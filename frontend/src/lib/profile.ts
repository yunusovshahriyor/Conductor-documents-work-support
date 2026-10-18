import type { CitizenshipGroup } from "./rules";

export type Profile = {
  name: string;
  citizenship: string;
  status: string;
  employer: string;
  address: string;
  registrationUntil: string;
};

export const emptyProfile: Profile = { name: "", citizenship: "", status: "", employer: "", address: "", registrationUntil: "" };

export const countryCodes = ["tj", "uz", "kg", "kz", "am", "by", "other"] as const;
export const statusCodes = ["patent", "eaeu", "study", "family", "stay", "other"] as const;

/** EAEU citizens (Kyrgyzstan, Kazakhstan, Armenia, Belarus) work without a patent. */
export function groupFor(citizenship: string): CitizenshipGroup {
  return ["kg", "kz", "am", "by"].includes(citizenship) ? "eaeu" : "other";
}
