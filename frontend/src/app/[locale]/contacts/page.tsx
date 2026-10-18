import { notFound } from "next/navigation";
import { ContactsList } from "@/components/ContactsList";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).contactsPage.title : undefined };
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  return (
    <>
      <h1>{t.contactsPage.title}</h1>
      <p className="lead">{t.contactsPage.intro}</p>
      <ContactsList t={t} />
    </>
  );
}
