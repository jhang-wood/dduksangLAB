'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Lock, CheckCircle, PlayCircle, BookOpen, Star } from 'lucide-react';

interface Module {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface ModuleAccordionProps {
  modules: Module[];
  className?: string;
}

// Module descriptions and topics
const moduleDetails: { [key: number]: { description: string; topics: string[]; difficulty: 'beginner' | 'intermediate' | 'advanced' } } = {
  1: {
    description: 'Claude Code CLI 사용을 위한 필수 개발환경을 세팅합니다. Windows, Mac, Linux 모든 OS에서 완벽하게 작동하는 환경을 구축합니다.',
    topics: ['VS Code 설치 및 설정', 'Node.js & npm 환경 구축', 'Git 설치 및 기본 설정', 'Claude Code CLI 설치'],
    difficulty: 'beginner'
  },
  2: {
    description: 'MCP(Model Context Protocol)를 한줄 명령으로 간단하게 설치하고 설정하는 방법을 배웁니다.',
    topics: ['MCP 개념 이해', '한줄 설치 명령어', '환경변수 자동 설정', 'MCP 서버 관리'],
    difficulty: 'beginner'
  },
  3: {
    description: 'GitHub의 핵심 개념을 이해하고 코드 관리의 기초를 다집니다.',
    topics: ['Repository 생성과 관리', 'Commit과 Push 이해', 'Branch 전략', 'GitHub Actions 기초'],
    difficulty: 'beginner'
  },
  4: {
    description: 'Docker를 활용한 컨테이너 기반 개발 환경을 구축합니다.',
    topics: ['Docker 기본 개념', 'Container vs VM', 'Docker Compose 활용', '개발환경 컨테이너화'],
    difficulty: 'intermediate'
  },
  5: {
    description: '여러 AI 에이전트를 동시에 활용하여 복잡한 작업을 효율적으로 처리합니다.',
    topics: ['서브에이전트 개념', '병렬 작업 처리', '에이전트 간 통신', '작업 분배 전략'],
    difficulty: 'intermediate'
  },
  6: {
    description: 'Claude Code CLI를 활용한 완전 자동화 워크플로우를 구축합니다.',
    topics: ['워크플로우 설계', 'Bash 스크립트 자동화', 'Cron 작업 설정', 'CI/CD 파이프라인'],
    difficulty: 'intermediate'
  },
  7: {
    description: '숏폼 콘텐츠를 자동으로 여러 플랫폼에 업로드하는 시스템을 구축합니다.',
    topics: ['API 연동 방법', '동영상 자동 편집', '캡션 자동 생성', '멀티 플랫폼 배포'],
    difficulty: 'intermediate'
  },
  8: {
    description: '네이버 블로그 자동 포스팅 봇을 만들어 콘텐츠 마케팅을 자동화합니다.',
    topics: ['네이버 API 활용', 'SEO 최적화 전략', '자동 글쓰기 AI', '스케줄링 시스템'],
    difficulty: 'intermediate'
  },
  9: {
    description: 'Twitter/X의 쓰레드를 자동으로 작성하고 포스팅하는 봇을 개발합니다.',
    topics: ['Twitter API v2', '쓰레드 자동 생성', '해시태그 최적화', '인게이지먼트 분석'],
    difficulty: 'intermediate'
  },
  10: {
    description: 'n8n을 활용한 노코드 자동화 워크플로우를 Claude Code로 자동 생성합니다.',
    topics: ['n8n 기본 구조', '워크플로우 자동 생성', 'Webhook 활용', '외부 서비스 연동'],
    difficulty: 'intermediate'
  },
  11: {
    description: '전문적인 회사 웹사이트를 Claude Code로 빠르게 구축합니다.',
    topics: ['Next.js 프레임워크', '반응형 디자인', 'SEO 최적화', 'Vercel 배포'],
    difficulty: 'intermediate'
  },
  12: {
    description: '월 구독형 SaaS 비즈니스 사이트를 처음부터 끝까지 구축합니다.',
    topics: ['SaaS 아키텍처', 'Stripe 결제 연동', '구독 관리 시스템', '대시보드 구축'],
    difficulty: 'advanced'
  },
  13: {
    description: 'Supabase를 활용한 백엔드 시스템을 완벽하게 마스터합니다.',
    topics: ['Supabase 설정', 'PostgreSQL 활용', 'Row Level Security', 'Realtime 기능'],
    difficulty: 'intermediate'
  },
  14: {
    description: '나만의 개인 AI 비서를 만들어 일상 업무를 자동화합니다.',
    topics: ['AI 비서 아키텍처', '커스텀 프롬프트', '메모리 시스템', '작업 자동화'],
    difficulty: 'advanced'
  },
  15: {
    description: 'RAG(Retrieval-Augmented Generation) 시스템을 구축하여 문서 기반 AI를 만듭니다.',
    topics: ['Vector DB 구축', '임베딩 생성', '검색 시스템', 'LangChain 활용'],
    difficulty: 'advanced'
  },
  16: {
    description: '스마트폰만으로 코딩하고 배포하는 방법을 배웁니다.',
    topics: ['모바일 IDE 설정', 'SSH 연결', '원격 개발 환경', 'Git 모바일 활용'],
    difficulty: 'intermediate'
  },
  17: {
    description: 'tmux를 활용한 병렬 작업으로 개발 속도를 10배 향상시킵니다.',
    topics: ['tmux 기본 명령어', '세션 관리', '윈도우 분할', '커스텀 설정'],
    difficulty: 'intermediate'
  },
  18: {
    description: 'CLAUDE.md 파일을 최적화하여 AI의 성능을 극대화합니다.',
    topics: ['CLAUDE.md 구조', '컨텍스트 최적화', '지시사항 작성법', '프로젝트 템플릿'],
    difficulty: 'intermediate'
  },
  19: {
    description: 'Claude의 컨텍스트 한계를 극복하는 고급 기법들을 배웁니다.',
    topics: ['컨텍스트 관리 전략', '요약 기법', '분할 처리', '메모리 최적화'],
    difficulty: 'advanced'
  },
  20: {
    description: 'GitHub의 인기 프레임워크를 가져와 커스터마이징하는 방법을 배웁니다.',
    topics: ['오픈소스 활용법', 'Fork와 Clone', '커스터마이징 전략', '라이선스 이해'],
    difficulty: 'intermediate'
  },
  21: {
    description: '바이브코딩의 핵심 철학과 실전 적용법을 마스터합니다.',
    topics: ['바이브코딩 철학', '빠른 프로토타이핑', 'MVP 개발', '반복 개선 전략'],
    difficulty: 'intermediate'
  },
  22: {
    description: 'MVP를 초고속으로 런칭하는 체계적인 절차를 배웁니다.',
    topics: ['MVP 정의', '핵심 기능 선정', '빠른 개발 전략', '런칭 체크리스트'],
    difficulty: 'advanced'
  },
  23: {
    description: '결제 시스템을 30분 만에 웹사이트에 연동하는 방법을 배웁니다.',
    topics: ['결제 게이트웨이', 'Stripe/PayApp 연동', '보안 처리', '정산 시스템'],
    difficulty: 'advanced'
  },
  24: {
    description: '프로젝트에 최적의 프레임워크를 선택하는 기준과 방법을 배웁니다.',
    topics: ['프레임워크 비교', '선택 기준', '성능 고려사항', '생태계 분석'],
    difficulty: 'advanced'
  },
  25: {
    description: '효율적인 프로젝트 구조와 작업 플로우를 설계합니다.',
    topics: ['폴더 구조 설계', 'Monorepo vs Polyrepo', '코드 컨벤션', '자동화 설정'],
    difficulty: 'advanced'
  },
  26: {
    description: 'Git worktree를 활용한 고급 버전 관리 기법을 배웁니다.',
    topics: ['Worktree 개념', '멀티 브랜치 작업', '충돌 해결 전략', 'Git 고급 명령어'],
    difficulty: 'advanced'
  },
  27: {
    description: 'Claude Code를 200% 활용하는 고급 테크닉을 마스터합니다.',
    topics: ['고급 프롬프트 엔지니어링', '컨텍스트 해킹', '자동화 극대화', '비밀 기능들'],
    difficulty: 'advanced'
  }
};

export default function ModuleAccordion({ modules, className = '' }: ModuleAccordionProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-500';
      case 'intermediate':
        return 'text-yellow-500';
      case 'advanced':
        return 'text-red-500';
      default:
        return 'text-metallicGold-500';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return '기본';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {modules.map((module, index) => {
        const details = moduleDetails[module.id] || {
          description: `${module.title}에 대한 실습 중심의 강의입니다.`,
          topics: ['핵심 개념 이해', '실습 프로젝트', '실전 응용'],
          difficulty: 'intermediate' as const
        };
        
        const isExpanded = expandedModules.includes(module.id);
        const isHovered = hoveredModule === module.id;
        const isLocked = index > 2 && !module.completed; // First 3 modules are unlocked
        
        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group"
          >
            <div
              className={`
                relative overflow-hidden rounded-2xl transition-all duration-300
                ${isLocked 
                  ? 'bg-deepBlack-600/30 border border-deepBlack-300/50' 
                  : 'bg-deepBlack-600/50 border border-metallicGold-900/30 hover:border-metallicGold-500/50'
                }
                ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}
              `}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              {/* Module Header */}
              <button
                onClick={() => !isLocked && toggleModule(module.id)}
                disabled={isLocked}
                className={`
                  w-full px-6 py-5 flex items-center justify-between
                  ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                  transition-all duration-300
                `}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Module Number */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                    transition-all duration-300
                    ${module.completed 
                      ? 'bg-green-500/20 text-green-500' 
                      : isLocked
                      ? 'bg-deepBlack-300/50 text-offWhite-600'
                      : isHovered
                      ? 'bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                      : 'bg-metallicGold-500/20 text-metallicGold-500'
                    }
                  `}>
                    {module.completed ? (
                      <CheckCircle size={24} />
                    ) : isLocked ? (
                      <Lock size={20} />
                    ) : (
                      <span>{module.id}</span>
                    )}
                  </div>

                  {/* Module Info */}
                  <div className="flex-1 text-left">
                    <h4 className={`
                      font-bold text-lg mb-1 transition-colors
                      ${isLocked 
                        ? 'text-offWhite-600' 
                        : 'text-offWhite-200 group-hover:text-metallicGold-500'
                      }
                    `}>
                      {module.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-offWhite-500">
                        <Clock size={14} />
                        {module.duration}
                      </span>
                      <span className={`flex items-center gap-1 ${getDifficultyColor(details.difficulty)}`}>
                        <Star size={14} />
                        {getDifficultyLabel(details.difficulty)}
                      </span>
                      {module.completed && (
                        <span className="text-green-500 font-medium">완료됨</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                {!isLocked && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="text-metallicGold-500" size={24} />
                  </motion.div>
                )}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-metallicGold-900/20">
                      {/* Description */}
                      <div className="mt-4">
                        <p className="text-offWhite-400 leading-relaxed">
                          {details.description}
                        </p>
                      </div>

                      {/* Topics */}
                      {details.topics && details.topics.length > 0 && (
                        <div className="mt-6">
                          <h5 className="text-sm font-bold text-metallicGold-500 mb-3 flex items-center gap-2">
                            <BookOpen size={16} />
                            학습 내용
                          </h5>
                          <div className="grid md:grid-cols-2 gap-2">
                            {details.topics.map((topic, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-start gap-2 text-sm text-offWhite-300"
                              >
                                <span className="text-metallicGold-500 mt-1">•</span>
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="mt-6">
                        {module.completed ? (
                          <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-500 rounded-xl font-medium border border-green-500/30">
                            <CheckCircle size={18} />
                            다시 보기
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-medium hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all">
                            <PlayCircle size={18} />
                            학습 시작하기
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover Effect Gradient */}
              {!isLocked && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/0 via-metallicGold-500/5 to-metallicGold-500/0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}