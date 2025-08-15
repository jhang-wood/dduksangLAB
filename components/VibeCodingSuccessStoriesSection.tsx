'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Quote,
  Award,
  Rocket,
  BarChart3
} from 'lucide-react';

export default function VibeCodingSuccessStoriesSection() {
  const successStories = [
    {
      name: 'Andrej Karpathy',
      role: 'OpenAI 공동창업자',
      achievement: '바이브코딩 창시자',
      quote: '바이브코딩으로 코드의 존재조차 잊게 된다',
      icon: Zap,
      color: 'from-purple-500 to-indigo-600',
      highlight: '2025년 2월 바이브코딩 용어 창시'
    },
    {
      name: 'Peter Levels',
      role: '인디 해커',
      achievement: '$1M+ 수익',
      quote: '바이브코딩으로 빠르게 만들고 수익화했다',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      highlight: '비행 시뮬레이터 MMO로 백만 달러'
    },
    {
      name: 'Base44',
      role: '스타트업',
      achievement: '$80M 인수',
      quote: '6개월 만에 25만 사용자 달성',
      icon: Rocket,
      color: 'from-orange-500 to-red-600',
      highlight: 'Wix가 8천만 달러에 인수'
    },
    {
      name: 'Replit',
      role: 'AI 플랫폼',
      achievement: '10배 성장',
      quote: 'ARR $10M → $100M (9개월)',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      highlight: 'Replit Agent 출시 후 폭발적 성장'
    }
  ];

  const industryStats = [
    {
      value: '60%',
      label: '개발자들이 AI로 코드 절반 작성',
      subtext: '2024년 20% → 2025년 60%'
    },
    {
      value: '40%',
      label: '비개발자도 이제 코딩 시작',
      subtext: '디자이너, 매니저, 분석가 포함'
    },
    {
      value: '25%',
      label: 'Y Combinator 스타트업 AI 코드',
      subtext: '대부분 AI 생성 코드베이스'
    },
    {
      value: '$25B',
      label: '2030년 AI 코딩 시장 규모',
      subtext: '폭발적인 성장 예상'
    }
  ];

  const leaderQuotes = [
    {
      name: 'Garry Tan',
      role: 'Y Combinator CEO',
      quote: '10명의 바이브 코더가 100명 개발자의 일을 한다',
      icon: Users,
      emphasis: '10배 생산성'
    },
    {
      name: 'Dario Amodei',
      role: 'Anthropic CEO',
      quote: 'AI가 3-6개월 내 모든 코드를 작성할 것',
      icon: Zap,
      emphasis: '완전 자동화'
    }
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 via-transparent to-purple-500/5" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-full backdrop-blur-sm mb-4">
            <Award className="w-4 h-4 text-metallicGold-500" />
            <span className="text-metallicGold-400 font-bold text-sm">
              2025년 바이브코딩 혁명
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              실제로 수익을 만든 사람들
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            OpenAI 창업자부터 인디 해커까지, 바이브코딩으로 성공한 실제 사례
          </p>
        </motion.div>

        {/* Success Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {successStories.map((story, index) => {
            const Icon = story.icon;
            
            return (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className={`bg-gradient-to-br ${story.color} p-[1px] rounded-2xl`}>
                  <div className="bg-deepBlack-800 rounded-2xl p-6 h-full">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${story.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-offWhite-200">{story.name}</h3>
                        <p className="text-sm text-offWhite-400">{story.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-metallicGold-500">{story.achievement}</p>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="bg-deepBlack-900/50 rounded-xl p-4 mb-3">
                      <Quote className="w-4 h-4 text-offWhite-600 mb-2" />
                      <p className="text-offWhite-300 italic">&ldquo;{story.quote}&rdquo;</p>
                    </div>

                    {/* Highlight */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-metallicGold-500 rounded-full animate-pulse" />
                      <p className="text-sm text-metallicGold-400 font-medium">{story.highlight}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Industry Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-deepBlack-800/50 to-deepBlack-700/50 rounded-3xl p-8 backdrop-blur-sm border border-metallicGold-500/20 mb-12"
        >
          <h3 className="text-2xl font-bold text-center text-metallicGold-500 mb-8">
            2025년 바이브코딩 시장 현황
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industryStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mb-2">
                  {stat.value}
                </div>
                <p className="text-sm font-semibold text-offWhite-200 mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-offWhite-500">
                  {stat.subtext}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leader Quotes */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {leaderQuotes.map((quote, index) => {
            const Icon = quote.icon;
            
            return (
              <motion.div
                key={quote.name}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-deepBlack-600/30 rounded-2xl p-6 border border-metallicGold-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-deepBlack-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-offWhite-200 mb-3">
                      &ldquo;{quote.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-offWhite-300">{quote.name}</p>
                        <p className="text-sm text-offWhite-500">{quote.role}</p>
                      </div>
                      <div className="px-3 py-1 bg-metallicGold-500/20 rounded-full">
                        <p className="text-sm font-bold text-metallicGold-400">{quote.emphasis}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cursor Success Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-3xl p-8 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-purple-400">특별 사례: Cursor</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-500 mb-2">$9.9B</p>
              <p className="text-sm text-offWhite-400">기업 가치</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-500 mb-2">$900M</p>
              <p className="text-sm text-offWhite-400">투자 유치</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-500 mb-2">#1</p>
              <p className="text-sm text-offWhite-400">역사상 가장 빠른 성장</p>
            </div>
          </div>
          
          <p className="text-center text-offWhite-300 mt-6">
            AI 코드 에디터가 <span className="text-purple-400 font-bold">99억 달러 평가</span>를 받은 이유?
            <br />
            <span className="text-lg font-semibold text-offWhite-200">바이브코딩이 미래이기 때문입니다</span>
          </p>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl px-8 py-6 backdrop-blur-sm border border-metallicGold-500/20">
            <p className="text-2xl font-bold text-offWhite-200 mb-2">
              이들의 공통점? <span className="text-metallicGold-500">Claude AI를 활용한 바이브코딩</span>
            </p>
            <p className="text-lg text-offWhite-400">
              이제 당신도 Claude Code CLI로 시작할 차례입니다
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}