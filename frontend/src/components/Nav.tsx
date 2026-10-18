"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

type Item = { slug: string; key: "home" | "wallet" | "deadlines" | "profile" | "help"; icon: IconName; center?: boolean };

// Help sits in the middle as the raised action button, like the primary action of a native app.
const items: Item[] = [
  { slug: "", key: "home", icon: "home" },
  { slug: "wallet", key: "wallet", icon: "wallet" },
  { slug: "help", key: "help", icon: "help", center: true },
  { slug: "deadlines", key: "deadlines", icon: "calendar" },
  { slug: "profile", key: "profile", icon: "profile" },
];

export function Nav({ locale, labels, menuLabel }: { locale: Locale; labels: Messages["nav"]; menuLabel: string }) {
  const pathname = usePathname() ?? "";
  return (
    <nav className="nav" aria-label={menuLabel}>
      <ul>
        {items.map(({ slug, key, icon, center }) => {
          const href = `/${locale}${slug ? `/${slug}` : ""}`;
          const active = slug ? pathname.startsWith(href) : pathname === href || pathname === `${href}/`;
          return (
            <li key={key}>
              <Link href={href} aria-current={active ? "page" : undefined} className={`nav__link${center ? " nav__link--center" : ""}`}>
                <Icon name={icon} size={center ? 30 : 24} />
                <span>{labels[key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
