'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('Test page mounted');
      setTimeout(() => {
        setLoading(false);
        console.log('Loading completed');
      }, 1000);
    } catch (err) {
      console.error('Error in test page:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">테스트 페이지 오류</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600">테스트 페이지 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-4">🎉 테스트 페이지 성공!</h1>
        <p className="text-green-600 mb-4">페이지가 정상적으로 로드되었습니다.</p>
        <div className="bg-white p-4 rounded shadow-md inline-block">
          <p className="text-sm text-gray-600">
            현재 시간: {new Date().toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
    </div>
  );
}