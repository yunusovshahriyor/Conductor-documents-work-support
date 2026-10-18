import { VAULT_META_KEY } from "./keys";
import { readJSON, writeJSON } from "./storage";

/**
 * Password-based encryption for the document wallet (PBKDF2 → AES-GCM, all in the browser).
 * The derived key lives only in memory; the password is never stored, so it cannot be recovered.
 */
type Meta = { salt: string; check: { iv: string; data: string } };

const ITERATIONS = 310_000;
const CHECK_TEXT = "provodnik-vault-ok";
let sessionKey: CryptoKey | null = null;

const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  arr.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}
function fromB64(value: string): Uint8Array<ArrayBuffer> {
  const s = atob(value);
  const out = new Uint8Array(new ArrayBuffer(s.length));
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function derive(pass: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptWith(key: CryptoKey, data: Uint8Array<ArrayBuffer>) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { iv: toB64(iv), data: toB64(cipher) };
}

async function decryptWith(key: CryptoKey, box: { iv: string; data: string }): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(box.iv) }, key, fromB64(box.data));
}

export const vaultSupported = () => typeof crypto !== "undefined" && !!crypto.subtle;
export const hasVault = () => !!readJSON<Meta | null>(VAULT_META_KEY, null);
export const isUnlocked = () => sessionKey !== null;
export const lockVault = () => {
  sessionKey = null;
};

export async function createVault(pass: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await derive(pass, salt);
  const check = await encryptWith(key, enc.encode(CHECK_TEXT));
  writeJSON(VAULT_META_KEY, { salt: toB64(salt), check } satisfies Meta);
  sessionKey = key;
}

export async function unlockVault(pass: string): Promise<boolean> {
  const meta = readJSON<Meta | null>(VAULT_META_KEY, null);
  if (!meta) return false;
  try {
    const key = await derive(pass, fromB64(meta.salt));
    const text = dec.decode(await decryptWith(key, meta.check));
    if (text !== CHECK_TEXT) return false;
    sessionKey = key;
    return true;
  } catch {
    return false;
  }
}

function requireKey(): CryptoKey {
  if (!sessionKey) throw new Error("vault locked");
  return sessionKey;
}

export async function encryptJSON(value: unknown) {
  return encryptWith(requireKey(), enc.encode(JSON.stringify(value)));
}
export async function decryptJSON<T>(box: { iv: string; data: string }): Promise<T> {
  return JSON.parse(dec.decode(await decryptWith(requireKey(), box))) as T;
}
export async function encryptBytes(buf: ArrayBuffer) {
  return encryptWith(requireKey(), new Uint8Array(buf.slice(0)));
}
export async function decryptBytes(box: { iv: string; data: string }): Promise<ArrayBuffer> {
  return decryptWith(requireKey(), box);
}
