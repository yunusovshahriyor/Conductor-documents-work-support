import type { Messages } from "@/i18n/messages/ru";

export function OfficialLinks({ t }: { t: Messages["common"] }) {
  return (
    <section className="callout">
      <h2>{t.official}</h2>
      <p>{t.officialNote}</p>
      <ul className="links">
        <li>
          <a href="https://www.gosuslugi.ru" target="_blank" rel="noopener noreferrer">
            {t.gosuslugi}
          </a>
        </li>
        <li>
          <a href="https://xn--b1aew.xn--p1ai" target="_blank" rel="noopener noreferrer">
            {t.mvd}
          </a>
        </li>
      </ul>
    </section>
  );
}
