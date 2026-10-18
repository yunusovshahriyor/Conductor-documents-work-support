import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { HomeDashboard } from "@/components/HomeDashboard";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  return (
    <>
      <h1 className="sr-only">{t.home.heroTitle}</h1>
      <HomeDashboard locale={locale} t={t} />

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
      <p className="muted caption">{t.common.verifyBanner}</p>
    </>
  );
}
