import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/dictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getMessages(locale).help.title : undefined };
}

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale);
  const h = t.help;
  return (
    <>
      <h1>{h.title}</h1>
      <p className="lead">{h.intro}</p>

      <section className="callout callout--sos">
        <h2>{h.emergencyTitle}</h2>
        <p>{h.emergencyText}</p>
        <a href="tel:112" className="btn btn--sos">
          <Icon name="phone" size={20} />
          {t.common.callEmergency}
        </a>
      </section>

      <section className="callout">
        <h2>{h.consulateTitle}</h2>
        <p>{h.consulateText}</p>
      </section>

      <section>
        <h2>{h.scenariosTitle}</h2>
        {h.scenarios.map((s) => (
          <details key={s.title} className="accordion">
            <summary>{s.title}</summary>
            <ol>
              {s.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </details>
        ))}
      </section>

      <section className="callout callout--soon">
        <h2>{h.ngoTitle}</h2>
        <p>{h.ngoText}</p>
      </section>
    </>
  );
}
