'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';
import { FAQSection, sampleFAQs } from '@/components/FAQSection';
// import { useAuth } from '@/lib/auth-context';
import EnhancedModuleAccordion from '@/components/EnhancedModuleAccordion';
import ClaudeHeroSection from '@/components/ClaudeHeroSection';
import ProjectGallery from '@/components/ProjectGallery';
import LearningMethodSection from '@/components/LearningMethodSection';
import TrialErrorVsShortcutSection from '@/components/TrialErrorVsShortcutSection';
import VibeCodingSuccessStoriesSection from '@/components/VibeCodingSuccessStoriesSection';
import ClaudeCodeVsOthersSection from '@/components/ClaudeCodeVsOthersSection';

// Claude Code CLI 마스터과정 데이터
const masterCourse = {
  id: 'claude-code-master',
  title: '비개발자도 Claude Code CLI 하나로 모든 것을 다한다!',
  subtitle: '코딩 몰라도 AI로 프로그램 만들기',
  description:
    '비개발자를 위한 Claude Code CLI 완벽 마스터 과정. 복잡한 개발 지식 없이도 AI를 활용해 자동화 프로그램과 웹사이트를 만들 수 있습니다.',
  instructor_name: '떡상연구소',
  duration: 780, // 13시간
  price: 149000,
  originalPrice: 899000,
  discount: 83,
  category: 'AI',
  level: 'beginner',
  preview_url: '',
  thumbnail_url: '',
  accessPeriod: '1년',
  isPreOrder: true,
  features: [
    'Claude Code CLI 완벽 마스터',
    'MCP 한줄 명령 세팅',
    '자동화 봇 만들기',
    '실전 프로젝트 구축',
  ],
  benefits: [
    '1년 수강 기간',
    '실습 위주 커리큘럼',
    '비개발자 친화적 설명',
    'Q&A 지원',
  ],
  modules: [
    // 무료 강의 3개
    { id: 1, title: '🎁 [무료] 강의소개', duration: '10분', completed: false },
    { id: 2, title: '🎁 [무료] 자동화 프로그램 exe 파일만들기', duration: '20분', completed: false },
    { id: 3, title: '🎁 [무료] 내 웹사이트 MVP 1시간안에 만들기', duration: '30분', completed: false },
    
    // 나머지 유료 강의들 (각 30분)
    { id: 4, title: '기초 개발환경 세팅', duration: '30분', completed: false },
    { id: 5, title: '한줄 명령으로 세팅하는 MCP', duration: '30분', completed: false },
    { id: 6, title: 'GitHub 이해하기', duration: '30분', completed: false },
    { id: 7, title: 'Docker 이해하기', duration: '30분', completed: false },
    { id: 8, title: '서브에이전트 간의 협업', duration: '30분', completed: false },
    { id: 9, title: 'Claude Code CLI 자동화 워크플로우', duration: '30분', completed: false },
    { id: 10, title: '숏폼 자동화 업로드', duration: '30분', completed: false },
    { id: 11, title: '네이버 블로그 자동화 포스팅 봇 만들기', duration: '30분', completed: false },
    { id: 12, title: '쓰레드 자동화 포스팅 봇 만들기', duration: '30분', completed: false },
    { id: 13, title: 'n8n 자동화 워크플로우 생성', duration: '30분', completed: false },
    { id: 14, title: '회사 사이트 만들기', duration: '30분', completed: false },
    { id: 15, title: '월구독 SaaS 사이트 만들기', duration: '30분', completed: false },
    { id: 16, title: 'Supabase 완벽 가이드', duration: '30분', completed: false },
    { id: 17, title: '나만의 AI비서 생성', duration: '30분', completed: false },
    { id: 18, title: 'RAG 구축', duration: '30분', completed: false },
    { id: 19, title: '휴대폰 코딩', duration: '30분', completed: false },
    { id: 20, title: '커스텀 tmux 병렬작업', duration: '30분', completed: false },
    { id: 21, title: '최상의 CLAUDE.md 작성법', duration: '30분', completed: false },
    { id: 22, title: 'Claude 컨텍스트 한계 뚫기', duration: '30분', completed: false },
    { id: 23, title: 'GitHub 인기 프레임워크 장착하고 커스텀하기', duration: '30분', completed: false },
    { id: 24, title: '바이브코딩의 진짜 바이브 감 잡기', duration: '30분', completed: false },
    { id: 25, title: 'MVP 초고속 런칭 절차', duration: '30분', completed: false },
    { id: 26, title: '내 사이트에 초고속 결제연동', duration: '30분', completed: false },
    { id: 27, title: '프레임워크 선정법 (Ruby on Rails, Next.js 등)', duration: '30분', completed: false },
    { id: 28, title: '최적의 폴더구조 및 작업플로우', duration: '30분', completed: false },
    { id: 29, title: 'Git worktree와 관련 프레임워크', duration: '30분', completed: false },
    { id: 30, title: '클로드코드를 천재적으로 만드는 공식', duration: '30분', completed: false },
  ],
};

