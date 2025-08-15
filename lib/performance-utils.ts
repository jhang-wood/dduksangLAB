/**
 * 성능 최적화 유틸리티 함수들
 */

// 디바운스 훅
import { useCallback, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback as T;
}

// 스로틀 훅
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastRunRef.current >= delay) {
        callback(...args);
        lastRunRef.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRunRef.current = Date.now();
        }, delay - (now - lastRunRef.current));
      }
    },
    [callback, delay]
  );

  return throttledCallback as T;
}

// 성능 측정 유틸리티
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private marks: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMark(name: string): void {
    this.marks.set(name, performance.now());
  }

  endMark(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Performance [${name}]: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
}

// 이미지 lazy loading 헬퍼
export const createImagePlaceholder = (width: number, height: number): string => {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x2="100%" y2="100%">
          <stop stop-color="#333"/>
          <stop offset="100%" stop-color="#666"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`
  )}`;
};

// 메모리 사용량 모니터링 (개발 환경에서만)
export const logMemoryUsage = (): void => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log('🧠 Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
    });
  }
};

// 컴포넌트 렌더링 횟수 추적 (개발 환경에서만)
export const useRenderCount = (componentName: string): void => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
  }
};

// API 응답 캐싱
export class APICache {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5분

  static set(key: string, data: any, ttl: number = APICache.DEFAULT_TTL): void {
    APICache.cache.set(key, {
      data,
      timestamp: Date.now() + ttl
    });
  }

  static get<T = any>(key: string): T | null {
    const cached = APICache.cache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.timestamp) {
      APICache.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  static clear(): void {
    APICache.cache.clear();
  }

  static size(): number {
    return APICache.cache.size;
  }
}