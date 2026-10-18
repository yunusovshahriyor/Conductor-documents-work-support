import { notFound } from "next/navigation";
import { MyDeadlines } from "@/components/MyDeadlines";
import { DeadlineCalculator } from "@/components/DeadlineCalculator";
import { OfficialLinks } from "@/components/OfficialLinks";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).deadlines.title : undefined };
}

export default async function DeadlinesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  return (
    <>
      <h1>{t.deadlines.title}</h1>
      <p className="lead">{t.deadlines.intro}</p>
      <MyDeadlines t={t} locale={locale} />
      <DeadlineCalculator t={t.deadlines} locale={locale} daysLabel={t.common.days} />
      <OfficialLinks t={t.common} />
    </>
  );
}
