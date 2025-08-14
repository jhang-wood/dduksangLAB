'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Timer,
  Target,
  MessageSquare,
  Zap,
  Brain,
  Rocket,
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';
import { FAQSection, sampleFAQs } from '@/components/FAQSection';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import AILeadersCards from '@/components/AILeadersCards';
// import VibeCodingShowcase from '@/components/VibeCodingShowcase';
import EnhancedModuleAccordion from '@/components/EnhancedModuleAccordion';
import StickyPriceCard from '@/components/StickyPriceCard';
import ClaudeHeroSection from '@/components/ClaudeHeroSection';
import ProjectGallery from '@/components/ProjectGallery';
import LearningMethodSection from '@/components/LearningMethodSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import InstructorSection from '@/components/InstructorSection';

// Claude Code CLI 마스터과정 데이터
const masterCourse = {
  id: 'claude-code-master',
  title: '비개발자도 Claude Code CLI 하나로 모든 것을 다한다!',
  subtitle: '코딩 몰라도 AI로 프로그램 만들기',
  description:
    '비개발자를 위한 Claude Code CLI 완벽 마스터 과정. 복잡한 개발 지식 없이도 AI를 활용해 자동화 프로그램과 웹사이트를 만들 수 있습니다.',
  instructor_name: '떡상연구소',
  duration: 1620, // 27시간 (27개 모듈 x 60분)
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
    { id: 1, title: '기초 개발환경 세팅', duration: '60분', completed: false },
    { id: 2, title: '한줄 명령으로 세팅하는 MCP', duration: '60분', completed: false },
    { id: 3, title: 'GitHub 이해하기', duration: '60분', completed: false },
    { id: 4, title: 'Docker 이해하기', duration: '60분', completed: false },
    { id: 5, title: '서브에이전트 간의 협업', duration: '60분', completed: false },
    { id: 6, title: 'Claude Code CLI 자동화 워크플로우', duration: '60분', completed: false },
    { id: 7, title: '숏폼 자동화 업로드', duration: '60분', completed: false },
    { id: 8, title: '네이버 블로그 자동화 포스팅 봇 만들기', duration: '60분', completed: false },
    { id: 9, title: '쓰레드 자동화 포스팅 봇 만들기', duration: '60분', completed: false },
    { id: 10, title: 'n8n 자동화 워크플로우 생성', duration: '60분', completed: false },
    { id: 11, title: '회사 사이트 만들기', duration: '60분', completed: false },
    { id: 12, title: '월구독 SaaS 사이트 만들기', duration: '60분', completed: false },
    { id: 13, title: 'Supabase 완벽 가이드', duration: '60분', completed: false },
    { id: 14, title: '나만의 AI비서 생성', duration: '60분', completed: false },
    { id: 15, title: 'RAG 구축', duration: '60분', completed: false },
    { id: 16, title: '휴대폰 코딩', duration: '60분', completed: false },
    { id: 17, title: '커스텀 tmux 병렬작업', duration: '60분', completed: false },
    { id: 18, title: '최상의 CLAUDE.md 작성법', duration: '60분', completed: false },
    { id: 19, title: 'Claude 컨텍스트 한계 뚫기', duration: '60분', completed: false },
    { id: 20, title: 'GitHub 인기 프레임워크 장착하고 커스텀하기', duration: '60분', completed: false },
    { id: 21, title: '바이브코딩의 진짜 바이브 감 잡기', duration: '60분', completed: false },
    { id: 22, title: 'MVP 초고속 런칭 절차', duration: '60분', completed: false },
    { id: 23, title: '내 사이트에 초고속 결제연동', duration: '60분', completed: false },
    { id: 24, title: '프레임워크 선정법 (Ruby on Rails, Next.js 등)', duration: '60분', completed: false },
    { id: 25, title: '최적의 폴더구조 및 작업플로우', duration: '60분', completed: false },
    { id: 26, title: 'Git worktree와 관련 프레임워크', duration: '60분', completed: false },
    { id: 27, title: '클로드코드를 천재적으로 만드는 공식', duration: '60분', completed: false },
  ],
};

