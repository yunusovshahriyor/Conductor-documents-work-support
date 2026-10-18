/** Ring chart: `value` out of `total` is drawn in the accent colour over a recessed track. */
export function Donut({ value, total, label, sub }: { value: number; total: number; label: string; sub: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const fraction = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <div className="donut" role="img" aria-label={`${sub}: ${value}/${total}`}>
      <svg viewBox="0 0 140 140" width="100%" height="100%">
        <circle cx="70" cy="70" r={r} className="donut__track" />
        <circle
          cx="70"
          cy="70"
          r={r}
          className="donut__value"
          strokeDasharray={`${fraction * c} ${c}`}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="donut__center">
        <strong>{label}</strong>
        <span>{sub}</span>
      </div>
    </div>
  );
}
