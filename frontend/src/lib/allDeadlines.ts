import { parseISODate } from "./dates";
import { computeDeadlines, emptyDeadlineState, type DeadlineState } from "./deadlines";
import { DEADLINES_KEY, PROFILE_KEY, WALLET_KEY } from "./keys";
import { emptyProfile, type Profile } from "./profile";
import { readJSON } from "./storage";
import type { WalletDoc } from "./wallet";
import type { Messages } from "@/i18n/messages/ru";

export type AnyDeadline = { key: string; label: string; date: Date };

/** Everything the user should not miss: calculator dates, profile registration and document expiries. */
export function loadAllDeadlines(t: Messages): AnyDeadline[] {
  const state = { ...emptyDeadlineState, ...readJSON<Partial<DeadlineState>>(DEADLINES_KEY, {}) };
  const profile = { ...emptyProfile, ...readJSON<Partial<Profile>>(PROFILE_KEY, {}) };
  const docs = readJSON<WalletDoc[]>(WALLET_KEY, []);

  const list: AnyDeadline[] = computeDeadlines(state).map((d) => ({ key: d.id, label: t.deadlines[d.id], date: d.date }));
  const reg = parseISODate(profile.registrationUntil);
  if (reg) list.push({ key: "regUntil", label: t.deadlines.regUntil, date: reg });
  for (const doc of docs) {
    const date = parseISODate(doc.expires);
    if (date) list.push({ key: `doc:${doc.id}`, label: `${doc.title} · ${t.deadlines.docExpires}`, date });
  }
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}
