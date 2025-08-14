'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock,
  DollarSign,
  AlertTriangle,
  Brain,
  Target,
  CheckCircle,
  Zap,
  Rocket,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export default function TrialErrorVsShortcutSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800 to-deepBlack-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 via-deepBlack-900 to-purple-500/5" />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              두 가지 선택
            </span>
          </h2>
          <p className="text-xl text-offWhite-400 max-w-2xl mx-auto">
            같은 목표, 전혀 다른 과정과 결과
          </p>
        </motion.div>

        {/* Trial Error Card - Top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-deepBlack-300/50 backdrop-blur-sm rounded-3xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all duration-500 card-hover">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-offWhite-200">혼자서 시행착오</h3>
                  <p className="text-red-400">방향성 없는 독학의 늪</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-500">3-6개월</div>
                <div className="text-sm text-offWhite-500">예상 소요 시간</div>
              </div>
            </div>

            {/* Items Grid - 4 columns horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Clock, title: '시간 소요', value: '6개월+', desc: '방향성 없이 헤매는 시간' },
                { icon: DollarSign, title: '도구 비용', value: '다양한 툴', desc: 'Claude, ChatGPT, Cursor' },
                { icon: AlertTriangle, title: '정보 과부하', value: '스트레스', desc: '뭐가 중요한지 모름' },
                { icon: Brain, title: '한계 봉착', value: '막힘', desc: '복잡한 프로젝트 포기' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-deepBlack-600/50 rounded-xl p-4 border border-red-500/20 hover:border-red-400/40 transition-all text-center"
                  >
                    <Icon className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <div className="text-xl font-bold text-red-300 mb-1">{item.value}</div>
                    <div className="text-sm font-medium text-offWhite-300 mb-1">{item.title}</div>
                    <div className="text-xs text-offWhite-500">{item.desc}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Total Impact */}
            <div className="bg-gradient-to-r from-red-600/30 to-red-800/30 rounded-2xl p-6 text-center border border-red-500/30">
              <div className="text-sm text-red-300 mb-1">결과</div>
              <div className="text-4xl font-bold text-red-400 mb-1">포기 확률 높음</div>
              <div className="text-sm text-offWhite-500">방향 없이 헤매다 중단</div>
            </div>
          </div>
        </motion.div>

        {/* VS Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 h-px bg-offWhite-800"></div>
          <div className="mx-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-full flex items-center justify-center shadow-2xl glow-yellow"
            >
              <span className="text-deepBlack-900 font-bold text-lg">VS</span>
            </motion.div>
          </div>
          <div className="flex-1 h-px bg-offWhite-800"></div>
        </div>

        {/* Shortcut Card - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-deepBlack-300/50 backdrop-blur-sm rounded-3xl p-8 border border-metallicGold-500/30 hover:border-metallicGold-500/50 transition-all duration-500 card-hover glow-yellow-hover">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-metallicGold-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-offWhite-200">검증된 지름길</h3>
                  <p className="text-metallicGold-400">1500만원 연구 결과</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-metallicGold-500">13시간</div>
                <div className="text-sm text-offWhite-500">실제 소요 시간</div>
              </div>
            </div>

            {/* Items Grid - 4 columns horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Rocket, title: '최적화된 시간', value: '13시간', desc: '검증된 커리큘럼' },
                { icon: CheckCircle, title: '합리적 비용', value: '149,000원', desc: '몇 달치 AI료보다 저렴' },
                { icon: Target, title: '명확한 방향', value: '확실함', desc: '단계별 가이드' },
                { icon: Zap, title: '즉시 적용', value: '30개 프로젝트', desc: '바로 써먹는 실전' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-deepBlack-600/50 rounded-xl p-4 border border-metallicGold-500/20 hover:border-metallicGold-400/40 transition-all text-center"
                  >
                    <Icon className="w-8 h-8 text-metallicGold-400 mx-auto mb-3" />
                    <div className="text-xl font-bold text-metallicGold-300 mb-1">{item.value}</div>
                    <div className="text-sm font-medium text-offWhite-300 mb-1">{item.title}</div>
                    <div className="text-xs text-offWhite-500">{item.desc}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Total Cost */}
            <div className="bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl p-6 text-center border border-metallicGold-500/30 backdrop-blur-sm">
              <div className="text-sm text-metallicGold-400 mb-1">총 투자</div>
              <div className="text-4xl font-bold text-metallicGold-500 mb-1">149,000원</div>
              <div className="text-sm text-offWhite-500">몇 달의 시간을 사는 가격</div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-3xl p-8 border border-metallicGold-500/20 backdrop-blur-sm glass-premium">
            <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mb-6">
              검증된 커리큘럼으로 시간 절약
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
              {[
                { value: '13시간', title: '집중 학습', desc: '핵심만 압축', color: 'from-green-400 to-emerald-500' },
                { value: '30개', title: '실전 프로젝트', desc: '바로 적용 가능', color: 'from-blue-400 to-cyan-500' },
                { value: '1년', title: '수강 기간', desc: '충분한 복습', color: 'from-purple-400 to-pink-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-deepBlack-600/50 rounded-2xl p-6 border border-metallicGold-500/20 hover:border-metallicGold-500/40 transition-all card-hover"
                >
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-offWhite-300 font-medium mb-1">{stat.title}</div>
                  <div className="text-sm text-offWhite-500">{stat.desc}</div>
                </motion.div>
              ))}
            </div>

            <p className="text-lg text-offWhite-300 max-w-3xl mx-auto text-shadow-premium">
              이미 검증된 길로 바로 가세요. 
              <span className="text-metallicGold-400 font-semibold"> 제가 밤낮없이 연구해서 찾아낸 길입니다.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}