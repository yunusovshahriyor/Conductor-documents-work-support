"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";
import { CONTACTS_KEY } from "@/lib/keys";
import { newId } from "@/lib/wallet";
import { useLocalState } from "@/lib/useLocalState";
import type { Messages } from "@/i18n/messages/ru";

type Contact = { id: string; name: string; role: string; phone: string; note: string };
const blank = (): Contact => ({ id: "", name: "", role: "", phone: "", note: "" });

export function ContactsList({ t }: { t: Messages }) {
  const c = t.contactsPage;
  const [items, setItems] = useLocalState<Contact[]>(CONTACTS_KEY, []);
  const [draft, setDraft] = useState<Contact | null>(null);

  const save = () => {
    if (!draft || !draft.name.trim()) return;
    const next = { ...draft, id: draft.id || newId() };
    setItems((prev) => (prev.some((i) => i.id === next.id) ? prev.map((i) => (i.id === next.id ? next : i)) : [next, ...prev]));
    setDraft(null);
  };
  const remove = () => {
    if (!draft?.id || !window.confirm(c.deleteConfirm)) return;
    setItems((prev) => prev.filter((i) => i.id !== draft.id));
    setDraft(null);
  };
  const set = (patch: Partial<Contact>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  return (
    <>
      <button type="button" className="btn btn--primary" onClick={() => setDraft(blank())}>
        <Icon name="plus" size={20} />
        {c.add}
      </button>

      {items.length === 0 ? (
        <p className="muted empty">{c.empty}</p>
      ) : (
        <ul className="cards">
          {items.map((item) => (
            <li key={item.id} className="card card--row">
              <button type="button" className="card__main" onClick={() => setDraft(item)}>
                <span className="card__icon">
                  <Icon name="contacts" />
                </span>
                <span className="card__body">
                  <strong>{item.name}</strong>
                  <span>{[item.role, item.phone].filter(Boolean).join(" · ")}</span>
                </span>
              </button>
              {item.phone && (
                <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`} className="icon-btn call-btn" aria-label={`${c.call}: ${item.name}`}>
                  <Icon name="phone" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {draft && (
        <Sheet title={draft.id ? t.common.edit : c.add} closeLabel={t.common.cancel} onClose={() => setDraft(null)}>
          <form className="form" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <label className="field">
              <span>{c.name}</span>
              <input type="text" value={draft.name} required onChange={(e) => set({ name: e.target.value })} />
            </label>
            <label className="field">
              <span>{c.role}</span>
              <input type="text" value={draft.role} onChange={(e) => set({ role: e.target.value })} />
            </label>
            <label className="field">
              <span>{c.phone}</span>
              <input type="tel" value={draft.phone} inputMode="tel" onChange={(e) => set({ phone: e.target.value })} />
            </label>
            <label className="field">
              <span>{c.note}</span>
              <textarea rows={2} value={draft.note} onChange={(e) => set({ note: e.target.value })} />
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
