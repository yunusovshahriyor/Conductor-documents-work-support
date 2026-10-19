"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { emptyDeadlineState, type DeadlineState } from "@/lib/deadlines";
import { DEADLINES_KEY, PROFILE_KEY } from "@/lib/keys";
import { countryCodes, emptyProfile, groupFor, statusCodes, type Profile } from "@/lib/profile";
import { readJSON, writeJSON } from "@/lib/storage";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/ru";

export function ProfileForm({ t, locale }: { t: Messages; locale: Locale }) {
  const p = t.profile;
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [dates, setDates] = useState<DeadlineState>(emptyDeadlineState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile({ ...emptyProfile, ...readJSON<Partial<Profile>>(PROFILE_KEY, {}) });
    setDates({ ...emptyDeadlineState, ...readJSON<Partial<DeadlineState>>(DEADLINES_KEY, {}) });
  }, []);

  const setP = (patch: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      writeJSON(PROFILE_KEY, next);
      return next;
    });
    if (patch.citizenship !== undefined) setD({ group: groupFor(patch.citizenship) });
    setSaved(true);
  };
  const setD = (patch: Partial<DeadlineState>) => {
    setDates((prev) => {
      const next = { ...prev, ...patch };
      writeJSON(DEADLINES_KEY, next);
      return next;
    });
    setSaved(true);
  };

  const eaeu = dates.group === "eaeu";

  const initial = (profile.name.trim()[0] ?? "").toUpperCase();
  const subtitle = [profile.citizenship && p.countries[profile.citizenship as keyof typeof p.countries], profile.status && p.statuses[profile.status as keyof typeof p.statuses]]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <div className="me">
        <span className="me__avatar" aria-hidden="true">
          {initial || <Icon name="profile" size={30} />}
        </span>
        <span className="me__body">
          <strong>{profile.name || p.title}</strong>
          <span>{subtitle || p.select}</span>
        </span>
      </div>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span>{p.name}</span>
          <input type="text" value={profile.name} autoComplete="name" onChange={(e) => setP({ name: e.target.value })} />
        </label>
        <label className="field">
          <span>{p.citizenship}</span>
          <select value={profile.citizenship} onChange={(e) => setP({ citizenship: e.target.value })}>
            <option value="">{p.select}</option>
            {countryCodes.map((c) => (
              <option key={c} value={c}>
                {p.countries[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{p.status}</span>
          <select value={profile.status} onChange={(e) => setP({ status: e.target.value })}>
            <option value="">{p.select}</option>
            {statusCodes.map((c) => (
              <option key={c} value={c}>
                {p.statuses[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{p.entryDate}</span>
          <input type="date" value={dates.entry} onChange={(e) => setD({ entry: e.target.value })} />
        </label>
        <label className="field">
          <span>{p.registrationUntil}</span>
          <input type="date" value={profile.registrationUntil} onChange={(e) => setP({ registrationUntil: e.target.value })} />
        </label>
        {!eaeu && (
          <label className="field">
            <span>{p.patentUntil}</span>
            <input type="date" value={dates.patent} onChange={(e) => setD({ patent: e.target.value })} />
          </label>
        )}
        <label className="field">
          <span>{p.contractUntil}</span>
          <input type="date" value={dates.contract} onChange={(e) => setD({ contract: e.target.value })} />
        </label>
        <label className="field">
          <span>{p.employer}</span>
          <input type="text" value={profile.employer} onChange={(e) => setP({ employer: e.target.value })} />
        </label>
        <label className="field">
          <span>{p.address}</span>
          <input type="text" value={profile.address} autoComplete="street-address" onChange={(e) => setP({ address: e.target.value })} />
        </label>
      </form>
      {saved && (
        <div className="notice" role="status">
          <span className="notice__icon">
            <Icon name="check" size={20} />
          </span>
          <span className="notice__body">
            <strong>{p.saved}</strong>
          </span>
        </div>
      )}

      <div className="section-head">
        <span>{p.shortcuts}</span>
      </div>
      <ul className="cards">
        {(["contacts", "journal"] as const).map((key) => (
          <li key={key}>
            <Link href={`/${locale}/${key}`} className="card">
              <span className="card__icon">
                <Icon name={key} />
              </span>
              <span className="card__body">
                <strong>{t.nav[key]}</strong>
                <span>{key === "contacts" ? t.contactsPage.intro : t.journalPage.intro}</span>
              </span>
              <Icon name="chevron" size={20} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
