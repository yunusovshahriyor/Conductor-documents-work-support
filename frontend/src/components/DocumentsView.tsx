"use client";

import { useEffect, useState } from "react";
import { Checklist } from "./Checklist";
import { Icon } from "./Icon";
import { DOCS_KEY, PATENT_KEY, PROFILE_KEY } from "@/lib/keys";
import { emptyProfile, type Profile } from "@/lib/profile";
import { readJSON } from "@/lib/storage";
import type { Messages } from "@/i18n/messages/ru";

type Mode = "patent" | "general";

/** Step guide: the patent route when the user's goal is "work on a patent", the general steps otherwise. */
export function DocumentsView({ t }: { t: Messages }) {
  const [mode, setMode] = useState<Mode>("general");

  useEffect(() => {
    const profile = { ...emptyProfile, ...readJSON<Partial<Profile>>(PROFILE_KEY, {}) };
    if (profile.status === "patent") setMode("patent");
  }, []);

  const p = t.patent;
  return (
    <>
      <div className="seg" role="tablist">
        {(["patent", "general"] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className="seg__btn" onClick={() => setMode(m)}>
            {m === "patent" ? p.tabPatent : p.tabGeneral}
          </button>
        ))}
      </div>

      {mode === "general" ? (
        <>
          <p className="lead">{t.documents.intro}</p>
          <Checklist steps={t.documents.steps} labels={t.documents} storageKey={DOCS_KEY} />
        </>
      ) : (
        <>
          <p className="lead">{p.intro}</p>
          <section className="callout">
            <h2>{p.costTitle}</h2>
            <p>{p.cost}</p>
          </section>
          <Checklist steps={p.steps} labels={t.documents} storageKey={PATENT_KEY} />

          <section className="callout callout--warn">
            <h2>
              <Icon name="alert" size={20} /> {p.refusalTitle}
            </h2>
            <ul>
              {p.refusal.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{p.refusalTip}</p>
          </section>

          <section className="callout callout--sos">
            <h2>
              <Icon name="alert" size={20} /> {p.finesTitle}
            </h2>
            <ul>
              {p.fines.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <p className="lead">{p.closing}</p>
          <p className="muted">{p.source}</p>
        </>
      )}
    </>
  );
}
