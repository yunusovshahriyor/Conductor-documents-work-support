import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).about.title : undefined };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).about;
  return (
    <>
      <h1>{t.title}</h1>
      <p className="lead">{t.text}</p>
      <section className="callout callout--warn">
        <h2>{t.disclaimerTitle}</h2>
        <p>{t.disclaimer}</p>
      </section>
      <section className="callout">
        <h2>{t.privacyTitle}</h2>
        <p>{t.privacy}</p>
      </section>
      <p className="muted">
        {t.versionLabel}: 0.1.0
      </p>
    </>
  );
}
