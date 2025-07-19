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
  Crown
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import PremiumBackground from '@/components/PremiumBackground'
import CountdownTimer from '@/components/CountdownTimer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-charcoal-950 relative overflow-hidden">
      <PremiumBackground />
      <div className="relative z-10">
        <Header currentPage="home" />

        {/* Hero Section - 헤드라인과 초대장 */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-premiumGold-500/20 to-premiumGold-600/20 border border-premiumGold-500/50 rounded-full mb-8 backdrop-blur-sm"
              >
                <Crown className="w-5 h-5 text-premiumGold-500" />
                <span className="text-premiumGold-500 font-medium tracking-wider">GRAND OPENING EVENT</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold mb-8 leading-tight"
              >
                <span className="block text-white mb-4">코딩도, 노코드 툴도 없는</span>
                <span className="block bg-gradient-to-r from-premiumGold-400 to-premiumGold-600 bg-clip-text text-transparent">
                  새로운 시대가 시작됩니다
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
              >
                AI와의 <span className="text-premiumGold-500 font-semibold">'대화'</span>만으로 자동화 프로그램을 만드는,
                <br />
                떡상연구소의 첫 번째 공식 클래스에 당신을 초대합니다.
              </motion.p>

              {/* Countdown Timer */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-12"
              >
                <p className="text-lg text-gray-400 mb-6 tracking-wider">GRAND OPEN D-DAY</p>
                <CountdownTimer />
                <p className="text-xl text-premiumGold-500 mt-6 font-medium">2025년 1월 21일 (월) 오후 7시</p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-premiumGold-500 to-premiumGold-600 text-charcoal-950 rounded-2xl font-bold text-lg hover:from-premiumGold-400 hover:to-premiumGold-500 transition-all shadow-2xl shadow-premiumGold-500/25 group"
                >
                  <Sparkles className="w-6 h-6" />
                  <span className="tracking-wide">오픈런 혜택, 사전 등록하고 100% 받기</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Vision Section - 최종 비전 */}
        <section className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal-950/50 to-transparent" />
          <div className="container mx-auto max-w-6xl relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
                우리가 꿈꾸는 최종 목표
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-premiumGold-500 to-premiumGold-600 mx-auto" />
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
                  className="bg-gradient-to-br from-charcoal-900/50 to-charcoal-950/50 backdrop-blur-sm border border-premiumGold-500/20 rounded-3xl p-8 hover:border-premiumGold-500/40 transition-all group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-premiumGold-500/20 to-premiumGold-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-premiumGold-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 whitespace-pre-line leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Class Introduction - 공식 런칭 클래스 */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-deepPurple-950/30 to-charcoal-950/30 backdrop-blur-sm border border-premiumGold-500/20 rounded-3xl p-12 md:p-16 text-center"
            >
              <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">
                이 위대한 여정, 어떻게 시작해야 할까요?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                떡상연구소가 21일 공식 런칭과 함께 모든 노하우를 담아 공개하는
                <br />
                <span className="text-premiumGold-500 font-semibold">1시간 집중 클래스</span>
              </p>

              <div className="bg-charcoal-950/50 rounded-2xl p-8 mb-8 border border-premiumGold-500/10">
                <p className="text-lg text-gray-300 mb-6">
                  이 1시간의 입문 과정은, 위에서 보여드린 '최종 결과물'을
                  <br />
                  당신도 만들 수 있다는 <span className="text-premiumGold-500 font-bold">'가능성을 증명하는 시간'</span>입니다.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gradient-to-br from-premiumGold-500/10 to-premiumGold-600/10 rounded-xl p-6 border border-premiumGold-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-premiumGold-500 font-bold">경험 1</span>
                    </div>
                    <p className="text-gray-300">AI와의 대화로 자동화 프로그램이 탄생하는 경험</p>
                  </div>
                  <div className="bg-gradient-to-br from-premiumGold-500/10 to-premiumGold-600/10 rounded-xl p-6 border border-premiumGold-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-premiumGold-500 font-bold">경험 2</span>
                    </div>
                    <p className="text-gray-300">AI 에이전트가 내 웹사이트를 만들어주는 경험</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Special Benefits - 조건부 특별 혜택 */}
        <section className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepPurple-950/20 to-transparent" />
          <div className="container mx-auto max-w-6xl relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
                오픈 기념! 미션 완료 시, 아래 혜택을 100% 드립니다
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-premiumGold-500 to-premiumGold-600 mx-auto" />
            </motion.div>

            {/* Mission Box */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-premiumGold-500/20 to-premiumGold-600/20 backdrop-blur-sm border-2 border-premiumGold-500/50 rounded-3xl p-8 md:p-12 mb-16 max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-premiumGold-500" />
                <h3 className="text-2xl font-bold text-premiumGold-500">※ '미션'이란?</h3>
              </div>
              <p className="text-lg text-white leading-relaxed mb-4">
                1시간 클래스를 따라 만든 '나만의 웹사이트 URL'을 제출하는 것입니다.
                <br />
                당신의 실행력을 증명하고, '첫 수강생'을 위한 모든 혜택을 독점하세요!
              </p>
              <p className="text-gray-300">
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
                  icon: Zap
                },
                {
                  tag: "능력 상승",
                  title: "AI 잠재력 200% 활용 '프롬프트 엔지니어링' 가이드",
                  value: "전문가 노하우",
                  icon: Star
                },
                {
                  tag: "독점 할인",
                  title: "80만원 즉시 할인! 'AI 올인원 마스터 패키지' 쿠폰",
                  value: "80만원",
                  icon: Gift
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-charcoal-900/80 to-charcoal-950/80 backdrop-blur-sm border border-premiumGold-500/20 rounded-3xl p-8 hover:border-premiumGold-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-premiumGold-500/20 text-premiumGold-500 text-sm font-medium rounded-full">
                      {benefit.tag}
                    </span>
                    <benefit.icon className="w-6 h-6 text-premiumGold-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-3xl font-playfair font-bold text-premiumGold-500">
                    {benefit.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-premiumGold-500/10 to-premiumGold-600/10 backdrop-blur-sm border border-premiumGold-500/30 rounded-3xl p-12 md:p-16 text-center"
            >
              <Gift className="w-16 h-16 text-premiumGold-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">
                기회를 선점하세요
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                떡상연구소의 첫 번째 공식 클래스, 그리고 80만원 상당의 혜택
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-premiumGold-500 to-premiumGold-600 text-charcoal-950 rounded-2xl font-bold text-lg hover:from-premiumGold-400 hover:to-premiumGold-500 transition-all shadow-2xl shadow-premiumGold-500/25 group"
                >
                  <Crown className="w-6 h-6" />
                  <span className="tracking-wide">80만원 상당 혜택, 지금 사전 등록하고 선점하기</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 px-4 border-t border-premiumGold-500/10">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-8 md:gap-16 opacity-60">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-premiumGold-500" />
                <span className="text-gray-400">수강생 1,000+</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-premiumGold-500" />
                <span className="text-gray-400">평점 4.9/5.0</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-premiumGold-500" />
                <span className="text-gray-400">검증된 커리큘럼</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-premiumGold-500/10">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/떡상연구소_로고-removebg-preview.png"
                    alt="떡상연구소 로고"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-premiumGold-500">떡상연구소</span>
              </div>
              <p className="text-gray-500 text-sm">
                © 2024 떡상연구소. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}