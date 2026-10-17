import type { Locale } from "./config";
import type { Messages } from "./messages/ru";
import ru from "./messages/ru";
import tg from "./messages/tg";
import uz from "./messages/uz";
import ky from "./messages/ky";

const dictionaries: Record<Locale, Messages> = { tg, ru, uz, ky };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}
