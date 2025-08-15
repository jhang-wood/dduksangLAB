'use client';

import { useState, useEffect, useCallback } from 'react';
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
  
  // 임시로 useAuth 비활성화
  const authLoading = false;

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

                    {/* GIF placeholder for GitHub */}
                    <div className="mb-8 p-8 bg-deepBlack-600/50 rounded-2xl border-2 border-dashed border-metallicGold-500/30">
                      <p className="text-center text-metallicGold-500 font-bold mb-2">
                        [GIF 추천: GitHub Actions 자동 배포]
                      </p>
                      <p className="text-center text-sm text-offWhite-500">
                        코드 푸시하면 자동으로 웹사이트가 배포되는 마법 같은 과정
                      </p>
                    </div>
                  </div>

                  {/* Module 10-13: Automation */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      ⚡ STEP 2: 자동화 봇 만들기 (모듈 10-13)
                    </h3>
                    
                    {/* GIF placeholder for automation */}
                    <div className="mb-8 p-8 bg-deepBlack-600/50 rounded-2xl border-2 border-dashed border-metallicGold-500/30">
                      <p className="text-center text-metallicGold-500 font-bold mb-2">
                        [GIF 추천: 숏폼 자동 업로드 시연]
                      </p>
                      <p className="text-center text-sm text-offWhite-500">
                        1개 영상이 유튜브, 틱톡, 인스타 동시 업로드되는 장면
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-500/10 to-green-900/10 rounded-2xl p-6 border border-green-500/30">
                        <h4 className="text-xl font-bold text-green-400 mb-3">
                          숏폼 & n8n 자동화
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          모듈 10, 13: 숏폼 자동 업로드와 n8n 워크플로우
                          한번 설정하면 모든 것이 자동으로!
                        </p>
                        <div className="text-2xl font-bold text-green-400">
                          멀티 플랫폼 배포
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 rounded-2xl p-6 border border-yellow-500/30">
                        <h4 className="text-xl font-bold text-yellow-400 mb-3">
                          블로그 & 쓰레드 자동화
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          모듈 11-12: 네이버 블로그와 쓰레드 포스팅 봇
                          AI가 알아서 글을 써서 업로드합니다.
                        </p>
                        <div className="text-2xl font-bold text-yellow-400">
                          완전 자동화 시스템
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 14-16: Real Projects */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      💎 STEP 3: 실전 프로젝트 (모듈 14-16)
                    </h3>
                    
                    {/* GIF placeholder for SaaS */}
                    <div className="mb-8 p-8 bg-deepBlack-600/50 rounded-2xl border-2 border-dashed border-metallicGold-500/30">
                      <p className="text-center text-metallicGold-500 font-bold mb-2">
                        [GIF 추천: SaaS 사이트 실시간 구축]
                      </p>
                      <p className="text-center text-sm text-offWhite-500">
                        결제 시스템, 회원가입, 대시보드가 3시간 만에 완성되는 과정
                      </p>
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
                    
                    {/* GIF placeholder for AI Assistant */}
                    <div className="mb-8 p-8 bg-deepBlack-600/50 rounded-2xl border-2 border-dashed border-metallicGold-500/30">
                      <p className="text-center text-metallicGold-500 font-bold mb-2">
                        [GIF 추천: AI 비서 대화 시연]
                      </p>
                      <p className="text-center text-sm text-offWhite-500">
                        자연스러운 한국어로 대화하며 복잡한 작업을 처리하는 AI 비서
                      </p>
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
                    
                    {/* GIF placeholder for MVP */}
                    <div className="mb-8 p-8 bg-deepBlack-600/50 rounded-2xl border-2 border-dashed border-metallicGold-500/30">
                      <p className="text-center text-metallicGold-500 font-bold mb-2">
                        [GIF 추천: MVP 런칭 전 과정]
                      </p>
                      <p className="text-center text-sm text-offWhite-500">
                        아이디어에서 실제 서비스 런칭까지 1주일 타임랩스
                      </p>
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

        {/* Fixed Bottom Navigation Bar with Timer */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-deepBlack-900/95 backdrop-blur-md border-t border-metallicGold-900/30 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Pre-order Timer */}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-500/30 mb-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-red-400">🔥 사전예약 마감임박</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm font-mono">
                <div className="bg-metallicGold-500/20 px-2 py-1 rounded border border-metallicGold-500/50">
                  <span className="text-metallicGold-400 font-bold">23</span>
                  <span className="text-offWhite-500 text-xs ml-1">시간</span>
                </div>
                <span className="text-offWhite-500">:</span>
                <div className="bg-metallicGold-500/20 px-2 py-1 rounded border border-metallicGold-500/50">
                  <span className="text-metallicGold-400 font-bold">59</span>
                  <span className="text-offWhite-500 text-xs ml-1">분</span>
                </div>
                <span className="text-offWhite-500">:</span>
                <div className="bg-metallicGold-500/20 px-2 py-1 rounded border border-metallicGold-500/50">
                  <span className="text-metallicGold-400 font-bold">42</span>
                  <span className="text-offWhite-500 text-xs ml-1">초</span>
                </div>
              </div>
            </div>
            
            {/* Price and Button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-offWhite-500 line-through">
                  ₩{masterCourse.originalPrice.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-metallicGold-500">
                    ₩{masterCourse.price.toLocaleString()}
                  </p>
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                    {masterCourse.discount}% OFF
                  </span>
                </div>
              </div>
              <a
                href="https://forms.gle/YSDJAUKC4kbovysTA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-lg hover:shadow-metallicGold-500/25"
              >
                🚀 사전예약 신청하기
              </a>
            </div>
          </div>
        </div>
        
        <div className="pb-20">
          <Footer />
        </div>
      </div>
    </div>
  );
}