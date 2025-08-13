'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Timer,
  Target,
  Shield,
  TrendingUp,
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
import VibeCodingShowcase from '@/components/VibeCodingShowcase';
import RealTimeCounter from '@/components/RealTimeCounter';
import ModuleAccordion from '@/components/ModuleAccordion';
import StickyPriceCard from '@/components/StickyPriceCard';
import ClaudeHeroSection from '@/components/ClaudeHeroSection';

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
  originalPrice: 179000,
  discount: 17,
  category: 'AI',
  level: 'beginner',
  preview_url: '',
  thumbnail_url: '',
  accessPeriod: '1년',
  isFirstLaunch: true,
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
        
        {/* Real-time counter */}
        <RealTimeCounter />
        
        {/* Main Content Container with 2 Columns */}
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Left Column: Main Content */}
            <div className="w-full">
              {/* Claude Hero Section */}
              <ClaudeHeroSection />

              {/* AI Leaders Cards */}
              <AILeadersCards />
              
              {/* Vibe Coding Showcase */}
              <VibeCodingShowcase />

              {/* Pain Points Section */}
              <section className="py-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      <span className="text-red-400">
                        혹시, 아직도 이렇게 시간 낭비하고 계신가요?
                      </span>
                    </h2>
                    <p className="text-lg text-offWhite-500">
                      대부분의 사람들이 빠지기 쉬운 함정들
                    </p>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        icon: AlertTriangle,
                        title: '열심히 하는데 왜 결과가 안나오지?',
                        description:
                          "수많은 사람들이 아직도 Cursor, Replit 같은 '보급형' AI를 쓰고 있습니다.",
                        highlight: '애초에 도구가 다릅니다.',
                      },
                      {
                        icon: Timer,
                        title: '자동화 하려다 노가다만 늘어난다?',
                        description:
                          'Make, n8n 화면에서 마우스로 점 찍고 선 잇는 작업, 그것도 결국 수작업입니다.',
                        highlight: '그 과정 자체를 자동화할 생각은 왜 못했을까요?',
                      },
                      {
                        icon: Brain,
                        title: '코딩, 배워도 배워도 끝이 없다?',
                        description:
                          '비개발자에게 C언어, Java는 독입니다. 우리는 개발자가 될 게 아닙니다.',
                        highlight: '정작 돈 버는 2%의 핵심을 놓치고 있습니다.',
                      },
                    ].map((pain, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <pain.icon className="w-6 h-6 text-red-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-offWhite-200 mb-2">
                              {pain.title}
                            </h3>
                            <p className="text-offWhite-500 mb-3">{pain.description}</p>
                            <p className="text-metallicGold-500 font-bold">{pain.highlight}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* Solution Section */}
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
                        떡상연구소는 '게임의 룰'을 바꿉니다
                      </span>
                    </h2>
                    <p className="text-lg text-offWhite-500">
                      우리의 4가지 원칙으로 당신의 AI 활용 수준을 완전히 다른 차원으로
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {[
                      {
                        icon: Rocket,
                        number: '1',
                        title: '최정상 1%의 AI Toolset',
                        description:
                          "우리는 현존 최강의 성능을 내는 'Claude Code'에 'Super Claude'를 탑재한 우리만의 강화된 AI를 사용합니다.",
                        highlight:
                          '대부분의 사람들이 세팅조차 못하는 이 압도적인 도구를, 당신은 강의 시작 10분 만에 손에 넣게 됩니다.',
                      },
                      {
                        icon: MessageSquare,
                        number: '2',
                        title: "시공간 제약 없는 '텔레그램 코딩'",
                        description:
                          '"지금 아이디어가 떠올랐는데!" 컴퓨터 앞에 앉을 필요 없습니다.',
                        highlight: '생각과 현실화 사이의 딜레이가 0이 됩니다.',
                      },
                      {
                        icon: Zap,
                        number: '3',
                        title: "자동화를 자동화하는 '메타 자동화'",
                        description:
                          'Make, n8n의 수작업은 이제 그만. 우리는 코드로 자동화 설계도 자체를 생성합니다.',
                        highlight:
                          "명령어 한 줄로 복잡한 자동화 시스템을 1분 만에 구축하는 '메타 자동화' 기술입니다.",
                      },
                      {
                        icon: Target,
                        number: '4',
                        title: "비개발자를 위한 '최소 지식 원칙'",
                        description:
                          '저는 천재 개발자가 아닙니다. 오히려 코딩을 못했기 때문에, 누구보다 효율적인 길을 찾아야만 했습니다.',
                        highlight:
                          "이 강의는 개발 지식의 98%를 버리고, 오직 '결과물'을 만드는 데 필요한 2%의 핵심만 다룹니다.",
                      },
                    ].map((solution, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-500/30 hover:border-metallicGold-500/50 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-deepBlack-900">
                              {solution.number}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-metallicGold-500 mb-3">
                              {solution.title}
                            </h3>
                            <p className="text-offWhite-400 mb-3">{solution.description}</p>
                            <p className="text-offWhite-200 font-bold">{solution.highlight}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* Curriculum Section */}
              <section className="py-16">
                <h2 className="text-3xl font-bold text-offWhite-200 mb-8">커리큘럼</h2>
                <ModuleAccordion modules={masterCourse.modules} />
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

            {/* Right Column: Sticky Price Card */}
            <div className="lg:block hidden">
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