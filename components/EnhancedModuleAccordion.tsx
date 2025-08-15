'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { 
  ChevronDown, Clock, Lock, CheckCircle, Star,
  Sparkles, Rocket, Zap,
  Award, Gift, AlertTriangle
} from 'lucide-react';

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

// 확장된 모듈 상세 정보 - 학습 성과와 실제 활용 사례 추가
const moduleDetails: { 
  [key: number]: { 
    description: string; 
    topics: string[]; 
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    outcomes: string[];  // 학습 성과
    realWorldUse: string[];  // 실제 활용 사례
    projectExample: string;  // 만들 수 있는 프로젝트 예시
    timeToMaster: string;  // 습득 예상 시간
    prerequisite?: string;  // 선수 지식
    bonus?: string;  // 보너스 콘텐츠
  } 
} = {
  1: {
    description: 'Claude Code CLI 사용을 위한 필수 개발환경을 세팅합니다. Windows, Mac, Linux 모든 OS에서 완벽하게 작동하는 환경을 구축합니다.',
    topics: ['VS Code 설치 및 설정', 'Node.js & npm 환경 구축', 'Git 설치 및 기본 설정', 'Claude Code CLI 설치'],
    difficulty: 'beginner',
    outcomes: [
      '✅ 10분 만에 개발환경 완벽 세팅',
      '✅ OS별 최적화된 환경 구축',
      '✅ 문제 발생 시 자가 진단 능력'
    ],
    realWorldUse: [
      '💼 회사에서 새 프로젝트 즉시 시작',
      '🏠 집에서도 동일한 개발 환경 구축',
      '📱 어디서든 코딩 가능한 환경'
    ],
    projectExample: '첫 번째 AI 자동화 프로그램 실행',
    timeToMaster: '즉시 활용 가능',
    bonus: '🎁 윈도우 WSL2 완벽 세팅 가이드'
  },
  2: {
    description: 'MCP(Model Context Protocol)를 한줄 명령으로 간단하게 설치하고 설정하는 방법을 배웁니다.',
    topics: ['MCP 개념 이해', '한줄 설치 명령어', '환경변수 자동 설정', 'MCP 서버 관리'],
    difficulty: 'beginner',
    outcomes: [
      '✅ 복잡한 MCP를 1분 만에 설치',
      '✅ 다양한 AI 서비스 즉시 연동',
      '✅ 자동화 시스템 기반 구축'
    ],
    realWorldUse: [
      '🤖 Notion AI 자동화',
      '📊 Supabase DB 자동 관리',
      '🔗 외부 API 원클릭 연동'
    ],
    projectExample: 'Notion 자동 문서화 시스템',
    timeToMaster: '30분 실습으로 마스터',
    bonus: '🎁 20개 MCP 서버 원클릭 설치 스크립트'
  },
  3: {
    description: 'GitHub의 핵심 개념을 이해하고 코드 관리의 기초를 다집니다.',
    topics: ['Repository 생성과 관리', 'Commit과 Push 이해', 'Branch 전략', 'GitHub Actions 기초'],
    difficulty: 'beginner',
    outcomes: [
      '✅ 코드 버전 관리 완벽 이해',
      '✅ 협업 가능한 수준의 Git 활용',
      '✅ 자동 배포 시스템 구축'
    ],
    realWorldUse: [
      '💻 포트폴리오 사이트 자동 배포',
      '👥 팀 프로젝트 효율적 관리',
      '🔄 코드 백업 및 복구'
    ],
    projectExample: 'GitHub Pages로 개인 블로그 런칭',
    timeToMaster: '1일 집중 학습',
    bonus: '🎁 GitHub Actions 자동화 템플릿 10종'
  },
  4: {
    description: 'Docker를 활용한 컨테이너 기반 개발 환경을 구축합니다.',
    topics: ['Docker 기본 개념', 'Container vs VM', 'Docker Compose 활용', '개발환경 컨테이너화'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ "내 컴퓨터에선 되는데" 문제 해결',
      '✅ 원클릭 개발환경 배포',
      '✅ 서버 비용 90% 절감'
    ],
    realWorldUse: [
      '🚀 마이크로서비스 아키텍처 구축',
      '💰 클라우드 비용 대폭 절감',
      '⚡ 개발-운영 환경 동기화'
    ],
    projectExample: '도커로 풀스택 앱 한방 배포',
    timeToMaster: '2-3일 실습',
    prerequisite: 'Linux 기본 명령어',
    bonus: '🎁 Docker Compose 실전 템플릿'
  },
  5: {
    description: '여러 AI 에이전트를 동시에 활용하여 복잡한 작업을 효율적으로 처리합니다.',
    topics: ['서브에이전트 개념', '병렬 작업 처리', '에이전트 간 통신', '작업 분배 전략'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 작업 속도 10배 향상',
      '✅ 복잡한 프로젝트 자동 분해',
      '✅ AI 협업 시스템 구축'
    ],
    realWorldUse: [
      '🎯 대규모 데이터 병렬 처리',
      '🤝 AI 팀워크로 복잡한 문제 해결',
      '⚡ 멀티태스킹 자동화'
    ],
    projectExample: '5개 AI가 협업하는 콘텐츠 생산 시스템',
    timeToMaster: '3일 심화 학습',
    bonus: '🎁 에이전트 오케스트레이션 템플릿'
  },
  6: {
    description: 'Claude Code CLI를 활용한 완전 자동화 워크플로우를 구축합니다.',
    topics: ['워크플로우 설계', 'Bash 스크립트 자동화', 'Cron 작업 설정', 'CI/CD 파이프라인'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 24/7 무인 자동화 시스템',
      '✅ 반복 작업 100% 자동화',
      '✅ 실시간 모니터링 구축'
    ],
    realWorldUse: [
      '📈 매출 리포트 자동 생성',
      '📧 고객 응대 자동화',
      '🔔 실시간 알림 시스템'
    ],
    projectExample: '완전 자동화된 온라인 비즈니스',
    timeToMaster: '1주일 프로젝트',
    bonus: '🎁 100개 자동화 스크립트 라이브러리'
  },
  7: {
    description: '숏폼 콘텐츠를 자동으로 여러 플랫폼에 업로드하는 시스템을 구축합니다.',
    topics: ['API 연동 방법', '동영상 자동 편집', '캡션 자동 생성', '멀티 플랫폼 배포'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 1개 영상 → 10개 플랫폼 동시 업로드',
      '✅ 자동 자막 및 썸네일 생성',
      '✅ 최적 업로드 시간 자동 설정'
    ],
    realWorldUse: [
      '📹 유튜브 쇼츠 자동화',
      '🎵 틱톡 대량 업로드',
      '📱 인스타 릴스 스케줄링'
    ],
    projectExample: '월 1000개 숏폼 자동 생산 시스템',
    timeToMaster: '3-4일 실습',
    bonus: '🎁 바이럴 콘텐츠 분석 AI'
  },
  8: {
    description: '네이버 블로그 자동 포스팅 봇을 만들어 콘텐츠 마케팅을 자동화합니다.',
    topics: ['네이버 API 활용', 'SEO 최적화 전략', '자동 글쓰기 AI', '스케줄링 시스템'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 하루 10개 포스트 자동 발행',
      '✅ 상위 노출 최적화',
      '✅ 조회수 10배 증가'
    ],
    realWorldUse: [
      '💰 블로그 수익화 자동화',
      '🎯 타겟 키워드 공략',
      '📊 성과 분석 자동화'
    ],
    projectExample: '월 100만원 수익 블로그 자동화',
    timeToMaster: '1주일 실전 적용',
    bonus: '🎁 네이버 SEO 비밀 전략'
  },
  9: {
    description: 'Twitter/X의 쓰레드를 자동으로 작성하고 포스팅하는 봇을 개발합니다.',
    topics: ['Twitter API v2', '쓰레드 자동 생성', '해시태그 최적화', '인게이지먼트 분석'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 팔로워 1000% 증가 전략',
      '✅ 바이럴 쓰레드 자동 생성',
      '✅ 최적 포스팅 시간 자동 설정'
    ],
    realWorldUse: [
      '🐦 트위터 인플루언서 되기',
      '💼 브랜드 인지도 향상',
      '🎯 타겟 오디언스 확보'
    ],
    projectExample: '일 100개 트윗 자동화 시스템',
    timeToMaster: '3-5일 구축',
    bonus: '🎁 트위터 성장 해킹 가이드'
  },
  10: {
    description: 'n8n을 활용한 노코드 자동화 워크플로우를 Claude Code로 자동 생성합니다.',
    topics: ['n8n 기본 구조', '워크플로우 자동 생성', 'Webhook 활용', '외부 서비스 연동'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 복잡한 워크플로우 1분 생성',
      '✅ 100개 서비스 연동',
      '✅ 노코드 한계 극복'
    ],
    realWorldUse: [
      '🔄 비즈니스 프로세스 자동화',
      '📊 데이터 파이프라인 구축',
      '🤖 챗봇 워크플로우'
    ],
    projectExample: 'CRM 자동화 시스템 구축',
    timeToMaster: '2-3일 마스터',
    bonus: '🎁 n8n 고급 노드 패키지'
  },
  11: {
    description: '전문적인 회사 웹사이트를 Claude Code로 빠르게 구축합니다.',
    topics: ['Next.js 프레임워크', '반응형 디자인', 'SEO 최적화', 'Vercel 배포'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 3시간 만에 회사 사이트 완성',
      '✅ 모바일 최적화 100점',
      '✅ 구글 상위 노출'
    ],
    realWorldUse: [
      '🏢 스타트업 웹사이트',
      '💼 포트폴리오 사이트',
      '🛍️ 랜딩 페이지'
    ],
    projectExample: '연 매출 10억 회사 사이트',
    timeToMaster: '1주일 프로젝트',
    bonus: '🎁 프리미엄 템플릿 50종'
  },
  12: {
    description: '월 구독형 SaaS 비즈니스 사이트를 처음부터 끝까지 구축합니다.',
    topics: ['SaaS 아키텍처', 'Stripe 결제 연동', '구독 관리 시스템', '대시보드 구축'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 월 1000만원 SaaS 런칭',
      '✅ 자동 결제 시스템',
      '✅ 고객 관리 자동화'
    ],
    realWorldUse: [
      '💎 B2B SaaS 플랫폼',
      '📊 데이터 분석 서비스',
      '🎓 온라인 교육 플랫폼'
    ],
    projectExample: '월 구독 AI 서비스 플랫폼',
    timeToMaster: '2-3주 집중 개발',
    bonus: '🎁 SaaS 비즈니스 플레이북'
  },
  13: {
    description: 'Supabase를 활용한 백엔드 시스템을 완벽하게 마스터합니다.',
    topics: ['Supabase 설정', 'PostgreSQL 활용', 'Row Level Security', 'Realtime 기능'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 서버 비용 0원 백엔드',
      '✅ 실시간 데이터 동기화',
      '✅ 엔터프라이즈급 보안'
    ],
    realWorldUse: [
      '💬 실시간 채팅 앱',
      '📱 모바일 앱 백엔드',
      '🎮 멀티플레이어 게임'
    ],
    projectExample: '실시간 협업 도구 백엔드',
    timeToMaster: '1주일 심화 학습',
    bonus: '🎁 Supabase 고급 쿼리 모음'
  },
  14: {
    description: '나만의 개인 AI 비서를 만들어 일상 업무를 자동화합니다.',
    topics: ['AI 비서 아키텍처', '커스텀 프롬프트', '메모리 시스템', '작업 자동화'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 업무 생산성 500% 향상',
      '✅ 24시간 개인 비서',
      '✅ 맞춤형 AI 어시스턴트'
    ],
    realWorldUse: [
      '📧 이메일 자동 응답',
      '📅 일정 관리 자동화',
      '📝 문서 작성 지원'
    ],
    projectExample: 'JARVIS 같은 AI 비서',
    timeToMaster: '2주 커스터마이징',
    bonus: '🎁 AI 비서 프롬프트 1000개'
  },
  15: {
    description: 'RAG(Retrieval-Augmented Generation) 시스템을 구축하여 문서 기반 AI를 만듭니다.',
    topics: ['Vector DB 구축', '임베딩 생성', '검색 시스템', 'LangChain 활용'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 기업 지식베이스 AI',
      '✅ PDF 1000개 학습 AI',
      '✅ 전문 분야 AI 구축'
    ],
    realWorldUse: [
      '📚 법률 문서 분석 AI',
      '🏥 의료 진단 보조 AI',
      '💼 기업 내부 ChatGPT'
    ],
    projectExample: '회사 전용 AI 지식 시스템',
    timeToMaster: '2-3주 프로젝트',
    bonus: '🎁 RAG 최적화 노하우'
  },
  16: {
    description: '스마트폰만으로 코딩하고 배포하는 방법을 배웁니다.',
    topics: ['모바일 IDE 설정', 'SSH 연결', '원격 개발 환경', 'Git 모바일 활용'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 언제 어디서나 코딩',
      '✅ 긴급 수정 즉시 대응',
      '✅ 노마드 개발자 라이프'
    ],
    realWorldUse: [
      '🏖️ 휴가 중 긴급 대응',
      '🚇 출퇴근 시간 활용',
      '☕ 카페에서 풀스택 개발'
    ],
    projectExample: '아이패드로 SaaS 운영하기',
    timeToMaster: '하루 만에 설정',
    bonus: '🎁 모바일 개발 필수 앱 10선'
  },
  17: {
    description: 'tmux를 활용한 병렬 작업으로 개발 속도를 10배 향상시킵니다.',
    topics: ['tmux 기본 명령어', '세션 관리', '윈도우 분할', '커스텀 설정'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 멀티태스킹 마스터',
      '✅ 서버 작업 효율 극대화',
      '✅ 팀 협업 생산성 향상'
    ],
    realWorldUse: [
      '⚡ 동시 10개 프로젝트 관리',
      '🖥️ 서버 모니터링 대시보드',
      '👥 페어 프로그래밍'
    ],
    projectExample: '프로 개발자의 작업 환경',
    timeToMaster: '3일 실습',
    bonus: '🎁 tmux 고급 설정 파일'
  },
  18: {
    description: 'CLAUDE.md 파일을 최적화하여 AI의 성능을 극대화합니다.',
    topics: ['CLAUDE.md 구조', '컨텍스트 최적화', '지시사항 작성법', '프로젝트 템플릿'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ AI 정확도 200% 향상',
      '✅ 개발 속도 3배 향상',
      '✅ 버그 발생률 90% 감소'
    ],
    realWorldUse: [
      '📋 프로젝트 표준화',
      '🤖 AI 성능 최적화',
      '📚 팀 지식 공유'
    ],
    projectExample: '완벽한 AI 협업 시스템',
    timeToMaster: '2-3일 마스터',
    bonus: '🎁 업계별 CLAUDE.md 템플릿'
  },
  19: {
    description: 'Claude의 컨텍스트 한계를 극복하는 고급 기법들을 배웁니다.',
    topics: ['컨텍스트 관리 전략', '요약 기법', '분할 처리', '메모리 최적화'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 100만 줄 코드 처리',
      '✅ 무제한 대화 지속',
      '✅ 대규모 프로젝트 관리'
    ],
    realWorldUse: [
      '📖 책 한 권 통째로 분석',
      '💾 레거시 코드 마이그레이션',
      '🏗️ 대규모 리팩토링'
    ],
    projectExample: '엔터프라이즈 시스템 분석',
    timeToMaster: '1주일 고급 과정',
    bonus: '🎁 컨텍스트 해킹 비법'
  },
  20: {
    description: 'GitHub의 인기 프레임워크를 가져와 커스터마이징하는 방법을 배웁니다.',
    topics: ['오픈소스 활용법', 'Fork와 Clone', '커스터마이징 전략', '라이선스 이해'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 개발 시간 90% 단축',
      '✅ 검증된 코드 활용',
      '✅ 커뮤니티 지원 활용'
    ],
    realWorldUse: [
      '🚀 스타트업 MVP 개발',
      '💎 프리미엄 기능 추가',
      '🔧 맞춤형 솔루션 구축'
    ],
    projectExample: '유명 SaaS 클론 코딩',
    timeToMaster: '1주일 프로젝트',
    bonus: '🎁 인기 오픈소스 TOP 100'
  },
  21: {
    description: '바이브코딩의 핵심 철학과 실전 적용법을 마스터합니다.',
    topics: ['바이브코딩 철학', '빠른 프로토타이핑', 'MVP 개발', '반복 개선 전략'],
    difficulty: 'intermediate',
    outcomes: [
      '✅ 아이디어→제품 3시간',
      '✅ 실패 비용 최소화',
      '✅ 빠른 시장 검증'
    ],
    realWorldUse: [
      '💡 스타트업 린 개발',
      '🎮 인디 게임 개발',
      '📱 앱 아이디어 검증'
    ],
    projectExample: '하루 만에 SaaS 런칭',
    timeToMaster: '실전으로 체득',
    bonus: '🎁 실리콘밸리 개발 문화'
  },
  22: {
    description: 'MVP를 초고속으로 런칭하는 체계적인 절차를 배웁니다.',
    topics: ['MVP 정의', '핵심 기능 선정', '빠른 개발 전략', '런칭 체크리스트'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 1주일 내 제품 런칭',
      '✅ 투자 유치 준비',
      '✅ 초기 고객 확보'
    ],
    realWorldUse: [
      '🦄 유니콘 스타트업 시작',
      '💰 부트스트래핑 비즈니스',
      '🎯 니치 마켓 공략'
    ],
    projectExample: '실리콘밸리식 MVP 런칭',
    timeToMaster: '실전 프로젝트로 학습',
    bonus: '🎁 MVP 체크리스트 & 템플릿'
  },
  23: {
    description: '결제 시스템을 30분 만에 웹사이트에 연동하는 방법을 배웁니다.',
    topics: ['결제 게이트웨이', 'Stripe/PayApp 연동', '보안 처리', '정산 시스템'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 30분 만에 결제 연동',
      '✅ 글로벌 결제 지원',
      '✅ 자동 정산 시스템'
    ],
    realWorldUse: [
      '💳 전자상거래 사이트',
      '🎫 티켓 예매 시스템',
      '📚 디지털 콘텐츠 판매'
    ],
    projectExample: '월 1억 결제 처리 시스템',
    timeToMaster: '하루 만에 구현',
    bonus: '🎁 PCI 컴플라이언스 가이드'
  },
  24: {
    description: '프로젝트에 최적의 프레임워크를 선택하는 기준과 방법을 배웁니다.',
    topics: ['프레임워크 비교', '선택 기준', '성능 고려사항', '생태계 분석'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 프로젝트 성공률 향상',
      '✅ 개발 비용 50% 절감',
      '✅ 유지보수 용이성 확보'
    ],
    realWorldUse: [
      '🏗️ 대규모 프로젝트 설계',
      '🔄 기술 스택 마이그레이션',
      '📊 기술 부채 관리'
    ],
    projectExample: '최적 기술 스택 선정',
    timeToMaster: '사례 연구로 학습',
    bonus: '🎁 2025 프레임워크 트렌드'
  },
  25: {
    description: '효율적인 프로젝트 구조와 작업 플로우를 설계합니다.',
    topics: ['폴더 구조 설계', 'Monorepo vs Polyrepo', '코드 컨벤션', '자동화 설정'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 개발 속도 3배 향상',
      '✅ 팀 협업 효율 극대화',
      '✅ 코드 품질 자동 보장'
    ],
    realWorldUse: [
      '👥 대규모 팀 프로젝트',
      '🔧 오픈소스 프로젝트',
      '🏢 엔터프라이즈 시스템'
    ],
    projectExample: '구글식 코드 구조',
    timeToMaster: '프로젝트 경험으로 체득',
    bonus: '🎁 빅테크 기업 코드 컨벤션'
  },
  26: {
    description: 'Git worktree를 활용한 고급 버전 관리 기법을 배웁니다.',
    topics: ['Worktree 개념', '멀티 브랜치 작업', '충돌 해결 전략', 'Git 고급 명령어'],
    difficulty: 'advanced',
    outcomes: [
      '✅ 동시 다중 버전 개발',
      '✅ 긴급 핫픽스 즉시 대응',
      '✅ 실험적 기능 안전 개발'
    ],
    realWorldUse: [
      '🔥 프로덕션 긴급 대응',
      '🧪 A/B 테스트 개발',
      '🔀 복잡한 머지 관리'
    ],
    projectExample: '넷플릭스식 배포 전략',
    timeToMaster: '실무 적용으로 마스터',
    bonus: '🎁 Git 고급 워크플로우'
  },
  27: {
    description: 'Claude Code를 200% 활용하는 고급 테크닉을 마스터합니다.',
    topics: ['고급 프롬프트 엔지니어링', '컨텍스트 해킹', '자동화 극대화', '비밀 기능들'],
    difficulty: 'advanced',
    outcomes: [
      '✅ AI 개발자 상위 1%',
      '✅ 불가능을 가능으로',
      '✅ 연봉 2배 상승'
    ],
    realWorldUse: [
      '🎯 AI 스타트업 CTO',
      '💼 AI 컨설턴트',
      '🚀 차세대 서비스 개발'
    ],
    projectExample: 'AI로 AI 만들기',
    timeToMaster: '지속적인 연구 필요',
    bonus: '🎁 Claude Code 시크릿 가이드'
  }
};


