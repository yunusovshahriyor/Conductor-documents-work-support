import Link from "next/link";
import { Icon } from "@/components/Icon";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  const modules = [
    { slug: "documents", icon: "documents", ...t.home.modules.documents },
    { slug: "deadlines", icon: "calendar", ...t.home.modules.deadlines },
    { slug: "work", icon: "work", ...t.home.modules.work },
    { slug: "help", icon: "help", ...t.home.modules.help },
  ] as const;

  return (
    <>
      <section className="hero">
        <h1>{t.home.heroTitle}</h1>
        <p>{t.home.heroText}</p>
        <div className="hero__actions">
          <Link href={`/${locale}/documents`} className="btn btn--primary">
            {t.home.ctaDocs}
          </Link>
          <Link href={`/${locale}/help`} className="btn btn--sos">
            <Icon name="phone" size={20} />
            {t.home.ctaHelp}
          </Link>
        </div>
      </section>

      <section>
        <h2>{t.home.modulesTitle}</h2>
        <ul className="cards">
          {modules.map((m) => (
            <li key={m.slug}>
              <Link href={`/${locale}/${m.slug}`} className="card">
                <span className="card__icon">
                  <Icon name={m.icon} />
                </span>
                <strong>{m.title}</strong>
                <span>{m.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="callout callout--warn">
        <h2>
          <Icon name="alert" size={22} /> {t.home.warnTitle}
        </h2>
        <ul>
          {t.home.warnItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="callout callout--sos">
        <h2>{t.home.sosTitle}</h2>
        <p>{t.home.sosText}</p>
        <a href="tel:112" className="btn btn--sos">
          <Icon name="phone" size={20} />
          {t.common.callEmergency}
        </a>
      </section>
    </>
  );
}
