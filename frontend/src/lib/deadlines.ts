import { addDays, addWorkingDays, parseISODate } from "./dates";
import { RULES, type CitizenshipGroup } from "./rules";

export type DeadlineState = { group: CitizenshipGroup; entry: string; patent: string; contract: string };
export type DeadlineId = "registration" | "stay90" | "patent" | "contract";
export type Deadline = { id: DeadlineId; date: Date };

export const emptyDeadlineState: DeadlineState = { group: "other", entry: "", patent: "", contract: "" };

/** Approximate deadlines derived from the dates a user entered, soonest first. */
export function computeDeadlines(state: DeadlineState): Deadline[] {
  const result: Deadline[] = [];
  const entry = parseISODate(state.entry);
  const patent = parseISODate(state.patent);
  const contract = parseISODate(state.contract);
  if (entry) {
    result.push({ id: "registration", date: addWorkingDays(entry, RULES.registrationWorkingDays) });
    if (state.group === "other") result.push({ id: "stay90", date: addDays(entry, RULES.visaFreeDays - 1) });
  }
  if (patent && state.group === "other") result.push({ id: "patent", date: patent });
  if (contract) result.push({ id: "contract", date: contract });
  return result.sort((a, b) => a.date.getTime() - b.date.getTime());
}
