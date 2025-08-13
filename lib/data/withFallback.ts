/**
 * Fallback utility for graceful degradation
 * Attempts main function first, falls back to fallback on error
 */
export async function withFallback<T>(
  main: () => Promise<T>,
  fallback: () => Promise<T> | T,
  label: string
): Promise<T> {
  try {
    const result = await main();
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[fallback:${label}]`, errorMessage);
    
    if (process.env.NODE_ENV === "development") {
      console.warn(`[fallback:${label}] Using fallback data source`);
    }
    
    return await Promise.resolve(fallback());
  }
}