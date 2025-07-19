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

              {/* Main Headline */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-montserrat font-bold mb-8 leading-tight tracking-wider"
              >
                <span className="block text-offWhite-200 mb-4">코딩도, 노코드 툴도 없는</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900">
                  새로운 시대가 시작됩니다
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl text-offWhite-500 max-w-4xl mx-auto mb-16 leading-relaxed font-light"
              >
                AI와의 <span className="text-metallicGold-500 font-semibold">'대화'</span>만으로 자동화 프로그램을 만드는,
                <br />
                떡상연구소의 첫 번째 공식 클래스에 당신을 초대합니다.
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