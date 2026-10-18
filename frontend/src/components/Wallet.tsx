"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";
import { VaultGate } from "./VaultGate";
import { diffInDays, formatDate, parseISODate, startOfToday } from "@/lib/dates";
import { idbDelete, idbGet, idbPut } from "@/lib/idb";
import { WALLET_KEY } from "@/lib/keys";
import { useLocalState } from "@/lib/useLocalState";
import { decryptBytes, decryptJSON, encryptBytes, encryptJSON } from "@/lib/vault";
import { MAX_FILE_BYTES, docTypes, newId, type DocType, type WalletDoc, type WalletSecret } from "@/lib/wallet";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

type Box = { iv: string; data: string };
type Draft = { id: string | null; type: DocType; title: string; expires: string; number: string; notes: string; files: WalletSecret["files"]; newFiles: File[] };
const blank = (): Draft => ({ id: null, type: "passport", title: "", expires: "", number: "", notes: "", files: [], newFiles: [] });

export function Wallet({ t, locale, daysLabel }: { t: Messages; locale: Locale; daysLabel: string }) {
  return <VaultGate t={t.wallet}>{(lock) => <WalletList t={t} locale={locale} daysLabel={daysLabel} lock={lock} />}</VaultGate>;
}

function WalletList({ t, locale, daysLabel, lock }: { t: Messages; locale: Locale; daysLabel: string; lock: () => void }) {
  const w = t.wallet;
  const [docs, setDocs] = useLocalState<WalletDoc[]>(WALLET_KEY, []);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const today = startOfToday();

  async function openDoc(doc: WalletDoc) {
    setError("");
    try {
      const box = await idbGet<Box>("secrets", doc.id);
      const secret = box ? await decryptJSON<WalletSecret>(box) : { number: "", notes: "", files: [] };
      setDraft({ id: doc.id, type: doc.type, title: doc.title, expires: doc.expires, newFiles: [], ...secret });
    } catch {
      setError(w.failed);
    }
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      const id = draft.id ?? newId();
      const files = [...draft.files];
      for (const file of draft.newFiles) {
        const fid = newId();
        await idbPut("files", fid, await encryptBytes(await file.arrayBuffer()));
        files.push({ id: fid, name: file.name, mime: file.type || "application/octet-stream" });
      }
      const secret: WalletSecret = { number: draft.number, notes: draft.notes, files };
      await idbPut("secrets", id, await encryptJSON(secret));
      const meta: WalletDoc = { id, type: draft.type, title: draft.title.trim() || w.types[draft.type], expires: draft.expires };
      setDocs((prev) => (prev.some((d) => d.id === id) ? prev.map((d) => (d.id === id ? meta : d)) : [meta, ...prev]));
      setDraft(null);
    } catch {
      setError(w.failed);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!draft?.id || !window.confirm(w.deleteConfirm)) return;
    const id = draft.id;
    for (const f of draft.files) await idbDelete("files", f.id);
    await idbDelete("secrets", id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDraft(null);
  }

  async function openFile(file: WalletSecret["files"][number]) {
    try {
      const box = await idbGet<Box>("files", file.id);
      if (!box) return;
      const url = URL.createObjectURL(new Blob([await decryptBytes(box)], { type: file.mime }));
      window.open(url, "_blank", "noopener");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError(w.failed);
    }
  }

  async function dropFile(file: WalletSecret["files"][number]) {
    await idbDelete("files", file.id);
    setDraft((d) => (d ? { ...d, files: d.files.filter((f) => f.id !== file.id) } : d));
    // persist the removal right away so a later "cancel" cannot resurrect a deleted file
    if (draft?.id) {
      const secret: WalletSecret = { number: draft.number, notes: draft.notes, files: draft.files.filter((f) => f.id !== file.id) };
      await idbPut("secrets", draft.id, await encryptJSON(secret));
    }
  }

  function pick(list: FileList | null) {
    if (!list) return;
    const ok = Array.from(list).filter((f) => f.size <= MAX_FILE_BYTES);
    if (ok.length !== list.length) setError(w.tooBig);
    setDraft((d) => (d ? { ...d, newFiles: [...d.newFiles, ...ok] } : d));
  }

  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  return (
    <>
      <div className="row row--between">
        <button type="button" className="btn btn--primary" onClick={() => setDraft(blank())}>
          <Icon name="plus" size={20} />
          {w.add}
        </button>
        <button type="button" className="btn btn--ghost" onClick={lock}>
          <Icon name="lock" size={18} />
          {w.lock}
        </button>
      </div>

      {error && !draft && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {docs.length === 0 ? (
        <p className="muted empty">{w.empty}</p>
      ) : (
        <ul className="cards">
          {docs.map((doc) => {
            const date = parseISODate(doc.expires);
            const left = date ? diffInDays(date, today) : null;
            const tone = left === null ? "none" : left < 0 ? "bad" : left <= 30 ? "warn" : "ok";
            return (
              <li key={doc.id}>
                <button type="button" className="card card--button" onClick={() => openDoc(doc)}>
                  <span className="card__icon">
                    <Icon name="documents" />
                  </span>
                  <span className="card__body">
                    <strong>{doc.title}</strong>
                    <span>{w.types[doc.type]}</span>
                  </span>
                  <span className={`badge badge--${tone}`}>
                    {date && left !== null ? (left < 0 ? w.expiredWord : `${left} ${daysLabel}`) : w.noExpiry}
                    {date && <small>{formatDate(date, locale)}</small>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {draft && (
        <Sheet title={draft.id ? t.common.edit : w.add} closeLabel={t.common.cancel} onClose={() => setDraft(null)}>
          <form className="form" onSubmit={(e) => { e.preventDefault(); void save(); }}>
            <label className="field">
              <span>{w.docType}</span>
              <select value={draft.type} onChange={(e) => set({ type: e.target.value as DocType, title: draft.title || "" })}>
                {docTypes.map((c) => (
                  <option key={c} value={c}>
                    {w.types[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{w.docTitle}</span>
              <input type="text" value={draft.title} placeholder={w.types[draft.type]} onChange={(e) => set({ title: e.target.value })} />
            </label>
            <label className="field">
              <span>{w.number}</span>
              <input type="text" value={draft.number} autoComplete="off" onChange={(e) => set({ number: e.target.value })} />
            </label>
            <label className="field">
              <span>{w.expires}</span>
              <input type="date" value={draft.expires} onChange={(e) => set({ expires: e.target.value })} />
            </label>
            <label className="field">
              <span>{w.notes}</span>
              <textarea rows={3} value={draft.notes} onChange={(e) => set({ notes: e.target.value })} />
            </label>

            <div className="field">
              <span>{w.files}</span>
              <ul className="files">
                {draft.files.map((f) => (
                  <li key={f.id}>
                    <button type="button" className="link-btn" onClick={() => openFile(f)}>
                      <Icon name="clip" size={16} /> {f.name}
                    </button>
                    <button type="button" className="link-btn link-btn--danger" onClick={() => dropFile(f)}>
                      {w.removeFile}
                    </button>
                  </li>
                ))}
                {draft.newFiles.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span>
                      <Icon name="clip" size={16} /> {f.name}
                    </span>
                    <button type="button" className="link-btn link-btn--danger" onClick={() => set({ newFiles: draft.newFiles.filter((_, j) => j !== i) })}>
                      {w.removeFile}
                    </button>
                  </li>
                ))}
              </ul>
              <input ref={fileInput} type="file" accept="image/*,application/pdf" multiple hidden onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
              <button type="button" className="btn btn--ghost" onClick={() => fileInput.current?.click()}>
                <Icon name="clip" size={18} />
                {w.attach}
              </button>
            </div>

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="row row--between">
              {draft.id ? (
                <button type="button" className="btn btn--danger" onClick={remove}>
                  <Icon name="trash" size={18} />
                  {t.common.delete}
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="btn btn--primary" disabled={busy}>
                {t.common.save}
              </button>
            </div>
          </form>
        </Sheet>
      )}
    </>
  );
}
