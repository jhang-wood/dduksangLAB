'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LecturesMinimalPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500 mx-auto mb-4"></div>
          <p className="text-offWhite-500 text-lg">강의 페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 text-offWhite-200">
      {/* Neural Network Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-deepBlack-800 to-deepBlack-900"></div>
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2">
          <div className="w-full h-full bg-gradient-to-br from-metallicGold-900/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2">
          <div className="w-full h-full bg-gradient-to-br from-metallicGold-500/5 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-deepBlack-900/80 backdrop-blur-xl border-b border-metallicGold-900/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-metallicGold-500">떡상연구소</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/ai-trends" className="text-sm font-medium text-offWhite-500 hover:text-metallicGold-500 transition-colors">
                  AI 트렌드
                </a>
                <a href="/community" className="text-sm font-medium text-offWhite-500 hover:text-metallicGold-500 transition-colors">
                  커뮤니티
                </a>
                <a href="/lectures" className="text-sm font-medium text-metallicGold-500">
                  강의
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-metallicGold-500">Claude Code CLI</span>
                <br />
                <span className="text-offWhite-200">마스터 과정</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-offWhite-400 mb-8">
                비개발자도 AI로 프로그램 만들기
              </p>

              <div className="bg-gradient-to-r from-deepBlack-600/50 to-deepBlack-700/50 rounded-3xl p-8 max-w-2xl mx-auto backdrop-blur-sm border border-metallicGold-900/20">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-offWhite-400 line-through mb-2">
                    ₩899,000
                  </div>
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-400 to-metallicGold-600 mb-2">
                    ₩149,000
                  </div>
                  <div className="text-sm text-metallicGold-400">
                    무려 750,000원 할인! (83% OFF)
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-metallicGold-500">✓</span>
                    <span className="text-offWhite-300">30개 실습 프로젝트</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-metallicGold-500">✓</span>
                    <span className="text-offWhite-300">13시간 분량</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-metallicGold-500">✓</span>
                    <span className="text-offWhite-300">1년 수강 기간</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl"
                >
                  🎁 수강 신청하기
                </motion.button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-bold text-center text-offWhite-200 mb-12">
                이런 것들을 배웁니다
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-deepBlack-600/30 rounded-2xl p-6 backdrop-blur-sm border border-metallicGold-900/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold text-offWhite-200 mb-2">AI 자동화</h3>
                  <p className="text-offWhite-400">명령어 하나로 복잡한 프로그램 생성</p>
                </div>

                <div className="bg-deepBlack-600/30 rounded-2xl p-6 backdrop-blur-sm border border-metallicGold-900/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold text-offWhite-200 mb-2">텔레그램 코딩</h3>
                  <p className="text-offWhite-400">휴대폰으로 어디서든 AI와 대화하며 개발</p>
                </div>

                <div className="bg-deepBlack-600/30 rounded-2xl p-6 backdrop-blur-sm border border-metallicGold-900/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-offWhite-200 mb-2">실전 배포</h3>
                  <p className="text-offWhite-400">만든 프로그램을 실제로 배포하고 운영</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}