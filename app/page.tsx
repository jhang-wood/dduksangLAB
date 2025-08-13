'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Gift,
  Trophy,
  Crown,
  Brain,
  Rocket,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import CountdownTimer from '@/components/CountdownTimer';
import LimitedTimer from '@/components/LimitedTimer';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="home" />

        {/* Hero Section - 역사적인 시작을 알리는 초대장 */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              {/* Logo Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-12"
              >
                <div className="relative w-48 h-32 md:w-64 md:h-40 lg:w-80 lg:h-48 mx-auto">
                  <Image
                    src="/images/떡상연구소_로고/누끼_떡상연구소.png"
                    alt="떡상연구소"
                    fill
                    className="object-contain filter drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                    priority
                  />
                </div>
              </motion.div>

              {/* Main Headline with Logo - 도발적이고 강력한 메시지 */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-montserrat font-bold mb-8 relative"
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 relative">
                  AI 300만원짜리 강의,
                </span>
                <span className="block text-offWhite-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight relative">
                  더 이상 돈 주고 듣지 마세요.
                </span>
              </motion.h1>

              {/* Subtitle - 압도적인 차별점 제시 */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-offWhite-400 max-w-3xl mx-auto mb-16 mt-12 leading-relaxed px-4 sm:px-0"
              >
                AI로 비싼 강의의 핵심만{' '}
                <span className="text-metallicGold-500 font-bold">'추출'</span>하고,
                <br className="hidden sm:inline" />
                <span className="text-metallicGold-500 font-bold">
                  '실행 가능한 자동화 프로그램'
                </span>
                으로 만드는
                <br />
                압도적인 방법을 알려드립니다.
                <br />
                <span className="text-offWhite-300 text-sm sm:text-base mt-4 block">
                  비개발자인 제가 해냈으니, 당신은 더 빨리 할 수 있습니다.
                </span>
              </motion.p>

              {/* Countdown Section */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-16"
              >
                <p className="text-lg text-offWhite-500 mb-8 tracking-[0.3em] uppercase">
                  Grand Open D-Day
                </p>
                <CountdownTimer />
                <p className="text-2xl text-metallicGold-500 mt-8 font-semibold">
                  2025년 8월 15일 (금) 오후 7시
                </p>
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
                    <span>[비공개 무료 강의] 지금 즉시 참여하기</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Vision Section - 게임의 룰을 바꾸는 새로운 패러다임 */}
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-6">
                떡상연구소는{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  '게임의 룰'
                </span>
                을 바꿉니다
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: '휴대폰 코딩',
                  description:
                    '지하철에서, 카페에서, 침대에서\n휴대폰 하나로 AI와 대화하며\n실시간으로 프로그램을 만듭니다',
                },
                {
                  icon: MessageSquare,
                  title: 'AI Agent 조직 협업',
                  description:
                    '당신이 CEO가 되고\nAI agent들이 팀장이 됩니다.\n서로 업무를 나누고 보고하며\n24시간 일하는 AI 회사를 만듭니다',
                },
                {
                  icon: Rocket,
                  title: '메타 자동화',
                  description:
                    '자동화를 자동화하는 기술\n명령어 한 줄로 복잡한 시스템을\n10분 만에 구축',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative h-full bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-10 hover:border-metallicGold-500/40 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-metallicGold-500" />
                    </div>

                    <h3 className="text-2xl font-bold text-offWhite-200 mb-4">{item.title}</h3>
                    <p className="text-offWhite-500 whitespace-pre-line leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pain Point Section - 문제 제기 */}
        <section className="py-32 px-4 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-800/50 via-deepBlack-900/60 to-deepBlack-800/50" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-metallicGold-500/5 rounded-full blur-3xl animate-pulse-soft" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px), linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-6">
                혹시, 아직도 이렇게 시간 낭비하고 계신가요?
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            <div className="space-y-8 max-w-5xl mx-auto">
              {[
                {
                  title: '"똑같은 AI인데 왜 나만 성과가 없지?"',
                  description:
                    '누군가는 똑같은 AI Agent를 경차처럼 사용하고\n누군가는 똑같은 AI Agent를 F1 머신처럼 사용합니다.\n같은 도구, 극단적인 격차.\n당신은 지금 어떻게 운전하고 있나요?',
                  icon: '😤',
                },
                {
                  title: '"자동화 하려다 노가다만 늘어난다?"',
                  description:
                    'Make, n8n 화면에서 마우스로\n점 찍고 선 잇는 작업, 그것도 결국 수작업입니다.\n자동화를 만들기 위해 또 다른 노가다를 하는 셈이죠.\n그 과정 자체를 자동화할 생각은 왜 못했을까요?',
                  icon: '🤯',
                },
                {
                  title: '"코딩, 배워도 배워도 끝이 없다?"',
                  description:
                    '비개발자에게 C언어, Java는 독입니다.\n우리는 개발자가 될 게 아닙니다.\n98%의 불필요한 지식 때문에\n정작 돈 버는 2%의 핵심을 놓치고 있습니다.',
                  icon: '😵',
                },
              ].map((pain, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-gradient-to-br from-deepBlack-300/60 to-deepBlack-400/40 backdrop-blur-md border border-metallicGold-900/20 rounded-3xl p-8 hover:border-metallicGold-500/40 hover:shadow-2xl hover:shadow-metallicGold-500/10 transition-all duration-500 transform hover:-translate-y-1"
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/0 to-metallicGold-600/0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  
                  <div className="relative flex items-start gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-metallicGold-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative text-4xl flex-shrink-0 block transform group-hover:scale-110 transition-transform duration-300">{pain.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-metallicGold-400 to-metallicGold-600 bg-clip-text text-transparent mb-4 group-hover:from-metallicGold-300 group-hover:to-metallicGold-500 transition-all duration-300">
                        {pain.title}
                      </h3>
                      <p className="text-lg text-offWhite-400 leading-relaxed whitespace-pre-line">
                        {pain.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* First Gateway Section - 첫 번째 관문 (Section 3) */}
        <section className="py-32 px-4 relative overflow-hidden">
          {/* Creative Background Pattern */}
          <div className="absolute inset-0">
            {/* Diagonal Gradient Stripes */}
            <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-deepBlack-800 to-deepBlack-900" />
            
            {/* Animated Diagonal Lines */}
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(255, 215, 0, 0.03) 100px,
                rgba(255, 215, 0, 0.03) 200px
              )`
            }} />
            
            {/* Floating Orbs */}
            <div className="absolute top-20 left-[10%] w-64 h-64 bg-metallicGold-500/10 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-20 right-[10%] w-64 h-64 bg-metallicGold-600/10 rounded-full blur-3xl animate-pulse-soft animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-metallicGold-400/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-6">
                이번 무료 강의에서 당신이{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  '훔쳐 갈'
                </span>{' '}
                3가지 비법
              </h2>
              <p className="text-xl md:text-2xl text-offWhite-500 max-w-4xl mx-auto mb-8">
                단 1시간만에 정보의 소비자에서{' '}
                <span className="text-metallicGold-500 font-bold">정보의 지배자</span>가 되는 방법
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            {/* Creative Cards Layout - Zigzag Pattern */}
            <div className="space-y-12">
              {[
                {
                  number: '1',
                  badge: '비법 공개',
                  title: '고가 강의 "자동 분석 시스템" 구축법',
                  description:
                    '300만원짜리 강의 결제 대신,\nAI에게 강의 내용을 분석시켜\n핵심 커리큘럼과 노하우만 추출하는 시스템을 직접 만듭니다.\n더 이상 정보의 소비자가 아닌, 정보의 \'지배자\'가 되십시오.',
                  icon: Brain,
                  highlight: '정보의 지배자',
                },
                {
                  number: '2',
                  badge: '실전 데모',
                  title: '실시간 "텔레그램 코딩" 시연',
                  description:
                    '지하철에서, 카페에서, 어디서든\n텔레그램 채팅만으로 즉시 프로그램을 만드는 혁신적인 방법.\n컴퓨터 없이도 아이디어를 현실로 만드는 경험을 하게 됩니다.',
                  icon: MessageSquare,
                  highlight: '언제 어디서든',
                },
                {
                  number: '3',
                  badge: '즉시 활용',
                  title: '밥 먹듯이 EXE 뽑아내는 "메타 자동화" 설계도',
                  description:
                    '아이디어만 있으면 클릭 몇 번에\n자동화 프로그램(EXE), 웹사이트가 튀어나오는 경험을 하게 됩니다.\n이는 당신이 평생 써먹을 \'디지털 건물\'을 짓는 능력입니다.',
                  icon: Rocket,
                  highlight: '평생 써먹을 능력',
                },
              ].map((secret, index) => (
                <motion.div
                  key={index}
                  initial={{ 
                    x: index % 2 === 0 ? -50 : 50, 
                    opacity: 0,
                    rotateY: index % 2 === 0 ? -5 : 5
                  }}
                  whileInView={{ 
                    x: 0, 
                    opacity: 1,
                    rotateY: 0
                  }}
                  whileHover={{
                    scale: 1.02,
                    rotateY: index % 2 === 0 ? 3 : -3,
                    transition: { duration: 0.3 }
                  }}
                  transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`group relative ${index % 2 === 0 ? 'md:mr-auto md:w-[85%]' : 'md:ml-auto md:w-[85%]'}`}
                  style={{ perspective: '1000px' }}
                >
                  {/* Card Glow Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 via-metallicGold-600/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110" />
                  
                  {/* Main Card */}
                  <div className="relative bg-gradient-to-br from-deepBlack-300/70 via-deepBlack-400/50 to-deepBlack-500/70 backdrop-blur-md border border-metallicGold-900/30 rounded-3xl overflow-hidden group-hover:border-metallicGold-500/50 transition-all duration-500 shadow-2xl">
                    {/* Number Badge - Large Background */}
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-600/10 rounded-full blur-2xl" />
                    <div className="absolute top-8 left-8 text-8xl font-black text-metallicGold-500/10">
                      {secret.number}
                    </div>
                    
                    {/* Content */}
                    <div className="relative p-10">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <motion.div 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                          >
                            <div className="w-20 h-20 bg-gradient-to-br from-metallicGold-500/30 to-metallicGold-900/30 rounded-2xl flex items-center justify-center group-hover:from-metallicGold-500/40 group-hover:to-metallicGold-900/40 transition-all duration-300">
                              <secret.icon className="w-10 h-10 text-metallicGold-500" />
                            </div>
                            <span className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900 text-xs font-bold rounded-full shadow-lg">
                              {secret.badge}
                            </span>
                          </motion.div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-offWhite-100 to-offWhite-300 bg-clip-text text-transparent mb-4">
                            {secret.title}
                          </h3>
                          <p className="text-lg text-offWhite-400 leading-relaxed whitespace-pre-line mb-4">
                            {secret.description}
                          </p>
                          
                          {/* Highlight Bar */}
                          <div className="flex items-center gap-3 mt-6 p-4 bg-metallicGold-500/10 rounded-xl border border-metallicGold-500/30">
                            <div className="w-2 h-2 bg-metallicGold-500 rounded-full animate-pulse" />
                            <p className="text-metallicGold-400 font-bold text-lg">
                              {secret.highlight}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Gradient Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-metallicGold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Benefits Section - 조건부 특별 혜택 (Section 4) */}
        <section className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/50 to-transparent" />

          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-6">
                오픈 기념! 미션 완료 시, 아래 혜택을 100% 드립니다.
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto" />
            </motion.div>

            {/* Mission Box */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 border border-metallicGold-500/30 rounded-3xl p-8 md:p-12 mb-16"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-metallicGold-500 mb-4">※ '미션'이란?</h3>
                <p className="text-lg text-offWhite-300 leading-relaxed mb-4">
                  1시간 클래스를 따라 만든 '나만의 웹사이트 URL'을 제출하는 것입니다.
                  <br />
                  당신의 실행력을 증명하고, '첫 수강생'을 위한 모든 혜택을 독점하세요!
                </p>
                <p className="text-offWhite-500">
                  + 추가로 안내해드리는 간단한 미션 후에 바로 받아가실 수 있습니다.
                </p>
              </div>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Gift,
                  badge: '즉시 사용',
                  category: '[N8N 자동화]',
                  title: '워크플로우 설계 프롬프트 SET',
                  value: '30만원 상당',
                },
                {
                  icon: Trophy,
                  badge: '능력 상승',
                  category: '[AI 잠재력 200% 활용]',
                  title: '\'프롬프트 엔지니어링\' 가이드',
                  value: '50만원 상당',
                },
                {
                  icon: Crown,
                  badge: '독점 자료',
                  category: '[초보자 전용]',
                  title: 'AI 수익화 모델 정리본.PDF',
                  value: '약 100page 분량',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative h-full bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8 hover:border-metallicGold-500/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 bg-metallicGold-500/20 text-metallicGold-500 rounded-lg text-sm font-semibold">
                        {benefit.badge}
                      </span>
                      <benefit.icon className="w-6 h-6 text-metallicGold-500" />
                    </div>

                    {benefit.category && (
                      <p className="text-sm text-metallicGold-400 mb-2 font-medium">{benefit.category}</p>
                    )}
                    <h3 className="text-lg font-bold text-offWhite-200 mb-3 leading-tight">{benefit.title}</h3>
                    <p className="text-xl font-bold text-metallicGold-500">{benefit.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section - 기회를 선점하세요 */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-deepBlack-800 via-deepBlack-700 to-deepBlack-800 backdrop-blur-sm border border-red-500/30 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 border border-red-500/20 rounded-full" />
                <div className="absolute bottom-4 left-4 w-24 h-24 border border-metallicGold-500/20 rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-red-500/10 rounded-full" />
              </div>

              {/* Warning Icon with Glow */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="relative mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/50">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-offWhite-200 mb-4">
                지금이 아니면,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                  영원히 못합니다
                </span>
              </h2>

              <p className="text-lg md:text-xl text-offWhite-400 mb-4 leading-relaxed max-w-2xl mx-auto">
                대부분의 사람들은 이 페이지를 그냥 지나칩니다.
                <br />
                그리고 1년 후에도 여전히 같은 자리에 있을 겁니다.
              </p>

              <p className="text-base md:text-lg text-metallicGold-500 font-bold">
                당신은 다르길 바랍니다.
              </p>

              {/* Scroll Down Animation - 이 섹션 바로 아래에 추가 */}
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-8 flex flex-col items-center"
              >
                <p className="text-offWhite-400 mb-3 text-sm">지금이 아니면 영원히 못합니다</p>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="pointer-events-none"
                >
                  <ChevronDown className="w-8 h-8 text-red-500" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Free Course CTA Section - 하단 무료강의 신청 */}
        <section className="py-32 px-4 relative overflow-hidden">
          {/* Enhanced Multi-layer Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-800/50 via-deepBlack-900/70 to-deepBlack-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,215,0,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,215,0,0.08),transparent_60%)]" />
          
          {/* Floating Geometric Elements */}
          <div className="absolute top-20 left-10 w-24 h-24 border border-metallicGold-500/20 rounded-full animate-pulse-soft" />
          <div className="absolute bottom-32 right-16 w-32 h-32 border border-metallicGold-600/15 rounded-full animate-float" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-metallicGold-400/25 rounded-xl rotate-45 animate-pulse-soft" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,215,0,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Warning Box - 수정된 텍스트 */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/40 rounded-2xl px-8 py-4 mb-8"
              >
                <Sparkles className="w-6 h-6 text-green-500" />
                <span className="text-lg font-bold text-green-500">
                  지금 바로 무료로 배워보세요!
                </span>
              </motion.div>

              {/* Enhanced 3D 카드 2장을 맨 위로 이동 */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16" style={{ perspective: '1000px' }}>
                {/* 자동화 프로그램 카드 - Enhanced 3D */}
                <motion.div
                  initial={{ x: -30, opacity: 0, rotateY: -15 }}
                  whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
                  whileHover={{ 
                    rotateY: 8, 
                    y: -15, 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(255, 215, 0, 0.25)"
                  }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group relative transform-gpu"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Enhanced Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/30 to-metallicGold-600/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-110" />
                  
                  {/* 3D Card Body */}
                  <div className="relative h-full bg-gradient-to-br from-deepBlack-300/60 via-deepBlack-400/40 to-deepBlack-500/60 backdrop-blur-md border border-metallicGold-900/20 rounded-3xl p-10 hover:border-metallicGold-500/50 transition-all duration-500 shadow-2xl">
                    {/* Top Edge Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-metallicGold-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-20 h-20 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="w-10 h-10 text-metallicGold-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-offWhite-200 mb-4">
                      자동화 프로그램 만들기
                    </h3>
                    
                    <p className="text-offWhite-400 mb-6 leading-relaxed">
                      AI와 함께 나만의 자동화 프로그램(EXE)을
                      <br />
                      단 10분 만에 완성하는 비법 공개
                    </p>
                    
                    <ul className="text-left text-offWhite-500 space-y-2 mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-metallicGold-500">✓</span>
                        코딩 경험 0% 필요
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-metallicGold-500">✓</span>
                        텔레그램으로 명령만 전송
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-metallicGold-500">✓</span>
                        즉시 실행 가능한 프로그램 생성
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* 웹사이트 제작 카드 - Enhanced 3D */}
                <motion.div
                  initial={{ x: 30, opacity: 0, rotateY: 15 }}
                  whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
                  whileHover={{ 
                    rotateY: -8, 
                    y: -15, 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(255, 215, 0, 0.25)"
                  }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group relative transform-gpu"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Enhanced Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/30 to-metallicGold-600/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-110" />
                  
                  {/* 3D Card Body */}
                  <div className="relative h-full bg-gradient-to-br from-deepBlack-300/60 via-deepBlack-400/40 to-deepBlack-500/60 backdrop-blur-md border border-metallicGold-900/20 rounded-3xl p-10 hover:border-metallicGold-500/50 transition-all duration-500 shadow-2xl">
                    {/* Top Edge Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-metallicGold-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-20 h-20 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-10 h-10 text-metallicGold-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-offWhite-200 mb-4">
                      웹사이트 무료로 만들기
                    </h3>
                    
                    <p className="text-offWhite-400 mb-6 leading-relaxed">
                      전문가급 웹사이트를 AI와 함께
                      <br />
                      1시간 안에 완성하고 배포하는 방법
                    </p>
                    
                    <ul className="text-left text-offWhite-500 space-y-2 mb-8">
                      <li className="flex items-center gap-2">
                        <span className="text-metallicGold-500">✓</span>
                        호스팅 비용 0원
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-metallicGold-500">✓</span>
                        반응형 디자인 자동 적용
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-metallicGold-500">✓</span>
                        즉시 URL 발급 및 공유 가능
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  한시적 무료 오픈!
                </span>
              </h2>
              
              {/* Timer */}
              <div className="mb-12">
                <LimitedTimer />
              </div>
              

              {/* Enhanced 메인 CTA 버튼 */}
              <motion.div 
                whileHover={{ 
                  scale: 1.03, 
                  y: -3,
                  boxShadow: "0 30px 60px rgba(255, 215, 0, 0.4)"
                }} 
                whileTap={{ scale: 0.97 }} 
                className="relative mb-8"
              >
                {/* Enhanced Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-700 rounded-2xl blur-xl opacity-60 animate-pulse-soft scale-110" />
                
                <Link
                  href="/register"
                  className="group relative block overflow-hidden rounded-2xl transform-gpu"
                >
                  {/* Enhanced Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 transition-all duration-300 group-hover:scale-105" />
                  
                  {/* Top Edge Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Enhanced Multi-layer Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200" />
                  </div>
                  
                  {/* Secondary Shine Wave */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metallicGold-100/40 to-transparent -skew-x-6 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>

                  {/* Enhanced Button Content */}
                  <div className="relative px-12 py-5 flex items-center justify-center gap-3 text-deepBlack-900 font-bold text-lg tracking-wide">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="group-hover:animate-none"
                    >
                      <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <span className="group-hover:scale-105 transition-transform">무료 강의 즉시 신청하기</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all" />
                  </div>
                </Link>
              </motion.div>

            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
