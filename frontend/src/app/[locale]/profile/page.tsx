import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).profile.title : undefined };
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  return (
    <>
      <h1>{t.profile.title}</h1>
      <p className="lead">{t.profile.intro}</p>
      <ProfileForm t={t} locale={locale} />
    </>
  );
}