export default function LecturesPage() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const checkEnrollment = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('lecture_enrollments')
        .select('lecture_id')
        .eq('user_id', user.id)
        .eq('lecture_id', masterCourse.id)
        .single();

      if (data) {
        setIsEnrolled(true);
      }
    } catch (error) {
      setIsEnrolled(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void checkEnrollment();
  }, [checkEnrollment]);

  const handleEnrollClick = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push(`/lectures/${masterCourse.id}/preview`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="lectures" />
        
        {/* Main Content Container with 2 Columns */}
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Main Content - Expanded */}
            <div className="flex-1 lg:max-w-5xl">
              {/* Claude Hero Section */}
              <ClaudeHeroSection />

              {/* Project Gallery - 실제로 만들 수 있는 것들 */}
              <ProjectGallery />
              
              {/* Before/After Section - 학습 전후 비교 (앞으로 이동) */}
              <BeforeAfterSection />

              {/* Learning Method Section - 학습 방식 소개 */}
              <LearningMethodSection />
              
              {/* Instructor Section - 강사 소개 (앞으로 이동) */}
              <InstructorSection />
              
              {/* Vibe Coding Showcase */}
              {/* <VibeCodingShowcase /> */}

              {/* Solution Section (앞으로 이동) */}
              <section className="py-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                        27개 실습 프로젝트로 완성하는 포트폴리오
                      </span>
                    </h2>
                    <p className="text-lg text-offWhite-500">
                      매 프로젝트마다 실제 배포까지 - 이론 없이 바로 만들기
                    </p>
                  </div>

                  {/* Project 1-2: Getting Started */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      🚀 STEP 1: 시작하기 (프로젝트 1-2)
                    </h3>
                    
                    {/* GIF placeholder for setup */}
                    <div className="mb-8 p-8 bg-deepBlack-600/50 rounded-2xl border-2 border-dashed border-metallicGold-500/30">
                      <p className="text-center text-metallicGold-500 font-bold mb-2">
                        [GIF 추천: 개발환경 세팅 과정]
                      </p>
                      <p className="text-center text-sm text-offWhite-500">
                        VS Code 설치부터 Claude Code CLI 설정까지 10분 만에 완료하는 모습
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-deepBlack-600/30 rounded-2xl p-6">
                        <h4 className="text-xl font-bold text-offWhite-200 mb-3">
                          기초 개발환경 세팅
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          Windows, Mac, Linux 어떤 환경이든 10분이면 완벽 세팅! 
                          복잡한 설정 없이 한 번에 모든 도구를 설치합니다.
                        </p>
                        <ul className="space-y-2 text-sm text-offWhite-500">
                          <li>• VS Code 자동 설치 및 최적화</li>
                          <li>• Node.js & npm 원클릭 설정</li>
                          <li>• Git 자동 구성</li>
                        </ul>
                      </div>
                      
                      <div className="bg-deepBlack-600/30 rounded-2xl p-6">
                        <h4 className="text-xl font-bold text-offWhite-200 mb-3">
                          한줄 명령으로 세팅하는 MCP
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          복잡하기로 유명한 MCP를 단 한 줄 명령어로 설치! 
                          이것만으로도 수강료가 아깝지 않습니다.
                        </p>
                        <ul className="space-y-2 text-sm text-offWhite-500">
                          <li>• 20개 MCP 서버 자동 설치</li>
                          <li>• Notion, Supabase 즉시 연동</li>
                          <li>• 환경변수 자동 설정</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Project 3-6: Foundation */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      🏗️ STEP 2: 기초 다지기 (프로젝트 3-6)
                    </h3>
                    
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-8">
                      <p className="text-lg text-offWhite-300 mb-4">
                        <span className="text-metallicGold-500 font-bold">"개발자가 1년 걸려 배울 것을 1주일 만에"</span>
                      </p>
                      <p className="text-offWhite-400">
                        GitHub, Docker, 서브에이전트... 어려워 보이는 개념들을 
                        비개발자도 이해할 수 있게 쉽게 풀어드립니다.
                      </p>
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

                  {/* Module 7-10: Automation */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      ⚡ STEP 3: 자동화 봇 만들기 (프로젝트 7-10)
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
                          콘텐츠 자동화의 정점
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          숏폼 1개 만들면 10개 플랫폼에 자동 배포! 
                          월 1000개 콘텐츠도 혼자서 관리 가능합니다.
                        </p>
                        <div className="text-2xl font-bold text-green-400">
                          월 평균 조회수 1000만 달성
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 rounded-2xl p-6 border border-yellow-500/30">
                        <h4 className="text-xl font-bold text-yellow-400 mb-3">
                          블로그 수익화 자동화
                        </h4>
                        <p className="text-offWhite-400 mb-4">
                          네이버 블로그 하루 10개 포스팅 자동화! 
                          SEO 최적화까지 AI가 알아서 처리합니다.
                        </p>
                        <div className="text-2xl font-bold text-yellow-400">
                          월 평균 수익 100만원+
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 11-13: Real Projects */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      💎 STEP 4: 실전 프로젝트 (프로젝트 11-13)
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

                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 mb-8">
                      <h4 className="text-2xl font-bold text-purple-400 mb-4">
                        회사 사이트부터 SaaS까지, 모든 것을 만들 수 있습니다
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-400">3시간</div>
                          <p className="text-sm text-offWhite-500">회사 사이트 완성</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-400">1주일</div>
                          <p className="text-sm text-offWhite-500">SaaS 플랫폼 런칭</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-400">월 1000만원</div>
                          <p className="text-sm text-offWhite-500">평균 수익</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 14-20: Advanced */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      🧠 STEP 5: 고급 기술 (프로젝트 14-20)
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
                            나만의 AI 비서 만들기
                          </h4>
                          <p className="text-offWhite-400">
                            JARVIS처럼 모든 업무를 처리하는 개인 AI 비서를 만듭니다. 
                            이메일 응답, 일정 관리, 문서 작성까지 완전 자동화!
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-6 bg-deepBlack-600/30 rounded-2xl hover:bg-deepBlack-600/50 transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📚</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-offWhite-200 mb-2">
                            RAG 시스템 구축
                          </h4>
                          <p className="text-offWhite-400">
                            PDF 1000개를 학습한 전문가 AI를 만듭니다. 
                            법률, 의료, 금융 등 전문 분야 AI 컨설턴트 구축!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module 21-27: Mastery */}
                  <div className="mb-16">
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">
                      🏆 STEP 6: 마스터 되기 (프로젝트 21-27)
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
                        당신도 AI 개발의 정점에 서게 됩니다
                      </h4>
                      <p className="text-lg text-offWhite-300 mb-6">
                        바이브코딩의 진수, MVP 초고속 런칭, 결제 시스템 연동... 
                        실리콘밸리 개발자들의 비밀 노하우를 모두 전수합니다.
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
                            <li>• AI 스타트업 CTO 수준</li>
                            <li>• 월 1000만원 자동 수익</li>
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
                      27개 프로젝트, 27시간으로 포트폴리오 완성
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
              </section>

              {/* AI Leaders Cards - 왜 지금 시작해야 하는가 */}
              <AILeadersCards />

              {/* Curriculum Section - Simplified */}
              <section className="py-16">
                <EnhancedModuleAccordion modules={masterCourse.modules} />
              </section>

              {/* Recommended For Section */}
              <section className="py-16">
                <h2 className="text-3xl font-bold text-offWhite-200 mb-8">
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
                      <span className="text-offWhite-300 text-lg">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <FAQSection
                faqs={sampleFAQs}
                className="py-16"
              />
            </div>

            {/* Right Column: Sticky Price Card - Reduced */}
            <div className="lg:block hidden w-[320px] flex-shrink-0">
              <StickyPriceCard
                originalPrice={masterCourse.originalPrice}
                discountedPrice={masterCourse.price}
                isEnrolled={isEnrolled}
                onEnrollClick={handleEnrollClick}
              />
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-deepBlack-900/95 backdrop-blur-md border-t border-metallicGold-900/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-offWhite-500 line-through">
                ₩{masterCourse.originalPrice.toLocaleString()}
              </p>
              <p className="text-xl font-bold text-metallicGold-500">
                ₩{masterCourse.price.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleEnrollClick}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
            >
              수강 신청하기
            </button>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}