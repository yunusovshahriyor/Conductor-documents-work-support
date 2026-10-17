"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { readJSON, writeJSON } from "@/lib/storage";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "provodnik:install-dismissed";

export function InstallPrompt({
  title,
  text,
  installLabel,
  dismissLabel,
}: {
  title: string;
  text: string;
  installLabel: string;
  dismissLabel: string;
}) {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (readJSON<boolean>(DISMISS_KEY, false)) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!event) return null;

  const dismiss = () => {
    writeJSON(DISMISS_KEY, true);
    setEvent(null);
  };

  return (
    <aside className="install" aria-label={title}>
      <Icon name="download" />
      <div className="install__body">
        <strong>{title}</strong>
        <p>{text}</p>
        <div className="install__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={async () => {
              await event.prompt();
              await event.userChoice;
              setEvent(null);
            }}
          >
            {installLabel}
          </button>
          <button type="button" className="btn btn--ghost" onClick={dismiss}>
            {dismissLabel}
          </button>
        </div>
      </div>
    </aside>
  );
}
