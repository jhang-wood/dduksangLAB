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
  CheckCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header currentPage="home" />

      {/* Hero Section - 반응형 개선 */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                이 사이트도
              </span>
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              <span className="text-white">1시간만에 만들어졌습니다</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI와 노코드 도구를 활용하면 <br className="md:hidden" />
              누구나 빠르게 웹서비스를 만들 수 있습니다.
              <br />
              함께 성장하는 개발자 커뮤니티에서 <br className="md:hidden" />
              당신의 아이디어를 현실로 만드세요.
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

      {/* Tech Stack Section - 3열 카드 레이아웃 */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <Brain className="text-yellow-400" size={32} />
                <h3 className="text-xl font-bold text-white">AI 도구</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">Claude, ChatGPT</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">Cursor AI, Replit AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">Google AI, Gemini</span>
                </div>
              </div>
            </motion.div>

            {/* Row 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <Workflow className="text-yellow-400" size={32} />
                <h3 className="text-xl font-bold text-white">자동화 도구</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">n8n, Make (Integromat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">Zapier, Workato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">LangChain, AutoGPT</span>
                </div>
              </div>
            </motion.div>

            {/* Row 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <Layers className="text-yellow-400" size={32} />
                <h3 className="text-xl font-bold text-white">개발 프레임워크</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">Next.js, React</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">Python, JavaScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="text-yellow-400/60" size={20} />
                  <span className="text-gray-300">Supabase, PostgreSQL</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - 8월 오픈 예정 제거 */}
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
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
            >
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
              <div className="mt-4 text-yellow-400 text-sm font-medium">
                곧 공개 예정
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
            >
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
              <div className="mt-4 text-yellow-400 text-sm font-medium">
                서비스 준비 중
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
            >
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
              <div className="mt-4 text-green-400 text-sm font-medium">
                ✅ 현재 운영 중
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 무료 강의 CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-yellow-500/30 overflow-hidden"
          >
            <div className="p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <AlertTriangle className="text-yellow-400" size={60} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
                ⚠️ 마지막 경고
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                "AI 시대는 이미 시작되었습니다"
              </h3>
              
              <div className="space-y-4 mb-8 text-lg text-gray-300">
                <p>지금 시작하지 않으면 격차는 더욱 벌어집니다.</p>
                <p className="text-yellow-400 font-semibold">
                  선점자가 모든 것을 가져가는 시대,
                </p>
                <p className="text-red-400 font-semibold">
                  지금이 마지막 기회입니다.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
                <h4 className="text-xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-2">
                  <Zap size={24} />
                  AI 무료강의로 배우는 것들
                </h4>
                <div className="space-y-3 text-left max-w-2xl mx-auto">
                  <p className="text-gray-300">
                    이 강의만으로도 <span className="text-yellow-400 font-semibold">웹사이트부터 자동화 EXE파일까지</span> 전부 생성 가능합니다.
                  </p>
                  <p className="text-gray-300">
                    그것도 <span className="text-yellow-400 font-semibold">아주 쉽고 빠르게</span> 전부 다 알려드릴게요.
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-400">
                      그리고 무료강의 후에 유료강의 홍보하겠지 생각하실텐데
                    </p>
                    <p className="text-gray-400">
                      아시는 분들은 아시다시피 <span className="text-yellow-400">이번이 마지막입니다.</span>
                    </p>
                    <p className="text-gray-400">
                      유료 오픈하겠지만 빠른 시일내에 저를 믿고 기다려주신 분들을 위해서
                    </p>
                    <p className="text-yellow-400 font-semibold">
                      초특가 할인은 바로 마감 후 시킬 예정입니다.
                    </p>
                    <p className="text-red-400 font-semibold">
                      다시는 기회 없습니다. 아실 분들은 아십니다.
                    </p>
                  </div>
                </div>
              </div>

              <Link 
                href="/lectures" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <PlayCircle className="mr-2" size={24} />
                긴급 탑승하기
              </Link>

              <p className="mt-6 text-red-400 font-semibold">
                🔥 마감까지 1월 7시간 11분 21초
              </p>
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