export default function LecturesPage() {
  const [_isEnrolled, setIsEnrolled] = useState(false);
  const [_loading, setLoading] = useState(true);
  
  // 실시간 타이머 상태 (8월 18일 23:59:59까지)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });
  
  // 임시로 useAuth 비활성화
  const authLoading = false;

  // 타이머 계산 함수
  const calculateTimeLeft = useCallback(() => {
    const targetDate = new Date('2025-08-18T23:59:59+09:00'); // 8월 18일 23:59:59 (한국시간)
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const milliseconds = Math.floor((difference % 1000) / 10); // 10ms 단위로 표시

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        milliseconds
      });
    } else {
      // 타이머 종료
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
    }
  }, []);

  const checkEnrollment = useCallback(async () => {
    // 임시로 user가 null이므로 체크 생략
    setLoading(false);
    setIsEnrolled(false);
  }, []);

  useEffect(() => {
    // 인증 로딩이 완료된 후에만 등록 상태 확인
    if (!authLoading) {
      void checkEnrollment();
    }
  }, [checkEnrollment, authLoading]);

  // 타이머 useEffect
  useEffect(() => {
    // 초기 계산
    calculateTimeLeft();
    
    // 100ms마다 업데이트
    const timer = setInterval(calculateTimeLeft, 100);
    
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // 로딩 조건을 단순화 - 환경변수 경고가 있어도 페이지 렌더링
  if (_loading && authLoading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
          <p className="text-offWhite-500 text-sm">
            페이지를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative lectures-page-container">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="lectures" />
        
        {/* Hero Section - Single Column */}
        <section className="w-full py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-deepBlack-800 to-deepBlack-900" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-metallicGold-400/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <ClaudeHeroSection />
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-purple-900/10 to-deepBlack-900" />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.02) 0%, transparent 50%)`
            }} />
            <div className="absolute top-20 right-[20%] w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <VibeCodingSuccessStoriesSection />
          </div>
        </section>
              
        {/* Comparison Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-blue-900/8 to-deepBlack-900" />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)`
            }} />
            <div className="absolute bottom-20 left-[15%] w-56 h-56 bg-indigo-500/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <ClaudeCodeVsOthersSection />
          </div>
        </section>
              
        {/* Gallery Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-orange-900/8 to-deepBlack-900" />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 70%, rgba(251, 146, 60, 0.04) 0%, transparent 50%)`
            }} />
            <div className="absolute top-16 left-[25%] w-44 h-44 bg-amber-500/6 rounded-full blur-2xl" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <ProjectGallery />
          </div>
        </section>
              
        {/* Trial vs Shortcut Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/30 to-deepBlack-900" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <TrialErrorVsShortcutSection />
          </div>
        </section>
              
        {/* Learning Method Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/40 to-deepBlack-900" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <LearningMethodSection />
          </div>
        </section>
              
              {/* Vibe Coding Showcase */}
              {/* <VibeCodingShowcase /> */}

        {/* Solution Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/30 to-deepBlack-900" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                        30개 실습 프로젝트로 완성하는 포트폴리오
                      </span>
                    </h2>
                    <p className="text-base text-offWhite-500">
                      매 프로젝트마다 실제 배포까지 - 이론 없이 바로 만들기
                    </p>
                  </div>

                  {/* Module 1-3: Free Lessons */}
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-metallicGold-500 mb-4">
                      🎁 STEP 0: 무료 체험 (모듈 1-3)
                    </h3>
                    
                    {/* Learning Mindmap for STEP 0 */}
                    <div className="mb-8 p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/30">
                      <div className="relative">
                        {/* Central Node */}
                        <div className="flex justify-center mb-6">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                            🎁 무료 체험 (모듈 1-3)
                          </div>
                        </div>
                        
                        {/* Connected Learning Nodes */}
                        <div className="grid md:grid-cols-3 gap-4 relative">
                          {/* Lines connecting to center */}
                          <div className="hidden md:block absolute inset-0">
                            <svg className="w-full h-full">
                              <line x1="50%" y1="0%" x2="16.66%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
                              <line x1="50%" y1="0%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
                              <line x1="50%" y1="0%" x2="83.33%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
                            </svg>
                          </div>
                          
                          {/* Learning Node 1 */}
                          <div className="relative bg-deepBlack-700/50 rounded-xl p-4 border border-green-500/20">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <span className="text-white text-sm font-bold">1</span>
                            </div>
                            <h4 className="text-sm font-semibold text-green-400 text-center mb-2">강의 소개</h4>
                            <ul className="text-xs text-offWhite-400 space-y-1">
                              <li>• 커리큘럼 소개</li>
                              <li>• 자동화 체험</li>
                              <li>• 미리보기</li>
                            </ul>
                          </div>
                          
                          {/* Learning Node 2 */}
                          <div className="relative bg-deepBlack-700/50 rounded-xl p-4 border border-green-500/20">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <span className="text-white text-sm font-bold">2</span>
                            </div>
                            <h4 className="text-sm font-semibold text-green-400 text-center mb-2">환경 설정</h4>
                            <ul className="text-xs text-offWhite-400 space-y-1">
                              <li>• WSL 설치법</li>
                              <li>• Claude Code 설정</li>
                              <li>• 첫 명령어</li>
                            </ul>
                          </div>
                          
                          {/* Learning Node 3 */}
                          <div className="relative bg-deepBlack-700/50 rounded-xl p-4 border border-green-500/20">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <span className="text-white text-sm font-bold">3</span>
                            </div>
                            <h4 className="text-sm font-semibold text-green-400 text-center mb-2">기초 실습</h4>
                            <ul className="text-xs text-offWhite-400 space-y-1">
                              <li>• 자동화 exe</li>
                              <li>• 폴더 정리</li>
                              <li>• 결과 확인</li>
                            </ul>
                          </div>
                        </div>
                        
                        {/* Bottom Summary */}
                        <div className="mt-6 text-center">
                          <p className="text-sm text-green-400 font-medium">
                            💡 <strong>학습 결과:</strong> 자동화 프로그램 exe 파일을 직접 만들어 보고, Claude Code CLI 기본 사용법 마스터
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-deepBlack-600/30 rounded-2xl p-6">
                        <h4 className="text-xl font-bold text-offWhite-200 mb-3">
                          강의 소개 & 자동화 체험
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          코딩 몰라도 따라할 수 있는 강의! 
                          자동화 프로그램 exe 파일 만들기 실습.
                        </p>
                        <ul className="space-y-2 text-sm text-offWhite-500">
                          <li>• 강의 커리큘럼 소개</li>
                          <li>• 자동화 프로그램 체험</li>
                          <li>• 실전 프로젝트 미리보기</li>
                        </ul>
                      </div>
                      
                      <div className="bg-deepBlack-600/30 rounded-2xl p-6">
                        <h4 className="text-xl font-bold text-offWhite-200 mb-3">
                          MVP 1시간안에 만들기
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          웹사이트를 1시간 만에 만들고 배포하는 방법! 
                          이것만 보고도 따라할 수 있습니다.
                        </p>
                        <ul className="space-y-2 text-sm text-offWhite-500">
                          <li>• 아이디어에서 배포까지 60분</li>
                          <li>• Vercel로 즉시 배포</li>
                          <li>• 도메인 연결 팝</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Module 4-9: Getting Started & Foundation */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      🚀 STEP 1: 기초 세팅 & 핵심 개념 (모듈 4-9)
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-deepBlack-600/30 rounded-2xl p-6">
                        <h4 className="text-xl font-bold text-offWhite-200 mb-3">
                          기초 개발환경 & MCP 세팅
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          모듈 4-5: 개발환경과 MCP를 한번에 세팅!
                          한줄 명령어로 모든 것이 자동 설치됩니다.
                        </p>
                        <ul className="space-y-2 text-sm text-offWhite-500">
                          <li>• VS Code, Node.js 자동 설치</li>
                          <li>• 20개 MCP 서버 한번에 세팅</li>
                          <li>• 환경변수 자동 구성</li>
                        </ul>
                      </div>
                      <div className="bg-deepBlack-600/30 rounded-2xl p-6">
                        <h4 className="text-xl font-bold text-offWhite-200 mb-3">
                          핵심 개념 이해
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          모듈 6-9: GitHub, Docker, 서브에이전트, Claude CLI
                          개발자 지식 없이도 이해할 수 있게 설명!
                        </p>
                        <ul className="space-y-2 text-sm text-offWhite-500">
                          <li>• GitHub로 코드 관리하기</li>
                          <li>• Docker 컨테이너 활용법</li>
                          <li>• AI 에이전트 협업 시스템</li>
                        </ul>
                      </div>
                    </div>

                    {/* GitHub Actions 자동 배포 시각화 */}
                    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20">
                      {/* 터미널 스타일 헤더 */}
                      <div className="bg-deepBlack-800/90 px-4 py-2 flex items-center gap-2 border-b border-green-500/20">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-offWhite-500 font-mono ml-2">GitHub Actions - 자동 배포 실행 중</span>
                      </div>
                      
                      {/* 3단계 프로세스 시각화 */}
                      <div className="p-6 space-y-4">
                        {/* STEP 1: Git Push */}
                        <div className="flex items-center gap-4 p-4 bg-deepBlack-700/50 rounded-lg border border-green-500/20">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">1</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-green-400 font-mono text-sm">git push origin main</span>
                              <span className="text-green-400 text-xs">✓ 완료</span>
                            </div>
                            <p className="text-xs text-offWhite-500">코드 변경사항을 GitHub에 업로드</p>
                          </div>
                          <span className="text-xs text-offWhite-400 font-mono">0.3초</span>
                        </div>

                        {/* STEP 2: 자동 빌드 */}
                        <div className="flex items-center gap-4 p-4 bg-deepBlack-700/50 rounded-lg border border-blue-500/20">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">2</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-blue-400 font-mono text-sm">npm run build</span>
                              <span className="text-blue-400 text-xs">✓ 완료</span>
                            </div>
                            <p className="text-xs text-offWhite-500">자동으로 웹사이트 빌드 및 최적화</p>
                          </div>
                          <span className="text-xs text-offWhite-400 font-mono">1.2분</span>
                        </div>

                        {/* STEP 3: 실시간 배포 */}
                        <div className="flex items-center gap-4 p-4 bg-deepBlack-700/50 rounded-lg border border-purple-500/20">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">3</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-purple-400 font-mono text-sm">deploy to vercel</span>
                              <span className="text-purple-400 text-xs">✓ 완료</span>
                            </div>
                            <div className="text-xs text-offWhite-500 mb-2">전 세계 어디서나 접근 가능한 URL 생성</div>
                            <div className="bg-deepBlack-600/50 px-3 py-1 rounded border border-purple-500/30">
                              <span className="text-purple-300 font-mono text-xs">🌐 https://my-awesome-idea.vercel.app</span>
                            </div>
                          </div>
                          <span className="text-xs text-offWhite-400 font-mono">0.8분</span>
                        </div>

                        {/* 성공 메시지 */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🚀</span>
                            <div>
                              <p className="text-green-400 font-bold text-sm">배포 완료! 총 소요시간: 2분 18초</p>
                              <p className="text-green-300 text-xs mt-1">당신의 아이디어가 이제 전 세계에 공개되었습니다</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 하단 설명 */}
                      <div className="bg-deepBlack-700/30 px-4 py-3 border-t border-green-500/20">
                        <p className="text-center text-sm text-offWhite-300 font-medium">
                          ✨ 코드 한 줄 수정 → 2분 후 전 세계 배포 완료
                        </p>
                        <p className="text-center text-xs text-offWhite-500 mt-1">
                          실리콘밸리 개발자들이 매일 사용하는 실제 워크플로우
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Module 10-13: Automation */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      ⚡ STEP 2: 자동화 봇 만들기 (모듈 10-13)
                    </h3>
                    
                    {/* 멀티플랫폼 자동화 시각화 */}
                    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
                      <div className="p-8">
                        {/* 중앙 영상 소스 */}
                        <div className="relative">
                          <div className="flex justify-center mb-12">
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4 rounded-2xl shadow-lg relative z-10">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🎬</span>
                                <div>
                                  <p className="text-white font-bold text-sm">내가 만든 영상 1개</p>
                                  <p className="text-red-100 text-xs">shorts_video.mp4 (30초)</p>
                                  <p className="text-red-200 text-xs mt-1">→ 4개 주요 플랫폼 자동 배포</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 깔끔한 연결선 디자인 */}
                          <div className="absolute top-0 left-0 right-0 h-60 pointer-events-none z-5">
                            <svg className="w-full h-full" viewBox="0 0 100 50">
                              {/* 그라데이션 정의 */}
                              <defs>
                                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.8"/>
                                  <stop offset="50%" stopColor="#ff8e8e" stopOpacity="0.6"/>
                                  <stop offset="100%" stopColor="#ffb3b3" stopOpacity="0.4"/>
                                </linearGradient>
                              </defs>
                              
                              {/* 깔끔한 곡선 연결선들 - 절대 극한 최대로 벌리기 */}
                              <path d="M50,18 Q5,22 0,40" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" className="animate-pulse" opacity="0.7"/>
                              <path d="M50,18 Q35,25 20,40" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" className="animate-pulse" opacity="0.7"/>
                              <path d="M50,18 Q65,25 80,40" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" className="animate-pulse" opacity="0.7"/>
                              <path d="M50,18 Q95,22 100,40" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" className="animate-pulse" opacity="0.7"/>
                              
                              {/* 중앙 허브 포인트 */}
                              <circle cx="50" cy="18" r="3" fill="#ff4757" className="animate-pulse" opacity="0.9"/>
                              <circle cx="50" cy="18" r="6" fill="none" stroke="#ff4757" strokeWidth="1" opacity="0.5" className="animate-ping"/>
                              
                              {/* 엔드 포인트들 - 절대 극한 최대로 벌리기 */}
                              <circle cx="0" cy="40" r="2" fill="#ff6b6b" opacity="0.6"/>
                              <circle cx="20" cy="40" r="2" fill="#ff6b6b" opacity="0.6"/>
                              <circle cx="80" cy="40" r="2" fill="#ff6b6b" opacity="0.6"/>
                              <circle cx="100" cy="40" r="2" fill="#ff6b6b" opacity="0.6"/>
                            </svg>
                          </div>
                          
                          {/* 주요 플랫폼별 업로드 상태 그리드 */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            {/* 유튜브 쇼츠 */}
                            <div className="bg-deepBlack-700/90 backdrop-blur-md rounded-xl p-5 border border-red-500/40 text-center hover:border-red-500/60 transition-all duration-300 min-h-[140px] flex flex-col justify-between">
                              <div>
                                <div className="text-3xl mb-3">📺</div>
                                <p className="text-sm font-bold text-red-400 mb-2">YouTube 쇼츠</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-green-400 font-semibold">✓ 업로드 완료</p>
                                <p className="text-xs text-offWhite-300">조회수: 847</p>
                                <p className="text-xs text-offWhite-500">⏱️ 2분 18초 소요</p>
                              </div>
                            </div>
                            
                            {/* 인스타그램 릴스 */}
                            <div className="bg-deepBlack-700/90 backdrop-blur-md rounded-xl p-5 border border-red-500/40 text-center hover:border-red-500/60 transition-all duration-300 min-h-[140px] flex flex-col justify-between">
                              <div>
                                <div className="text-3xl mb-3">📸</div>
                                <p className="text-sm font-bold text-red-400 mb-2">Instagram 릴스</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-yellow-400 font-semibold">⏳ 업로드 중</p>
                                <p className="text-xs text-offWhite-300">진행률: 78%</p>
                                <p className="text-xs text-offWhite-500">⏱️ 1분 20초 남음</p>
                              </div>
                            </div>
                            
                            {/* 네이버 블로그 */}
                            <div className="bg-deepBlack-700/90 backdrop-blur-md rounded-xl p-5 border border-red-500/40 text-center hover:border-red-500/60 transition-all duration-300 min-h-[140px] flex flex-col justify-between">
                              <div>
                                <div className="text-3xl mb-3">🌐</div>
                                <p className="text-sm font-bold text-red-400 mb-2">네이버 블로그</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-green-400 font-semibold">✓ 업로드 완료</p>
                                <p className="text-xs text-offWhite-300">조회수: 156</p>
                                <p className="text-xs text-offWhite-500">⏱️ 1분 45초 소요</p>
                              </div>
                            </div>
                            
                            {/* 쓰레드 */}
                            <div className="bg-deepBlack-700/90 backdrop-blur-md rounded-xl p-5 border border-red-500/40 text-center hover:border-red-500/60 transition-all duration-300 min-h-[140px] flex flex-col justify-between">
                              <div>
                                <div className="text-3xl mb-3">🧵</div>
                                <p className="text-sm font-bold text-red-400 mb-2">Threads</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400 font-semibold">⏰ 대기 중</p>
                                <p className="text-xs text-offWhite-300">큐: 2번째</p>
                                <p className="text-xs text-offWhite-500">⏱️ 3분 후 시작</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 현실적인 통계 요약 */}
                          <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/40 backdrop-blur-sm">
                            <h6 className="text-sm font-bold text-red-400 mb-4 text-center">📊 자동화 성과 요약</h6>
                            <div className="grid grid-cols-3 gap-6 text-center">
                              <div className="space-y-1">
                                <p className="text-xl font-bold text-green-400">4개</p>
                                <p className="text-xs text-offWhite-300 font-medium">주요 플랫폼</p>
                                <p className="text-xs text-offWhite-500">동시 배포</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xl font-bold text-yellow-400">7분</p>
                                <p className="text-xs text-offWhite-300 font-medium">총 소요시간</p>
                                <p className="text-xs text-offWhite-500">완전 자동화</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xl font-bold text-blue-400">17배</p>
                                <p className="text-xs text-offWhite-300 font-medium">시간 단축</p>
                                <p className="text-xs text-offWhite-500">vs 수동 2시간</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 하단 설명 */}
                      <div className="bg-deepBlack-700/30 px-4 py-3 border-t border-red-500/20">
                        <p className="text-center text-sm text-offWhite-300 font-medium">
                          🎬 영상 1개 업로드 → 4개 주요 플랫폼 동시 배포
                        </p>
                        <p className="text-center text-xs text-offWhite-500 mt-1">
                          수동 업로드 2시간 vs 자동화 7분 - <span className="text-red-400 font-bold">17배 시간 단축</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                      <div className="bg-gradient-to-br from-green-500/15 to-green-600/15 rounded-2xl p-6 border border-green-500/40 backdrop-blur-sm hover:border-green-500/60 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-lg">🎬</span>
                          </div>
                          <h4 className="text-lg font-bold text-green-400">
                            영상 자동 업로드 시스템
                          </h4>
                        </div>
                        <p className="text-offWhite-300 mb-4 text-sm leading-relaxed">
                          모듈 10: 유튜브, 인스타그램 동시 업로드 봇<br/>
                          영상 1개로 주요 플랫폼 자동 배포!
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-sm">✓</span>
                          <span className="text-sm font-medium text-green-400">실제 사용 가능한 수준</span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 rounded-2xl p-6 border border-yellow-500/40 backdrop-blur-sm hover:border-yellow-500/60 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-lg">📝</span>
                          </div>
                          <h4 className="text-lg font-bold text-yellow-400">
                            텍스트 콘텐츠 자동화
                          </h4>
                        </div>
                        <p className="text-offWhite-300 mb-4 text-sm leading-relaxed">
                          모듈 11-12: 네이버 블로그와 쓰레드 포스팅 봇<br/>
                          간단한 설정으로 정기 포스팅 자동화
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm">⏰</span>
                          <span className="text-sm font-medium text-yellow-400">일주일에 2-3시간 절약</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 14-16: Real Projects */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      💎 STEP 3: 실전 프로젝트 (모듈 14-16)
                    </h3>
                    
                    {/* SaaS 구축 과정 3시간 타임라인 시각화 */}
                    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                      <div className="p-6">
                        {/* 타임라인 헤더 */}
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-bold text-purple-400 mb-2">SaaS 3시간 완성 타임라인</h4>
                          <p className="text-sm text-offWhite-500">실시간 구축 과정 - 결제 시스템까지 완전 자동화</p>
                        </div>
                        
                        {/* 3단계 개발 프로세스 */}
                        <div className="space-y-4">
                          {/* 1단계: 프로젝트 세팅 */}
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg font-bold">1단계</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-bold text-purple-400 mb-1">프로젝트 세팅 & 기본 구조</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-offWhite-400">
                                <span>• Next.js 프로젝트 생성</span>
                                <span>• Supabase 데이터베이스 연동</span>
                                <span>• 회원가입/로그인 시스템</span>
                                <span>• 기본 대시보드 레이아웃</span>
                              </div>
                              <p className="text-xs text-purple-300 mt-2">⏱️ 약 1시간 소요</p>
                            </div>
                            <div className="bg-green-500/20 px-3 py-1 rounded-full">
                              <span className="text-green-400 text-xs font-bold">✓ 완료</span>
                            </div>
                          </div>

                          {/* 2단계: 핵심 기능 개발 */}
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-lg border border-cyan-500/30">
                            <div className="w-16 h-16 bg-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg font-bold">2단계</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-bold text-cyan-400 mb-1">핵심 비즈니스 로직 개발</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-offWhite-400">
                                <span>• 사용자 관리 시스템</span>
                                <span>• 데이터베이스 설계</span>
                                <span>• API 엔드포인트 구축</span>
                                <span>• 권한 관리 로직</span>
                              </div>
                              <p className="text-xs text-cyan-300 mt-2">⏱️ 약 1시간 소요</p>
                            </div>
                            <div className="bg-yellow-500/20 px-3 py-1 rounded-full">
                              <span className="text-yellow-400 text-xs font-bold">⏳ 진행 중</span>
                            </div>
                          </div>

                          {/* 3단계: 결제 & 배포 */}
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded-lg border border-indigo-500/30">
                            <div className="w-16 h-16 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg font-bold">3단계</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-bold text-indigo-400 mb-1">결제 시스템 & 실서비스 배포</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-offWhite-400">
                                <span>• 스트라이프 결제 연동</span>
                                <span>• 구독 관리 시스템</span>
                                <span>• 커스텀 도메인 연결</span>
                                <span>• SSL 인증서 & 보안 설정</span>
                              </div>
                              <p className="text-xs text-indigo-300 mt-2">⏱️ 약 1시간 소요</p>
                            </div>
                            <div className="bg-gray-500/20 px-3 py-1 rounded-full">
                              <span className="text-gray-400 text-xs font-bold">⏰ 대기</span>
                            </div>
                          </div>
                        </div>

                        {/* 기능 모듈 조립식 표현 */}
                        <div className="mt-8">
                          <h5 className="text-sm font-bold text-purple-400 mb-4 text-center">🧩 조립식 SaaS 모듈</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* 인증 모듈 */}
                            <div className="bg-deepBlack-700/50 rounded-lg p-3 border border-purple-500/30 text-center">
                              <div className="text-lg mb-1">🔐</div>
                              <p className="text-xs font-semibold text-purple-400">인증</p>
                              <p className="text-xs text-green-400">✓ 장착 완료</p>
                            </div>
                            
                            {/* 결제 모듈 */}
                            <div className="bg-deepBlack-700/50 rounded-lg p-3 border border-cyan-500/30 text-center">
                              <div className="text-lg mb-1">💳</div>
                              <p className="text-xs font-semibold text-cyan-400">결제</p>
                              <p className="text-xs text-yellow-400">⏳ 설치 중</p>
                            </div>
                            
                            {/* 대시보드 모듈 */}
                            <div className="bg-deepBlack-700/50 rounded-lg p-3 border border-indigo-500/30 text-center">
                              <div className="text-lg mb-1">📊</div>
                              <p className="text-xs font-semibold text-indigo-400">대시보드</p>
                              <p className="text-xs text-green-400">✓ 장착 완료</p>
                            </div>
                            
                            {/* API 모듈 */}
                            <div className="bg-deepBlack-700/50 rounded-lg p-3 border border-purple-500/30 text-center">
                              <div className="text-lg mb-1">🔗</div>
                              <p className="text-xs font-semibold text-purple-400">API</p>
                              <p className="text-xs text-green-400">✓ 장착 완료</p>
                            </div>
                          </div>
                        </div>

                        {/* 실제 완성 사례 목업 */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg border border-purple-500/30">
                          <div className="text-center mb-3">
                            <p className="text-sm font-bold text-purple-400">완성된 SaaS 화면 미리보기</p>
                          </div>
                          <div className="bg-deepBlack-800/80 rounded-lg p-4 border border-purple-500/20">
                            {/* 가상 SaaS 인터페이스 */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-purple-400">📈 AI 마케팅 도구 SaaS</span>
                                <span className="text-xs text-green-400">● 실시간 운영 중</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-purple-500/20 p-2 rounded text-center">
                                  <p className="text-purple-400 font-bold">142</p>
                                  <p className="text-offWhite-500">구독자</p>
                                </div>
                                <div className="bg-cyan-500/20 p-2 rounded text-center">
                                  <p className="text-cyan-400 font-bold">₩89,000</p>
                                  <p className="text-offWhite-500">월 매출</p>
                                </div>
                                <div className="bg-green-500/20 p-2 rounded text-center">
                                  <p className="text-green-400 font-bold">96%</p>
                                  <p className="text-offWhite-500">가동률</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 하단 설명 */}
                      <div className="bg-deepBlack-700/30 px-4 py-3 border-t border-purple-500/20">
                        <p className="text-center text-sm text-offWhite-300 font-medium">
                          ⚡ 3시간 완성: 아이디어 → 수익 창출 SaaS 서비스
                        </p>
                        <p className="text-center text-xs text-offWhite-500 mt-1">
                          기업이 몇 달 걸려 만드는 수준을 <span className="text-purple-400 font-bold">180분</span>만에 완성
                        </p>
                      </div>
                    </div>

                    <div className="bg-deepBlack-600/30 rounded-xl p-4 mb-6 border border-metallicGold-500/10">
                      <h4 className="text-base font-semibold text-offWhite-300 mb-3">
                        실전 프로젝트 타임라인
                      </h4>
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-metallicGold-400 font-bold">모듈 14</span>
                          <span className="text-offWhite-500 ml-1">회사 사이트</span>
                        </div>
                        <div>
                          <span className="text-metallicGold-400 font-bold">모듈 15</span>
                          <span className="text-offWhite-500 ml-1">SaaS 사이트</span>
                        </div>
                        <div>
                          <span className="text-metallicGold-400 font-bold">모듈 16</span>
                          <span className="text-offWhite-500 ml-1">Supabase</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 17-20: Advanced */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      🧠 STEP 4: 고급 기술 (모듈 17-20)
                    </h3>
                    
                    {/* JARVIS급 AI 비서 대화 인터페이스 시각화 */}
                    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                      <div className="p-6">
                        {/* 채팅 앱 스타일 헤더 */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl px-4 py-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <span className="text-sm">🤖</span>
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">JARVIS AI 비서</p>
                              <p className="text-blue-100 text-xs">● 온라인 - 즉시 응답 가능</p>
                            </div>
                            <div className="ml-auto text-white/80 text-xs">
                              오후 2:34
                            </div>
                          </div>
                        </div>

                        {/* 실제 대화 시연 */}
                        <div className="bg-deepBlack-800/50 rounded-xl p-4 space-y-4 max-h-80 overflow-y-auto">
                          {/* 사용자 메시지 1 */}
                          <div className="flex justify-end">
                            <div className="bg-blue-500 text-white rounded-xl px-4 py-2 max-w-xs">
                              <p className="text-sm">메일 정리해줘</p>
                              <p className="text-xs text-blue-100 mt-1">14:32</p>
                            </div>
                          </div>

                          {/* AI 응답 1 */}
                          <div className="flex justify-start">
                            <div className="bg-deepBlack-600 text-offWhite-200 rounded-xl px-4 py-2 max-w-xs">
                              <p className="text-sm">네! 이메일을 확인해보겠습니다. 📧</p>
                              <div className="mt-2 text-xs bg-indigo-500/20 rounded p-2">
                                <p className="text-indigo-300">✓ 스팸 메일 15개 자동 삭제</p>
                                <p className="text-green-300">✓ 중요 메일 3개 우선순위 분류</p>
                                <p className="text-yellow-300">✓ 업무 메일 8개 카테고리별 정리</p>
                              </div>
                              <p className="text-xs text-offWhite-500 mt-1">14:32</p>
                            </div>
                          </div>

                          {/* 사용자 메시지 2 */}
                          <div className="flex justify-end">
                            <div className="bg-blue-500 text-white rounded-xl px-4 py-2 max-w-xs">
                              <p className="text-sm">회의 일정도 확인해줘</p>
                              <p className="text-xs text-blue-100 mt-1">14:35</p>
                            </div>
                          </div>

                          {/* AI 응답 2 */}
                          <div className="flex justify-start">
                            <div className="bg-deepBlack-600 text-offWhite-200 rounded-xl px-4 py-2 max-w-xs">
                              <p className="text-sm">오늘 일정을 확인했습니다! 📅</p>
                              <div className="mt-2 text-xs space-y-1">
                                <div className="bg-red-500/20 rounded p-2">
                                  <p className="text-red-300">🚨 오후 3시: 중요 프로젝트 회의</p>
                                  <p className="text-red-200 text-xs">15분 후 시작 - 자료 준비 완료</p>
                                </div>
                                <div className="bg-yellow-500/20 rounded p-2">
                                  <p className="text-yellow-300">⏰ 오후 5시: 팀 미팅</p>
                                  <p className="text-yellow-200 text-xs">Zoom 링크 미리 준비해뒀어요</p>
                                </div>
                              </div>
                              <p className="text-xs text-offWhite-500 mt-1">14:35</p>
                            </div>
                          </div>

                          {/* 사용자 메시지 3 */}
                          <div className="flex justify-end">
                            <div className="bg-blue-500 text-white rounded-xl px-4 py-2 max-w-xs">
                              <p className="text-sm">보고서 작성도 도와줄 수 있어?</p>
                              <p className="text-xs text-blue-100 mt-1">14:37</p>
                            </div>
                          </div>

                          {/* AI 응답 3 */}
                          <div className="flex justify-start">
                            <div className="bg-deepBlack-600 text-offWhite-200 rounded-xl px-4 py-2 max-w-xs">
                              <p className="text-sm">물론이죠! 어떤 보고서인지 알려주세요 📊</p>
                              <div className="mt-2 text-xs bg-purple-500/20 rounded p-2">
                                <p className="text-purple-300">• 데이터 분석 및 시각화</p>
                                <p className="text-purple-300">• 자동 차트 생성</p>
                                <p className="text-purple-300">• PPT 슬라이드 작성</p>
                                <p className="text-purple-300">• 한영 번역 지원</p>
                              </div>
                              <p className="text-xs text-offWhite-500 mt-1">14:37</p>
                            </div>
                          </div>

                          {/* 타이핑 인디케이터 */}
                          <div className="flex justify-start">
                            <div className="bg-deepBlack-600 text-offWhite-400 rounded-xl px-4 py-2">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <span className="text-xs ml-2">AI가 분석 중...</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI 능력 요약 */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                            <div className="text-center">
                              <span className="text-2xl mb-2 block">⚡</span>
                              <p className="text-sm font-bold text-blue-400">즉시 응답</p>
                              <p className="text-xs text-offWhite-500">평균 0.8초 내 처리</p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded-lg p-4 border border-indigo-500/30">
                            <div className="text-center">
                              <span className="text-2xl mb-2 block">🧠</span>
                              <p className="text-sm font-bold text-indigo-400">맥락 이해</p>
                              <p className="text-xs text-offWhite-500">자연스러운 한국어</p>
                            </div>
                          </div>
                        </div>

                        {/* 지원 업무 목록 */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg border border-blue-500/30">
                          <p className="text-sm font-bold text-blue-400 mb-3 text-center">🎯 지원 가능한 업무</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-1">
                              <p className="text-offWhite-300">• 이메일 자동 분류/응답</p>
                              <p className="text-offWhite-300">• 일정 관리 및 알림</p>
                              <p className="text-offWhite-300">• 문서 작성 지원</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-offWhite-300">• 데이터 분석/시각화</p>
                              <p className="text-offWhite-300">• 보고서 자동 생성</p>
                              <p className="text-offWhite-300">• 다국어 번역</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 하단 설명 */}
                      <div className="bg-deepBlack-700/30 px-4 py-3 border-t border-blue-500/20">
                        <p className="text-center text-sm text-offWhite-300 font-medium">
                          🗣️ "메일 정리해줘" → AI가 즉시 분류 및 응답 처리
                        </p>
                        <p className="text-center text-xs text-offWhite-500 mt-1">
                          영화 속 JARVIS처럼 <span className="text-blue-400 font-bold">자연스러운 한국어</span>로 모든 업무 해결
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-6 bg-deepBlack-600/30 rounded-2xl hover:bg-deepBlack-600/50 transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-offWhite-200 mb-2">
                            AI 비서 & RAG 구축
                          </h4>
                          <p className="text-offWhite-400">
                            모듈 17-18: 나만의 AI 비서와 전문가 RAG 시스템
                            PDF 학습한 전문가 AI를 만들어보세요!
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-6 bg-deepBlack-600/30 rounded-2xl hover:bg-deepBlack-600/50 transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📚</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-offWhite-200 mb-2">
                            휴대폰 코딩 & tmux
                          </h4>
                          <p className="text-offWhite-400">
                            모듈 19-20: 휴대폰으로 코딩하고 tmux로 병렬작업
                            언제 어디서나 개발할 수 있는 환경 구축!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 21-30: Mastery */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      🏆 STEP 5: 마스터 되기 (모듈 21-30)
                    </h3>
                    
                    {/* MVP 7일 런칭 프로세스 시각화 */}
                    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                      <div className="p-6">
                        {/* 헤더 */}
                        <div className="text-center mb-6">
                          <h4 className="text-xl font-bold text-emerald-400 mb-2">💡 아이디어 → 🚀 런칭 7일 로드맵</h4>
                          <p className="text-sm text-offWhite-500">실제 고객이 사용하는 서비스까지 완성하는 전체 과정</p>
                        </div>

                        {/* 7일 일정표 */}
                        <div className="space-y-3">
                          {/* DAY 1-2: 아이디어 검증 */}
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-4 border border-emerald-500/30">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">D1</span>
                                </div>
                                <h5 className="text-sm font-bold text-emerald-400">아이디어 검증</h5>
                              </div>
                              <div className="text-xs text-offWhite-400 space-y-1">
                                <p>• 문제 정의 및 타겟 고객 설정</p>
                                <p>• 경쟁 분석 (10분 리서치)</p>
                                <p>• MVP 핵심 기능 1개 선정</p>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-lg p-4 border border-teal-500/30">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">D2</span>
                                </div>
                                <h5 className="text-sm font-bold text-teal-400">프로토타입 제작</h5>
                              </div>
                              <div className="text-xs text-offWhite-400 space-y-1">
                                <p>• Claude Code로 기본 구조 생성</p>
                                <p>• 핵심 기능 1개 구현</p>
                                <p>• 로컬 환경에서 테스트</p>
                              </div>
                            </div>
                          </div>

                          {/* DAY 3-4: 개발 */}
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/30">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">D3</span>
                                </div>
                                <h5 className="text-sm font-bold text-green-400">기능 완성</h5>
                              </div>
                              <div className="text-xs text-offWhite-400 space-y-1">
                                <p>• 회원가입/로그인 시스템</p>
                                <p>• 데이터베이스 연동</p>
                                <p>• 반응형 UI 적용</p>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-lg p-4 border border-cyan-500/30">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">D4</span>
                                </div>
                                <h5 className="text-sm font-bold text-cyan-400">결제 시스템</h5>
                              </div>
                              <div className="text-xs text-offWhite-400 space-y-1">
                                <p>• 스트라이프 결제 연동</p>
                                <p>• 가격 정책 설정</p>
                                <p>• 구독 관리 기능</p>
                              </div>
                            </div>
                          </div>

                          {/* DAY 5-6: 배포 및 테스트 */}
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">D5</span>
                                </div>
                                <h5 className="text-sm font-bold text-blue-400">프로덕션 배포</h5>
                              </div>
                              <div className="text-xs text-offWhite-400 space-y-1">
                                <p>• Vercel 실서비스 배포</p>
                                <p>• 도메인 연결 (my-idea.com)</p>
                                <p>• SSL 인증서 적용</p>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">D6</span>
                                </div>
                                <h5 className="text-sm font-bold text-purple-400">베타 테스트</h5>
                              </div>
                              <div className="text-xs text-offWhite-400 space-y-1">
                                <p>• 지인 5명 테스트 참여</p>
                                <p>• 피드백 수집 및 개선</p>
                                <p>• 최종 버그 수정</p>
                              </div>
                            </div>
                          </div>

                          {/* DAY 7: 런칭 */}
                          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">D7</span>
                              </div>
                              <div className="flex-1">
                                <h5 className="text-base font-bold text-yellow-400 mb-1">🚀 공식 런칭!</h5>
                                <div className="grid md:grid-cols-3 gap-2 text-xs text-offWhite-400">
                                  <span>• SNS 마케팅 시작</span>
                                  <span>• 첫 고객 유치</span>
                                  <span>• 수익 모델 검증</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 실제 성과 이정표 */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                          <h5 className="text-sm font-bold text-emerald-400 mb-4 text-center">📊 런칭 7일 후 실제 성과</h5>
                          
                          {/* 진화 과정 시각화 */}
                          <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                <span className="text-2xl">💡</span>
                              </div>
                              <p className="text-xs font-bold text-gray-400">DAY 1</p>
                              <p className="text-xs text-offWhite-500">아이디어 스케치</p>
                            </div>
                            
                            <div className="text-center">
                              <div className="w-16 h-16 bg-emerald-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                <span className="text-2xl">🌐</span>
                              </div>
                              <p className="text-xs font-bold text-emerald-400">DAY 7</p>
                              <p className="text-xs text-offWhite-500">실제 웹사이트</p>
                            </div>
                            
                            <div className="text-center">
                              <div className="w-16 h-16 bg-yellow-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                              </div>
                              <p className="text-xs font-bold text-yellow-400">DAY 14</p>
                              <p className="text-xs text-offWhite-500">첫 수익 발생</p>
                            </div>
                          </div>

                          {/* 실제 성과 수치 */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-deepBlack-700/50 rounded-lg p-3">
                              <p className="text-lg font-bold text-emerald-400">12</p>
                              <p className="text-xs text-offWhite-500">첫 고객 수</p>
                            </div>
                            <div className="bg-deepBlack-700/50 rounded-lg p-3">
                              <p className="text-lg font-bold text-teal-400">₩47,000</p>
                              <p className="text-xs text-offWhite-500">첫 주 매출</p>
                            </div>
                            <div className="bg-deepBlack-700/50 rounded-lg p-3">
                              <p className="text-lg font-bold text-yellow-400">98%</p>
                              <p className="text-xs text-offWhite-500">서비스 가동률</p>
                            </div>
                          </div>
                        </div>

                        {/* 핵심 학습 포인트 */}
                        <div className="mt-6 p-4 bg-deepBlack-700/50 rounded-lg border border-emerald-500/20">
                          <p className="text-sm font-bold text-emerald-400 mb-2 text-center">🎯 7일 런칭의 핵심</p>
                          <div className="grid md:grid-cols-2 gap-2 text-xs text-offWhite-400">
                            <div className="space-y-1">
                              <p>• 완벽함보다 빠른 검증</p>
                              <p>• 핵심 기능 1개에 집중</p>
                            </div>
                            <div className="space-y-1">
                              <p>• 실제 고객 피드백 우선</p>
                              <p>• 점진적 기능 추가</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 하단 설명 */}
                      <div className="bg-deepBlack-700/30 px-4 py-3 border-t border-emerald-500/20">
                        <p className="text-center text-sm text-offWhite-300 font-medium">
                          🎯 DAY 1: 아이디어 → DAY 7: 실제 수익 서비스 런칭
                        </p>
                        <p className="text-center text-xs text-offWhite-500 mt-1">
                          <span className="text-emerald-400 font-bold">스타트업 수준</span>의 완성도로 일주일만에 실제 고객을 받는 서비스 완성
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl p-8 border border-metallicGold-500/30">
                      <h4 className="text-2xl font-bold text-metallicGold-500 mb-4">
                        AI 시대를 활용할 수 있게 됩니다
                      </h4>
                      <p className="text-lg text-offWhite-300 mb-6">
                        모듈 21-30: CLAUDE.md 작성법, 컨텍스트 한계 뚫기, 프레임워크 활용,
                        바이브코딩, MVP 런칭, 결제연동, Git worktree 등 고급 기술!
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-bold text-metallicGold-400 mb-2">배우게 될 핵심 기술</h5>
                          <ul className="space-y-1 text-sm text-offWhite-400">
                            <li>• 바이브코딩 철학과 실전 적용</li>
                            <li>• 30분 만에 결제 시스템 연동</li>
                            <li>• Git worktree 고급 활용법</li>
                            <li>• Claude Code 200% 활용법</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-bold text-metallicGold-400 mb-2">졸업 후 당신의 모습</h5>
                          <ul className="space-y-1 text-sm text-offWhite-400">
                            <li>• AI 도구 전문가 수준</li>
                            <li>• 자동화 시스템 구축 가능</li>
                            <li>• 어떤 아이디어든 구현 가능</li>
                            <li>• AI 컨설턴트로 활동</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center p-8 bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-3xl border border-metallicGold-500/30"
                  >
                    <h3 className="text-3xl font-bold text-metallicGold-500 mb-4">
                      30개 프로젝트, 13시간으로 포트폴리오 완성
                    </h3>
                    <p className="text-lg text-offWhite-300 mb-6">
                      더 이상 망설이지 마세요. 지금이 시작할 최고의 타이밍입니다.
                    </p>
                    <div className="text-4xl font-bold text-metallicGold-500 mb-2">
                      단 149,000원
                    </div>
                    <p className="text-sm text-offWhite-500 line-through mb-6">
                      정가 899,000원
                    </p>
                  </motion.div>
                </motion.div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/40 to-deepBlack-900" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <EnhancedModuleAccordion modules={masterCourse.modules} />
          </div>
        </section>

        {/* Recommended For Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/30 to-deepBlack-900" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-2xl font-bold text-offWhite-200 mb-6">
              이런 분들께 추천합니다
            </h2>
            <div className="space-y-4">
              {[
                '비싼 강의료에 지친 직장인',
                'AI로 자동화 비즈니스를 시작하고 싶은 사업가',
                '코딩 없이 프로그램을 만들고 싶은 비개발자',
                '시간과 장소에 구애받지 않고 일하고 싶은 프리랜서',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-offWhite-300 text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/40 to-deepBlack-900" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <FAQSection
              faqs={sampleFAQs}
            />
          </div>
        </section>

        {/* Floating Bottom Card Navigation */}
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-deepBlack-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-metallicGold-500/30 overflow-hidden">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left: Heart + Course Info */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-lg flex items-center justify-center border border-metallicGold-500/30">
                    <img 
                      src="/images/떡상연구소_로고/누끼_떡상연구소.png" 
                      alt="떡상연구소" 
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-offWhite-200">
                      Claude Code CLI 사전예약 3일 특가 → {masterCourse.discount}% OFF
                    </p>
                    <p className="text-xs text-offWhite-500">
                      <span className="line-through">₩{masterCourse.originalPrice.toLocaleString()}</span>
                      <span className="ml-2 font-bold text-metallicGold-400">₩{masterCourse.price.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                
                {/* Center: Timer */}
                <div className="text-center mt-2">
                  <div className="flex items-center gap-1 text-sm font-mono text-offWhite-200">
                    <span className="text-xs text-offWhite-500 mr-1">마감까지</span>
                    <span className="font-bold text-metallicGold-400">{timeLeft.days}</span>
                    <span className="text-xs text-offWhite-500">일</span>
                    <span className="font-bold text-metallicGold-400 mx-1">{timeLeft.hours}</span>
                    <span className="text-xs text-offWhite-500">시간</span>
                    <span className="font-bold text-metallicGold-400 mx-1">{timeLeft.minutes}</span>
                    <span className="text-xs text-offWhite-500">분</span>
                    <span className="font-bold text-metallicGold-400 mx-1">{timeLeft.seconds}</span>
                    <span className="text-xs text-offWhite-500">초</span>
                    <span className="font-bold text-metallicGold-400 mx-1">{String(timeLeft.milliseconds).padStart(2, '0')}</span>
                    <span className="text-xs text-offWhite-500">ms</span>
                  </div>
                </div>
                
                {/* Right: CTA Button */}
                <a
                  href="https://forms.gle/YSDJAUKC4kbovysTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-700 hover:from-metallicGold-400 hover:to-metallicGold-600 text-deepBlack-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-metallicGold-500/25"
                >
                  🚀 사전예약 신청
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pb-32">
          <Footer />
        </div>
      </div>
    </div>
  );
}