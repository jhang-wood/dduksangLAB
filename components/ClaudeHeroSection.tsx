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
          {/* Top: Creative Hook Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center pt-8"
          >
            <h1 className="font-bold">
              <span className="block text-base sm:text-lg md:text-xl text-offWhite-500 mb-2">
                코딩 1도 몰라도
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                <span className="text-metallicGold-500">"그냥 만들어줘"</span>
                <span className="text-offWhite-200"> 한 마디로</span>
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl text-offWhite-300 mt-3">
                월 천만원 버는 자동화 시스템 완성
              </span>
            </h1>
            <p className="text-sm sm:text-base text-offWhite-500 mt-4 max-w-2xl mx-auto">
              대기업 개발자들도 몰래 쓰는 Claude Code CLI의 비밀
            </p>
          </motion.div>

          {/* Second: Enhanced Terminal View */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl" />
              
              {/* Terminal window */}
              <div className="relative bg-deepBlack-900/80 backdrop-blur-xl rounded-2xl shadow-[0_30px_90px_-15px_rgba(255,215,0,0.4)] border border-metallicGold-900/30 overflow-hidden">
                {/* Terminal header */}
                <div className="bg-deepBlack-800/90 px-6 py-3 flex items-center justify-between border-b border-metallicGold-900/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-offWhite-500 font-mono">Claude Code CLI - 왕초보의 첫 MVP 🚀</span>
                  <div className="text-xs text-offWhite-600 font-mono">실시간 데모</div>
                </div>
                
                {/* Terminal content */}
                <div className="p-6 font-mono text-sm space-y-3">
                  {/* Initial command */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-green-400"
                  >
                    <span className="text-offWhite-600">초보자@첫도전 $</span> claude create "쇼핑몰 만들어줘"
                  </motion.div>
                  
                  {/* AI Understanding */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-cyan-400 pl-4"
                  >
                    🤖 네, 쇼핑몰 사이트를 만들어드리겠습니다!
                  </motion.div>
                  
                  {/* Progress indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="space-y-2"
                  >
                    <div className="text-yellow-400 pl-4">
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ⚡ [0분] AI가 프로젝트 구조 생성 중...
                      </motion.span>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      className="text-blue-400 pl-4"
                    >
                      📦 [10분] 상품 관리 시스템 구축 중...
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      className="text-purple-400 pl-4"
                    >
                      💳 [20분] 결제 시스템 연동 중...
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      className="text-pink-400 pl-4"
                    >
                      🎨 [30분] 반응형 디자인 적용 중...
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.5 }}
                      className="text-emerald-400 pl-4"
                    >
                      🔐 [40분] 회원가입/로그인 시스템 완성...
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 4 }}
                      className="text-orange-400 pl-4"
                    >
                      📊 [50분] 관리자 대시보드 생성 중...
                    </motion.div>
                  </motion.div>
                  
                  {/* Success message */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 4.5, type: "spring", stiffness: 200 }}
                    className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, delay: 5 }}
                        className="text-2xl"
                      >
                        ✨
                      </motion.span>
                      <div>
                        <p className="text-green-400 font-bold text-base">
                          [58분] 완료! MVP 쇼핑몰이 준비되었습니다!
                        </p>
                        <p className="text-green-300 text-xs mt-1">
                          🌐 https://my-shopping-mall.vercel.app 에서 확인하세요
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 5.5 }}
                    className="flex gap-6 mt-4 pt-4 border-t border-metallicGold-900/20 text-xs"
                  >
                    <div className="text-offWhite-500">
                      <span className="text-metallicGold-400 font-bold">58분</span> 소요
                    </div>
                    <div className="text-offWhite-500">
                      <span className="text-metallicGold-400 font-bold">0줄</span> 직접 코딩
                    </div>
                    <div className="text-offWhite-500">
                      <span className="text-metallicGold-400 font-bold">100%</span> AI 자동화
                    </div>
                    <div className="text-offWhite-500">
                      <span className="text-metallicGold-400 font-bold">즉시</span> 배포 완료
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Bottom highlight */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 6 }}
                className="text-center mt-6"
              >
                <p className="text-metallicGold-400 font-bold text-lg">
                  👆 실제 왕초보가 1시간 안에 만든 결과물
                </p>
                <p className="text-offWhite-500 text-sm mt-2">
                  코딩 경험 0, 개발 지식 0, 오직 한국어로 대화만 했습니다
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom: Supporting Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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

            {/* Description */}
            <p className="text-base sm:text-lg text-offWhite-400 mb-6 leading-relaxed max-w-2xl mx-auto">
              복잡한 개발 지식 없이도{' '}
              <span className="text-metallicGold-500 font-semibold">AI를 활용해</span>
              {' '}자동화 프로그램과 웹사이트를 만드는 방법을 알려드립니다.
            </p>

            {/* Features - More compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-1">
                <Terminal className="w-4 h-4 text-metallicGold-500" />
                <span className="text-xs text-offWhite-300">27개 실습</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-metallicGold-500" />
                <span className="text-xs text-offWhite-300">비개발자용</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Code className="w-4 h-4 text-metallicGold-500" />
                <span className="text-xs text-offWhite-300">1년 수강</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Rocket className="w-4 h-4 text-metallicGold-500" />
                <span className="text-xs text-offWhite-300">실전 프로젝트</span>
              </div>
            </div>

            {/* Sub Message */}
            <p className="text-lg font-bold text-offWhite-200">
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

        </div>
      </div>
    </section>
  );
}