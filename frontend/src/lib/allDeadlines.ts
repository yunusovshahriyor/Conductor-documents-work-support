import { addDays, addMonths, parseISODate } from "./dates";
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
  if (profile.status === "patent") {
    const entry = parseISODate(state.entry);
    const patentEnd = parseISODate(state.patent);
    const issued = parseISODate(profile.patentIssued);
    // Rules from the patent guide: apply within 30 days of entry, notify MVD within 2 months of issue, renew 10+ days before the end.
    if (entry) list.push({ key: "patentApply", label: t.deadlines.patentApply, date: addDays(entry, 30) });
    if (issued) list.push({ key: "patentNotify", label: t.deadlines.patentNotify, date: addMonths(issued, 2) });
    if (patentEnd) list.push({ key: "patentRenew", label: t.deadlines.patentRenew, date: addDays(patentEnd, -10) });
  }
  for (const doc of docs) {
    const date = parseISODate(doc.expires);
    if (date) list.push({ key: `doc:${doc.id}`, label: `${doc.title} · ${t.deadlines.docExpires}`, date });
  }
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}
