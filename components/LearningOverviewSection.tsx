'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
 
  Zap, 
  Target,
  BookOpen
} from 'lucide-react';

export default function LearningOverviewSection() {
  const mainCards = [
    {
      title: "바이브코딩 바이브:",
      subtitle: "Cursor AI로 나와 함께할 파트너!",
      description: "1인 개발 수익화 패키지",
      icon: "🚀",
      color: "from-purple-500 to-blue-600",
      items: [
        "바이브 기조로 시작 + 쾌속 속도로 개발 기초 습득",
        "Cursor AI 기능으로 AI 개발자와 협업 익히기",
        "피그마 이용하여 UI를 직접 접근해 보기"
      ]
    },
    {
      title: "자금 절약 나와 쭈뺏: 상한!",
      subtitle: "13가지 초고성능터 실 새로운 포함",
      description: "Cursor AI 마스터",
      icon: "💎",
      color: "from-green-500 to-emerald-600",
      items: [
        "무료 툴들로 기진 13가지 초고성능터 트레트너의",
        "Cursor AI로 기능들 더 크리에 주 옮기",
        "프로젝트 구조 분석과 혼합해서 더 효율 높아보기"
      ]
    }
  ];

  const detailSections = [
    {
      title: "바이브 자료",
      color: "bg-gradient-to-br from-green-500/20 to-green-900/10",
      border: "border-green-500/30",
      icon: BookOpen,
      items: [
        "기본 필수로 기호를",
        "기본 + MVP 조직도 + 일정 패",
        "출창값도 자료 기일과 방향 처리 자세히조",
        "기술경가 쌓이 마내바내 없눈 시민류전 전봇 풀이",
        "추진면 신마치메 혼개 안인이코를 낫떪면",
        "거원조혼 사태이로 아원일를 다쮸어럽 옴김"
      ]
    },
    {
      title: "1,2,3 프로토타입",
      color: "bg-gradient-to-br from-yellow-500/20 to-yellow-900/10", 
      border: "border-yellow-500/30",
      icon: Target,
      items: [
        "스 세무 제품 기능 + 스 업프기 수업 창완",
        "스 설리내 스 자내 정성 사업성 사보 무료",
        "스 내돼더나 내운 + 스 혹일애르 아직 수원성",
        "스 취사 성전가 동의 + 스 내표 아직 목전성",
        "스 손기네주 목포구 카내 일기업 합료자",
        "스 창해인전 스 내안다내 수업 성연",
        "스 스 시쭉성용"
      ]
    },
    {
      title: "수익",
      color: "bg-gradient-to-br from-blue-500/20 to-blue-900/10",
      border: "border-blue-500/30", 
      icon: Zap,
      items: [
        "틸 초재기 고상처 몬 칸 아짓스던이 발",
        "스 내역 솔무다터 애겨둑 일만 처상",
        "스 내수러쌓이 혼합하는 카 안관일괭 안혹",
        "관성러카 인뷸 것 조혼아 바다하 아내와 싫어짠",
        "스 해원좌 관매네 새웃있는 매일 터자 혓어",
        "아 해출내애 때문 숭인있실 아의료개전 하국아시간",
        "스 구석업세 수내언성"
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800 to-deepBlack-900">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Sparkles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
              Cursor AI로 등불기 활용 패키지
            </h2>
            <Sparkles className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        {/* Main Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {mainCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-6xl">{card.icon}</div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 translate-y-8"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">바이브 코딩 무료</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90 mb-4">{card.subtitle}</p>
                
                <ul className="space-y-2 text-sm">
                  {card.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-green-300 mt-1">●</span>
                      <span className="opacity-90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Sections Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {detailSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className={`${section.color} ${section.border} border rounded-2xl p-6 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{section.title}</h3>
                </div>
                
                <ul className="space-y-2 text-sm text-white/80">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-white/60 text-xs mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl px-8 py-6 border border-green-500/20">
            <p className="text-xl font-bold text-green-400 mb-2">
              바이브만으로도 클발 밟고 진전해 소와키가 움기 않습니다!
            </p>
            <p className="text-offWhite-400 text-sm">
              걸공간으로 공내은 매시스들을 더인 클혼 카크 있습니다
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}