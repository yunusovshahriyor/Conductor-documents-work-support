"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Donut } from "./Donut";
import { Icon, type IconName } from "./Icon";
import { diffInDays, formatDate, startOfToday } from "@/lib/dates";
import { computeDeadlines, emptyDeadlineState, type DeadlineState } from "@/lib/deadlines";
import { DEADLINES_KEY, DOCS_KEY } from "@/lib/keys";
import { readJSON } from "@/lib/storage";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

const tiles: { slug: string; icon: IconName; key: "deadlines" | "work" | "help"; tone: string }[] = [
  { slug: "deadlines", icon: "calendar", key: "deadlines", tone: "teal" },
  { slug: "work", icon: "work", key: "work", tone: "amber" },
  { slug: "help", icon: "help", key: "help", tone: "rose" },
];

export function HomeDashboard({ locale, t }: { locale: Locale; t: Messages }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [dates, setDates] = useState<DeadlineState>(emptyDeadlineState);

  useEffect(() => {
    setDone(readJSON<Record<string, boolean>>(DOCS_KEY, {}));
    setDates({ ...emptyDeadlineState, ...readJSON<Partial<DeadlineState>>(DEADLINES_KEY, {}) });
  }, []);

  const steps = t.documents.steps;
  const total = steps.length;
  const doneCount = steps.filter((_, i) => done[`step-${i}`]).length;
  const nextIndex = steps.findIndex((_, i) => !done[`step-${i}`]);
  const percent = Math.round((doneCount / total) * 100);

  const today = startOfToday();
  const deadlines = computeDeadlines(dates);
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
          {upcoming ? `${t.deadlines[upcoming.id]} · ${formatDate(upcoming.date, locale)}` : t.home.setDates}
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
        {tiles.map(({ slug, icon, key, tone }) => (
          <Link key={slug} href={`/${locale}/${slug}`} className={`tile tile--${tone}`}>
            <Icon name={icon} size={26} />
            <strong>{t.home.modules[key].title}</strong>
            <span>{t.home.modules[key].text}</span>
          </Link>
        ))}
        <Link href={`/${locale}/about`} className="tile tile--indigo">
          <Icon name="info" size={26} />
          <strong>{t.nav.about}</strong>
          <span>{t.about.disclaimerTitle}</span>
        </Link>
      </div>
    </>
  );
}
