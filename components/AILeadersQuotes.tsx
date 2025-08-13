'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Quote } from 'lucide-react';

const aiLeaders = [
  {
    id: 1,
    name: 'Sam Altman',
    role: 'OpenAI CEO',
    company: 'OpenAI',
    quote: '2025년 AI 에이전트가 직장에 합류합니다. AGI는 전통적 이해대로 구축 가능합니다',
    source: 'Bloomberg Interview 2025',
    color: 'from-emerald-500/20 to-emerald-900/20',
  },
  {
    id: 2,
    name: 'Elon Musk',
    role: 'xAI Founder',
    company: 'xAI',
    quote: 'AGI는 2025-2026년 사이 도래. 인간보다 똑똑한 AI가 내년 현실화됩니다',
    source: 'Norway Wealth Fund Interview',
    color: 'from-blue-500/20 to-blue-900/20',
  },
  {
    id: 3,
    name: 'Jensen Huang',
    role: 'NVIDIA CEO',
    company: 'NVIDIA',
    quote: '5년 내 AGI가 모든 테스트에서 인간을 능가할 것입니다',
    source: 'GTC 2025 Keynote',
    color: 'from-green-500/20 to-green-900/20',
  },
  {
    id: 4,
    name: 'Demis Hassabis',
    role: 'DeepMind CEO',
    company: 'Google DeepMind',
    quote: '5-10년 내 AGI 도래, 산업혁명보다 10배 크고 10배 빠른 변화',
    source: 'Fortune Interview 2025',
    color: 'from-purple-500/20 to-purple-900/20',
  },
  {
    id: 5,
    name: 'Satya Nadella',
    role: 'Microsoft CEO',
    company: 'Microsoft',
    quote: 'AI 에이전트가 비즈니스 애플리케이션의 개념 자체를 붕괴시킬 것',
    source: 'Microsoft AI Tour 2025',
    color: 'from-orange-500/20 to-orange-900/20',
  },
];

export default function AILeadersQuotes() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % aiLeaders.length);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + aiLeaders.length) % aiLeaders.length);
  };

  const currentLeader = aiLeaders[currentIndex];

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-offWhite-200 mb-4">
            2025년 8월,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              AI 리더들이 말하는 미래
            </span>
          </h2>
          <p className="text-base sm:text-lg text-offWhite-400">
            세계 최고의 AI 기업 CEO들이 예측하는 AGI 시대
          </p>
        </motion.div>

        {/* Quote Carousel */}
        <div className="relative">
          <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLeader.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Quote Icon */}
                <Quote className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-12 sm:h-12 text-metallicGold-500/20" />
                
                {/* Quote Content */}
                <div className={`bg-gradient-to-br ${currentLeader.color} rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6`}>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-offWhite-200 leading-relaxed">
                    "{currentLeader.quote}"
                  </p>
                </div>

                {/* Leader Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-metallicGold-500">
                      {currentLeader.name}
                    </h3>
                    <p className="text-sm sm:text-base text-offWhite-400">
                      {currentLeader.role}, {currentLeader.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-offWhite-500">
                    <ExternalLink className="w-4 h-4" />
                    <span>{currentLeader.source}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 sm:mt-8">
              <button
                onClick={prevQuote}
                className="p-2 sm:p-3 bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-lg sm:rounded-xl hover:bg-metallicGold-500/20 transition-all"
                aria-label="Previous quote"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-metallicGold-500" />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {aiLeaders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-8 bg-metallicGold-500'
                        : 'bg-metallicGold-500/30'
                    }`}
                    aria-label={`Go to quote ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextQuote}
                className="p-2 sm:p-3 bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-lg sm:rounded-xl hover:bg-metallicGold-500/20 transition-all"
                aria-label="Next quote"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-metallicGold-500" />
              </button>
            </div>
          </div>

          {/* Auto-play indicator */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-metallicGold-500/30 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            onAnimationComplete={nextQuote}
          />
        </div>

        {/* Additional Context */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm sm:text-base md:text-lg text-offWhite-400 px-4">
            <span className="text-metallicGold-500 font-semibold">공통 예측:</span>{' '}
            AGI는 2-5년 내 현실이 됩니다. 지금 준비하지 않으면 늦습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}