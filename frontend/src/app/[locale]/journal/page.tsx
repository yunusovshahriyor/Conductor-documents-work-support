import { notFound } from "next/navigation";
import { Journal } from "@/components/Journal";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).journalPage.title : undefined };
}

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  return (
    <>
      <h1>{t.journalPage.title}</h1>
      <p className="lead">{t.journalPage.intro}</p>
      <Journal t={t} locale={locale} />
    </>
  );
}
