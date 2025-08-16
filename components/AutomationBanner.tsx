'use client';

import React from 'react';

export default function AutomationBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-center space-x-3">
        {/* 애니메이션 점 */}
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-400"></span>
        </div>
        
        {/* 메인 텍스트 */}
        <div className="text-center">
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            🤖 실시간 AI 트렌드 자동 수집 시스템 가동 중
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            검증된 최신 AI 정보를 매일 오전 8시, 오후 8시 자동 업데이트
          </p>
        </div>
        
        {/* 회전 아이콘 */}
        <div className="relative">
          <svg className="w-6 h-6 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      
      {/* 하단 상태 바 */}
      <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-gray-400">시스템 정상</span>
        </span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400">24/7 자동화</span>
      </div>
    </div>
  );
}