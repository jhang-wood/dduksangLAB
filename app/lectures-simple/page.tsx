'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LecturesSimplePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Use auth hook properly at top level
  const authContext = useAuth();

  useEffect(() => {
    try {
      console.log('Auth context loaded:', authContext);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Auth context error:', err);
      setError(err instanceof Error ? err.message : 'Auth context error');
      setLoading(false);
    }
  }, [authContext]);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">에러 발생</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="text-sm text-red-500 bg-red-100 p-4 rounded">
            <strong>가능한 원인:</strong>
            <ul className="mt-2 text-left">
              <li>• useAuth가 AuthProvider 밖에서 호출됨</li>
              <li>• 환경변수 문제</li>
              <li>• 컴포넌트 import 에러</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600">간단한 강의 페이지 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎯 간단한 강의 페이지 (디버그용)
          </h1>
          <p className="text-gray-600">
            이 페이지가 로드되면 기본 인프라는 정상입니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">✅ 테스트 결과</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>React 컴포넌트 로딩</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>useAuth 훅 작동</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>환경변수 접근</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>페이지 렌더링</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Auth 상태</h3>
          <div className="text-sm text-blue-700">
            <p><strong>로딩:</strong> {authContext?.loading ? '예' : '아니오'}</p>
            <p><strong>사용자:</strong> {authContext?.user ? '로그인됨' : '로그인 안됨'}</p>
            <p><strong>관리자:</strong> {authContext?.isAdmin ? '예' : '아니오'}</p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">💡 다음 단계</h3>
          <p className="text-yellow-700">
            이 페이지가 정상 작동하면, 원본 /lectures 페이지의 특정 컴포넌트에서 에러가 발생하고 있습니다.
            복잡한 컴포넌트들을 하나씩 제거하면서 문제를 찾아보세요.
          </p>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/lectures" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            원본 강의 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  );
}