import { useSyncExternalStore, useCallback } from 'react';

/**
 * SSR-safe media query hook.
 * Vraća `true` dok god upit odgovara (npr. '(min-width: 1024px)').
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onStoreChange);
    return () => mql.removeEventListener('change', onStoreChange);
  }, [query]);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false, // SSR fallback
  );
}

/** Desktop = ≥1024px (Tailwind `lg`). Ispod toga koristimo bottom sheet. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
