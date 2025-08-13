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
                  title: '최정상 1%의 AI Toolset',
                  description:
                    'Claude Code + Super Claude\n대부분이 세팅조차 못하는\n압도적인 도구를 10분 만에',
                },
                {
                  icon: MessageSquare,
                  title: '텔레그램 코딩',
                  description:
                    '언제 어디서든 채팅 하나로\n아이디어를 즉시 프로그램으로\n생각과 현실화 사이의 딜레이 0',
                },
                {
                  icon: Rocket,
                  title: '메타 자동화',
                  description:
                    '자동화를 자동화하는 기술\n명령어 한 줄로 복잡한 시스템을\n1분 만에 구축',
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
        <section className="py-32 px-4 bg-deepBlack-800/30">
          <div className="container mx-auto max-w-6xl">
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
                  title: '"열심히 하는데 왜 결과가 안나오지?"',
                  description:
                    "수많은 사람들이 아직도 Cursor, Replit 같은 '보급형' AI를 쓰고 있습니다. 자동차로 비유하면, 당신이 경차로 낑낑댈 때, 누군가는 F1 머신으로 질주하고 있습니다. 애초에 도구가 다릅니다.",
                  icon: '😤',
                },
                {
                  title: '"자동화 하려다 노가다만 늘어난다?"',
                  description:
                    'Make, n8n 화면에서 마우스로 점 찍고 선 잇는 작업, 그것도 결국 수작업입니다. 자동화를 만들기 위해 또 다른 노가다를 하는 셈이죠. 그 과정 자체를 자동화할 생각은 왜 못했을까요?',
                  icon: '🤯',
                },
                {
                  title: '"코딩, 배워도 배워도 끝이 없다?"',
                  description:
                    '비개발자에게 C언어, Java는 독입니다. 우리는 개발자가 될 게 아닙니다. 98%의 불필요한 지식 때문에 정작 돈 버는 2%의 핵심을 놓치고 있습니다.',
                  icon: '😵',
                },
              ].map((pain, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8 hover:border-metallicGold-500/30 transition-all"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-4xl flex-shrink-0">{pain.icon}</span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-metallicGold-500 mb-4">
                        {pain.title}
                      </h3>
                      <p className="text-lg text-offWhite-400 leading-relaxed">
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
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-6xl">
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

            <div className="space-y-8">
              {[
                {
                  number: '1',
                  badge: '비법 공개',
                  title: '고가 강의 "자동 분석 시스템" 구축법',
                  description:
                    "300만원짜리 강의 결제 대신, AI에게 강의 내용을 분석시켜 핵심 커리큘럼과 노하우만 추출하는 시스템을 직접 만듭니다. 더 이상 정보의 소비자가 아닌, 정보의 '지배자'가 되십시오.",
                  icon: Brain,
                  highlight: '정보의 지배자',
                },
                {
                  number: '2',
                  badge: '실전 데모',
                  title: '실시간 "텔레그램 코딩" 시연',
                  description:
                    '지하철에서, 카페에서, 어디서든 텔레그램 채팅만으로 즉시 프로그램을 만드는 혁신적인 방법. 컴퓨터 없이도 아이디어를 현실로 만드는 경험을 하게 됩니다.',
                  icon: MessageSquare,
                  highlight: '언제 어디서든',
                },
                {
                  number: '3',
                  badge: '즉시 활용',
                  title: '밥 먹듯이 EXE 뽑아내는 "메타 자동화" 설계도',
                  description:
                    "아이디어만 있으면 클릭 몇 번에 자동화 프로그램(EXE), 웹사이트가 튀어나오는 경험을 하게 됩니다. 이는 당신이 평생 써먹을 '디지털 건물'을 짓는 능력입니다.",
                  icon: Rocket,
                  highlight: '평생 써먹을 능력',
                },
              ].map((secret, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8 hover:border-metallicGold-500/40 transition-all"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-2xl flex items-center justify-center">
                          <secret.icon className="w-8 h-8 text-deepBlack-900" />
                        </div>
                        <span className="absolute -top-2 -right-2 px-2 py-1 bg-metallicGold-500 text-deepBlack-900 text-xs font-bold rounded-lg">
                          {secret.badge}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-offWhite-200 mb-3">
                        {secret.title}
                      </h3>
                      <p className="text-lg text-offWhite-400 leading-relaxed">
                        {secret.description}
                      </p>
                      <p className="text-metallicGold-500 font-bold mt-3">→ {secret.highlight}</p>
                    </div>
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
                  title: 'n8n 자동화 설계 프롬프트 SET',
                  value: '30만원 상당',
                },
                {
                  icon: Trophy,
                  badge: '능력 상승',
                  title: "AI 잠재력 200% 활용 '프롬프트 엔지니어링' 가이드",
                  value: '50만원 상당',
                },
                {
                  icon: Crown,
                  badge: '독점 할인',
                  title: "80만원 즉시 할인! 'AI 올인원 마스터 패키지' 쿠폰",
                  value: '80만원 할인',
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

                    <h3 className="text-xl font-bold text-offWhite-200 mb-3">{benefit.title}</h3>
                    <p className="text-2xl font-bold text-metallicGold-500">{benefit.value}</p>
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
                지금이 아니면,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  영원히 못합니다
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-offWhite-400 mb-6 leading-relaxed">
                대부분의 사람들은 이 페이지를 그냥 지나칩니다.
                <br />
                그리고 1년 후에도 여전히 같은 자리에 있을 겁니다.
              </p>

              <p className="text-lg md:text-xl text-metallicGold-500 font-bold mb-12">
                당신은 다르길 바랍니다.
              </p>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                    <span>한시적 무료 강의 신청하기 (선착순 마감)</span>
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

        {/* Free Course CTA Section - 하단 무료강의 신청 */}
        <section className="py-32 px-4 bg-deepBlack-800/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Warning Box */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 border border-metallicGold-500/40 rounded-2xl px-8 py-4 mb-8"
              >
                <AlertTriangle className="w-6 h-6 text-metallicGold-500" />
                <span className="text-lg font-bold text-metallicGold-500">
                  지금이 아니면 영원히 못합니다.
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-offWhite-200 mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  한시적 무료 오픈!
                </span>
              </h2>
              
              {/* Timer */}
              <div className="mb-12">
                <LimitedTimer />
              </div>
              
              <p className="text-xl md:text-2xl text-offWhite-400 mb-16 leading-relaxed">
                자동화 프로그램 / 웹사이트 무료로 만들어보기
              </p>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* 자동화 프로그램 카드 */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative h-full bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-10 hover:border-metallicGold-500/40 transition-all duration-300">
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

                {/* 웹사이트 제작 카드 */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative h-full bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-10 hover:border-metallicGold-500/40 transition-all duration-300">
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

              {/* Scroll Down Animation */}
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-12 flex flex-col items-center"
              >
                <p className="text-offWhite-400 mb-4">아래로 스크롤하여 자세히 보기</p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="cursor-pointer"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                  <ChevronDown className="w-10 h-10 text-metallicGold-500" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
