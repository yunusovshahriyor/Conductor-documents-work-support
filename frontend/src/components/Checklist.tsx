"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { readJSON, removeKey, writeJSON } from "@/lib/storage";
import type { Messages } from "@/i18n/messages/ru";

type Step = { title: string; text: string; items: string[] };
type Labels = Pick<Messages["documents"], "progress" | "of" | "reset" | "itemsTitle">;

export function Checklist({ steps, labels: t, storageKey: KEY }: { steps: Step[]; labels: Labels; storageKey: string }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(readJSON<Record<string, boolean>>(KEY, {}));
    setReady(true);
  }, []);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJSON(KEY, next);
      return next;
    });
  };

  const reset = () => {
    removeKey(KEY);
    setDone({});
  };

  const total = steps.length;
  const count = steps.filter((_, i) => done[`step-${i}`]).length;

  return (
    <div>
      <div className="progress" aria-live="polite">
        <div className="progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count}>
          <span style={{ width: `${(count / total) * 100}%` }} />
        </div>
        <p>
          {t.progress}: {ready ? count : 0} {t.of} {total}
        </p>
      </div>

      <ol className="steps">
        {steps.map((step, i) => {
          const id = `step-${i}`;
          const checked = !!done[id];
          return (
            <li key={id} className={`step${checked ? " step--done" : ""}`}>
              <div className="step__head">
                <span className="step__num" aria-hidden="true">
                  {checked ? <Icon name="check" size={18} /> : i + 1}
                </span>
                <h2>{step.title}</h2>
              </div>
              <p>{step.text}</p>
              <details>
                <summary>{t.itemsTitle}</summary>
                <ul>
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </details>
              <label className="check">
                <input type="checkbox" checked={checked} onChange={() => toggle(id)} />
                <span>{t.progress}</span>
              </label>
            </li>
          );
        })}
      </ol>

      <button type="button" className="btn btn--ghost" onClick={reset}>
        {t.reset}
      </button>
    </div>
  );
}
