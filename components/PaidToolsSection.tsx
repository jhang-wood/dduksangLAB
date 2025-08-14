'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard,
  Zap,
  // Bot,
  // Code,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function PaidToolsSection() {
  const tools = [
    {
      name: "Claude (Anthropic)",
      icon: "🤖",
      color: "from-orange-500 to-red-500",
      pricing: {
        free: "Claude.ai 무료 - 일일 제한",
        pro: "Claude Pro $20/월 (약 2만7천원)",
        api: "Claude API 사용량 기준 과금"
      },
      usage: "하루 평균 300-400불 상당 (월 1500만원 수준)",
      description: "가장 자유도가 높은 AI로 복잡한 프로젝트 구현에 최적화. 바이브코딩의 핵심 도구로 모든 개발 과정에서 활용됩니다.",
      features: [
        "200K 토큰 컨텍스트 윈도우로 대용량 프로젝트 처리",
        "코드 이해도와 설명 능력 최상급",
        "복잡한 로직 구조화 및 아키텍처 설계 가능",
        "자연스러운 한국어 대화로 개발 진행"
      ],
      recommendation: "Pro 플랜 권장 - 무제한 사용으로 학습 효율 극대화"
    },
    {
      name: "Gemini CLI",
      icon: "💎",
      color: "from-blue-500 to-purple-500",
      pricing: {
        free: "Gemini 1.5 Flash 무료 (일일 제한)",
        pro: "Gemini Advanced $20/월",
        api: "API 사용량 기준"
      },
      usage: "빠른 응답과 코드 생성에 특화",
      description: "Google의 최신 AI로 Claude와 상호 보완적 사용. 특히 빠른 프로토타입 생성과 코드 최적화에 강점을 보입니다.",
      features: [
        "1M 토큰 컨텍스트로 대용량 코드베이스 분석",
        "멀티모달 기능으로 이미지와 코드 동시 처리",
        "Google 생태계와 완벽 연동",
        "실시간 웹 검색 연동 가능"
      ],
      recommendation: "Claude 보조 도구로 활용 - 서로 다른 관점의 솔루션 비교"
    },
    {
      name: "Ollama 커스텀 에이전트",
      icon: "🦙",
      color: "from-green-500 to-teal-500",
      pricing: {
        free: "완전 무료 (로컬 실행)",
        cost: "초기 GPU 비용만 (RTX 4080 이상 권장)",
        cloud: "클라우드 GPU 렌탈 시간당 과금"
      },
      usage: "프라이빗 AI 환경 구축으로 무제한 사용",
      description: "로컬에서 실행되는 오픈소스 AI로 데이터 보안이 중요한 프로젝트나 비용을 절약하고 싶을 때 활용. 커스터마이징 가능한 전용 에이전트 구축.",
      features: [
        "Llama 2, Code Llama, Mistral 등 다양한 모델 지원",
        "완전한 데이터 프라이버시 보장",
        "커스텀 프롬프트와 파인튜닝 가능",
        "오프라인 환경에서도 작동"
      ],
      recommendation: "장기적 비용 절약과 보안이 중요한 경우 필수"
    },
    {
      name: "Cursor CLI",
      icon: "⚡",
      color: "from-purple-500 to-pink-500",
      pricing: {
        free: "Cursor 무료 - 월 2000회 완성",
        pro: "Cursor Pro $20/월 - 무제한",
        business: "Cursor Business $40/월 - 팀 기능"
      },
      usage: "실제 코딩 작업의 90% 자동화",
      description: "VS Code 기반의 AI 에디터로 실시간 코드 작성과 수정이 가능. 바이브코딩의 실전 구현 단계에서 핵심 역할을 담당합니다.",
      features: [
        "Tab 키 하나로 전체 함수 자동 완성",
        "Cmd+K로 자연어 명령어 코드 변환",
        "코드베이스 전체 이해하여 컨텍스트 기반 제안",
        "실시간 버그 감지 및 수정 제안"
      ],
      recommendation: "바이브코딩 필수 도구 - Pro 플랜으로 무제한 활용 권장"
    }
  ];

  // const _monthlyBudget = [
  //   { item: "Claude Pro", cost: "27,000원", necessity: "필수" },
  //   { item: "Cursor Pro", cost: "27,000원", necessity: "필수" },
  //   { item: "Gemini Advanced", cost: "27,000원", necessity: "선택" },
  //   { item: "클라우드 GPU", cost: "50,000원", necessity: "선택" }
  // ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-deepBlack-800 to-deepBlack-900">
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
              바이브코딩 필수 유료툴 가이드
            </span>
          </h2>
          <p className="text-lg text-offWhite-400 mb-2">
            효율적인 바이브코딩을 위한 핵심 도구들과 비용 최적화 전략
          </p>
          <div className="text-sm text-offWhite-500 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>2025년 8월 기준 요금</span>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-deepBlack-800/80 to-deepBlack-700/80 rounded-3xl p-6 border border-metallicGold-500/20 backdrop-blur-sm"
            >
              {/* Tool Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-offWhite-200">{tool.name}</h3>
                  <p className="text-sm text-offWhite-500">{tool.usage}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-deepBlack-900/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-metallicGold-500" />
                  <h4 className="font-semibold text-metallicGold-500">요금 체계</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {Object.entries(tool.pricing).map(([type, price]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-offWhite-400">{price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-offWhite-400 text-sm leading-relaxed mb-4">
                {tool.description}
              </p>

              {/* Features */}
              <div className="mb-4">
                <h5 className="font-semibold text-offWhite-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  주요 기능
                </h5>
                <ul className="space-y-2 text-sm">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-offWhite-400">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl p-4 border border-metallicGold-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-metallicGold-500" />
                  <span className="text-sm font-semibold text-metallicGold-500">추천사항</span>
                </div>
                <p className="text-sm text-offWhite-400">{tool.recommendation}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly Budget Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl p-8 border border-green-500/20"
        >
          <div className="text-center mb-8">
            <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-offWhite-200 mb-2">
              월 예산 가이드라인
            </h3>
            <p className="text-offWhite-400">
              바이브코딩 학습을 위한 최적화된 월 구독료 계획
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Essential Plan */}
            <div className="bg-deepBlack-800/50 rounded-2xl p-6 border border-green-500/20">
              <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                필수 플랜 (권장)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-300">Claude Pro</span>
                  <span className="text-offWhite-200 font-semibold">27,000원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-300">Cursor Pro</span>
                  <span className="text-offWhite-200 font-semibold">27,000원</span>
                </div>
                <hr className="border-offWhite-700" />
                <div className="flex justify-between items-center text-green-400 font-bold">
                  <span>월 총액</span>
                  <span>54,000원</span>
                </div>
              </div>
              <p className="text-sm text-offWhite-500 mt-4">
                바이브코딩 학습에 꼭 필요한 핵심 도구들로 구성된 기본 플랜
              </p>
            </div>

            {/* Complete Plan */}
            <div className="bg-deepBlack-800/50 rounded-2xl p-6 border border-blue-500/20">
              <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                완전 플랜 (고급)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-300">Claude Pro + Cursor Pro</span>
                  <span className="text-offWhite-200 font-semibold">54,000원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-300">Gemini Advanced</span>
                  <span className="text-offWhite-200 font-semibold">27,000원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-offWhite-300">GPU 클라우드</span>
                  <span className="text-offWhite-200 font-semibold">50,000원</span>
                </div>
                <hr className="border-offWhite-700" />
                <div className="flex justify-between items-center text-blue-400 font-bold">
                  <span>월 총액</span>
                  <span>131,000원</span>
                </div>
              </div>
              <p className="text-sm text-offWhite-500 mt-4">
                모든 AI 도구를 활용한 최고급 바이브코딩 환경
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-metallicGold-500/10 rounded-2xl p-6 border border-metallicGold-500/20">
            <h5 className="font-bold text-metallicGold-500 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              비용 최적화 팁
            </h5>
            <ul className="space-y-2 text-sm text-offWhite-400">
              <li>• 학습 초기에는 필수 플랜(54,000원)으로 시작하여 익숙해진 후 확장</li>
              <li>• Ollama로 로컬 환경 구축 시 장기적으로 월 구독료 절약 가능</li>
              <li>• 각 도구의 무료 할당량을 먼저 활용해본 후 유료 전환 권장</li>
              <li>• 팀 작업 시 Business 플랜으로 인당 비용 절약 효과</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}