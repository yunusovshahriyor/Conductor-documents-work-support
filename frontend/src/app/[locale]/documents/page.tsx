import { notFound } from "next/navigation";
import { Checklist } from "@/components/Checklist";
import { OfficialLinks } from "@/components/OfficialLinks";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).documents.title : undefined };
}

export default async function DocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  return (
    <>
      <h1>{t.documents.title}</h1>
      <p className="lead">{t.documents.intro}</p>
      <Checklist t={t.documents} />
      <OfficialLinks t={t.common} />
    </>
  );
}
