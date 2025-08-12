import { useState, useEffect, useCallback, useMemo } from 'react';
import { logger } from '@/lib/logger';

/**
 * 최적화된 쿼리 훅 - 메모이제이션과 캐싱을 통한 성능 향상
 * @param queryFn 실행할 쿼리 함수
 * @param deps 의존성 배열
 * @param cacheTime 캐시 유지 시간 (ms)
 */
interface UseOptimizedQueryOptions<T> {
  queryFn: () => Promise<{ data: T | null; error: any }>;
  deps: any[];
  cacheTime?: number;
  enabled?: boolean;
}

interface QueryCache {
  data: any;
  timestamp: number;
  key: string;
}

// 전역 캐시 저장소
const queryCache = new Map<string, QueryCache>();

function getCacheKey(deps: any[]): string {
  return JSON.stringify(deps);
}

function isCacheValid(cache: QueryCache, cacheTime: number): boolean {
  return Date.now() - cache.timestamp < cacheTime;
}

export function useOptimizedQuery<T>({
  queryFn,
  deps,
  cacheTime = 5 * 60 * 1000, // 기본 5분 캐시
  enabled = true,
}: UseOptimizedQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const cacheKey = useMemo(() => getCacheKey(deps), deps);

  const executeQuery = useCallback(async () => {
    if (!enabled) {
      return;
    }

    // 캐시 확인
    const cached = queryCache.get(cacheKey);
    if (cached && isCacheValid(cached, cacheTime)) {
      setData(cached.data);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();

      if (result.error) {
        throw result.error;
      }

      // 캐시에 저장
      queryCache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now(),
        key: cacheKey,
      });

      setData(result.data);
      return result.data;
    } catch (err) {
      logger.error('Query error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryFn, cacheKey, cacheTime, enabled]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  const refetch = useCallback(() => {
    // 캐시 무효화 후 재실행
    queryCache.delete(cacheKey);
    return executeQuery();
  }, [cacheKey, executeQuery]);

  const invalidateCache = useCallback(() => {
    queryCache.delete(cacheKey);
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache,
  };
}

/**
 * 캐시 관리 유틸리티
 */
export const queryUtils = {
  clearAll: () => {
    queryCache.clear();
  },

  clearByPattern: (pattern: string) => {
    for (const [key] of queryCache) {
      if (key.includes(pattern)) {
        queryCache.delete(key);
      }
    }
  },

  getStats: () => ({
    size: queryCache.size,
    keys: Array.from(queryCache.keys()),
  }),
};
