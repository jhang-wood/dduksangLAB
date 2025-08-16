'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, Users, CheckCircle } from 'lucide-react';

const LectureCTA = () => {
  return (
    <section className="py-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-900/20 via-deepBlack-800/80 to-deepBlack-900" />
      
      <div className="container mx-auto max-w-4xl px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          {/* Attention Hook */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-metallicGold-500/20 border border-metallicGold-500/30 text-metallicGold-400 text-xs font-medium mb-3">
            <Zap className="w-3 h-3" />
            <span>이런 AI 트렌드를 직접 구현하고 싶다면?</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-offWhite-200 mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-300">
              Claude Code CLI 마스터
            </span>
            {' '}실전 구현 강의
          </h2>

          <p className="text-sm text-offWhite-400 max-w-xl mx-auto">
            AI 트렌드를 보고만 있지 말고, <strong className="text-metallicGold-400">직접 만들어보세요</strong>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-deepBlack-300/60 via-deepBlack-400/40 to-deepBlack-500/60 backdrop-blur-sm border border-metallicGold-500/30 rounded-xl p-4 hover:border-metallicGold-400/50 transition-all duration-300"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 to-transparent rounded-xl" />
          
          <div className="relative text-center">
            {/* Center Content */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-sm text-offWhite-300">
                <Code className="w-4 h-4 text-metallicGold-500" />
                <span>실전 구현 노하우로 <strong className="text-metallicGold-400">나만의 AI 도구</strong> 만들기</span>
              </div>
              
              <div className="flex justify-center">
                <Link href="/lectures" className="group">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900 font-semibold py-2.5 px-6 rounded-lg hover:from-metallicGold-400 hover:to-metallicGold-500 transition-all duration-300 shadow-lg shadow-metallicGold-500/30 text-sm"
                  >
                    <span>강의 둘러보기</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Trust Signals - Simple */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-3 pt-2 border-t border-metallicGold-900/20"
        >
          <div className="text-xs text-offWhite-500">
            <span>실무 중심 커리큘럼</span>
            <span className="mx-2">•</span>
            <span>평생 업데이트 지원</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LectureCTA;