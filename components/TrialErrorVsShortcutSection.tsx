'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Brain,
  Target,
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function TrialErrorVsShortcutSection() {
  const trialErrorItems = [
    {
      icon: Clock,
      title: '3-6개월 시행착오',
      description: '방향성 없이 헤매는 시간',
      value: '180일',
      color: 'text-red-500'
    },
    {
      icon: DollarSign,
      title: 'AI 사용료 폭탄',
      description: 'Claude Max, ChatGPT Plus 등',
      value: '월 30만원+',
      color: 'text-red-500'
    },
    {
      icon: AlertTriangle,
      title: '정보의 홍수에 압도',
      description: '뭐가 중요한지 모르겠음',
      value: '스트레스',
      color: 'text-red-500'
    },
    {
      icon: Brain,
      title: '컨텍스트 한계에 갇힘',
      description: '복잡한 프로젝트는 포기',
      value: '제한적',
      color: 'text-red-500'
    }
  ];

  const shortcutItems = [
    {
      icon: Target,
      title: '검증된 27시간 커리큘럼',
      description: '최소 지식으로 최대 효과',
      value: '27시간',
      color: 'text-green-500'
    },
    {
      icon: CheckCircle,
      title: '강의료만 149,000원',
      description: '몇 달치 AI 사용료보다 저렴',
      value: '149,000원',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: '명확한 방향성 제시',
      description: '단계별 가이드로 길을 잃지 않음',
      value: '확실함',
      color: 'text-green-500'
    },
    {
      icon: Zap,
      title: '바로 적용 가능한 실전',
      description: '27개 프로젝트 완성 보장',
      value: '무제한',
      color: 'text-green-500'
    }
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/30 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-green-500/5" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-metallicGold-500 to-green-500">
              시행착오 vs 지름길
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            강사가 1500만원 상당의 연구로 찾아낸 지름길의 가치
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trial & Error Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-500/10 to-red-900/5 rounded-3xl p-8 border border-red-500/20 h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-400">혼자 하는 시행착오</h3>
                  <p className="text-offWhite-500 text-sm">AI에게 물어보며 독학</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {trialErrorItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-4 bg-deepBlack-800/50 rounded-xl border border-red-500/10"
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-offWhite-200 mb-1">{item.title}</h4>
                        <p className="text-sm text-offWhite-500">{item.description}</p>
                      </div>
                      <div className={`text-right flex-shrink-0 font-bold ${item.color}`}>
                        {item.value}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total Cost */}
              <div className="mt-8 p-6 bg-red-500/20 rounded-2xl border border-red-500/30">
                <div className="text-center">
                  <p className="text-sm text-red-400 mb-2">예상 총 비용</p>
                  <p className="text-3xl font-bold text-red-500 mb-2">900만원+</p>
                  <p className="text-xs text-offWhite-500">시간 비용 + AI 사용료 + 기회비용</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Arrow in the middle (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 p-4 rounded-full shadow-2xl"
            >
              <ArrowRight className="w-8 h-8 text-deepBlack-900" />
            </motion.div>
          </div>

          {/* Shortcut Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-900/5 rounded-3xl p-8 border border-green-500/20 h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400">검증된 지름길</h3>
                  <p className="text-offWhite-500 text-sm">이 강의로 바로 시작</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {shortcutItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-4 bg-deepBlack-800/50 rounded-xl border border-green-500/10"
                    >
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-offWhite-200 mb-1">{item.title}</h4>
                        <p className="text-sm text-offWhite-500">{item.description}</p>
                      </div>
                      <div className={`text-right flex-shrink-0 font-bold ${item.color}`}>
                        {item.value}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total Cost */}
              <div className="mt-8 p-6 bg-green-500/20 rounded-2xl border border-green-500/30">
                <div className="text-center">
                  <p className="text-sm text-green-400 mb-2">실제 총 비용</p>
                  <p className="text-3xl font-bold text-green-500 mb-2">149,000원</p>
                  <p className="text-xs text-offWhite-500">강의료 + 1년 수강 기간</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-3xl p-8 border border-metallicGold-500/30">
            <h3 className="text-2xl font-bold text-metallicGold-500 mb-4">
              강사의 1500만원 상당 연구가 여러분의 149,000원
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-metallicGold-500">60배</p>
                <p className="text-sm text-offWhite-500">비용 절감 효과</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-metallicGold-500">240배</p>
                <p className="text-sm text-offWhite-500">시간 단축 효과</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-metallicGold-500">∞</p>
                <p className="text-sm text-offWhite-500">스트레스 해결 가치</p>
              </div>
            </div>
            <p className="text-offWhite-300 mt-6">
              여러분이 몇 달간 헤맬 시행착오를 이미 마쳤습니다. 
              <span className="text-metallicGold-400 font-semibold"> 검증된 길로 바로 가세요.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}