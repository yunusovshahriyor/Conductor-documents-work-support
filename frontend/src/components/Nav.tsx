"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

const items: { slug: string; key: "home" | "documents" | "deadlines" | "work" | "help"; icon: IconName }[] = [
  { slug: "", key: "home", icon: "home" },
  { slug: "documents", key: "documents", icon: "documents" },
  { slug: "deadlines", key: "deadlines", icon: "calendar" },
  { slug: "work", key: "work", icon: "work" },
  { slug: "help", key: "help", icon: "help" },
];

export function Nav({ locale, labels, menuLabel }: { locale: Locale; labels: Messages["nav"]; menuLabel: string }) {
  const pathname = usePathname() ?? "";
  return (
    <nav className="nav" aria-label={menuLabel}>
      <ul>
        {items.map(({ slug, key, icon }) => {
          const href = `/${locale}${slug ? `/${slug}` : ""}`;
          const active = slug ? pathname.startsWith(href) : pathname === href;
          return (
            <li key={key}>
              <Link href={href} aria-current={active ? "page" : undefined} className="nav__link">
                <Icon name={icon} />
                <span>{labels[key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
