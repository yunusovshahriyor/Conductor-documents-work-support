import { notFound } from "next/navigation";
import { Wallet } from "@/components/Wallet";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).wallet.title : undefined };
}

export default async function WalletPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  return (
    <>
      <h1>{t.wallet.title}</h1>
      <p className="lead">{t.wallet.intro}</p>
      <Wallet t={t} locale={locale} daysLabel={t.common.days} />
    </>
  );
}
