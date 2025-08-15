'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone,
  Users,
  DollarSign,
  Zap,
  Code2
} from 'lucide-react';

export default function RealProjectsSection() {
  // 핵심 프로젝트만 간결하게 정리
  const mainProjects = [
    {
      id: 1,
      category: "수익형 SaaS",
      title: "유튜브 분석 플랫폼",
      icon: DollarSign,
      color: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      highlights: [
        { label: "기술", value: "API 연동", color: "text-green-400" },
        { label: "기간", value: "3일", color: "text-offWhite-400" },
        { label: "난이도", value: "중급", color: "text-yellow-400" }
      ],
      keyPoint: "YouTube API + 결제시스템 + 대시보드"
    },
    {
      id: 2,
      category: "자동화 시스템",
      title: "숏폼 콘텐츠 자동화",
      icon: Zap,
      color: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      highlights: [
        { label: "기술", value: "자동화", color: "text-yellow-400" },
        { label: "기간", value: "3일", color: "text-offWhite-400" },
        { label: "난이도", value: "중급", color: "text-orange-400" }
      ],
      keyPoint: "AI 스크립트 + 자동편집 + 멀티플랫폼 배포"
    },
    {
      id: 3,
      category: "모바일 환경",
      title: "휴대폰 코딩 시스템",
      icon: Smartphone,
      color: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
      borderColor: "border-blue-500/30",
      highlights: [
        { label: "효과", value: "24시간 개발", color: "text-blue-400" },
        { label: "기간", value: "1일", color: "text-offWhite-400" },
        { label: "난이도", value: "초급", color: "text-green-400" }
      ],
      keyPoint: "iOS/Android 터미널 + 원격 서버 관리"
    },
    {
      id: 4,
      category: "AI 오케스트레이션",
      title: "멀티 에이전트 시스템",
      icon: Users,
      color: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      highlights: [
        { label: "기술", value: "AI 협업", color: "text-purple-400" },
        { label: "기간", value: "2일", color: "text-offWhite-400" },
        { label: "난이도", value: "고급", color: "text-red-400" }
      ],
      keyPoint: "에이전트 체인 + 작업 분배 + 자동 검증"
    }
  ];

  // 추가 프로젝트 리스트 (간단하게)
  const additionalProjects = [
    "네이버 블로그 자동화",
    "쿠팡파트너스 연동",
    "인스타그램 봇",
    "텔레그램 트레이딩봇",
    "노션 자동화",
    "슬랙 업무봇",
    "디스코드 관리봇",
    "이메일 자동응답"
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Simplified Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-offWhite-200 mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              실제로 만들 프로젝트
            </span>
          </h2>
          <p className="text-sm text-offWhite-500">
            30개 중 핵심 프로젝트 4개
          </p>
        </motion.div>

        {/* Clean 2x2 Grid Layout */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {mainProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`${project.color} rounded-xl p-5 border ${project.borderColor} hover:scale-[1.02] transition-transform`}
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-offWhite-500 mb-1">{project.category}</p>
                    <h3 className="text-base font-bold text-offWhite-200">{project.title}</h3>
                  </div>
                  <Icon className="w-5 h-5 text-offWhite-400" />
                </div>

                {/* Key Point */}
                <p className="text-xs text-offWhite-400 mb-3 leading-relaxed">
                  {project.keyPoint}
                </p>

                {/* Highlights - Inline Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {project.highlights.map((item, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 bg-deepBlack-600/50 rounded-md ${item.color}`}
                    >
                      {item.label}: <span className="font-semibold">{item.value}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Projects - Simple List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs text-offWhite-500 text-center mb-3">그 외 26개 프로젝트</p>
          <div className="flex flex-wrap justify-center gap-2">
            {additionalProjects.map((project, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 bg-deepBlack-600/30 text-offWhite-400 rounded-full border border-offWhite-800/20"
              >
                {project}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Simplified Warning Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-4 border border-red-500/20 mb-8"
        >
          <div className="flex items-start gap-3">
            <Code2 className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-offWhite-300">
                <span className="text-red-400 font-semibold">프레임워크 커스텀 주의:</span> 잘못된 수정은 시스템 전체를 망가뜨릴 수 있습니다.
                <span className="text-metallicGold-400 font-semibold ml-1">안전한 방법만 가르칩니다.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Learning Progress Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-deepBlack-600/30 rounded-xl p-6 border border-metallicGold-500/10"
        >
          <h3 className="text-sm font-bold text-metallicGold-400 text-center mb-4">
            학습 진도 로드맵
          </h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-metallicGold-400">1주차</div>
              <div className="text-xs text-offWhite-400">기초 세팅</div>
            </div>
            <div>
              <div className="text-lg font-bold text-metallicGold-400">2주차</div>
              <div className="text-xs text-offWhite-400">첫 프로젝트</div>
            </div>
            <div>
              <div className="text-lg font-bold text-metallicGold-400">3주차</div>
              <div className="text-xs text-offWhite-400">자동화 구축</div>
            </div>
            <div>
              <div className="text-lg font-bold text-metallicGold-400">4주차</div>
              <div className="text-xs text-offWhite-400">실전 배포</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}