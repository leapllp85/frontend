import { useEffect, useState } from 'react';

/**
 * Hook to ensure component only renders on client-side after hydration
 * Prevents hydration mismatches for components using browser-only APIs
 */
export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
