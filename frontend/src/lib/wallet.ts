export const docTypes = ["passport", "migration", "registration", "patent", "contract", "insurance", "receipt", "other"] as const;
export type DocType = (typeof docTypes)[number];

/** Non-sensitive part of a document, kept in localStorage so deadlines work without the password. */
export type WalletDoc = { id: string; type: DocType; title: string; expires: string };

/** Sensitive part (number, notes, attached files) lives encrypted in IndexedDB. */
export type WalletSecret = { number: string; notes: string; files: { id: string; name: string; mime: string }[] };

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
