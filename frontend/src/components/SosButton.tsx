import { Icon } from "./Icon";

/** Always-reachable emergency call button, shown only on phones. */
export function SosButton({ label }: { label: string }) {
  return (
    <a href="tel:112" className="sos-fab" aria-label={label}>
      <Icon name="phone" size={22} />
      <span>112</span>
    </a>
  );
}
