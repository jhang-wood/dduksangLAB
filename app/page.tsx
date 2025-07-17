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
  Workflow
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                이 사이트도
              </span>
              <br />
              <span className="text-white">1시간만에 만들어졌습니다</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI와 노코드 도구를 활용하면 누구나 빠르게 웹서비스를 만들 수 있습니다.
              <br />
              함께 성장하는 개발자 커뮤니티에서 당신의 아이디어를 현실로 만드세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community" className="px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center">
                <MessageSquare className="mr-2" size={20} />
                커뮤니티 바로가기
              </Link>
              <Link href="/saas" className="px-8 py-4 border border-yellow-400 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center">
                <Sparkles className="mr-2" size={20} />
                SaaS 프로젝트 구경하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              주요 활용 기술
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              커뮤니티에서 다루는 최신 기술 스택
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <motion.div
              animate={{
                x: ["-100%", "0%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
              className="flex gap-8 py-8"
            >
              {/* Tech logos */}
              <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Cpu className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Python</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Brain className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Google AI</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Workflow className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">LangChain</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Zap className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">n8n</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Settings className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Make</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Bot className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Cursor AI</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Code2 className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Replit AI</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Terminal className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Claude</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Layers className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Next.js</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Database className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Ruby on Rails</span>
                </div>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Cpu className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Python</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Brain className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Google AI</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Workflow className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">LangChain</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Zap className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">n8n</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Settings className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Make</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Bot className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Cursor AI</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Code2 className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Replit AI</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Terminal className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Claude</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Layers className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Next.js</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gray-900/50 rounded-lg border border-yellow-500/20">
                  <Database className="text-yellow-400" size={24} />
                  <span className="text-white font-semibold">Ruby on Rails</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              핵심 기능 소개
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              AI 시대를 선도하는 커뮤니티의 핵심 서비스
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
                  <div className="text-yellow-400 text-3xl font-bold mb-2">8월 오픈 예정</div>
                </div>
              </div>
              <div className="opacity-30">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                  <Globe className="text-black" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">AI 자동화 뉴스</h4>
                <p className="text-gray-300 mb-4">
                  매일 업데이트되는 AI 트렌드와 자동화 기술 소식
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 실시간 AI 뉴스 큐레이션</li>
                  <li>• 자동화 도구 리뷰</li>
                  <li>• 업계 동향 분석</li>
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
                  <div className="text-yellow-400 text-3xl font-bold mb-2">8월 오픈 예정</div>
                </div>
              </div>
              <div className="opacity-30">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="text-black" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">SaaS 프로젝트 쇼케이스</h4>
                <p className="text-gray-300 mb-4">
                  창업자들의 SaaS 프로젝트를 소개하고 홍보하는 공간
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 프로젝트 갤러리</li>
                  <li>• 사용자 리뷰 시스템</li>
                  <li>• 투자자 매칭</li>
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
                  <div className="text-yellow-400 text-3xl font-bold mb-2">8월 오픈 예정</div>
                </div>
              </div>
              <div className="opacity-30">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-black" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-white">전문가 Q&A 커뮤니티</h4>
                <p className="text-gray-300 mb-4">
                  AI 전문가들과 실시간으로 소통하는 지식 공유 공간
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 실시간 질문답변</li>
                  <li>• 전문가 멘토링</li>
                  <li>• 지식 아카이브</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Feed Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              실시간 커뮤니티 피드
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              지금 이 순간에도 활발히 소통하고 있는 커뮤니티
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Posts */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MessageSquare className="mr-2 text-yellow-400" size={20} />
                최신 게시글
              </h4>
              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                      김
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium">AI로 월 1000만원 버는 방법 공유</h5>
                      <p className="text-gray-400 text-sm mt-1">김OO • 방금 전</p>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-800 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                      이
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium">n8n 자동화 수익화 후기</h5>
                      <p className="text-gray-400 text-sm mt-1">이OO • 5분 전</p>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-800 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                      박
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium">Cursor AI로 SaaS 만들기 성공</h5>
                      <p className="text-gray-400 text-sm mt-1">박OO • 15분 전</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Live Activities */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-yellow-400" size={20} />
                실시간 활동
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-300 text-sm">
                    <span className="text-white font-medium">최OO</span>님이 <span className="text-yellow-400">"AI 뉴스"</span> 게시판에 새 글을 작성했습니다
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-300 text-sm">
                    <span className="text-white font-medium">정OO</span>님이 <span className="text-yellow-400">"SaaS 프로젝트"</span>를 등록했습니다
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-300 text-sm">
                    <span className="text-white font-medium">한OO</span>님이 댓글을 남겼습니다
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-300 text-sm">
                    <span className="text-white font-medium">강OO</span>님이 좋아요를 눌렀습니다
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-300 text-sm">
                    <span className="text-white font-medium">손OO</span>님이 <span className="text-yellow-400">"Q&A"</span>에 질문을 등록했습니다
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-yellow-400 text-sm font-medium">현재 접속자 2,847명</p>
              </div>
            </div>
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