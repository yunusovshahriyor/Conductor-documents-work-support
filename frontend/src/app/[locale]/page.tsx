import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  const modules: { slug: string; icon: IconName; title: string; text: string }[] = [
    { slug: "documents", icon: "documents", ...t.home.modules.documents },
    { slug: "deadlines", icon: "calendar", ...t.home.modules.deadlines },
    { slug: "work", icon: "work", ...t.home.modules.work },
    { slug: "help", icon: "help", ...t.home.modules.help },
  ];

  return (
    <>
      <section className="intro">
        <h1>{t.home.heroTitle}</h1>
        <p>{t.home.heroText}</p>
      </section>

      <a href="tel:112" className="card card--sos">
        <span className="card__icon">
          <Icon name="phone" />
        </span>
        <span className="card__body">
          <strong>{t.home.sosTitle}</strong>
          <span>{t.home.sosText}</span>
        </span>
        <Icon name="chevron" size={20} />
      </a>

      <h2 className="section-title">{t.home.modulesTitle}</h2>
      <ul className="cards">
        {modules.map((m) => (
          <li key={m.slug}>
            <Link href={`/${locale}/${m.slug}`} className="card">
              <span className="card__icon">
                <Icon name={m.icon} />
              </span>
              <span className="card__body">
                <strong>{m.title}</strong>
                <span>{m.text}</span>
              </span>
              <Icon name="chevron" size={20} />
            </Link>
          </li>
        ))}
      </ul>

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

      <ul className="cards">
        <li>
          <Link href={`/${locale}/about`} className="card card--plain">
            <span className="card__icon">
              <Icon name="info" />
            </span>
            <span className="card__body">
              <strong>{t.nav.about}</strong>
              <span>{t.common.verifyBanner}</span>
            </span>
            <Icon name="chevron" size={20} />
          </Link>
        </li>
      </ul>
    </>
  );
}
