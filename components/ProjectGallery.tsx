'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Bot, 
  Briefcase,
  Clock,
  Star,
  ArrowRight,
  Database,
  Server,
  Globe,
  Code,
  Layers
} from 'lucide-react';

const projects = [
  {
    id: 1,
    title: '온라인 쇼핑몰',
    description: '상품 등록부터 결제까지 완벽한 이커머스 플랫폼',
    difficulty: 3,
    duration: '3시간',
    icon: ShoppingCart,
    features: ['상품 관리', '장바구니', '결제 연동', '주문 관리'],
    gradient: 'from-purple-500 to-pink-500',
    workflow: {
      steps: [
        { icon: Database, label: 'DB 설계' },
        { icon: Server, label: 'API 구축' },
        { icon: Globe, label: 'UI 개발' },
        { icon: Code, label: '결제 연동' }
      ]
    }
  },
  {
    id: 2,
    title: 'SaaS 대시보드',
    description: '구독형 서비스를 위한 관리자 대시보드',
    difficulty: 4,
    duration: '4시간',
    icon: BarChart3,
    features: ['사용자 관리', '구독 결제', '데이터 분석', '실시간 차트'],
    gradient: 'from-blue-500 to-cyan-500',
    workflow: {
      steps: [
        { icon: Layers, label: '인증 시스템' },
        { icon: Database, label: '데이터 모델' },
        { icon: BarChart3, label: '차트 구현' },
        { icon: Server, label: 'API 통합' }
      ]
    }
  },
  {
    id: 3,
    title: '자동화 봇 시스템',
    description: '업무 자동화를 위한 스마트 봇',
    difficulty: 2,
    duration: '2시간',
    icon: Bot,
    features: ['스케줄링', '자동 응답', '데이터 수집', 'API 연동'],
    gradient: 'from-green-500 to-emerald-500',
    workflow: {
      steps: [
        { icon: Bot, label: '봇 설정' },
        { icon: Clock, label: '스케줄러' },
        { icon: Server, label: 'API 연결' },
        { icon: Database, label: '로그 저장' }
      ]
    }
  },
  {
    id: 4,
    title: '블로그 플랫폼',
    description: 'SEO 최적화된 개인 블로그 사이트',
    difficulty: 2,
    duration: '2시간',
    icon: FileText,
    features: ['글 작성/편집', '카테고리', '댓글 시스템', 'SEO 최적화'],
    gradient: 'from-orange-500 to-amber-500',
    workflow: {
      steps: [
        { icon: FileText, label: 'CMS 구축' },
        { icon: Database, label: '포스트 DB' },
        { icon: Globe, label: 'SEO 설정' },
        { icon: MessageSquare, label: '댓글 기능' }
      ]
    }
  },
  {
    id: 5,
    title: '실시간 채팅 앱',
    description: '웹소켓 기반 실시간 메시징 플랫폼',
    difficulty: 3,
    duration: '3시간',
    icon: MessageSquare,
    features: ['실시간 채팅', '파일 공유', '알림 기능', '그룹 채팅'],
    gradient: 'from-indigo-500 to-purple-500',
    workflow: {
      steps: [
        { icon: Server, label: '웹소켓' },
        { icon: MessageSquare, label: '채팅 UI' },
        { icon: Database, label: '메시지 저장' },
        { icon: Globe, label: '알림 시스템' }
      ]
    }
  },
  {
    id: 6,
    title: '포트폴리오 사이트',
    description: '개인 브랜딩을 위한 포트폴리오',
    difficulty: 1,
    duration: '1시간',
    icon: Briefcase,
    features: ['반응형 디자인', '프로젝트 갤러리', '연락처 폼', '애니메이션'],
    gradient: 'from-red-500 to-rose-500',
    workflow: {
      steps: [
        { icon: Layers, label: '레이아웃' },
        { icon: Globe, label: '반응형 UI' },
        { icon: Briefcase, label: '갤러리' },
        { icon: MessageSquare, label: '연락 폼' }
      ]
    }
  },
];

export default function ProjectGallery() {
  const getDifficultyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < level ? 'fill-metallicGold-500 text-metallicGold-500' : 'text-offWhite-600'} 
      />
    ));
  };

  return (
    <section className="py-12 px-4 relative overflow-hidden bg-deepBlack-900">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/30 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-offWhite-200 mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              실제로 만들 수 있는 것들
            </span>
          </h2>
          <p className="text-base sm:text-lg text-offWhite-400">
            13개 프로젝트 중 대표 6개 - 복사/붙여넣기로 시작해서 완성까지
          </p>
        </motion.div>

        {/* Horizontal Card List */}
        <div className="space-y-6">
          {projects.map((project, index) => {
            const Icon = project.icon;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className={`
                  flex flex-col lg:flex-row gap-6 p-6 rounded-2xl border border-offWhite-700/20
                  bg-gradient-to-r from-deepBlack-800/90 to-deepBlack-800/70
                  backdrop-blur-sm transition-all duration-300
                  hover:shadow-2xl hover:shadow-metallicGold-500/10
                  hover:border-metallicGold-500/30
                `}>
                  {/* Left: Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`
                        w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient}
                        flex items-center justify-center shadow-lg flex-shrink-0
                      `}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-offWhite-200">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-offWhite-500" />
                            <span className="text-offWhite-400 font-medium">{project.duration}</span>
                          </div>
                        </div>
                        <p className="text-sm text-offWhite-400 mb-3">
                          {project.description}
                        </p>
                        
                        {/* Difficulty */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-offWhite-500">난이도:</span>
                          <div className="flex gap-0.5">
                            {getDifficultyStars(project.difficulty)}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {project.features.map((feature, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 bg-deepBlack-900/50 rounded-lg text-xs text-offWhite-400 border border-offWhite-700/20"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Workflow Visualization */}
                  <div className="lg:w-80 flex items-center justify-center">
                    <div className="bg-deepBlack-900/50 rounded-xl p-4 border border-offWhite-700/10 w-full">
                      <p className="text-xs text-offWhite-500 mb-3 text-center">워크플로우</p>
                      <div className="flex items-center justify-between">
                        {project.workflow.steps.map((step, idx) => {
                          const StepIcon = step.icon;
                          return (
                            <React.Fragment key={idx}>
                              <div className="flex flex-col items-center gap-1">
                                <div className={`
                                  w-10 h-10 rounded-lg bg-gradient-to-br ${project.gradient}
                                  flex items-center justify-center opacity-80
                                `}>
                                  <StepIcon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xs text-offWhite-500 text-center max-w-[50px]">
                                  {step.label}
                                </span>
                              </div>
                              {idx < project.workflow.steps.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-offWhite-600 flex-shrink-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Number Badge */}
                <div className="absolute -left-3 top-6 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 text-xs font-bold px-2 py-1 rounded">
                  #{project.id}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl px-6 py-3 backdrop-blur-sm border border-metallicGold-500/20">
            <p className="text-base font-bold text-offWhite-200">
              🎯 <span className="text-metallicGold-500">100% 실습</span> · 
              <span className="text-metallicGold-500"> 0% 이론</span> · 
              <span className="text-metallicGold-500"> 즉시 적용 가능</span>
            </p>
            <p className="text-xs text-offWhite-400 mt-1">
              모든 프로젝트는 실제 배포까지 완료합니다
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}