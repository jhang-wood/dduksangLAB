'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calculator,
  DollarSign
} from 'lucide-react';

export default function PaidToolsSection() {
  const tools = [
    {
      name: "Claude Code CLI",
      icon: "🤖",
      color: "from-orange-500 to-red-500", 
      pricing: "Claude Max $100/월 (약 13만원)",
      usage: "최상급 코딩 실력의 AI 개발자",
      description: "가장 뛰어난 코딩 능력과 추론 실력을 보유한 AI. 복잡한 아키텍처 설계와 고급 프로그래밍에 최적화.",
      features: [
        "200K 토큰으로 대용량 프로젝트 처리",
        "HumanEval 92% - 업계 최고 코딩 성능",
        "Claude Pro 대비 5배 사용량"
      ],
      recommendation: "Max 플랜 - API 대비 압도적 가격 효율성"
    },
    {
      name: "Gemini CLI",
      icon: "💎",
      color: "from-blue-500 to-purple-500",
      pricing: "Gemini Advanced $20/월 (약 3만원)",
      usage: "Claude 보조 도구로 활용",
      description: "빠른 응답과 코드 생성에 특화된 Google AI. Claude와 상호 보완적으로 사용하여 다양한 관점의 솔루션 비교 가능.",
      features: [
        "1M 토큰으로 대용량 코드베이스 분석",
        "빠른 프로토타입 생성",
        "Google 생태계 연동"
      ],
      recommendation: "Claude 보조 도구로 활용 - 서로 다른 관점의 솔루션 비교"
    }
  ];

  // 2025년 8월 기준 - Opus 4.1 API 비용 대비 Max 플랜 가치
  const costComparison = {
    opus41Api: {
      model: "Claude Opus 4.1",
      input: "$15/1M tokens",
      output: "$75/1M tokens",
      daily6Hours: 120, // 6시간 집중 사용 기준
      monthly: 3600, // $120 * 30일
      yearlyKRW: "약 5,400만원"
    },
    maxPlan: {
      monthly: 100,
      yearlyKRW: "약 156만원",
      includes: "Opus 4.1 충분히 사용"
    },
    savings: {
      monthly: 3500,
      yearly: "약 5,244만원",
      percentage: 97
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-deepBlack-800 to-deepBlack-900">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-orange-500">
              바이브코딩 핵심 도구
            </span>
          </h2>
          <p className="text-lg text-offWhite-400">
            최고 성능의 AI 코딩 도구와 효율적인 보조 도구
          </p>
        </motion.div>

        {/* Tools Grid - 2개만 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-deepBlack-800/80 to-deepBlack-700/80 rounded-2xl p-5 border border-metallicGold-500/20 backdrop-blur-sm"
            >
              {/* Tool Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl shadow-lg`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-offWhite-200">{tool.name}</h3>
                  <p className="text-sm text-offWhite-500">{tool.usage}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-deepBlack-900/50 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-metallicGold-500" />
                  <span className="text-sm font-semibold text-metallicGold-500">{tool.pricing}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-offWhite-400 text-sm leading-relaxed mb-3">
                {tool.description}
              </p>

              {/* Features */}
              <div className="mb-4">
                <ul className="space-y-1 text-sm">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-offWhite-400">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl p-3 border border-metallicGold-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-3 h-3 text-metallicGold-500" />
                  <span className="text-xs font-semibold text-metallicGold-500">추천사항</span>
                </div>
                <p className="text-xs text-offWhite-400">{tool.recommendation}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* API Cost vs Max Plan Value - 벤치마크 스타일로 변경 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-deepBlack-800/80 to-deepBlack-700/80 rounded-3xl p-8 border border-metallicGold-500/20 backdrop-blur-sm"
        >
          <div className="text-center mb-6">
            <Calculator className="w-10 h-10 text-metallicGold-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-offWhite-200 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-orange-500">
                2025년 8월 기준 가격 비교
              </span>
            </h3>
            <p className="text-sm text-offWhite-400">
              최신 Opus 4.1 모델 API vs Claude Max 플랜
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Opus 4.1 API 직접 사용 비용 */}
            <div className="bg-deepBlack-600/50 rounded-xl p-5 border border-red-500/20">
              <h4 className="text-base font-bold text-red-400 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Opus 4.1 API 직접 사용
              </h4>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">모델</span>
                  <span className="text-offWhite-300 font-medium text-sm">{costComparison.opus41Api.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">요금</span>
                  <span className="text-offWhite-300 text-xs">{costComparison.opus41Api.input} / {costComparison.opus41Api.output}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">일 6시간</span>
                  <span className="text-offWhite-300 font-medium">${costComparison.opus41Api.daily6Hours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">월간</span>
                  <span className="text-red-400 font-bold text-lg">${costComparison.opus41Api.monthly}</span>
                </div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-400">
                  {costComparison.opus41Api.yearlyKRW}
                </div>
                <div className="text-xs text-offWhite-500">연간 비용</div>
              </div>
            </div>

            {/* Max 플랜 비용 */}
            <div className="bg-deepBlack-600/50 rounded-xl p-5 border border-green-500/20">
              <h4 className="text-base font-bold text-green-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Claude Max 플랜
              </h4>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">월 정액</span>
                  <span className="text-green-400 font-bold text-lg">${costComparison.maxPlan.monthly}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">포함</span>
                  <span className="text-offWhite-300 text-xs font-medium">{costComparison.maxPlan.includes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">사용량</span>
                  <span className="text-offWhite-300 font-medium text-sm">Pro의 5배</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-500 text-xs">추가요금</span>
                  <span className="text-offWhite-300 font-medium">없음</span>
                </div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">
                  {costComparison.maxPlan.yearlyKRW}
                </div>
                <div className="text-xs text-offWhite-500">연간 비용</div>
              </div>
            </div>
          </div>

          {/* 절감 효과 */}
          <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl p-4 border border-metallicGold-500/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-metallicGold-400">
                  {costComparison.savings.percentage}%
                </div>
                <div className="text-xs text-offWhite-500">절감률</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-metallicGold-400">
                  ${costComparison.savings.monthly}
                </div>
                <div className="text-xs text-offWhite-500">월 절감</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-metallicGold-400">
                  {costComparison.savings.yearly}
                </div>
                <div className="text-xs text-offWhite-500">연간 절감</div>
              </div>
            </div>
            <p className="text-xs text-offWhite-400 mt-3 text-center">
              최신 Opus 4.1을 <span className="text-metallicGold-400 font-semibold">월 정액제로 마음껏</span> 사용
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}