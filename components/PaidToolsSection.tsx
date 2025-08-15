'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  Check,
  Star,
  Crown,
  Zap,
  DollarSign
} from 'lucide-react';

export default function PaidToolsSection() {
  const aiTools = [
    {
      name: 'Claude',
      logo: '🤖',
      description: 'Opus 4.1 - 최고의 코딩 & 창의적 AI',
      features: [
        '컨텍스트 윈도우 200K',
        'Claude Code CLI 완벽 지원',
        '멀티모달 (이미지 분석)',
        '최신 Opus 4.1 모델'
      ],
      pricing: {
        free: '무료 (제한적)',
        recommended: 'Max 5x - $100/월',
        recommendedFeatures: '주당 15-35시간 Opus 4.1 사용'
      },
      badge: 'BEST',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'ChatGPT',
      logo: '💬',
      description: 'GPT-5 - 통합형 추론 AI',
      features: [
        '무료 사용자도 GPT-5 접근',
        '환각 4.8%로 대폭 감소',
        'SWE-bench 74.9% 달성',
        '실시간 라우팅 시스템'
      ],
      pricing: {
        free: '무료 (제한적)',
        recommended: 'Pro - $20/월',
        recommendedFeatures: '무제한 GPT-5 사용'
      },
      badge: 'NEW',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Gemini',
      logo: '✨',
      description: 'Gemini 2.0 - Google의 멀티모달 AI',
      features: [
        '100만 토큰 컨텍스트',
        'Google 서비스 통합',
        '실시간 음성 대화',
        '코드 실행 환경'
      ],
      pricing: {
        free: '무료 플랜',
        recommended: '무료',
        recommendedFeatures: '일일 제한 내 충분'
      },
      badge: 'FREE',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <section className="py-8 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-offWhite-200 mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-green-500 to-blue-500">
              떡상연구소 AI툴 안내
            </span>
          </h2>
          <p className="text-base sm:text-lg text-offWhite-400 mb-2">
            2025년 8월 기준 최신 AI 툴 비교 가이드
          </p>
          <p className="text-sm text-offWhite-500">
            Opus 4.1 & GPT-5 시대의 최적 선택
          </p>
        </motion.div>

        {/* AI Tools Grid - Horizontal Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {aiTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`bg-gradient-to-br ${tool.color} p-[1px] rounded-2xl`}>
                <div className="bg-deepBlack-800 rounded-2xl p-6 h-full">
                  {/* Badge */}
                  {tool.badge && (
                    <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold
                      ${tool.badge === 'BEST' ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900' : 
                        tool.badge === 'NEW' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                        'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'}`}>
                      {tool.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{tool.logo}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-offWhite-200 mb-1">{tool.name}</h3>
                      <p className="text-sm text-offWhite-400">{tool.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {tool.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-offWhite-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-offWhite-700/20 pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-offWhite-500">무료:</span>
                        <span className="text-sm text-offWhite-400">{tool.pricing.free}</span>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} bg-opacity-10 border border-opacity-20 ${
                        tool.name === 'Claude' ? 'border-purple-500' : 
                        tool.name === 'ChatGPT' ? 'border-green-500' : 
                        'border-blue-500'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Crown className="w-4 h-4 text-metallicGold-500" />
                          <span className="text-sm font-bold text-offWhite-200">추천 플랜</span>
                        </div>
                        <p className="text-sm font-semibold text-offWhite-200 mb-1">
                          {tool.pricing.recommended}
                        </p>
                        <p className="text-xs text-offWhite-400">
                          {tool.pricing.recommendedFeatures}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-6 border border-metallicGold-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-metallicGold-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-metallicGold-500" />
            </div>
            <h3 className="text-lg font-bold text-metallicGold-500">떡상연구소 추천 조합</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-deepBlack-800/50 rounded-lg">
              <p className="font-bold text-purple-400 mb-1">Claude Max 5x</p>
              <p className="text-xs text-offWhite-400">코딩 & 창의적 작업</p>
              <p className="text-sm font-bold text-offWhite-200 mt-1">$100/월</p>
            </div>
            <div className="p-3 bg-deepBlack-800/50 rounded-lg">
              <p className="font-bold text-green-400 mb-1">ChatGPT Pro</p>
              <p className="text-xs text-offWhite-400">추론 & 분석 작업</p>
              <p className="text-sm font-bold text-offWhite-200 mt-1">$20/월</p>
            </div>
            <div className="p-3 bg-deepBlack-800/50 rounded-lg">
              <p className="font-bold text-blue-400 mb-1">Gemini 무료</p>
              <p className="text-xs text-offWhite-400">보조 & 검색 작업</p>
              <p className="text-sm font-bold text-offWhite-200 mt-1">$0/월</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-offWhite-300">
              총 월 비용: <span className="text-metallicGold-500 font-bold text-lg">$120</span>
              <span className="text-offWhite-500 ml-2">(약 16만원)</span>
            </p>
            <p className="text-xs text-offWhite-500 mt-2">
              💡 이 조합으로 모든 AI 작업을 완벽하게 커버할 수 있습니다
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}