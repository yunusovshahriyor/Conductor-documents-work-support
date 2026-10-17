import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).work.title : undefined };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).work;
  return (
    <>
      <h1>{t.title}</h1>
      <p className="lead">{t.intro}</p>

      <section className="callout callout--ok">
        <h2>
          <Icon name="shield" size={22} /> {t.rightsTitle}
        </h2>
        <ul>
          {t.rights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="callout callout--warn">
        <h2>
          <Icon name="alert" size={22} /> {t.flagsTitle}
        </h2>
        <ul>
          {t.flags.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="callout">
        <h2>{t.checkTitle}</h2>
        <ul className="checklist">
          {t.checks.map((item) => (
            <li key={item}>
              <Icon name="check" size={18} />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="callout callout--soon">
        <h2>{t.jobsTitle}</h2>
        <p>{t.jobsSoon}</p>
      </section>
    </>
  );
}
