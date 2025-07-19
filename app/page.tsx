'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight,
  Sparkles,
  Code2,
  MessageSquare,
  Globe,
  Zap,
  Gift,
  CheckCircle2,
  Star,
  Users,
  Timer,
  Trophy,
  Crown,
  Brain,
  Rocket
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'
import CountdownTimer from '@/components/CountdownTimer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="home" />

        {/* Hero Section - 역사적인 시작을 알리는 초대장 */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-16"
              >
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소"
                  width={80}
                  height={80}
                  className="object-contain filter drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                  priority
                />
              </motion.div>

              {/* Main Headline - product_page_copy.md 기반 */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-montserrat font-bold mb-8 leading-tight tracking-wider"
              >
                <span className="block text-offWhite-200 mb-4">AI 300만원짜리 강의,</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900">
                  더 이상 돈 주고 듣지 마세요
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl text-offWhite-500 max-w-4xl mx-auto mb-16 leading-relaxed font-light"
              >
                AI로 비싼 강의의 핵심만 <span className="text-metallicGold-500 font-semibold">'추출'</span>하고, 
                <span className="text-metallicGold-500 font-semibold">'실행 가능한 자동화 프로그램'</span>으로 만드는 압도적인 방법을 알려드립니다.
                <br className="hidden md:block" />
                <span className="text-offWhite-400">비개발자인 제가 해냈으니, 당신은 더 빨리 할 수 있습니다.</span>
              </motion.p>

              {/* Countdown Section */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-16"
              >
                <p className="text-lg text-offWhite-500 mb-8 tracking-[0.3em] uppercase">Grand Open D-Day</p>
                <CountdownTimer />
                <p className="text-2xl text-metallicGold-500 mt-8 font-semibold">2025년 7월 21일 (월) 오후 7시</p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/register"
                  className="group relative inline-flex items-center gap-3 px-12 py-5 overflow-hidden rounded-2xl font-bold text-lg tracking-wide transition-all duration-300"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 transition-all duration-300 group-hover:scale-105" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metallicGold-100/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative flex items-center gap-3 text-deepBlack-900">
                    <Sparkles className="w-6 h-6" />
                    <span>오픈런 혜택, 사전 등록하고 100% 받기</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pain Points Section - 문제 제기 */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-offWhite-200 mb-6">
                혹시, 아직도 이렇게 시간 낭비하고 계신가요?
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  title: '"열심히 하는데 왜 결과가 안나오지?"',
                  content: '수많은 사람들이 아직도 Cursor, Replit 같은 차로 비유하면, 당신이 경차로 낁낁댁 때, 누군가는 F1 머신으로 질주하고 있습니다. 애초에 도구가 다릅니다.',
                  icon: Code2
                },
                {
                  title: '"자동화 하려다 노가다만 늘어난다?"',
                  content: 'Make, n8n 화면에서 마우스로 점 찍고 선 잇는 작업, 그것도 결국 수작업입니다. 자동화를 만들기 위해 또 다른 노가다를 하는 셈이죠. 그 과정 자체를 자동화할 생각은 왜 못했을까요?',
                  icon: Zap
                },
                {
                  title: '"코딩, 배워도 배워도 끝이 없다?"',
                  content: '비개발자에게 C언어, Java는 독입니다. 우리는 개발자가 될 게 아닙니다. 98%의 불필요한 지식 때문에 정작 돈 버는 2%의 핵심을 놓치고 있습니다.',
                  icon: Brain
                }
              ].map((pain, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-deepBlack-300/50 backdrop-blur-sm border border-red-900/20 rounded-2xl p-8 md:p-12 hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <pain.icon className="w-7 h-7 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-400 mb-4">{pain.title}</h3>
                      <p className="text-lg text-offWhite-400 leading-relaxed">{pain.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section - 해결책 제시 */}
        <section className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/50 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
                <span className="text-offWhite-200">떡상연구소는</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  '게임의 룰'을 바꿉니다
                </span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {[
                {
                  number: "1",
                  title: "최정상 1%의 AI Toolset",
                  description: "우리는 현존 최강의 성능을 내는 'Claude Code'에 'Super Claude'를 탑재한 우리만의 강화된 AI를 사용합니다. 대부분의 사람들이 세팅조차 못하는 이 압도적인 도구를, 당신은 강의 시작 10분 만에 손에 넣게 됩니다."
                },
                {
                  number: "2",
                  title: "시공간 제약 없는 '텔레그램 코딩'",
                  description: '"지금 아이디어가 떠올랐는데!" 컴퓨터 앞에 앉을 필요 없습니다. 언제 어디서든 텔레그램 채팅 하나로 아이디어를 즉시 \'바이블 코딩\'하여 프로그램으로 만듭니다. 생각과 현실화 사이의 딜레이가 0이 됩니다.'
                },
                {
                  number: "3",
                  title: "자동화를 자동화하는 '메타 자동화'",
                  description: "Make, n8n의 수작업은 이제 그만. 우리는 코드로 자동화 설계도 자체를 생성합니다. 마우스 클릭이 아닌, 명령어 한 줄로 복잡한 자동화 시스템을 1분 만에 구축하는 '메타 자동화' 기술입니다."
                },
                {
                  number: "4",
                  title: "비개발자를 위한 '최소 지식 원칙'",
                  description: "저는 천재 개발자가 아닙니다. 오히려 코딩을 못했기 때문에, 누구보다 효율적인 길을 찾아야만 했습니다. 이 강의는 개발 지식의 98%를 버리고, 오직 '결과물'을 만드는 데 필요한 2%의 핵심만 다룹니다."
                }
              ].map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative h-full bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8 md:p-10 hover:border-metallicGold-500/40 transition-all duration-300">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-deepBlack-900 font-bold text-xl">{principle.number}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-metallicGold-500 mb-4 mt-4">{principle.title}</h3>
                    <p className="text-lg text-offWhite-400 leading-relaxed">{principle.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section - 최종 비전 */}
        <section className="py-32 px-4 relative">
          {/* Background gradient for section separation */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/50 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-offWhite-200 mb-6">
                우리가 꿈꾸는 최종 목표
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "대화만으로 완성",
                  description: "AI와의 자연스러운 대화로\n복잡한 자동화 프로그램을 구현"
                },
                {
                  icon: Globe,
                  title: "웹사이트 자동 생성",
                  description: "AI 에이전트가 당신의 아이디어를\n완성된 웹사이트로 변환"
                },
                {
                  icon: Zap,
                  title: "즉시 실행 가능",
                  description: "만든 즉시 바로 사용할 수 있는\n실전 자동화 솔루션"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  {/* Card glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card content */}
                  <div className="relative h-full bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-10 hover:border-metallicGold-500/40 transition-all duration-300">
                    {/* Icon container */}
                    <div className="w-16 h-16 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-metallicGold-500" />
                    </div>
                    
                    {/* Text content */}
                    <h3 className="text-2xl font-bold text-offWhite-200 mb-4">{item.title}</h3>
                    <p className="text-offWhite-500 whitespace-pre-line leading-relaxed text-lg">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Class Details Section - 무료 강의 상세 소개 */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-offWhite-200 mb-8">
                이번 무료 강의에서 당신이 <span className="text-metallicGold-500">'훔쳐 갈'</span> 3가지 비법
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  emoji: "🎯",
                  number: "1️⃣",
                  title: "고가 강의 '자동 분석 시스템' 구축법",
                  content: "300만원짜리 강의 결제 대신, AI에게 강의 내용을 분석시켜 핵심 커리큘럼과 노하우만 추출하는 시스템을 직접 만듭니다. 더 이상 정보의 소비자가 아닌, 정보의 '지배자'가 되십시오.",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  emoji: "🚀",
                  number: "2️⃣",
                  title: "텔레그램으로 '언제 어디서나 코딩' 실전법",
                  content: "휴대폰 하나로 필요한 자동화를 만들어내는 비법을 공개합니다. 카페에서, 지하철에서, 침대에서... 언제 어디서나 아이디어를 현실로 만드는 힘, 그것이 진정한 자유입니다.",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  emoji: "✨",
                  number: "3️⃣",
                  title: "밥 먹듯이 EXE 뽑아내는 '메타 자동화' 설계도",
                  content: "아이디어만 있으면 클릭 몇 번에 자동화 프로그램(EXE), 웹사이트가 튀어나오는 경험을 하게 됩니다. 이는 당신이 평생 써먹을 '디지털 건물'을 짓는 능력입니다.",
                  gradient: "from-yellow-500 to-orange-500"
                }
              ].map((secret, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-16 top-0 text-6xl opacity-10">{secret.emoji}</div>
                  <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8 md:p-12 hover:border-metallicGold-500/40 transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${secret.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-2xl">{secret.number}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-metallicGold-500 mb-6">{secret.title}</h3>
                        <p className="text-lg md:text-xl text-offWhite-300 leading-relaxed">{secret.content}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Class Introduction - 공식 런칭 클래스 */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-deepBlack-300/30 to-deepBlack-600/30 backdrop-blur-sm border border-metallicGold-900/30 rounded-3xl p-12 md:p-20 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-8">
                이 위대한 여정, 어떻게 시작해야 할까요?
              </h2>
              <p className="text-xl md:text-2xl text-offWhite-500 mb-12 leading-relaxed">
                떡상연구소가 21일 공식 런칭과 함께 모든 노하우를 담아 공개하는
                <br />
                <span className="text-metallicGold-500 font-semibold">1시간 집중 클래스</span>
              </p>

              <div className="bg-deepBlack-600/50 rounded-2xl p-10 mb-8 border border-metallicGold-900/10">
                <p className="text-lg text-offWhite-400 mb-10">
                  이 1시간의 입문 과정은, 위에서 보여드린 '최종 결과물'을
                  <br />
                  당신도 만들 수 있다는 <span className="text-metallicGold-500 font-bold">'가능성을 증명하는 시간'</span>입니다.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl p-8 border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-lg flex items-center justify-center">
                        <span className="text-deepBlack-900 font-bold">1</span>
                      </div>
                      <span className="text-metallicGold-500 font-bold text-lg">경험 1</span>
                    </div>
                    <p className="text-offWhite-300 text-lg">AI와의 대화로 자동화 프로그램이 탄생하는 경험</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl p-8 border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-lg flex items-center justify-center">
                        <span className="text-deepBlack-900 font-bold">2</span>
                      </div>
                      <span className="text-metallicGold-500 font-bold text-lg">경험 2</span>
                    </div>
                    <p className="text-offWhite-300 text-lg">AI 에이전트가 내 웹사이트를 만들어주는 경험</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Special Benefits - 조건부 특별 혜택 */}
        <section className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/30 to-transparent" />
          
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-6">
                오픈 기념! 미션 완료 시, 아래 혜택을 100% 드립니다
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            {/* Mission Box */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 backdrop-blur-sm border-2 border-metallicGold-500/50 rounded-3xl p-10 md:p-14 mb-20 max-w-5xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-8">
                <Trophy className="w-10 h-10 text-metallicGold-500" />
                <h3 className="text-2xl font-bold text-metallicGold-500">※ '미션'이란?</h3>
              </div>
              <p className="text-xl text-offWhite-200 leading-relaxed mb-6">
                1시간 클래스를 따라 만든 '나만의 웹사이트 URL'을 제출하는 것입니다.
                <br />
                당신의 실행력을 증명하고, '첫 수강생'을 위한 모든 혜택을 독점하세요!
              </p>
              <p className="text-lg text-offWhite-400">
                + 추가로 안내해드리는 간단한 미션 후에 바로 받아가실 수 있습니다.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  tag: "즉시 사용",
                  title: "n8n 자동화 설계 프롬프트 SET",
                  value: "실무 검증",
                  icon: Zap,
                  description: "현장에서 바로 사용할 수 있는 검증된 프롬프트"
                },
                {
                  tag: "능력 상승",
                  title: "AI 잠재력 200% 활용 '프롬프트 엔지니어링' 가이드",
                  value: "전문가 노하우",
                  icon: Brain,
                  description: "AI의 숨겨진 능력을 끌어내는 고급 테크닉"
                },
                {
                  tag: "독점 할인",
                  title: "80만원 즉시 할인! 'AI 올인원 마스터 패키지' 쿠폰",
                  value: "80만원",
                  icon: Gift,
                  description: "떡상연구소 최고 인기 패키지 특별 할인"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative h-full bg-deepBlack-300/80 backdrop-blur-sm border border-metallicGold-900/30 rounded-3xl p-8 hover:border-metallicGold-500/50 transition-all duration-300">
                    {/* Tag */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-2 bg-metallicGold-500/20 text-metallicGold-500 text-sm font-medium rounded-full">
                        {benefit.tag}
                      </span>
                      <benefit.icon className="w-8 h-8 text-metallicGold-500" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-offWhite-200 mb-4 leading-tight">
                      {benefit.title}
                    </h3>
                    
                    {/* Value highlight */}
                    <p className="text-4xl font-montserrat font-bold text-metallicGold-500 mb-4">
                      {benefit.value}
                    </p>
                    
                    {/* Description */}
                    <p className="text-offWhite-500 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section - 기회를 선점하세요 */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 backdrop-blur-sm border border-metallicGold-500/30 rounded-3xl p-12 md:p-20 text-center"
            >
              <Gift className="w-20 h-20 text-metallicGold-500 mx-auto mb-8" />
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-8">
                기회를 선점하세요
              </h2>
              
              <p className="text-xl md:text-2xl text-offWhite-500 mb-12">
                떡상연구소의 첫 번째 공식 클래스, 그리고 80만원 상당의 혜택
              </p>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/register"
                  className="group relative inline-flex items-center gap-3 px-12 py-5 overflow-hidden rounded-2xl font-bold text-lg tracking-wide transition-all duration-300"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 transition-all duration-300 group-hover:scale-105" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metallicGold-100/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative flex items-center gap-3 text-deepBlack-900">
                    <Crown className="w-6 h-6" />
                    <span>80만원 상당 혜택, 지금 사전 등록하고 선점하기</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
              
              {/* Bottom CTA */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-12 text-lg text-offWhite-500"
              >
                단 1시간만에 웹사이트와 자동화 EXE파일을 만드는 기술
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 px-4 border-t border-metallicGold-900/20">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-offWhite-500">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-metallicGold-500" />
                <span>수강생 1,000+</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-metallicGold-500" />
                <span>평점 4.9/5.0</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-metallicGold-500" />
                <span>검증된 커리큘럼</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 border-t border-metallicGold-900/20 bg-deepBlack-900">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/떡상연구소_로고-removebg-preview.png"
                    alt="떡상연구소"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-metallicGold-500">떡상연구소</span>
              </div>
              <p className="text-offWhite-600 text-sm">
                © 2025 떡상연구소. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}