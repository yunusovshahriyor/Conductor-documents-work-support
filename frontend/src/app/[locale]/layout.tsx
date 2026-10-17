import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { InstallPrompt } from "@/components/InstallPrompt";
import { AppBar } from "@/components/AppBar";
import { Nav } from "@/components/Nav";
import { OfflineBadge } from "@/components/OfflineBadge";
import { SosButton } from "@/components/SosButton";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Ripple } from "@/components/Ripple";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { isLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";
import { BASE_PATH } from "@/lib/basePath";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return {
    title: { default: t.app.fullName, template: `%s · ${t.app.name}` },
    description: t.app.tagline,
    manifest: `${BASE_PATH}/manifest.webmanifest`,
    applicationName: t.app.name,
    appleWebApp: { capable: true, title: t.app.name, statusBarStyle: "default" },
    icons: { icon: `${BASE_PATH}/icons/icon.svg`, apple: `${BASE_PATH}/icons/apple-touch-icon.png` },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8faf8" },
    { media: "(prefers-color-scheme: dark)", color: "#101413" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <header className="header">
          <AppBar locale={locale} t={t} />
          <div className="header__nav">
            <div className="container">
              <Nav locale={locale} labels={t.nav} menuLabel={t.nav.menu} />
            </div>
          </div>
        </header>

        <OfflineBadge label={t.common.offlineBadge} />
        <main className="container main" id="main">{children}</main>

        <footer className="container footer">
          <p>{t.common.verifyBanner}</p>
          <p>
            <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          </p>
        </footer>

        <InstallPrompt
          title={t.common.installTitle}
          text={t.common.installText}
          installLabel={t.common.installButton}
          dismissLabel={t.common.dismiss}
        />
        <SosButton label={t.common.callEmergency} />
        <PullToRefresh label={t.common.refreshing} />
        <Ripple />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
