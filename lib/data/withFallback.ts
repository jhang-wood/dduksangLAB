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
    // Only log in development mode to reduce production noise
    if (process.env.NODE_ENV === "development") {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`[fallback:${label}] ${errorMessage} - using fallback`);
    }
    
    return await Promise.resolve(fallback());
  }
}