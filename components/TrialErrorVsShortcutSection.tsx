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
      title: 'API 비용 폭탄',
      description: 'Claude API 직접 사용',
      value: '월 $300-500+',
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
      title: '검증된 13시간 커리큘럼',
      description: '최소 지식으로 최대 효과',
      value: '13시간',
      color: 'text-green-500'
    },
    {
      icon: CheckCircle,
      title: '강의 + Max $100',
      description: '예측 가능한 고정 비용',
      value: '총 $249,000원',
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
      description: '13개 프로젝트 완성 보장',
      value: '무제한',
      color: 'text-green-500'
    }
  ];

  return (
    <section className="py-6 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/30 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-green-500/5" />
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-offWhite-200 mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-metallicGold-500 to-green-500">
              시행착오 vs 지름길
            </span>
          </h2>
          <p className="text-base sm:text-lg text-offWhite-400">
            강사가 1500만원 상당의 연구로 찾아낸 지름길의 가치
          </p>
        </motion.div>

        {/* Comparison Grid - Changed to vertical layout */}
        <div className="space-y-6">
          {/* Trial & Error Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-500/10 to-red-900/5 rounded-xl p-5 border border-red-500/20 max-w-4xl mx-auto shadow-lg backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400">혼자 하는 시행착오</h3>
                  <p className="text-offWhite-500 text-xs">AI에게 물어보며 독학</p>
                </div>
              </div>

              {/* Items - Grid layout for better organization */}
              <div className="grid md:grid-cols-2 gap-3">
                {trialErrorItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-3 bg-deepBlack-800/50 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-offWhite-200 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-offWhite-500">{item.description}</p>
                      </div>
                      <div className={`text-right flex-shrink-0 font-bold text-sm ${item.color}`}>
                        {item.value}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total Cost */}
              <div className="mt-4 p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                <div className="text-center">
                  <p className="text-xs text-red-400 mb-1">예상 총 비용</p>
                  <p className="text-2xl font-bold text-red-500 mb-1">$1,800+/6개월</p>
                  <p className="text-xs text-offWhite-500">API 비용 + 시간 비용 + 기회비용</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Arrow in the middle - vertical orientation */}
          <div className="flex justify-center my-3">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-gradient-to-b from-metallicGold-500 to-metallicGold-900 p-3 rounded-full shadow-xl rotate-90"
            >
              <ArrowRight className="w-5 h-5 text-deepBlack-900" />
            </motion.div>
          </div>

          {/* Shortcut Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-900/5 rounded-xl p-5 border border-green-500/20 max-w-4xl mx-auto shadow-lg backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-400">검증된 지름길</h3>
                  <p className="text-offWhite-500 text-xs">이 강의로 바로 시작</p>
                </div>
              </div>

              {/* Items - Grid layout for better organization */}
              <div className="grid md:grid-cols-2 gap-3">
                {shortcutItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-3 bg-deepBlack-800/50 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-offWhite-200 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-offWhite-500">{item.description}</p>
                      </div>
                      <div className={`text-right flex-shrink-0 font-bold text-sm ${item.color}`}>
                        {item.value}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total Cost */}
              <div className="mt-4 p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="text-center">
                  <p className="text-xs text-green-400 mb-1">실제 총 비용</p>
                  <p className="text-2xl font-bold text-green-500 mb-1">149,000원</p>
                  <p className="text-xs text-offWhite-500">강의료 + Claude Max $100 추천</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <div className="bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl p-5 border border-metallicGold-500/30">
            <h3 className="text-lg font-bold text-metallicGold-500 mb-3">
              3-6개월 시행착오 vs 13시간 지름길
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-metallicGold-500">7배</p>
                <p className="text-xs text-offWhite-500">비용 절감 효과</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-metallicGold-500">30배</p>
                <p className="text-xs text-offWhite-500">시간 단축 효과</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-metallicGold-500">100%</p>
                <p className="text-xs text-offWhite-500">명확한 방향성</p>
              </div>
            </div>
            <p className="text-offWhite-300 text-sm mt-4">
              여러분이 몇 달간 헤맬 시행착오를 이미 마쳤습니다. 
              <span className="text-metallicGold-400 font-semibold"> 검증된 길로 바로 가세요.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}