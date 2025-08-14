'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Code, Cpu, Zap, Rocket, MessageSquare } from 'lucide-react';

export default function ClaudeHeroSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 via-deepBlack-900 to-purple-500/5" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col gap-8">
          {/* Top: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-full mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-metallicGold-500" />
              <span className="text-metallicGold-400 font-bold text-sm">
                🎉 첫 런칭 오픈 특가
              </span>
            </motion.div>

            {/* Main Title */}
            <h1 className="font-bold mb-6">
              <span className="block text-offWhite-400 mb-3 text-2xl sm:text-3xl md:text-4xl leading-tight">
                비개발자도
              </span>
              <span className="block bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                Claude Code CLI 하나로
                <br />
                모든 것을 다한다!
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-offWhite-400 mb-8 leading-relaxed">
              복잡한 개발 지식 없이도{' '}
              <span className="text-metallicGold-500 font-semibold">AI를 활용해</span>
              {' '}자동화 프로그램과 웹사이트를 만드는 방법을 알려드립니다.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <Terminal className="w-5 h-5 text-metallicGold-500" />
                <span className="text-sm text-offWhite-300">27개 실습 모듈</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-5 h-5 text-metallicGold-500" />
                <span className="text-sm text-offWhite-300">비개발자 전용</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Code className="w-5 h-5 text-metallicGold-500" />
                <span className="text-sm text-offWhite-300">1년 수강 기간</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Rocket className="w-5 h-5 text-metallicGold-500" />
                <span className="text-sm text-offWhite-300">실전 프로젝트</span>
              </div>
            </div>

            {/* Sub Message */}
            <p className="text-xl font-bold text-offWhite-200">
              코딩을 몰라도 괜찮습니다.
              <br />
              <span className="text-metallicGold-500">Claude Code CLI가 모든 것을 해결합니다.</span>
            </p>
          </motion.div>

          {/* Middle: Feature Cards Grid - 4 cards in a row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* AI 자동화 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative group"
              >
                <div className="bg-deepBlack-600/30 backdrop-blur-xl rounded-2xl p-6 hover:bg-deepBlack-600/40 transition-all duration-300 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(255,215,0,0.15)] h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl flex items-center justify-center mb-4">
                    <Terminal className="w-6 h-6 text-metallicGold-500" />
                  </div>
                  <h3 className="text-lg font-bold text-offWhite-200 mb-2">AI 자동화</h3>
                  <p className="text-sm text-offWhite-500">명령어 하나로 복잡한 프로그램 생성</p>
                </div>
              </motion.div>

              {/* 텔레그램 코딩 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="bg-deepBlack-600/30 backdrop-blur-xl rounded-2xl p-6 hover:bg-deepBlack-600/40 transition-all duration-300 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(255,215,0,0.15)] h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-cyan-500" />
                  </div>
                  <h3 className="text-lg font-bold text-offWhite-200 mb-2">텔레그램 코딩</h3>
                  <p className="text-sm text-offWhite-500">휴대폰으로 어디서든 AI와 대화하며 개발</p>
                </div>
              </motion.div>

              {/* 메타 자동화 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                <div className="bg-deepBlack-600/30 backdrop-blur-xl rounded-2xl p-6 hover:bg-deepBlack-600/40 transition-all duration-300 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(255,215,0,0.15)] h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-bold text-offWhite-200 mb-2">메타 자동화</h3>
                  <p className="text-sm text-offWhite-500">자동화를 자동화하는 혁신적 기술</p>
                </div>
              </motion.div>

              {/* AI 에이전트 협업 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="bg-deepBlack-600/30 backdrop-blur-xl rounded-2xl p-6 hover:bg-deepBlack-600/40 transition-all duration-300 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(255,215,0,0.15)] h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Cpu className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-offWhite-200 mb-2">AI 에이전트 협업</h3>
                  <p className="text-sm text-offWhite-500">24시간 일하는 AI 팀 구축</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom: Enhanced Terminal View */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/10 to-purple-500/10 blur-3xl" />
              <div className="relative bg-deepBlack-600/50 backdrop-blur-xl rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(255,215,0,0.3)] border border-metallicGold-900/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="ml-2 text-sm text-offWhite-500">Claude Code CLI Terminal</span>
                </div>
                <div className="font-mono text-sm space-y-3">
                  {/* Step 1: Initialize */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-green-400"
                  >
                    $ claude create-app my-saas --template nextjs
                  </motion.div>
                  
                  {/* Step 2: Processing */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-offWhite-500 pl-4"
                  >
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ⚡ AI 엔진 초기화 중...
                    </motion.span>
                  </motion.div>
                  
                  {/* Step 3: Creating structure */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="text-cyan-400 pl-4"
                  >
                    📁 프로젝트 구조 생성 중...
                  </motion.div>
                  
                  {/* Step 4: Installing */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0 }}
                    className="text-blue-400 pl-4"
                  >
                    📦 필요한 패키지 설치 중... (27개)
                  </motion.div>
                  
                  {/* Step 5: Setting up features */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4 }}
                    className="text-purple-400 pl-4"
                  >
                    🔧 인증 시스템 설정 중...
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                    className="text-purple-400 pl-4"
                  >
                    💳 결제 시스템 연동 중...
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.2 }}
                    className="text-purple-400 pl-4"
                  >
                    🗄️ 데이터베이스 설정 중...
                  </motion.div>
                  
                  {/* Step 6: Success with animation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.6, type: "spring", stiffness: 200 }}
                    className="text-metallicGold-500 font-bold pl-4 text-base"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: 4 }}
                      className="inline-block"
                    >
                      ✨
                    </motion.span>
                    {' '}완료! SaaS 앱이 준비되었습니다
                  </motion.div>
                  
                  {/* Step 7: Running dev server */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.2 }}
                    className="text-green-400"
                  >
                    $ npm run dev
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.6 }}
                    className="text-offWhite-400 pl-4"
                  >
                    🚀 서버가 http://localhost:3000 에서 실행 중...
                  </motion.div>
                  
                  {/* Progress bar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 5 }}
                    className="mt-4 pt-4 border-t border-metallicGold-900/20"
                  >
                    <div className="flex items-center justify-between text-xs text-offWhite-500 mb-2">
                      <span>전체 진행률</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 5.2 }}
                      >
                        100%
                      </motion.span>
                    </div>
                    <div className="w-full bg-deepBlack-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 5.2, duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-full"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Final message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 6.5 }}
                    className="text-center mt-6 p-4 bg-gradient-to-r from-metallicGold-500/10 to-purple-500/10 rounded-xl"
                  >
                    <p className="text-metallicGold-400 font-bold">
                      🎉 단 5분 만에 완전한 SaaS 플랫폼 구축 완료!
                    </p>
                    <p className="text-offWhite-500 text-xs mt-2">
                      인증, 결제, 데이터베이스 모두 자동 설정됨
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}