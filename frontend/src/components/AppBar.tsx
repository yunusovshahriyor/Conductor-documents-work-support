"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

const sections = ["documents", "wallet", "profile", "contacts", "journal", "deadlines", "work", "help", "about"] as const;

export function AppBar({ locale, t }: { locale: Locale; t: Messages }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const section = sections.find((s) => pathname.startsWith(`/${locale}/${s}`));
  const isHome = !section;

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(`/${locale}`);
  };

  return (
    <div className="container appbar">
      {!isHome && (
        <button type="button" className="icon-btn icon-btn--plain appbar__back" aria-label={t.common.back} onClick={goBack}>
          <Icon name="back" />
        </button>
      )}
      <Link href={`/${locale}`} className={`brand${isHome ? "" : " brand--wide-only"}`} aria-label={t.app.fullName}>
        <span className="brand__mark" aria-hidden="true">П</span>
        <span className="brand__words">
          <span className="brand__text">
            {t.app.name}
            <i>.</i>
          </span>
          <span className="brand__tag">{t.app.tagline}</span>
        </span>
      </Link>
      {!isHome && <span className="appbar__title">{t.nav[section]}</span>}
      <div className="appbar__end">
        <LanguageSwitcher current={locale} label={t.nav.language} closeLabel={t.common.dismiss} />
      </div>
    </div>
  );
}
