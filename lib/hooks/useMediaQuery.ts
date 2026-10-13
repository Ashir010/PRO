"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media-query hook via useSyncExternalStore. Returns `false` on the
 * server and at first client render (so hydration matches), then the live value.
 * Used to switch the service panels between sticky stacking (desktop) and the
 * natural-flow stacked-reveal (mobile/tablet).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** True only after client hydration — avoids hydration mismatches. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
