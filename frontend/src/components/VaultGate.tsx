"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { createVault, hasVault, isUnlocked, unlockVault, vaultSupported } from "@/lib/vault";
import type { Messages } from "@/i18n/messages/ru";

type Phase = "loading" | "create" | "locked" | "open";

/** Shows a create-password / unlock screen until the wallet key is available in memory. */
export function VaultGate({ t, children }: { t: Messages["wallet"]; children: (lock: () => void) => ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [pass, setPass] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPhase(isUnlocked() ? "open" : hasVault() ? "locked" : "create");
  }, []);

  if (phase === "loading") return null;
  if (phase === "open") {
    return <>{children(() => { import("@/lib/vault").then((v) => v.lockVault()); setPass(""); setRepeat(""); setPhase("locked"); })}</>;
  }

  const creating = phase === "create";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!vaultSupported()) return setError(t.failed);
    if (creating) {
      if (pass.length < 6) return setError(t.tooShort);
      if (pass !== repeat) return setError(t.mismatch);
    }
    setBusy(true);
    try {
      if (creating) {
        await createVault(pass);
        setPhase("open");
      } else if (await unlockVault(pass)) {
        setPhase("open");
      } else {
        setError(t.wrong);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="gate" onSubmit={submit}>
      <span className="gate__icon">
        <Icon name="lock" size={30} />
      </span>
      <h2>{creating ? t.createTitle : t.lockedTitle}</h2>
      <p className="muted">{creating ? t.createText : t.lockedText}</p>
      <label className="field">
        <span>{t.passphrase}</span>
        <input type="password" value={pass} autoComplete={creating ? "new-password" : "current-password"} onChange={(e) => setPass(e.target.value)} />
      </label>
      {creating && (
        <label className="field">
          <span>{t.passphraseRepeat}</span>
          <input type="password" value={repeat} autoComplete="new-password" onChange={(e) => setRepeat(e.target.value)} />
        </label>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn--primary" disabled={busy}>
        {creating ? t.create : t.unlock}
      </button>
    </form>
  );
}
