"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 72; // px of (damped) pull needed to trigger a refresh
const MAX_PULL = 120;
const HOLD = 56; // where the spinner rests while the page reloads

/** Android-style pull-to-refresh: drag down from the top of the page to reload it. */
export function PullToRefresh({ label }: { label: string }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    const set = (value: number) => {
      pullRef.current = value;
      setPull(value);
    };

    const onStart = (e: TouchEvent) => {
      const target = e.target as Element | null;
      const blocked = target?.closest("input, textarea, select, [role='dialog']");
      startY.current = !busy.current && !blocked && e.touches.length === 1 && window.scrollY <= 0 ? e.touches[0].clientY : null;
    };

    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0 || window.scrollY > 0) {
        if (pullRef.current !== 0) set(0);
        return;
      }
      if (e.cancelable) e.preventDefault();
      set(Math.min(dy * 0.5, MAX_PULL));
    };

    const onEnd = () => {
      if (startY.current === null) return;
      startY.current = null;
      if (pullRef.current >= THRESHOLD) {
        busy.current = true;
        setRefreshing(true);
        set(HOLD);
        window.setTimeout(() => window.location.reload(), 450);
      } else {
        set(0);
      }
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  const progress = Math.min(pull / THRESHOLD, 1);
  return (
    <div
      className={`ptr${pull > 0 ? " ptr--active" : ""}${refreshing ? " ptr--spin" : ""}`}
      style={{ transform: `translate(-50%, ${pull - 56}px)`, opacity: refreshing ? 1 : progress }}
      role="status"
      aria-label={refreshing ? label : undefined}
    >
      <RefreshCw size={22} strokeWidth={2.2} style={refreshing ? undefined : { transform: `rotate(${progress * 270}deg)` }} />
    </div>
  );
}
