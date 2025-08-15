'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  XCircle, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Frown,
  Smile,
  ArrowRight
} from 'lucide-react';

export default function BeforeAfterSection() {
  const beforeItems = [
    {
      icon: '😰',
      title: 'AI 시대에 뒤처지는 불안감',
      description: '모두가 AI를 활용하는데 나만 모르는 것 같은 느낌'
    },
    {
      icon: '📚',
      title: '개발자 중심 강의에 좌절',
      description: '바이브코딩이라면서도 결국 변수, 함수, 클래스... 개발 용어 투성이'
    },
    {
      icon: '💸',
      title: '비싼 개발 외주비 부담',
      description: '간단한 웹사이트도 수백만원 견적'
    },
    {
      icon: '⏰',
      title: '배우고 싶지만 시간이 없음',
      description: '프로그래밍 배우려면 최소 6개월은 필요하다는데...'
    },
    {
      icon: '🚫',
      title: '코딩은 너무 어려워 보임',
      description: 'ChatGPT 써봤지만 복잡한 프로젝트는 여전히 막막함'
    },
    {
      icon: '😔',
      title: '아이디어는 있는데 구현 불가',
      description: '머릿속 아이디어를 현실로 만들 방법이 없음'
    }
  ];

  const afterItems = [
    {
      icon: '🚀',
      title: 'AI 활용 최전선에 서있는 자신감',
      description: '최신 AI 도구를 자유자재로 활용하는 나'
    },
    {
      icon: '🎨',
      title: '바이브만으로 모든 것 구현',
      description: '코드 이해 없이도 복잡한 사이트와 기능 완성'
    },
    {
      icon: '💰',
      title: '외주 없이 직접 개발',
      description: '연간 수천만원 개발비 절감'
    },
    {
      icon: '⚡',
      title: '하루 1시간으로 충분',
      description: '최소한의 시간으로 최대한의 결과물'
    },
    {
      icon: '🎯',
      title: '진짜 바이브코딩 완성',
      description: '개발 용어 없이 AI와 자연스럽게 대화하며 개발'
    },
    {
      icon: '🏆',
      title: '13개 포트폴리오 보유',
      description: '실제 작동하는 서비스 13개 완성'
    }
  ];

  return (
    <section className="py-6 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-green-500/5" />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-offWhite-200 mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">
              단 13시간의 변화
            </span>
          </h2>
          <p className="text-base sm:text-lg text-offWhite-400">
            이 강의를 듣기 전과 후, 당신의 삶이 어떻게 달라질까요?
          </p>
        </motion.div>

        {/* Before/After Grid - Changed to vertical layout */}
        <div className="space-y-6">
          {/* Before Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-500/10 to-red-900/5 rounded-xl p-4 border border-red-500/20 max-w-3xl mx-auto shadow-lg">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Frown className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400">Before</h3>
                  <p className="text-offWhite-500 text-xs">지금의 당신</p>
                </div>
              </div>

              {/* Items - Two column grid for better visibility */}
              <div className="grid md:grid-cols-2 gap-2">
                {beforeItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2 p-2 bg-deepBlack-800/50 rounded-lg border border-red-500/10 hover:border-red-500/20 transition-colors"
                  >
                    <div className="text-lg flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-offWhite-200 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-offWhite-500">{item.description}</p>
                    </div>
                    <XCircle className="w-4 h-4 text-red-500/50 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>

              {/* Bottom Status */}
              <div className="mt-4 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-xs font-medium text-red-400">
                    기회를 놓치고 있는 상태
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Arrow in the middle - vertical orientation */}
          <div className="flex justify-center my-3">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 p-3 rounded-full shadow-xl rotate-90"
            >
              <ArrowRight className="w-5 h-5 text-deepBlack-900" />
            </motion.div>
          </div>

          {/* After Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-900/5 rounded-xl p-4 border border-green-500/20 max-w-3xl mx-auto shadow-lg">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Smile className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-400">After</h3>
                  <p className="text-offWhite-500 text-xs">13시간 후의 당신</p>
                </div>
              </div>

              {/* Items - Two column grid for better visibility */}
              <div className="grid md:grid-cols-2 gap-2">
                {afterItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2 p-2 bg-deepBlack-800/50 rounded-lg border border-green-500/10 hover:border-green-500/20 transition-colors"
                  >
                    <div className="text-lg flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-offWhite-200 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-offWhite-500">{item.description}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500/50 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>

              {/* Bottom Status */}
              <div className="mt-4 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <p className="text-xs font-medium text-green-400">
                    AI 시대의 승자가 된 상태
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-lg px-4 py-3 backdrop-blur-sm border border-metallicGold-500/20">
            <p className="text-lg font-bold text-offWhite-200 mb-1">
              <span className="text-metallicGold-500">13시간</span>이면 충분합니다
            </p>
            <p className="text-sm text-offWhite-400">
              더 이상 망설이지 마세요. 지금이 시작할 최적의 타이밍입니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}