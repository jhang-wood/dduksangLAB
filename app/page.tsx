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
import ModernBackground from '@/components/ModernBackground'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      <ModernBackground />
      <div className="relative z-10">
        <Header currentPage="home" />

        {/* Hero Section - 모던 미니멀 디자인 */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-12"
              >
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full mb-8"
              >
                <div className="w-2 h-2 bg-accent-electric rounded-full animate-pulse" />
                <span className="text-neutral-300 text-sm font-medium tracking-wide">LAUNCHING SOON</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              >
                <span className="block text-white mb-2">코딩 없이 AI와</span>
                <span className="block bg-gradient-to-r from-accent-electric to-accent-neon bg-clip-text text-transparent">
                  대화로 만드는 자동화
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                복잡한 코드나 노코드 툴 없이 AI와의 자연스러운 대화만으로
                <br />
                자동화 프로그램을 만드는 새로운 방법을 경험하세요.
              </motion.p>

              {/* Launch Date */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <p className="text-sm text-neutral-500 mb-3 uppercase tracking-wider">Launch Date</p>
                <p className="text-2xl font-semibold text-white">2025년 1월 21일</p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Link 
                  href="/register"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-950 rounded-xl font-semibold hover:bg-neutral-100 transition-all group"
                >
                  <span>사전 등록하기</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Vision Section - 모던 미니멀 */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                우리가 만드는 미래
              </h2>
              <p className="text-neutral-400 text-lg">AI로 누구나 만들 수 있는 자동화의 시대</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: MessageSquare,
                  title: "대화형 프로그래밍",
                  description: "자연어로 설명하면 AI가 코드로 변환"
                },
                {
                  icon: Globe,
                  title: "원클릭 배포",
                  description: "만든 즉시 웹에서 바로 실행"
                },
                {
                  icon: Zap,
                  title: "실시간 자동화",
                  description: "복잡한 작업도 몇 분 만에 자동화"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:bg-neutral-900/80 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-electric/20 to-accent-neon/20 rounded-xl flex items-center justify-center mb-6">
                      <item.icon className="w-6 h-6 text-accent-electric" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Class Introduction - 모던 스타일 */}
        <section className="py-24 px-4 bg-neutral-900/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                어떻게 시작할까요?
              </h2>
              <p className="text-lg text-neutral-400 mb-12">
                1시간 만에 AI 자동화의 가능성을 직접 경험하세요
              </p>

              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 md:p-12">
                <div className="max-w-3xl mx-auto">
                  <p className="text-neutral-300 mb-8 text-lg leading-relaxed">
                    떡상연구소의 첫 공식 클래스에서
                    <br />
                    <span className="text-white font-semibold">실제로 작동하는 자동화 프로그램</span>을 만들어봅니다
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-neutral-900 rounded-xl p-6 text-left">
                      <div className="text-accent-electric font-semibold mb-2">Step 1</div>
                      <p className="text-neutral-300">AI와 대화로 자동화 로직 설계</p>
                    </div>
                    <div className="bg-neutral-900 rounded-xl p-6 text-left">
                      <div className="text-accent-neon font-semibold mb-2">Step 2</div>
                      <p className="text-neutral-300">실시간으로 웹사이트 생성 및 배포</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Special Benefits - 모던 혜택 섹션 */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                런칭 기념 특별 혜택
              </h2>
              <p className="text-neutral-400 text-lg">미션 완료 시 100% 제공</p>
            </motion.div>

            {/* Mission Box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-accent-electric/10 to-accent-neon/10 border border-neutral-800 rounded-2xl p-8 mb-12 max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-accent-electric" />
                <h3 className="text-xl font-semibold text-white">미션 안내</h3>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                클래스를 따라 만든 웹사이트 URL을 제출하시면
                <br />
                아래의 모든 혜택을 즉시 제공해드립니다.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "자동화 프롬프트 세트",
                  description: "실무 검증된 n8n 자동화 템플릿",
                  icon: Zap,
                  bgClass: "bg-gradient-to-br from-accent-electric/20 to-transparent",
                  iconClass: "text-accent-electric"
                },
                {
                  title: "프롬프트 엔지니어링 가이드",
                  description: "AI 활용도를 200% 높이는 전문 가이드",
                  icon: Star,
                  bgClass: "bg-gradient-to-br from-accent-neon/20 to-transparent",
                  iconClass: "text-accent-neon"
                },
                {
                  title: "80만원 할인 쿠폰",
                  description: "AI 마스터 패키지 즉시 할인",
                  icon: Gift,
                  bgClass: "bg-gradient-to-br from-accent-electric/20 to-transparent",
                  iconClass: "text-accent-electric"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/80 transition-all"
                >
                  <div className={`w-12 h-12 ${benefit.bgClass} rounded-xl flex items-center justify-center mb-4`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.iconClass}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-4 bg-neutral-900/50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                지금 시작하세요
              </h2>
              <p className="text-lg text-neutral-400 mb-8">
                AI 자동화의 미래를 먼저 경험할 기회
              </p>
              <Link 
                href="/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-electric to-accent-neon text-white rounded-xl font-semibold hover:opacity-90 transition-all group"
              >
                <span>사전 등록하고 혜택 받기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 px-4 border-t border-neutral-800">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-neutral-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">1,000+ 수강생</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="text-sm">4.9/5.0 평점</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">검증된 커리큘럼</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-neutral-800">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/떡상연구소_로고-removebg-preview.png"
                    alt="떡상연구소"
                    fill
                    className="object-contain opacity-80"
                  />
                </div>
                <span className="text-lg font-medium text-neutral-300">떡상연구소</span>
              </div>
              <p className="text-neutral-500 text-sm">
                © 2025 떡상연구소. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}