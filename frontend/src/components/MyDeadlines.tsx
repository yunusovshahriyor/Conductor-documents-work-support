"use client";

import { useEffect, useState } from "react";
import { diffInDays, formatDate, startOfToday } from "@/lib/dates";
import { loadAllDeadlines, type AnyDeadline } from "@/lib/allDeadlines";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

/** All upcoming dates gathered from the profile, calculator and document wallet. */
export function MyDeadlines({ t, locale }: { t: Messages; locale: Locale }) {
  const [list, setList] = useState<AnyDeadline[]>([]);
  useEffect(() => setList(loadAllDeadlines(t)), [t]);
  const today = startOfToday();

  return (
    <section>
      <h2>{t.deadlines.mine}</h2>
      <p className="muted">{t.deadlines.mineHint}</p>
      {list.length === 0 ? (
        <p className="muted">{t.deadlines.none}</p>
      ) : (
        <ul className="results">
          {list.map((d) => {
            const left = diffInDays(d.date, today);
            const tone = left < 0 ? "bad" : left <= 14 ? "warn" : "ok";
            return (
              <li key={d.key} className={`result result--${tone}`}>
                <div>
                  <strong>{d.label}</strong>
                  <span>{formatDate(d.date, locale)}</span>
                </div>
                <b>{left < 0 ? t.deadlines.overdue : `${left} ${t.common.days} ${t.deadlines.left}`}</b>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
