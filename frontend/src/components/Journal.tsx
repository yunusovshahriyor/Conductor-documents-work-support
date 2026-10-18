"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";
import { formatDate, parseISODate, toISODate } from "@/lib/dates";
import { JOURNAL_KEY } from "@/lib/keys";
import { newId } from "@/lib/wallet";
import { useLocalState } from "@/lib/useLocalState";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

type Entry = { id: string; date: string; topic: string; text: string };
const blank = (): Entry => ({ id: "", date: toISODate(new Date()), topic: "", text: "" });

export function Journal({ t, locale }: { t: Messages; locale: Locale }) {
  const j = t.journalPage;
  const [items, setItems] = useLocalState<Entry[]>(JOURNAL_KEY, []);
  const [draft, setDraft] = useState<Entry | null>(null);

  const save = () => {
    if (!draft || !(draft.topic.trim() || draft.text.trim())) return;
    const next = { ...draft, id: draft.id || newId() };
    setItems((prev) => {
      const list = prev.some((i) => i.id === next.id) ? prev.map((i) => (i.id === next.id ? next : i)) : [next, ...prev];
      return list.sort((a, b) => b.date.localeCompare(a.date));
    });
    setDraft(null);
  };
  const remove = () => {
    if (!draft?.id || !window.confirm(j.deleteConfirm)) return;
    setItems((prev) => prev.filter((i) => i.id !== draft.id));
    setDraft(null);
  };
  const set = (patch: Partial<Entry>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  return (
    <>
      <button type="button" className="btn btn--primary" onClick={() => setDraft(blank())}>
        <Icon name="plus" size={20} />
        {j.add}
      </button>

      {items.length === 0 ? (
        <p className="muted empty">{j.empty}</p>
      ) : (
        <ul className="cards">
          {items.map((item) => {
            const date = parseISODate(item.date);
            return (
              <li key={item.id}>
                <button type="button" className="card card--button card--top" onClick={() => setDraft(item)}>
                  <span className="card__body">
                    <small className="muted">{date ? formatDate(date, locale) : item.date}</small>
                    <strong>{item.topic || item.text.slice(0, 40)}</strong>
                    {item.topic && item.text && <span className="clamp">{item.text}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {draft && (
        <Sheet title={draft.id ? t.common.edit : j.add} closeLabel={t.common.cancel} onClose={() => setDraft(null)}>
          <form className="form" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <label className="field">
              <span>{j.date}</span>
              <input type="date" value={draft.date} onChange={(e) => set({ date: e.target.value })} />
            </label>
            <label className="field">
              <span>{j.topic}</span>
              <input type="text" value={draft.topic} onChange={(e) => set({ topic: e.target.value })} />
            </label>
            <label className="field">
              <span>{j.text}</span>
              <textarea rows={5} value={draft.text} onChange={(e) => set({ text: e.target.value })} />
            </label>
            <div className="row row--between">
              {draft.id ? (
                <button type="button" className="btn btn--danger" onClick={remove}>
                  <Icon name="trash" size={18} />
                  {t.common.delete}
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="btn btn--primary">
                {t.common.save}
              </button>
            </div>
          </form>
        </Sheet>
      )}
    </>
  );
}
