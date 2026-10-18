"use client";

import { useEffect, useMemo, useState } from "react";
import { diffInDays, formatDate, startOfToday } from "@/lib/dates";
import { computeDeadlines, emptyDeadlineState } from "@/lib/deadlines";
import { DEADLINES_KEY } from "@/lib/keys";
import { readJSON, removeKey, writeJSON } from "@/lib/storage";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

const KEY = DEADLINES_KEY;
const empty = emptyDeadlineState;
type State = typeof empty;

export function DeadlineCalculator({ t, locale, daysLabel }: { t: Messages["deadlines"]; locale: Locale; daysLabel: string }) {
  const [state, setState] = useState<State>(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setState({ ...empty, ...readJSON<Partial<State>>(KEY, {}) });
  }, []);

  const update = (patch: Partial<State>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      writeJSON(KEY, next);
      return next;
    });
    setSaved(true);
  };

  const rows = useMemo(() => computeDeadlines(state).map((d) => ({ label: t[d.id], date: d.date })), [state, t]);

  const today = startOfToday();

  return (
    <div>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>{t.groupLabel}</legend>
          <label className="radio">
            <input type="radio" name="group" checked={state.group === "other"} onChange={() => update({ group: "other" })} />
            <span>{t.groupOther}</span>
          </label>
          <label className="radio">
            <input type="radio" name="group" checked={state.group === "eaeu"} onChange={() => update({ group: "eaeu" })} />
            <span>{t.groupEaeu}</span>
          </label>
        </fieldset>

        <label className="field">
          <span>{t.entryDate}</span>
          <input type="date" value={state.entry} onChange={(e) => update({ entry: e.target.value })} />
        </label>
        {state.group === "other" && (
          <label className="field">
            <span>{t.patentUntil}</span>
            <input type="date" value={state.patent} onChange={(e) => update({ patent: e.target.value })} />
          </label>
        )}
        <label className="field">
          <span>{t.contractUntil}</span>
          <input type="date" value={state.contract} onChange={(e) => update({ contract: e.target.value })} />
        </label>
      </form>

      {state.group === "eaeu" && <p className="note">{t.eaeuNote}</p>}

      <section aria-live="polite">
        <h2>{t.resultsTitle}</h2>
        {rows.length === 0 ? (
          <p className="muted">{t.noDates}</p>
        ) : (
          <ul className="results">
            {rows.map((row) => {
              const left = diffInDays(row.date, today);
              const tone = left < 0 ? "bad" : left <= 14 ? "warn" : "ok";
              return (
                <li key={row.label} className={`result result--${tone}`}>
                  <div>
                    <strong>{row.label}</strong>
                    <span>{formatDate(row.date, locale)}</span>
                  </div>
                  <b>{left < 0 ? t.overdue : `${left} ${daysLabel} ${t.left}`}</b>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="muted">{t.approx}</p>
      <div className="row">
        {saved && <span className="muted">{t.save}</span>}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            removeKey(KEY);
            setState(empty);
            setSaved(false);
          }}
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
}
