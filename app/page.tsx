'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  PlayCircle, 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Settings,
  Star,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-16 h-16">
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소 로고"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#lectures" className="text-gray-300 hover:text-yellow-400 transition-colors">강의</a>
              <a href="#community" className="text-gray-300 hover:text-yellow-400 transition-colors">커뮤니티</a>
              <a href="#saas" className="text-gray-300 hover:text-yellow-400 transition-colors">SaaS</a>
              <a href="#admin" className="text-gray-300 hover:text-yellow-400 transition-colors">관리</a>
            </nav>
            <div className="flex space-x-3">
              <Link href="/auth/login" className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-black transition-colors">
                로그인
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-full text-sm font-semibold">
                ⚡ 이 페이지도 1시간만에 만들어졌습니다
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                완벽한 AI 시대가
              </span>
              <br />
              <span className="text-white">열렸습니다</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              더 이상 늦지마세요. AI와 함께하는 미래,
              <br />
              지금 시작하지 않으면 영원히 뒤처집니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center">
                <PlayCircle className="mr-2" size={20} />
                무료 체험하기
              </button>
              <button className="px-8 py-4 border border-yellow-400 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-colors">
                더 알아보기
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              왜 <span className="text-yellow-400">떡상연구소</span>인가?
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              전문적인 AI 교육부터 활발한 커뮤니티, SaaS 홍보까지 한 곳에서
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-yellow-400 text-3xl font-bold mb-2">2025년 8월</div>
                  <div className="text-white text-lg">오픈 예정</div>
                </div>
              </div>
              <div className="opacity-30">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="text-black" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">전문 강의</h4>
                <p className="text-gray-300 mb-4">
                  체계적인 AI/노코드 교육 프로그램으로 전문성을 키우세요
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 단계별 커리큘럼</li>
                  <li>• 실무 중심 교육</li>
                  <li>• 개인 맞춤 학습</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-yellow-400 text-3xl font-bold mb-2">2025년 8월</div>
                  <div className="text-white text-lg">오픈 예정</div>
                </div>
              </div>
              <div className="opacity-30">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="text-black" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">활발한 커뮤니티</h4>
                <p className="text-gray-300 mb-4">
                  전국의 수강생들과 지식을 공유하고 네트워킹하세요
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 실시간 질문답변</li>
                  <li>• 프로젝트 공유</li>
                  <li>• 멘토링 시스템</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-yellow-400 text-3xl font-bold mb-2">2025년 8월</div>
                  <div className="text-white text-lg">오픈 예정</div>
                </div>
              </div>
              <div className="opacity-30">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="text-black" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">SaaS 홍보</h4>
                <p className="text-gray-300 mb-4">
                  개발한 SaaS를 효과적으로 홍보하고 사용자를 모으세요
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 카드형 홍보</li>
                  <li>• 트렌드 분석</li>
                  <li>• 마케팅 지원</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-yellow-900/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              떡상연구소의 <span className="text-yellow-400">놀라운 성과</span>
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              실제 수강생들이 만들어낸 놀라운 변화의 숫자들
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2">2,847+</div>
              <div className="text-xl text-gray-300">수강생</div>
              <div className="text-sm text-gray-500 mt-2">전국에서 함께하는</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2">92%</div>
              <div className="text-xl text-gray-300">만족도</div>
              <div className="text-sm text-gray-500 mt-2">수강생 평균 만족도</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2">₩15M</div>
              <div className="text-xl text-gray-300">평균 수익</div>
              <div className="text-sm text-gray-500 mt-2">6개월 내 달성</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-xl text-gray-300">서포트</div>
              <div className="text-sm text-gray-500 mt-2">언제나 함께하는</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              <span className="text-yellow-400">수강생들의</span> 생생한 후기
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              떡상연구소와 함께 성공한 사람들의 이야기
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  김
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">김OO</h4>
                  <p className="text-gray-400 text-sm">전업 트레이더</p>
                </div>
              </div>
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="inline-block w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300">
                "AI 활용법을 배운 후 수익률이 3배나 증가했습니다. 
                체계적인 커리큘럼과 실무 중심 교육이 정말 도움이 되었어요."
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  이
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">이OO</h4>
                  <p className="text-gray-400 text-sm">스타트업 대표</p>
                </div>
              </div>
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="inline-block w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300">
                "노코드로 MVP를 1주일 만에 만들었습니다. 
                투자 유치까지 성공했어요. 떡상연구소 최고!"
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  박
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">박OO</h4>
                  <p className="text-gray-400 text-sm">프리랜서 개발자</p>
                </div>
              </div>
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="inline-block w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300">
                "AI 자동화로 업무 시간이 70% 단축되었습니다. 
                덕분에 더 많은 프로젝트를 진행할 수 있게 되었어요."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              떡상연구소의 <span className="text-yellow-400">학습 프로세스</span>
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              체계적인 4단계 프로세스로 누구나 AI 전문가가 됩니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-yellow-400 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                1
              </div>
              <h4 className="text-xl font-semibold text-white text-center mb-2">기초 학습</h4>
              <p className="text-gray-400 text-center">
                AI/노코드 기본 개념과 핵심 원리를 쉽게 이해
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-yellow-400 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                2
              </div>
              <h4 className="text-xl font-semibold text-white text-center mb-2">실습 프로젝트</h4>
              <p className="text-gray-400 text-center">
                실제 프로젝트를 통한 hands-on 경험 축적
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-yellow-400 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                3
              </div>
              <h4 className="text-xl font-semibold text-white text-center mb-2">멘토링</h4>
              <p className="text-gray-400 text-center">
                전문가의 1:1 맞춤형 피드백과 코칭
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-yellow-400 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mb-4 mx-auto">
                4
              </div>
              <h4 className="text-xl font-semibold text-white text-center mb-2">수익화</h4>
              <p className="text-gray-400 text-center">
                실제 수익 창출까지 완벽 지원
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              자주 묻는 <span className="text-yellow-400">질문</span>
            </h3>
            <p className="text-gray-300 text-lg">
              떡상연구소에 대해 궁금한 점을 해결해드립니다
            </p>
          </div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6"
            >
              <h4 className="text-xl font-semibold text-white mb-2">
                Q. 프로그래밍 경험이 없어도 수강할 수 있나요?
              </h4>
              <p className="text-gray-300">
                A. 네, 전혀 문제없습니다! 떡상연구소는 비전공자도 쉽게 따라올 수 있도록 
                기초부터 차근차근 알려드립니다. 노코드 툴을 활용하기 때문에 
                프로그래밍 지식이 없어도 충분히 수강 가능합니다.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6"
            >
              <h4 className="text-xl font-semibold text-white mb-2">
                Q. 수강 기간은 얼마나 되나요?
              </h4>
              <p className="text-gray-300">
                A. 기본 과정은 12주이며, 평생 수강이 가능합니다. 
                본인의 페이스에 맞춰 학습할 수 있고, 
                업데이트되는 콘텐츠도 계속 무료로 제공됩니다.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6"
            >
              <h4 className="text-xl font-semibold text-white mb-2">
                Q. 실제로 수익을 낼 수 있나요?
              </h4>
              <p className="text-gray-300">
                A. 90% 이상의 수강생이 2개월 내 첫 수익을 달성했습니다. 
                체계적인 커리큘럼과 실무 프로젝트, 그리고 멘토링을 통해 
                실제 수익화까지 완벽하게 지원합니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900/20 to-red-600/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <span className="text-red-500 text-6xl mb-4 block">⚠️</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                마지막 경고
              </h3>
              <p className="text-2xl md:text-3xl text-red-400 font-bold">
                "AI 시대는 이미 시작되었습니다"
              </p>
            </div>
            
            <div className="space-y-6 text-center mb-10">
              <p className="text-xl text-gray-300">
                지금 시작하지 않으면 격차는 더욱 벌어집니다.
              </p>
              <p className="text-xl text-yellow-400 font-semibold">
                선점자가 모든 것을 가져가는 시대,
              </p>
              <p className="text-2xl text-red-400 font-bold">
                지금이 마지막 기회입니다.
              </p>
              <div className="py-4">
                <p className="text-lg text-gray-300">
                  솔로프리너의 시대, 1인 기업의 시대
                </p>
                <p className="text-xl text-white font-semibold">
                  준비된 사람만이 살아남습니다.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 mb-8">
              <h4 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center justify-center">
                <span className="mr-2">🚀</span> AI 무료강의로 배우는 것들
              </h4>
              <p className="text-lg text-gray-300 mb-6">
                이 강의만으로도 웹사이트부터 자동화 EXE파일까지 전부 생성 가능합니다.<br />
                그것도 아주 쉽고 빠르게 전부 다 알려드릴께요.
              </p>
              <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-400 mb-4">
                  그리고 무료강의 후에 유료강의 홍보하겠지 생각하실텐데<br />
                  아시는 분들은 아시다시피 <span className="text-red-400 font-bold">이번이 마지막입니다.</span>
                </p>
                <p className="text-gray-300">
                  유료 오픈하겠지만 빠른 시일내에 저를 믿고 기다려주신 분들을 위해서<br />
                  초특가 할인은 바로 마감 후 시킬 예정입니다.
                </p>
                <p className="text-xl text-red-400 font-bold mt-4">
                  다시는 기회 없습니다. 아실 분들은 아실겁니다.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <p className="text-2xl text-yellow-400 font-bold mb-2">⏰ 마감까지</p>
                <p className="text-3xl md:text-4xl text-white font-bold">
                  4일 1시간 37분 5초
                </p>
              </div>
              <button className="px-10 py-5 bg-red-500 text-white rounded-lg font-semibold text-xl hover:bg-red-600 transition-all transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg">
                지금 무료 강의 신청하기
                <ArrowRight className="ml-3" size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-yellow-500/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/떡상연구소_로고-removebg-preview.png"
                    alt="떡상연구소 로고"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-semibold text-yellow-400">떡상연구소</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI 시대를 앞서가는 교육 플랫폼
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">서비스</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-400">온라인 강의</a></li>
                <li><a href="#" className="hover:text-yellow-400">커뮤니티</a></li>
                <li><a href="#" className="hover:text-yellow-400">SaaS 홍보</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">지원</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-400">고객센터</a></li>
                <li><a href="#" className="hover:text-yellow-400">FAQ</a></li>
                <li><a href="#" className="hover:text-yellow-400">문의하기</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">회사</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-400">이용약관</a></li>
                <li><a href="#" className="hover:text-yellow-400">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-yellow-400">회사소개</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-yellow-500/20 text-center text-gray-400 text-sm">
            <p>&copy; 2024 떡상연구소. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}