'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Rocket, DollarSign, Code } from 'lucide-react';

const vibeCodingStats = [
  {
    name: 'Pieter Levels',
    achievement: '연 매출 40억원',
    detail: '직원 0명, 혼자서 운영',
    highlight: '30분 만에 월 5만불 게임 제작',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'Remote OK',
    achievement: '월 1.4억원 수익',
    detail: '구인구직 플랫폼',
    highlight: '완전 자동화 운영',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Reagan Maconi',
    achievement: '4시간 개발',
    detail: '배틀로얄 FPS 게임',
    highlight: '18만 뷰 달성',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: '익명 개발자',
    achievement: '월 5만불 수익',
    detail: 'AI 생성 게임',
    highlight: '프로토타입 30분',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
  },
];

const gameJamStats = {
  totalGames: '1,170',
  aiGenerated: '80%+',
  totalPrize: '200만원',
  participants: '2,000+',
};

export default function VibeCodingShowcase() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offWhite-200 mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              바이브코딩
            </span>
            이 뭔가요?
          </h2>
          
          {/* Definition Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-3xl p-8 mb-12 max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-metallicGold-500/20 rounded-xl">
                <Code className="w-8 h-8 text-metallicGold-500" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-metallicGold-500 mb-2">
                  Vibe Coding = AI와 함께 춤추는 개발
                </h3>
                <p className="text-lg text-offWhite-300 leading-relaxed">
                  "AI에게 코드 작성을 맡기고 우리는 아이디어에만 집중하는 개발 방식"
                </p>
                <p className="text-sm text-offWhite-500 mt-4">
                  - Andrej Karpathy (OpenAI 공동창업자) 제안<br />
                  - 코드 품질보다 속도와 결과에 집중<br />
                  - 비개발자도 프로덕트 제작 가능
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Success Stories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-offWhite-200 mb-8 text-center">
            바이브코딩 대가들의 
            <span className="text-metallicGold-500"> 실제 성과</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {vibeCodingStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6 hover:border-metallicGold-500/40 transition-all duration-300">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                    
                    <div className="relative flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-offWhite-200 mb-1">
                          {stat.name}
                        </h4>
                        <p className="text-2xl font-bold text-metallicGold-500 mb-2">
                          {stat.achievement}
                        </p>
                        <p className="text-offWhite-400 mb-3">
                          {stat.detail}
                        </p>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-500">
                            {stat.highlight}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 2025 Vibe Code Game Jam Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-metallicGold-500/10 via-metallicGold-600/10 to-metallicGold-900/10 border border-metallicGold-500/30 rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold text-center text-metallicGold-500 mb-8">
            🎮 2025 Vibe Code Game Jam 성과
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-offWhite-200">{gameJamStats.totalGames}</p>
              <p className="text-sm text-offWhite-500 mt-1">출품 게임</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-offWhite-200">{gameJamStats.aiGenerated}</p>
              <p className="text-sm text-offWhite-500 mt-1">AI 생성 코드</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-offWhite-200">{gameJamStats.totalPrize}</p>
              <p className="text-sm text-offWhite-500 mt-1">총 상금</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-offWhite-200">{gameJamStats.participants}</p>
              <p className="text-sm text-offWhite-500 mt-1">참가자</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xl text-offWhite-300">
            코딩 몰라도 <span className="text-metallicGold-500 font-bold">바이브코딩</span>으로
          </p>
          <p className="text-2xl font-bold text-offWhite-200 mt-2">
            당신도 월 천만원 자동화 시스템을 만들 수 있습니다
          </p>
        </motion.div>
      </div>
    </section>
  );
}