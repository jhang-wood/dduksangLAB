'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Check,
  MessageSquare,
  Zap,
  Brain,
  Rocket,
  ArrowRight,
  Gift,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Target,
  Shield,
  TrendingUp,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';
import {
  PricingCard,
  ProgressBar,
  LearningDashboard,
  CourseStatusIcons,
} from '@/components/CourseVisualElements';
import { FAQSection, sampleFAQs } from '@/components/FAQSection';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { PaymentButton } from '@/hooks/usePayment';
import AILeadersQuotes from '@/components/AILeadersQuotes';
import VibeCodingShowcase from '@/components/VibeCodingShowcase';
import CouponSystem from '@/components/CouponSystem';
import RealTimeCounter from '@/components/RealTimeCounter';
import ModuleAccordion from '@/components/ModuleAccordion';

// Claude Code CLI 마스터과정 데이터
const masterCourse = {
  id: 'claude-code-master',
  title: '비개발자도 Claude Code CLI 하나로 모든 것을 다한다!',
  subtitle: '코딩 몰라도 AI로 프로그램 만들기',
  description:
    '비개발자를 위한 Claude Code CLI 완벽 마스터 과정. 복잡한 개발 지식 없이도 AI를 활용해 자동화 프로그램과 웹사이트를 만들 수 있습니다.',
  instructor_name: '떡상연구소',
  duration: 1620, // 27시간 (27개 모듈 x 60분)
  price: 179000,
  originalPrice: 179000,
  discount: 0,
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
  const [showStickyButton, setShowStickyButton] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const checkEnrollment = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if user is enrolled in AI Agent Master course
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
      // User not enrolled
      setIsEnrolled(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void checkEnrollment();
  }, [checkEnrollment]);

  // Sticky button scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 1000; // Show after scrolling 1000px
      setShowStickyButton(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnrollClick = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    // Navigate to course preview/purchase page
    router.push(`/lectures/${masterCourse.id}/preview`);
  };

  const handleContinueLearning = () => {
    router.push(`/lectures/${masterCourse.id}`);
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
        
        {/* Enhanced Hero Section with FastCampus-style layout */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/8 via-deepBlack-900 to-deepBlack-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-deepBlack-900 via-transparent to-deepBlack-900/50" />

          {/* Hero content container */}
          <div className="relative z-10">
            <div className="container mx-auto max-w-7xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                {/* Launch Badge */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-full border border-metallicGold-500/50 mb-12 backdrop-blur-sm"
                >
                  <Sparkles className="w-6 h-6 text-metallicGold-500" />
                  <span className="text-metallicGold-400 font-bold text-lg">
                    🎉 첫 런칭 오픈 특가
                  </span>
                  <Sparkles className="w-6 h-6 text-metallicGold-500" />
                </motion.div>

                {/* Main headline */}
                <h1 className="font-montserrat font-bold mb-12">
                  <span className="block text-offWhite-400 mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                    비개발자도
                  </span>
                  <span className="block bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-none">
                    Claude Code CLI 하나로
                    <br className="sm:hidden" />
                    모든 것을 다한다!
                  </span>
                </h1>

                {/* Subheadline */}
                <div className="max-w-5xl mx-auto mb-10">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-offWhite-400 leading-relaxed mb-8">
                    복잡한 개발 지식 없이도
                    <br className="sm:hidden" />
                    <span className="text-metallicGold-500 font-bold">AI를 활용해</span>
                    <br />
                    <span className="text-metallicGold-500 font-bold">
                      자동화 프로그램과 웹사이트
                    </span>
                    를
                    <br className="sm:hidden" />
                    만드는 방법을 알려드립니다.
                  </p>

                  <p className="text-xl sm:text-2xl md:text-3xl text-offWhite-200 font-bold">
                    코딩을 몰라도 괜찮습니다.
                    <br className="sm:hidden" />
                    <span className="text-metallicGold-500">Claude Code CLI가 모든 것을 해결합니다.</span>
                  </p>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap justify-center items-center gap-8 text-offWhite-500 mb-12">
                  <div className="flex items-center gap-2">
                    <Clock className="text-metallicGold-500" size={20} />
                    <span className="font-medium">27개 실습 모듈</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="text-metallicGold-500" size={20} />
                    <span className="font-medium">1년 수강 기간</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="text-metallicGold-500" size={20} />
                    <span className="font-medium">비개발자 전용</span>
                  </div>
                </div>
                
                {/* Coupon System */}
                <div className="max-w-2xl mx-auto">
                  <CouponSystem 
                    originalPrice={179000}
                    discountedPrice={149000}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI Leaders Quotes */}
        <AILeadersQuotes />
        
        {/* Vibe Coding Showcase */}
        <VibeCodingShowcase />

        {/* Enhanced Pain Points Section with Cards */}
        <section className="py-24 px-4 bg-gradient-to-b from-deepBlack-900 to-deepBlack-300/20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-red-400 leading-tight">
                    혹시, 아직도 이렇게
                    <br className="sm:hidden" /> 시간 낭비하고 계신가요?
                  </span>
                </h2>
                <p className="text-lg text-offWhite-500 max-w-3xl mx-auto">
                  대부분의 사람들이 빠지기 쉬운 함정들을 확인해보세요
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: AlertTriangle,
                    title: '열심히 하는데 왜 결과가 안나오지?',
                    description:
                      "수많은 사람들이 아직도 Cursor, Replit 같은 '보급형' AI를 쓰고 있습니다. 자동차로 비유하면, 당신이 경차로 낑낑댈 때, 누군가는 F1 머신으로 질주하고 있습니다.",
                    highlight: '애초에 도구가 다릅니다.',
                  },
                  {
                    icon: Timer,
                    title: '자동화 하려다 노가다만 늘어난다?',
                    description:
                      'Make, n8n 화면에서 마우스로 점 찍고 선 잇는 작업, 그것도 결국 수작업입니다. 자동화를 만들기 위해 또 다른 노가다를 하는 셈이죠.',
                    highlight: '그 과정 자체를 자동화할 생각은 왜 못했을까요?',
                  },
                  {
                    icon: Brain,
                    title: '코딩, 배워도 배워도 끝이 없다?',
                    description:
                      '비개발자에게 C언어, Java는 독입니다. 우리는 개발자가 될 게 아닙니다. 98%의 불필요한 지식 때문에 정작 돈 버는 2%의 핵심을 놓치고 있습니다.',
                    highlight: '정작 돈 버는 2%의 핵심을 놓치고 있습니다.',
                  },
                ].map((pain, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all group"
                  >
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/30 transition-colors">
                      <pain.icon className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-offWhite-200 mb-4 leading-tight">
                      {pain.title}
                    </h3>
                    <p className="text-offWhite-500 mb-6 leading-relaxed">{pain.description}</p>
                    <div className="border-t border-red-500/20 pt-4">
                      <p className="text-metallicGold-500 font-bold">{pain.highlight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Game Changer Solution Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-deepBlack-300/20 to-deepBlack-900">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                    떡상연구소는 '게임의 룰'을 바꿉니다
                  </span>
                </h2>
                <p className="text-xl text-offWhite-500 max-w-4xl mx-auto leading-relaxed">
                  우리의 4가지 원칙으로 당신의 AI 활용 수준을 완전히 다른 차원으로 끌어올립니다
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
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
                      '"지금 아이디어가 떠올랐는데!" 컴퓨터 앞에 앉을 필요 없습니다. 언제 어디서든 텔레그램 채팅 하나로 아이디어를 즉시 \'바이블 코딩\'하여 프로그램으로 만듭니다.',
                    highlight: '생각과 현실화 사이의 딜레이가 0이 됩니다.',
                  },
                  {
                    icon: Zap,
                    number: '3',
                    title: "자동화를 자동화하는 '메타 자동화'",
                    description:
                      'Make, n8n의 수작업은 이제 그만. 우리는 코드로 자동화 설계도 자체를 생성합니다.',
                    highlight:
                      "마우스 클릭이 아닌, 명령어 한 줄로 복잡한 자동화 시스템을 1분 만에 구축하는 '메타 자동화' 기술입니다.",
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
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-8 border border-metallicGold-500/30 hover:border-metallicGold-500/50 transition-all group"
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span className="text-3xl font-bold text-deepBlack-900">
                          {solution.number}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-metallicGold-500 mb-3 group-hover:text-metallicGold-400 transition-colors">
                          {solution.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-offWhite-400 mb-6 leading-relaxed">{solution.description}</p>
                    <div className="border-t border-metallicGold-500/20 pt-4">
                      <p className="text-offWhite-200 font-bold">{solution.highlight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* What You'll Steal Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-deepBlack-900 to-deepBlack-300/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                <span className="text-offWhite-200">이번 무료 강의에서 당신이</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  '훔쳐 갈' 3가지 비법
                </span>
              </h2>
              <p className="text-xl text-center text-offWhite-500 mb-16">
                이것만 알아도 당신은 더 이상 '정보의 소비자'가 아닌 '정보의 지배자'가 됩니다
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: Brain,
                    number: '1️⃣',
                    title: "고가 강의 '자동 분석 시스템' 구축법",
                    description:
                      '300만원짜리 강의 결제 대신, AI에게 강의 내용을 분석시켜 핵심 커리큘럼과 노하우만 추출하는 시스템을 직접 만듭니다.',
                    highlight: "더 이상 정보의 소비자가 아닌, 정보의 '지배자'가 되십시오.",
                  },
                  {
                    icon: MessageSquare,
                    number: '2️⃣',
                    title: "생각만 하면 프로그램이 나오는 '텔레그램 바이블 코딩'",
                    description:
                      '복잡한 개발 환경 없이, 스마트폰 텔레그램으로 명령만 내리면 AI가 즉시 실행 가능한 프로그램을 만들어냅니다.',
                    highlight:
                      '출퇴근 지하철에서도 월 천만원 짜리 자동화 프로그램을 뚝딱 만들어낼 수 있습니다.',
                  },
                  {
                    icon: Zap,
                    number: '3️⃣',
                    title: "밥 먹듯이 EXE 뽑아내는 '메타 자동화' 설계도",
                    description:
                      '아이디어만 있으면 클릭 몇 번에 자동화 프로그램(EXE), 웹사이트가 튀어나오는 경험을 하게 됩니다.',
                    highlight: "이는 당신이 평생 써먹을 '디지털 건물'을 짓는 능력입니다.",
                  },
                ].map((secret, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-deepBlack-600/50 rounded-2xl p-8 border border-metallicGold-500/20 hover:border-metallicGold-500/40 transition-all"
                  >
                    <div className="flex items-start gap-6">
                      <div className="text-4xl">{secret.number}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-metallicGold-500 mb-4">
                          {secret.title}
                        </h3>
                        <p className="text-lg text-offWhite-400 mb-4">{secret.description}</p>
                        <p className="text-lg text-offWhite-200 font-bold">{secret.highlight}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>


        {/* Main Course Display */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Course Details */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* 강화된 가격 카드 */}
                <PricingCard
                  originalPrice={masterCourse.originalPrice}
                  discountPrice={masterCourse.price}
                  discountPercent={masterCourse.discount}
                  isLimited={true}
                  dDay={7}
                  className="mb-8"
                />

                {/* 결제 버튼 및 강의 상태 아이콘 */}
                <div className="bg-deepBlack-300/50 rounded-2xl p-6 border border-metallicGold-500/20 mb-8">
                  {isEnrolled ? (
                    <button
                      onClick={handleContinueLearning}
                      className="w-full px-8 py-4 bg-green-500/20 text-green-400 rounded-xl font-bold text-lg border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 mb-6"
                    >
                      <Check size={20} />
                      학습 계속하기
                    </button>
                  ) : user ? (
                    <PaymentButton
                      lectureId={masterCourse.id}
                      price={masterCourse.price}
                      className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all mb-6"
                    >
                      <ShoppingCart size={20} className="inline mr-2" />
                      지금 수강 신청하기
                    </PaymentButton>
                  ) : (
                    <button
                      onClick={handleEnrollClick}
                      className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all mb-6"
                    >
                      로그인하고 수강 신청하기
                    </button>
                  )}

                  {/* 강의 특징 아이콘 */}
                  <CourseStatusIcons
                    isOnline={true}
                    hasSubtitles={true}
                    hasCommunity={true}
                    hasCertificate={true}
                    isUnlimited={true}
                    className="mb-6"
                  />

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-metallicGold-900/20">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                        <Flame className="fill-current" size={16} />
                        <span className="font-bold">한정</span>
                      </div>
                      <p className="text-sm text-offWhite-600">선착순</p>
                    </div>
                    <div className="text-center">
                      <p className="text-metallicGold-500 font-bold mb-1">첫 기수</p>
                      <p className="text-sm text-offWhite-600">모집중</p>
                    </div>
                    <div className="text-center">
                      <p className="text-metallicGold-500 font-bold mb-1">
                        {masterCourse.duration / 60}시간
                      </p>
                      <p className="text-sm text-offWhite-600">총 강의</p>
                    </div>
                  </div>
                </div>

                {/* 등록된 사용자를 위한 학습 대시보드 */}
                {isEnrolled && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-offWhite-200 mb-6">나의 학습 현황</h3>
                    <LearningDashboard
                      completedLessons={0}
                      totalLessons={5}
                      studyTime={0}
                      certificates={0}
                      className="mb-6"
                    />
                    <ProgressBar progress={0} total={5} showPercentage={true} size="lg" />
                  </div>
                )}

                {/* Course Features */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-offWhite-200 mb-6">
                    이런 분들께 추천합니다
                  </h3>
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
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
                        <span className="text-offWhite-300 text-lg">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Course Curriculum */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-offWhite-200 mb-6">무엇을 배우나요?</h3>

                {/* Key Features */}
                <div className="grid gap-6 mb-10">
                  {masterCourse.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6 hover:border-metallicGold-500/40 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-deepBlack-900 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-metallicGold-500 mb-2">
                            {feature}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Course Modules */}
                <h3 className="text-2xl font-bold text-offWhite-200 mb-6">커리큘럼</h3>
                <ModuleAccordion modules={masterCourse.modules} className="mb-10" />

                {/* Benefits */}
                <div className="mt-10 bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-8 border border-metallicGold-500/30">
                  <h3 className="text-xl font-bold text-metallicGold-500 mb-4 flex items-center gap-2">
                    <Gift size={24} />
                    수강생 전용 혜택
                  </h3>
                  <ul className="space-y-3">
                    {masterCourse.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-offWhite-300">
                        <span className="text-metallicGold-500 mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Why You Must Act Now Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center text-offWhite-200 mb-12">
                지금 신청하지 않으면 <span className="text-red-400">후회하는 이유</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    icon: Timer,
                    title: '가격이 다시 올라갑니다',
                    description: '첫 기수 한정 45% 할인. 다음 기수부터는 정가 180만원',
                    warning: '지금 아니면 99만원 더 내야 합니다',
                  },
                  {
                    icon: Shield,
                    title: '경쟁자들이 먼저 배웁니다',
                    description: '이미 많은 분들이 신청 중. 당신만 뒤처질 수 있습니다',
                    warning: '1년 후에도 같은 자리에 있고 싶으신가요?',
                  },
                  {
                    icon: TrendingUp,
                    title: 'AI 격차는 더 벌어집니다',
                    description: 'AI를 제대로 쓰는 1%와 못 쓰는 99%의 격차는 매일 커집니다',
                    warning: '지금이 마지막 따라잡을 기회입니다',
                  },
                ].map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-deepBlack-600/50 rounded-2xl p-6 border border-red-500/20"
                  >
                    <reason.icon className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-offWhite-200 mb-3">{reason.title}</h3>
                    <p className="text-offWhite-500 mb-3">{reason.description}</p>
                    <p className="text-red-400 font-bold text-sm">{reason.warning}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-20 text-center bg-gradient-to-br from-red-500/10 to-red-900/10 rounded-3xl p-12 border border-red-500/30"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-6">
                  지금이 아니면,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                    영원히 못합니다
                  </span>
                </h2>
                <p className="text-xl text-offWhite-400 mb-4">
                  대부분의 사람들은 이 페이지를 그냥 지나칩니다.
                  <br />
                  그리고 1년 후에도 여전히 같은 자리에 있을 겁니다.
                </p>
                <p className="text-lg text-metallicGold-500 font-bold mb-8">
                  당신은 다르길 바랍니다.
                </p>
              </motion.div>
              {!isEnrolled && (
                <motion.button
                  onClick={handleEnrollClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-xl hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-2xl"
                >
                  <Rocket size={28} />
                  지금 바로 시작하기
                  <ArrowRight size={24} />
                </motion.button>
              )}
            </motion.div>
          </div>
        </section>


        {/* FAQ 섹션 */}
        <FAQSection
          faqs={sampleFAQs}
          className="bg-gradient-to-b from-deepBlack-900 to-deepBlack-300/20"
        />


        {/* Sticky CTA Button */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: showStickyButton ? 0 : 100,
            opacity: showStickyButton ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-deepBlack-900/95 backdrop-blur-md border-t border-metallicGold-900/30 p-4 shadow-2xl"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between gap-4">
              {/* Course info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="text-deepBlack-900" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-offWhite-200 truncate">{masterCourse.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-offWhite-500">
                    <span className="text-lg font-bold text-metallicGold-500">
                      ₩{masterCourse.price.toLocaleString()}
                    </span>
                    <span className="line-through text-offWhite-600">
                      ₩{masterCourse.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">
                      {masterCourse.discount}% 할인
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0">
                {isEnrolled ? (
                  <button
                    onClick={handleContinueLearning}
                    className="px-6 py-3 bg-green-500/20 text-green-400 rounded-xl font-bold border border-green-500/30 hover:bg-green-500/30 transition-all whitespace-nowrap"
                  >
                    학습 계속하기
                  </button>
                ) : user ? (
                  <PaymentButton
                    lectureId={masterCourse.id}
                    price={masterCourse.price}
                    className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap"
                  >
                    <Rocket size={18} className="inline mr-2" />
                    지금 시작하기
                  </PaymentButton>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap"
                  >
                    지금 시작하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        <Footer />
      </div>
    </div>
  );
}
