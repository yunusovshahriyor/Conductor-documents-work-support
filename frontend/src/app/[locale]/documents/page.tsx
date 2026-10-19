import { notFound } from "next/navigation";
import { DocumentsView } from "@/components/DocumentsView";
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
      <DocumentsView t={t} />
      <OfficialLinks t={t.common} />
    </>
  );
}
