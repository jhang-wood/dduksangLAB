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
import StarField from '@/components/StarField'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <StarField />
      <div className="relative z-10">
        <Header currentPage="home" />

        {/* Hero Section - Premium Space Theme */}
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
                  <span className="text-sm tracking-wider">신뢰도 1위</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 text-yellow-400"
                >
                  <Award size={20} />
                  <span className="text-sm tracking-wider">AI 교육 선도</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 text-yellow-400"
                >
                  <Star size={20} />
                  <span className="text-sm tracking-wider">5.0 만족도</span>
                </motion.div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-wider">
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  이 사이트도
                </span>
                <br className="hidden md:block" />
                <span className="md:hidden"> </span>
                <span className="text-white tracking-wider">1시간만에 만들어졌습니다</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed tracking-wide opacity-90">
                AI와 노코드 도구를 활용하면 <br className="md:hidden" />
                누구나 빠르게 웹서비스를 만들 수 있습니다.
                <br />
                함께 성장하는 개발자 커뮤니티에서 <br className="md:hidden" />
                당신의 아이디어를 현실로 만드세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/community" className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all shadow-lg shadow-yellow-400/30 flex items-center justify-center tracking-wide">
                    <MessageSquare className="mr-2" size={20} />
                    커뮤니티 바로가기
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/saas" className="px-10 py-5 border-2 border-yellow-400 text-yellow-400 rounded-full font-bold text-lg hover:bg-yellow-400/10 hover:border-orange-400 hover:text-orange-400 transition-all backdrop-blur-sm flex items-center justify-center tracking-wide">
                    <Sparkles className="mr-2" size={20} />
                    SaaS 프로젝트 구경하기
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

      {/* Tech Stack Section - 2줄 무한 슬라이드 */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-wide"
            >
              주요 활용 기술
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto tracking-wide"
            >
              커뮤니티에서 다루는 최신 기술 스택
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
                  <React.Fragment key={setIndex}>
                    {/* AI Tools Card */}
                    <div className="w-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all flex-shrink-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                          <Brain className="text-black" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide">AI 도구</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Claude, ChatGPT, Gemini</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Cursor AI, Replit AI</span>
                        </div>
                      </div>
                    </div>

                    {/* Automation Tools Card */}
                    <div className="w-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all flex-shrink-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                          <Workflow className="text-black" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide">자동화 도구</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">n8n, Make, Zapier</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">LangChain, AutoGPT</span>
                        </div>
                      </div>
                    </div>

                    {/* Development Framework Card */}
                    <div className="w-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all flex-shrink-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                          <Layers className="text-black" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide">개발 프레임워크</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Next.js, React, Vue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Python, JavaScript, TypeScript</span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
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
                  <React.Fragment key={setIndex}>
                    {/* Database Card */}
                    <div className="w-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all flex-shrink-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                          <Database className="text-black" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide">데이터베이스</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Supabase, PostgreSQL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">MongoDB, Firebase</span>
                        </div>
                      </div>
                    </div>

                    {/* Cloud Services Card */}
                    <div className="w-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all flex-shrink-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                          <Cloud className="text-black" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide">클라우드 서비스</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Vercel, Netlify, AWS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Google Cloud, Azure</span>
                        </div>
                      </div>
                    </div>

                    {/* No-Code Tools Card */}
                    <div className="w-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all flex-shrink-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                          <Settings className="text-black" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide">노코드 도구</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Bubble, Webflow, Framer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300 tracking-wide">Notion, Airtable</span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
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
              className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-wide"
            >
              핵심 기능 소개
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto tracking-wide"
            >
              AI 시대를 선도하는 커뮤니티의 핵심 서비스
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-black" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white tracking-wide">AI 자동화 뉴스</h4>
              <p className="text-gray-300 mb-4 leading-relaxed">
                매일 업데이트되는 AI 트렌드와 자동화 기술 소식
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  실시간 AI 뉴스 큐레이션
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  자동화 도구 리뷰
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  업계 동향 분석
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full">
                <Rocket className="text-yellow-400" size={16} />
                <span className="text-yellow-400 text-sm font-semibold tracking-wide">8월 오픈 예정</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="text-black" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white tracking-wide">SaaS 프로젝트 쇼케이스</h4>
              <p className="text-gray-300 mb-4 leading-relaxed">
                창업자들의 SaaS 프로젝트를 소개하고 홍보하는 공간
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  프로젝트 갤러리
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  사용자 리뷰 시스템
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  투자자 매칭
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full">
                <Rocket className="text-yellow-400" size={16} />
                <span className="text-yellow-400 text-sm font-semibold tracking-wide">8월 오픈 예정</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-black" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white tracking-wide">전문가 Q&A 커뮤니티</h4>
              <p className="text-gray-300 mb-4 leading-relaxed">
                AI 전문가들과 실시간으로 소통하는 지식 공유 공간
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  실시간 질문답변
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  전문가 멘토링
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  지식 아카이브
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full">
                <Rocket className="text-yellow-400" size={16} />
                <span className="text-yellow-400 text-sm font-semibold tracking-wide">8월 오픈 예정</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Premium Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 blur-3xl rounded-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-yellow-500/40 overflow-hidden shadow-2xl">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-20"></div>
              
              <div className="relative p-10 md:p-16 text-center">
                {/* Premium Icon with Animation */}
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex justify-center mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 animate-pulse"></div>
                    <AlertTriangle className="relative text-yellow-400" size={80} />
                  </div>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-6 tracking-wider"
                >
                  ⚠️ FINAL WARNING
                </motion.h2>
                
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-wide"
                >
                  "AI 시대의 승자와 패자가 결정되는 순간"
                </motion.h3>
                
                <div className="space-y-6 mb-10 text-lg">
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-200 tracking-wide"
                  >
                    지금 시작하지 않으면 격차는 영원히 좁혀지지 않습니다.
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent"
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
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-yellow-500/30"
                >
                  <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-6 flex items-center justify-center gap-3">
                    <Zap className="text-yellow-400" size={28} />
                    AI 무료강의로 배우는 것들
                  </h4>
                  
                  <div className="space-y-4 max-w-3xl mx-auto">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-200 text-left tracking-wide">
                        단 <span className="text-yellow-400 font-bold">1시간</span> 만에 <span className="text-yellow-400 font-bold">웹사이트부터 자동화 EXE파일</span>까지 전부 생성
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-200 text-left tracking-wide">
                        코딩 경험 <span className="text-yellow-400 font-bold">0</span>이어도 <span className="text-yellow-400 font-bold">프로 개발자 수준</span>의 결과물 생성
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-200 text-left tracking-wide">
                        <span className="text-yellow-400 font-bold">월 1,000만원</span> 이상 수익 창출하는 SaaS 비즈니스 구축법
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-yellow-500/20 space-y-3">
                      <p className="text-gray-400 tracking-wide">
                        "무료강의 후에 유료강의 홍보하겠지" 생각하시죠?
                      </p>
                      <p className="text-xl font-bold text-yellow-400 tracking-wide">
                        이번이 정말 마지막입니다.
                      </p>
                      <p className="text-gray-300 tracking-wide">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full font-bold text-xl text-black tracking-wider shadow-2xl">
                      <Rocket className="animate-bounce" size={28} />
                      긴급 탑승하기
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
                  <p className="text-red-400 font-bold text-lg tracking-wide">
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
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6"
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
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6"
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
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-yellow-400">지금 시작하세요</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              AI 시대의 주인공이 되고 싶다면, 떡상연구소와 함께하세요.
              <br />
              단 1시간만에 당신도 AI 전문가가 될 수 있습니다.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-600/20 p-8 rounded-xl border border-yellow-500/30 mb-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
                  <p className="text-gray-300">무료 체험</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                  <p className="text-gray-300">지원 서비스</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">∞</div>
                  <p className="text-gray-300">평생 업데이트</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href="/community" 
                  className="block w-full px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-all transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg"
                >
                  <MessageSquare className="mr-2" size={24} />
                  커뮤니티 바로가기
                </Link>
                <Link 
                  href="/lectures" 
                  className="block w-full px-8 py-4 border-2 border-yellow-400 text-yellow-400 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center mx-auto"
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