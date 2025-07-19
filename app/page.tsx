'use client'

import React, { Fragment } from 'react'
import { motion } from 'framer-motion'
import { 
  PlayCircle, 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Settings,
  Star,
  ArrowRight,
  Globe,
  Code2,
  Zap,
  Brain,
  Sparkles,
  Bot,
  Cpu,
  Database,
  Cloud,
  Terminal,
  Layers,
  Workflow,
  AlertTriangle,
  CheckCircle,
  Rocket,
  Shield,
  Award
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import MountainAurora from '@/components/MountainAurora'
import AscendingArrows from '@/components/AscendingArrows'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-950 relative overflow-hidden">
      <MountainAurora />
      <AscendingArrows />
      <div className="relative z-10">
        <Header currentPage="home" />

        {/* Hero Section - Aurora + Mountain Theme */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Trust badges */}
              <div className="flex justify-center gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 text-yellow-400"
                >
                  <Shield size={20} />
                  <span className="text-sm tracking-widest font-light">신뢰도 1위</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 text-yellow-400"
                >
                  <Award size={20} />
                  <span className="text-sm tracking-widest font-light">AI 교육 선도</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 text-yellow-400"
                >
                  <Star size={20} />
                  <span className="text-sm tracking-widest font-light">5.0 만족도</span>
                </motion.div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gold-foil via-amber-400 to-gold-foil bg-clip-text text-transparent tracking-ultra animate-shimmer">
                  떡상
                </span>
                <span className="text-white tracking-widest mx-2">의</span>
                <span className="text-white tracking-widest">시작</span>
                <br className="hidden md:block" />
                <span className="md:hidden"> </span>
                <span className="text-gray-200 tracking-wider text-4xl md:text-6xl">AI와 함께 성장하다</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-loose tracking-wider opacity-90">
                <span className="font-noto-serif">지식의 산을 넘어</span>
                <span className="text-aurora-amber-light mx-2">·</span>
                <span className="font-noto-serif">성공의 빛을 향해</span>
                <br />
                <span className="text-lg md:text-xl text-gray-400 tracking-wide">
                  AI 시대, 당신의 가능성에 날개를 달아드립니다
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/community" className="px-10 py-5 bg-gradient-to-r from-gold-foil to-amber-400 text-ink-950 rounded-full font-bold text-lg hover:from-amber-400 hover:to-gold-foil transition-all shadow-lg shadow-gold-foil/30 flex items-center justify-center tracking-wider group">
                    <MessageSquare className="mr-2 group-hover:animate-bounce" size={20} />
                    커뮤니티 시작하기
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/saas" className="px-10 py-5 border-2 border-gold-foil/60 text-gold-foil rounded-full font-bold text-lg hover:bg-gold-foil/10 hover:border-gold-foil hover:text-amber-300 transition-all backdrop-blur-sm flex items-center justify-center tracking-wider group">
                    <Sparkles className="mr-2 group-hover:animate-bounce" size={20} />
                    무료 강의 보기
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Tech Stack Section - 2줄 무한 슬라이드 */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-widest"
            >
              <span className="font-noto-serif">기술의</span>
              <span className="text-gold-foil mx-3">·</span>
              <span className="font-noto-serif">정상</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto tracking-wider font-light"
            >
              커뮤니티에서 함께 탐구하는 최신 기술들
            </motion.p>
          </div>
          
          {/* Infinite Scroll Container */}
          <div className="relative overflow-hidden">
            {/* Row 1 - Moving Right */}
            <div className="flex gap-4 mb-4">
              <motion.div
                animate={{ x: ["0%", "-100%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-4 flex-shrink-0"
              >
                {[...Array(2)].map((_, setIndex) => (
                  <Fragment key={setIndex}>
                    {/* AI Tools Card */}
                    <div className="w-80 bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all flex-shrink-0 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-foil to-amber-500 rounded-xl flex items-center justify-center group-hover:animate-float shadow-lg shadow-gold-foil/20">
                          <Brain className="text-ink-950" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wider">AI 도구</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Claude, ChatGPT, Gemini</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Cursor AI, Replit AI</span>
                        </div>
                      </div>
                    </div>

                    {/* Automation Tools Card */}
                    <div className="w-80 bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all flex-shrink-0 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-foil to-amber-500 rounded-xl flex items-center justify-center group-hover:animate-float shadow-lg shadow-gold-foil/20">
                          <Workflow className="text-ink-950" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wider">자동화 도구</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">n8n, Make, Zapier</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">LangChain, AutoGPT</span>
                        </div>
                      </div>
                    </div>

                    {/* Development Framework Card */}
                    <div className="w-80 bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all flex-shrink-0 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-foil to-amber-500 rounded-xl flex items-center justify-center group-hover:animate-float shadow-lg shadow-gold-foil/20">
                          <Layers className="text-ink-950" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wider">개발 프레임워크</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Next.js, React, Vue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Python, JavaScript, TypeScript</span>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </motion.div>
            </div>

            {/* Row 2 - Moving Left */}
            <div className="flex gap-4">
              <motion.div
                animate={{ x: ["-100%", "0%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-4 flex-shrink-0"
              >
                {[...Array(2)].map((_, setIndex) => (
                  <Fragment key={setIndex}>
                    {/* Database Card */}
                    <div className="w-80 bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all flex-shrink-0 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-foil to-amber-500 rounded-xl flex items-center justify-center group-hover:animate-float shadow-lg shadow-gold-foil/20">
                          <Database className="text-ink-950" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wider">데이터베이스</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Supabase, PostgreSQL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">MongoDB, Firebase</span>
                        </div>
                      </div>
                    </div>

                    {/* Cloud Services Card */}
                    <div className="w-80 bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all flex-shrink-0 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-foil to-amber-500 rounded-xl flex items-center justify-center group-hover:animate-float shadow-lg shadow-gold-foil/20">
                          <Cloud className="text-ink-950" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wider">클라우드 서비스</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Vercel, Netlify, AWS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Google Cloud, Azure</span>
                        </div>
                      </div>
                    </div>

                    {/* No-Code Tools Card */}
                    <div className="w-80 bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all flex-shrink-0 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-foil to-amber-500 rounded-xl flex items-center justify-center group-hover:animate-float shadow-lg shadow-gold-foil/20">
                          <Settings className="text-ink-950" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wider">노코드 도구</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Bubble, Webflow, Framer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold-foil rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Notion, Airtable</span>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 8월 오픈 예정 */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-widest"
            >
              <span className="font-noto-serif">성공의</span>
              <span className="text-gold-foil mx-3">·</span>
              <span className="font-noto-serif">길잡이</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto tracking-wider font-light"
            >
              떡상연구소가 제공하는 핵심 서비스
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold-foil to-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-gold-foil/20">
                <Globe className="text-ink-950" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white tracking-wider">AI 트렌드 허브</h4>
              <p className="text-gray-300 mb-4 leading-relaxed">
                매일 업데이트되는 AI 트렌드와 자동화 기술 소식
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  실시간 AI 뉴스 큐레이션
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  자동화 도구 리뷰
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  업계 동향 분석
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-foil/10 border border-gold-foil/30 rounded-full group-hover:bg-gold-foil/20 transition-colors">
                <Rocket className="text-gold-foil animate-bounce" size={16} />
                <span className="text-gold-foil text-sm font-semibold tracking-wider">8월 오픈 예정</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold-foil to-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-gold-foil/20">
                <Sparkles className="text-ink-950" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white tracking-wider">SaaS 프로젝트 쇼케이스</h4>
              <p className="text-gray-300 mb-4 leading-relaxed">
                창업자들의 SaaS 프로젝트를 소개하고 홍보하는 공간
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  프로젝트 갤러리
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  사용자 리뷰 시스템
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  투자자 매칭
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-foil/10 border border-gold-foil/30 rounded-full group-hover:bg-gold-foil/20 transition-colors">
                <Rocket className="text-gold-foil animate-bounce" size={16} />
                <span className="text-gold-foil text-sm font-semibold tracking-wider">8월 오픈 예정</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-ink-900/80 to-ink-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gold-foil/20 hover:border-gold-foil/40 transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold-foil to-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-gold-foil/20">
                <Users className="text-ink-950" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white tracking-wider">전문가 Q&A 커뮤니티</h4>
              <p className="text-gray-300 mb-4 leading-relaxed">
                AI 전문가들과 실시간으로 소통하는 지식 공유 공간
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  실시간 질문답변
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  전문가 멘토링
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gold-foil rounded-full"></div>
                  지식 아카이브
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-foil/10 border border-gold-foil/30 rounded-full group-hover:bg-gold-foil/20 transition-colors">
                <Rocket className="text-gold-foil animate-bounce" size={16} />
                <span className="text-gold-foil text-sm font-semibold tracking-wider">8월 오픈 예정</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20 px-4 relative">
        <AscendingArrows />
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Premium Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold-foil/20 via-amber-400/20 to-gold-foil/20 blur-3xl rounded-3xl animate-aurora"></div>
            
            <div className="relative bg-gradient-to-br from-ink-900/95 to-ink-800/95 backdrop-blur-xl rounded-3xl border border-gold-foil/30 overflow-hidden shadow-2xl">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-foil via-amber-400 to-gold-foil opacity-10 animate-shimmer"></div>
              
              <div className="relative p-10 md:p-16 text-center">
                {/* Premium Icon with Animation */}
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex justify-center mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold-foil blur-2xl opacity-50 animate-pulse"></div>
                    <AlertTriangle className="relative text-gold-foil" size={80} />
                  </div>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-foil to-amber-400 mb-6 tracking-ultra"
                >
                  ⚠️ FINAL WARNING
                </motion.h2>
                
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-widest"
                >
                  <span className="font-noto-serif">"산을 넘어 봄만이 성공의 떡상에 다가간다"</span>
                </motion.h3>
                
                <div className="space-y-6 mb-10 text-lg">
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-200 tracking-wider"
                  >
                    지금 시작하지 않으면 격차는 영원히 좁혀지지 않습니다.
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold bg-gradient-to-r from-gold-foil to-amber-300 bg-clip-text text-transparent"
                  >
                    선점자가 모든 것을 가져가는 시대
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl font-bold text-red-400 animate-pulse"
                  >
                    지금이 당신의 마지막 기회입니다
                  </motion.p>
                </div>

                {/* Premium Features Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-ink-800/80 to-ink-900/80 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-gold-foil/30"
                >
                  <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-foil to-amber-300 mb-6 flex items-center justify-center gap-3">
                    <Zap className="text-gold-foil" size={28} />
                    <span className="tracking-wider">AI 무료강의로 배우는 것들</span>
                  </h4>
                  
                  <div className="space-y-4 max-w-3xl mx-auto">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-gold-foil mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-200 text-left tracking-wider">
                        단 <span className="text-gold-foil font-bold">1시간</span> 만에 <span className="text-gold-foil font-bold">웹사이트부터 자동화 EXE파일</span>까지 전부 생성
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-gold-foil mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-200 text-left tracking-wider">
                        코딩 경험 <span className="text-gold-foil font-bold">0</span>이어도 <span className="text-gold-foil font-bold">프로 개발자 수준</span>의 결과물 생성
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-gold-foil mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-200 text-left tracking-wider">
                        <span className="text-gold-foil font-bold">월 1,000만원</span> 이상 수익 창출하는 SaaS 비즈니스 구축법
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gold-foil/20 space-y-3">
                      <p className="text-gray-400 tracking-wider">
                        "무료강의 후에 유료강의 홍보하겠지" 생각하시죠?
                      </p>
                      <p className="text-xl font-bold text-gold-foil tracking-wider">
                        이번이 정말 마지막입니다.
                      </p>
                      <p className="text-gray-300 tracking-wider">
                        초특가 할인은 <span className="text-red-400 font-bold">바로 마감</span> 후 종료됩니다.
                      </p>
                      <p className="text-2xl font-bold text-red-400 animate-pulse mt-4">
                        다시는 기회 없습니다.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Premium CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block mb-8"
                >
                  <Link 
                    href="/lectures" 
                    className="relative inline-flex items-center justify-center px-12 py-6 group"
                  >
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-foil to-amber-400 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-gold-foil to-amber-400 rounded-full font-bold text-xl text-ink-950 tracking-wider shadow-2xl">
                      <Rocket className="animate-bounce" size={28} />
                      <span className="tracking-ultra">정상 도전하기</span>
                      <ArrowRight size={24} />
                    </div>
                  </Link>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <p className="text-red-400 font-bold text-lg tracking-wider">
                    🔥 특별 할인 마감까지
                  </p>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 tracking-wider">
                    1일 7시간 11분 21초
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - 내용 수정 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-widest">
              <span className="font-noto-serif">궁금한</span>
              <span className="text-gold-foil mx-3">·</span>
              <span className="font-noto-serif">이야기</span>
            </h3>
            <p className="text-gray-400 text-lg tracking-wider font-light">
              떡상연구소에 대해 궁금한 점을 해결해드립니다
            </p>
          </div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-ink-900/50 backdrop-blur-sm rounded-xl border border-gold-foil/20 p-6"
            >
              <h4 className="text-xl font-semibold text-white mb-2">
                Q. 바이브 코딩이 뭔가요?
              </h4>
              <p className="text-gray-300">
                A. 바이브 코딩은 AI 도구들을 활용해 기존 개발 방식보다 10배 빠르게 
                웹서비스를 만드는 새로운 개발 방법론입니다. 코딩 경험이 없어도 
                AI와 노코드 도구를 조합해 원하는 서비스를 만들 수 있습니다.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-ink-900/50 backdrop-blur-sm rounded-xl border border-gold-foil/20 p-6"
            >
              <h4 className="text-xl font-semibold text-white mb-2">
                Q. 이 사이트를 정말 하루만에 만들었나요?
              </h4>
              <p className="text-gray-300">
                A. 네, 실제로 1시간 만에 기본 구조를 완성했고, 하루 만에 배포까지 
                완료했습니다. Claude AI, Cursor, Next.js를 활용했고, 
                Supabase로 데이터베이스를 구축했습니다. 이 모든 과정을 강의에서 공개합니다.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-ink-900/50 backdrop-blur-sm rounded-xl border border-gold-foil/20 p-6"
            >
              <h4 className="text-xl font-semibold text-white mb-2">
                Q. 프로그래밍 경험이 없어도 가능한가요?
              </h4>
              <p className="text-gray-300">
                A. 물론입니다! 오히려 기존 개발 방식에 익숙하지 않은 분들이 
                더 빠르게 적응하는 경우가 많습니다. AI가 코드를 대신 작성해주기 때문에 
                아이디어와 열정만 있다면 누구나 시작할 수 있습니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-ink-900/50 to-ink-950">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-gold-foil tracking-ultra animate-shimmer">산을 넘으세요</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto tracking-wider leading-relaxed">
              AI 시대의 주인공이 되고 싶다면, 떡상연구소와 함께하세요.
              <br />
              <span className="text-gold-foil font-semibold">산을 넘어 성공의 정상에 오르세요.</span>
            </p>
            
            <div className="bg-gradient-to-r from-gold-foil/10 to-amber-400/10 p-8 rounded-xl border border-gold-foil/30 mb-8 backdrop-blur-sm">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold-foil mb-2 tracking-wider">100%</div>
                  <p className="text-gray-300 tracking-wide">무료 체험</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold-foil mb-2 tracking-wider">24/7</div>
                  <p className="text-gray-300 tracking-wide">지원 서비스</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold-foil mb-2 tracking-wider">∞</div>
                  <p className="text-gray-300 tracking-wide">평생 업데이트</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href="/community" 
                  className="block w-full px-8 py-4 bg-gradient-to-r from-gold-foil to-amber-400 text-ink-950 rounded-lg font-bold text-lg hover:from-amber-400 hover:to-gold-foil transition-all transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg shadow-gold-foil/30 tracking-wider"
                >
                  <MessageSquare className="mr-2" size={24} />
                  커뮤니티 바로가기
                </Link>
                <Link 
                  href="/lectures" 
                  className="block w-full px-8 py-4 border-2 border-gold-foil text-gold-foil rounded-lg font-bold text-lg hover:bg-gold-foil hover:text-ink-950 transition-all flex items-center justify-center mx-auto tracking-wider"
                >
                  <PlayCircle className="mr-2" size={24} />
                  무료 강의 시작하기
                </Link>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              ※ 회원가입만으로 모든 기본 기능을 무료로 이용할 수 있습니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gold-foil/20">
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
                <span className="text-lg font-semibold text-gold-foil tracking-wider">떡상연구소</span>
              </div>
              <p className="text-gray-400 text-sm tracking-wide">
                AI 시대를 앞서가는 교육 플랫폼
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">서비스</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold-foil transition-colors">온라인 강의</a></li>
                <li><a href="#" className="hover:text-gold-foil transition-colors">커뮤니티</a></li>
                <li><a href="#" className="hover:text-gold-foil transition-colors">SaaS 홍보</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">지원</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold-foil transition-colors">고객센터</a></li>
                <li><a href="#" className="hover:text-gold-foil transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-gold-foil transition-colors">문의하기</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">회사</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold-foil transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-gold-foil transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-gold-foil transition-colors">회사소개</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gold-foil/20 text-center text-gray-400 text-sm tracking-wide">
            <p>&copy; 2024 떡상연구소. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}