export default function EnhancedModuleAccordion({ modules, className = '' }: ModuleAccordionProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

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
        return 'from-green-500 to-green-600';
      case 'intermediate':
        return 'from-yellow-500 to-yellow-600';
      case 'advanced':
        return 'from-red-500 to-red-600';
      default:
        return 'from-metallicGold-500 to-metallicGold-600';
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

  const getDifficultyIcon = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Sparkles className="w-4 h-4" />;
      case 'intermediate':
        return <Zap className="w-4 h-4" />;
      case 'advanced':
        return <Rocket className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Simple Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-offWhite-200 mb-2">13개 실습 모듈</h3>
        <p className="text-sm text-offWhite-500">클릭하여 상세 내용을 확인하세요</p>
      </div>

      {/* Module List */}
      <div className="space-y-4">
        {modules.map((module, index) => {
          const details = moduleDetails[module.id] || {
            description: `${module.title}에 대한 실습 중심의 강의입니다.`,
            topics: ['핵심 개념 이해', '실습 프로젝트', '실전 응용'],
            difficulty: 'intermediate' as const,
            outcomes: ['실무 활용 능력', '문제 해결 능력', '자동화 구현'],
            realWorldUse: ['실제 프로젝트 적용', '업무 효율화', '수익 창출'],
            projectExample: '실전 프로젝트',
            timeToMaster: '1주일 내 마스터'
          };
          
          const isExpanded = expandedModules.includes(module.id);
          const isHovered = hoveredModule === module.id;
          const isLocked = index > 2 && !module.completed;
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group"
              onMouseMove={handleMouseMove}
            >
              <div
                className={`
                  relative overflow-hidden rounded-3xl transition-all duration-500
                  ${isLocked 
                    ? 'bg-deepBlack-600/30 border border-deepBlack-300/50' 
                    : isExpanded
                    ? 'bg-gradient-to-br from-deepBlack-600/60 to-deepBlack-600/40 border-2 border-metallicGold-500/50 shadow-2xl shadow-metallicGold-500/20'
                    : 'bg-deepBlack-600/50 border border-metallicGold-900/30 hover:border-metallicGold-500/50 hover:shadow-xl'
                  }
                `}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Gradient Follow Effect */}
                {!isLocked && isHovered && (
                  <motion.div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background: `radial-gradient(200px circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(255,215,0,0.2), transparent)`
                    }}
                  />
                )}

                {/* Module Header */}
                <button
                  onClick={() => !isLocked && toggleModule(module.id)}
                  disabled={isLocked}
                  className={`
                    w-full px-6 py-6 flex items-center justify-between
                    ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                    transition-all duration-300
                  `}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Module Number with Animation */}
                    <motion.div 
                      whileHover={!isLocked ? { scale: 1.1, rotate: 5 } : {}}
                      className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg
                        transition-all duration-300 relative
                        ${module.completed 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                          : isLocked
                          ? 'bg-deepBlack-300/50 text-offWhite-600'
                          : isHovered
                          ? 'bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                          : 'bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 text-metallicGold-500'
                        }
                      `}
                    >
                      {module.completed ? (
                        <CheckCircle size={28} />
                      ) : isLocked ? (
                        <Lock size={24} />
                      ) : (
                        <>
                          <span className="relative z-10">{module.id}</span>
                          {isHovered && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 rounded-2xl border-2 border-metallicGold-500/30"
                            />
                          )}
                        </>
                      )}
                    </motion.div>

                    {/* Module Info */}
                    <div className="flex-1 text-left">
                      <h4 className={`
                        font-bold text-base mb-1 transition-colors
                        ${isLocked 
                          ? 'text-offWhite-600' 
                          : 'text-offWhite-200 group-hover:text-metallicGold-500'
                        }
                      `}>
                        {module.title}
                      </h4>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-offWhite-500">
                          <Clock size={14} />
                          {module.duration}
                        </span>
                        <span className={`
                          flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                          bg-gradient-to-r ${getDifficultyColor(details.difficulty)} text-white
                        `}>
                          {getDifficultyIcon(details.difficulty)}
                          {getDifficultyLabel(details.difficulty)}
                        </span>
                        {details.prerequisite && (
                          <span className="text-sm text-yellow-500 flex items-center gap-1">
                            <AlertTriangle size={14} />
                            선수과목 필요
                          </span>
                        )}
                        {details.bonus && (
                          <span className="text-sm text-green-500 flex items-center gap-1">
                            <Gift size={14} />
                            보너스 포함
                          </span>
                        )}
                        {module.completed && (
                          <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                            <Award size={14} />
                            수료 완료
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon with Animation */}
                  {!isLocked && (
                    <motion.div
                      animate={{ 
                        rotate: isExpanded ? 180 : 0,
                        scale: isHovered ? 1.2 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-metallicGold-500"
                    >
                      <ChevronDown size={28} />
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
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-metallicGold-900/20">
                        {/* Simplified Content - No Tabs */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4 mt-6"
                        >
                          {/* Description */}
                          <div>
                            <p className="text-offWhite-400 leading-relaxed mb-4">
                              {details.description}
                            </p>
                          </div>

                          {/* Key Topics */}
                          <div>
                            <h5 className="font-semibold text-metallicGold-500 mb-3">학습 내용</h5>
                            <div className="space-y-2">
                              {details.topics.map((topic, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-metallicGold-500 mt-0.5">•</span>
                                  <span className="text-sm text-offWhite-300">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Project Example */}
                          <div className="p-4 bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl">
                            <p className="text-sm text-metallicGold-500 mb-1">이 모듈을 완료하면</p>
                            <p className="font-bold text-offWhite-200">{details.projectExample}</p>
                            <p className="text-xs text-offWhite-500 mt-1">를 만들 수 있습니다</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Locked Overlay Message */}
                {isLocked && isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-deepBlack-900/80 backdrop-blur-sm flex items-center justify-center rounded-3xl"
                  >
                    <div className="text-center p-6">
                      <Lock className="w-12 h-12 text-metallicGold-500 mx-auto mb-3" />
                      <p className="text-offWhite-200 font-bold mb-2">이전 모듈을 먼저 완료해주세요</p>
                      <p className="text-sm text-offWhite-500">순차적 학습으로 더 효과적입니다</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-3xl border border-metallicGold-500/30 text-center"
      >
        <h3 className="text-2xl font-bold text-metallicGold-500 mb-3">
          준비되셨나요? 지금 시작하세요!
        </h3>
        <p className="text-offWhite-400 mb-6">
          13개 모듈, 13시간의 압축된 지식으로 당신을 AI 마스터로 만들어드립니다
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl"
        >
          전체 커리큘럼 시작하기 →
        </motion.button>
      </motion.div>
    </div>
  );
}