'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Code, Cpu, Zap, Rocket } from 'lucide-react';

export default function ClaudeHeroSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 via-deepBlack-900 to-purple-500/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-full border border-metallicGold-500/50 mb-6 backdrop-blur-sm"
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
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-metallicGold-500" />
                <span className="text-sm text-offWhite-300">27개 실습 모듈</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-metallicGold-500" />
                <span className="text-sm text-offWhite-300">비개발자 전용</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-metallicGold-500" />
                <span className="text-sm text-offWhite-300">1년 수강 기간</span>
              </div>
              <div className="flex items-center gap-2">
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

          {/* Right: Claude Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/20 to-purple-500/20 blur-3xl" />
              
              {/* Claude Terminal Illustration */}
              <div className="relative bg-deepBlack-600/50 backdrop-blur-xl border border-metallicGold-500/30 rounded-2xl p-6 shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="ml-2 text-xs text-offWhite-500">Claude Code CLI</span>
                </div>

                {/* Terminal Content */}
                <div className="space-y-3 font-mono text-sm">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-green-500">$</span>
                    <span className="text-offWhite-300">claude</span>
                    <span className="text-metallicGold-500">create-app</span>
                    <span className="text-offWhite-500">my-saas</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-offWhite-500"
                  >
                    ✨ AI가 앱을 생성중...
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-green-400"
                  >
                    ✅ 프론트엔드 구축 완료
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-green-400"
                  >
                    ✅ 백엔드 API 생성 완료
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    className="text-green-400"
                  >
                    ✅ 데이터베이스 연결 완료
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-metallicGold-500 font-bold"
                  >
                    🚀 앱이 준비되었습니다!
                  </motion.div>
                </div>

                {/* Animated Claude Icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-metallicGold-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <div className="text-4xl">🤖</div>
                </motion.div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Cpu className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(255, 255, 255, 0.03) 40px,
            rgba(255, 255, 255, 0.03) 80px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(255, 255, 255, 0.03) 40px,
            rgba(255, 255, 255, 0.03) 80px
          );
        }
      `}</style>
    </section>
  );
}