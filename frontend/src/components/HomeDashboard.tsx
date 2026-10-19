"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Donut } from "./Donut";
import { Icon, type IconName } from "./Icon";
import { diffInDays, formatDate, startOfToday } from "@/lib/dates";
import { loadAllDeadlines, type AnyDeadline } from "@/lib/allDeadlines";
import { DOCS_KEY, PATENT_KEY, PROFILE_KEY } from "@/lib/keys";
import { emptyProfile, type Profile } from "@/lib/profile";
import { readJSON } from "@/lib/storage";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

const tiles: { slug: string; icon: IconName; title: (t: Messages) => string; text: (t: Messages) => string; tone: string }[] = [
  { slug: "documents", icon: "documents", title: (t) => t.nav.documents, text: (t) => t.home.modules.documents.text, tone: "teal" },
  { slug: "contacts", icon: "contacts", title: (t) => t.nav.contacts, text: (t) => t.contactsPage.intro, tone: "indigo" },
  { slug: "journal", icon: "journal", title: (t) => t.nav.journal, text: (t) => t.journalPage.intro, tone: "rose" },
  { slug: "work", icon: "work", title: (t) => t.nav.work, text: (t) => t.home.modules.work.text, tone: "amber" },
  { slug: "about", icon: "info", title: (t) => t.nav.about, text: (t) => t.about.disclaimerTitle, tone: "slate" },
];

export function HomeDashboard({ locale, t }: { locale: Locale; t: Messages }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [deadlines, setDeadlines] = useState<AnyDeadline[]>([]);

  const [patentMode, setPatentMode] = useState(false);

  useEffect(() => {
    const isPatent = { ...emptyProfile, ...readJSON<Partial<Profile>>(PROFILE_KEY, {}) }.status === "patent";
    setPatentMode(isPatent);
    setDone(readJSON<Record<string, boolean>>(isPatent ? PATENT_KEY : DOCS_KEY, {}));
    setDeadlines(loadAllDeadlines(t));
  }, [t]);

  const steps = patentMode ? t.patent.steps : t.documents.steps;
  const total = steps.length;
  const doneCount = steps.filter((_, i) => done[`step-${i}`]).length;
  const nextIndex = steps.findIndex((_, i) => !done[`step-${i}`]);
  const percent = Math.round((doneCount / total) * 100);

  const today = startOfToday();
  const upcoming = deadlines.find((d) => diffInDays(d.date, today) >= 0) ?? deadlines[deadlines.length - 1];
  const left = upcoming ? diffInDays(upcoming.date, today) : null;

  return (
    <>
      <section className="metric" aria-live="polite">
        <span className="metric__label">{t.home.nearestLabel}</span>
        <div className="metric__row">
          <strong className="metric__value">{left === null ? "—" : Math.max(left, 0)}</strong>
          {left !== null && <span className="metric__unit">{t.common.days}</span>}
        </div>
        <span className="metric__hint">
          {upcoming ? `${upcoming.label} · ${formatDate(upcoming.date, locale)}` : t.home.setDates}
        </span>
      </section>

      <section className="panel">
        <Link href={`/${locale}/documents`} className="panel__row">
          <span>
            <small>{t.home.modules.documents.title}</small>
            <strong>
              {doneCount} {t.documents.of} {total}
            </strong>
          </span>
          <Icon name="chevron" size={20} />
        </Link>
        <Link href={`/${locale}/deadlines`} className="panel__row">
          <span>
            <small>{t.nav.deadlines}</small>
            <strong>{upcoming ? formatDate(upcoming.date, locale) : t.home.notSet}</strong>
          </span>
          <Icon name="chevron" size={20} />
        </Link>
        <div className="track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={doneCount}>
          <span style={{ width: `${percent}%` }} />
        </div>
      </section>

      <div className="minis">
        <Link href={`/${locale}/documents`} className="mini">
          <small>{t.home.nextStep}</small>
          <strong>{nextIndex === -1 ? t.home.allDone : steps[nextIndex].title}</strong>
        </Link>
        <a href="tel:112" className="mini mini--sos">
          <small>{t.home.emergencyLabel}</small>
          <strong>112</strong>
        </a>
      </div>

      <section className="panel panel--chart">
        <div className="panel__head">
          <h2>{t.home.chartTitle}</h2>
          <Link href={`/${locale}/documents`} className="link-accent">
            {t.home.more}
          </Link>
        </div>
        <Donut value={doneCount} total={total} label={`${doneCount}/${total}`} sub={t.documents.progress} />
        <ul className="legend">
          <li>
            <i className="dot dot--done" />
            <span>{t.documents.progress}</span>
            <b>{doneCount}</b>
            <em>{percent}%</em>
          </li>
          <li>
            <i className="dot dot--todo" />
            <span>{t.home.pending}</span>
            <b>{total - doneCount}</b>
            <em>{100 - percent}%</em>
          </li>
        </ul>
      </section>

      <div className="section-head">
        <span>{t.home.sectionsTitle}</span>
      </div>
      <div className="tiles">
        {tiles.map(({ slug, icon, title, text, tone }) => (
          <Link key={slug} href={`/${locale}/${slug}`} className={`tile tile--${tone}`}>
            <Icon name={icon} size={26} />
            <strong>{title(t)}</strong>
            <span>{text(t)}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
