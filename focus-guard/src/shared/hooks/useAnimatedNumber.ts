import { useEffect, useRef, useState } from 'react';

interface Options {
  duration?: number;
  decimals?: number;
  snapThreshold?: number;
}

export function useAnimatedNumber(
  target: number,
  { duration = 400, decimals = 0, snapThreshold = 30 }: Options = {},
): number {
  const [displayed, setDisplayed] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const delta = target - from;

    // Snap instantly when wrapping (e.g. 59→0) or delta is too large backward
    if (delta < 0 && Math.abs(delta) >= snapThreshold) {
      cancelAnimationFrame(rafRef.current);
      fromRef.current = target;
      setDisplayed(target);
      return;
    }

    // No change
    if (delta === 0) return;

    startRef.current = null;

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // Quadratic ease-out: t * (2 - t)
      const eased = t * (2 - t);
      const current = from + delta * eased;

      const rounded = decimals > 0
        ? parseFloat(current.toFixed(decimals))
        : Math.round(current);

      setDisplayed(rounded);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals, snapThreshold]);

  // Keep fromRef in sync when displayed settles
  useEffect(() => {
    fromRef.current = displayed;
  }, [displayed]);

  return displayed;
}
