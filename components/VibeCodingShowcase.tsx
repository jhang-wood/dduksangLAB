'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Rocket, Code, Brain, Cpu, Smartphone, Globe } from 'lucide-react';

const vibeCodingSuccessStories = [
  {
    name: '실리콘밸리 스타트업',
    achievement: '바이브코딩 전면 도입',
    detail: 'Y Combinator 2025년 겨울 배치',
    highlight: '코드베이스 95%가 AI 생성',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: '노코드 혁신 기업',
    achievement: '2025년 급성장',
    detail: '가트너 예측: 신규 앱 70%',
    highlight: '노코드/로우코드 기술 활용',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'AI 자동화 솔루션',
    achievement: '업무 효율 10배 향상',
    detail: '워크플로우 자동화',
    highlight: '반복 작업 완전 해결',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Claude Code CLI',
    achievement: '개발 민주화 실현',
    detail: '비개발자도 앱 개발 가능',
    highlight: '자연어 프로그래밍',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
  },
];

const marketTrends2025 = {
  noCodeMarket: '455억$',
  aiDevelopers: '70%',
  automationGrowth: '300%',
  vibeCodingAdoption: '25%',
};

const practicalApplications = [
  {
    icon: Smartphone,
    title: 'SNS 자동화',
    description: '인스타그램, 유튜브, 틱톡 콘텐츠 자동 생성 및 관리',
    examples: ['포스팅 자동화', '해시태그 생성', '댓글 응답 봇']
  },
  {
    icon: Brain,
    title: '업무 효율화',
    description: '일상 업무를 AI로 자동화하여 시간 절약',
    examples: ['보고서 자동 작성', '이메일 템플릿', '데이터 분석']
  },
  {
    icon: Globe,
    title: '웹사이트 구축',
    description: '전문 지식 없이도 완전한 웹사이트 제작',
    examples: ['쇼핑몰', '포트폴리오', '회사 홈페이지']
  },
  {
    icon: Cpu,
    title: '비즈니스 자동화',
    description: '온라인 비즈니스 운영을 완전 자동화',
    examples: ['고객 관리', '주문 처리', '재고 관리']
  },
];

export default function VibeCodingShowcase() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-metallicGold-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,215,0,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-metallicGold-500/20 via-transparent to-transparent transform rotate-12 blur-sm" />
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-blue-500/20 via-transparent to-transparent transform -rotate-12 blur-sm" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-metallicGold-500 via-purple-500 to-cyan-500 rounded-full opacity-70 blur-sm" />
          <div className="px-4 md:px-8 lg:px-12 xl:px-16">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mb-20"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 lg:col-start-1">
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-metallicGold-500/20 to-transparent rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-lg" />
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-offWhite-200 leading-tight">
                      <span className="block">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-400 via-metallicGold-500 to-metallicGold-600">
                          2025년 대세
                        </span>
                      </span>
                      <span className="block mt-2 text-offWhite-100">
                        바이브코딩
                      </span>
                      <span className="block text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        혁명
                      </span>
                    </h2>
                  </div>
                </div>
                
                <div className="lg:col-span-4 lg:col-start-9">
                  <div className="relative">
                    <div className="space-y-4">
                      <motion.div 
                        className="bg-metallicGold-500/10 backdrop-blur-md border border-metallicGold-500/20 rounded-2xl p-4 ml-8"
                        whileHover={{ scale: 1.05, x: -10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-2xl font-bold text-metallicGold-400">95%</div>
                        <div className="text-sm text-offWhite-500">코드는 AI가</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 -ml-4"
                        whileHover={{ scale: 1.05, x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-2xl font-bold text-blue-400">10X</div>
                        <div className="text-sm text-offWhite-500">개발 속도</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-purple-500/10 backdrop-blur-md border border-purple-500/20 rounded-2xl p-4 ml-12"
                        whileHover={{ scale: 1.05, x: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-2xl font-bold text-purple-400">25%</div>
                        <div className="text-sm text-offWhite-500">YC 채택률</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative mb-20"
            >
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-10 lg:col-start-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl rounded-[2rem] border border-metallicGold-900/30 transform rotate-1"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-deepBlack-800/50 to-deepBlack-700/30 backdrop-blur-xl rounded-[2rem] border border-purple-900/20 transform -rotate-1"></div>
                    
                    <div className="relative bg-deepBlack-800/60 backdrop-blur-xl rounded-[2rem] p-8 border border-metallicGold-900/20 shadow-[0_20px_60px_-15px_rgba(255,215,0,0.1)]">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-metallicGold-500/20 rounded-xl">
                          <Code className="w-8 h-8 text-metallicGold-500" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-2xl font-bold text-metallicGold-500 mb-2">
                            2025년 개발 트렌드의 핵심
                          </h3>
                          <p className="text-lg text-offWhite-300 leading-relaxed mb-4">
                            <span className="font-bold text-metallicGold-400">자연어로 코딩하는 새로운 시대</span>
                          </p>
                          <p className="text-base text-offWhite-400 mb-4">
                            안드레이 카르파티가 명명한 바이브코딩은 <span className="text-metallicGold-400">AI와 대화</span>하며 
                            프로그램을 만드는 혁신적 개발 방법론입니다. <span className="text-metallicGold-400">노코드/로우코드</span> 
                            플랫폼과 함께 개발의 민주화를 이끌고 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mb-20"
            >
              <div className="relative mb-12">
                <div className="grid lg:grid-cols-12">
                  <div className="lg:col-span-8 lg:col-start-3">
                    <div className="text-center relative">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-metallicGold-500/30 to-transparent"></div>
                      <h3 className="text-2xl md:text-3xl font-bold text-offWhite-200 bg-deepBlack-800 px-6 inline-block">
                        <span className="text-metallicGold-500">실전 활용 분야</span> - 이런 것들을 자동화할 수 있습니다
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {practicalApplications.map((app, index) => {
                  const Icon = app.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="group relative"
                    >
                      <div className="bg-deepBlack-300/40 backdrop-blur-xl shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(255,215,0,0.15)] rounded-2xl p-6 transition-all duration-300 border border-metallicGold-900/20 h-full">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-metallicGold-500/20 rounded-xl">
                            <Icon className="w-6 h-6 text-metallicGold-500" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-offWhite-200 mb-2">
                              {app.title}
                            </h4>
                            <p className="text-offWhite-400 mb-3">
                              {app.description}
                            </p>
                            <div className="space-y-1">
                              {app.examples.map((example, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-metallicGold-400 rounded-full"></div>
                                  <span className="text-sm text-offWhite-500">{example}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mb-20"
            >
              <div className="max-w-6xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-offWhite-200 mb-8 text-center">
                    2025년 글로벌 트렌드: 
                    <span className="text-metallicGold-500"> AI 자동화 혁신 사례</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {vibeCodingSuccessStories.map((story, index) => {
                      const Icon = story.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="group relative"
                        >
                          <div className="bg-deepBlack-300/40 backdrop-blur-xl shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(255,215,0,0.15)] rounded-2xl p-6 transition-all duration-300 border border-metallicGold-900/20">
                            <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                            
                            <div className="relative flex items-start gap-4">
                              <div className={`p-3 bg-gradient-to-br ${story.color} rounded-xl`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-offWhite-200 mb-1">
                                  {story.name}
                                </h4>
                                <p className="text-xl font-bold text-metallicGold-500 mb-2">
                                  {story.achievement}
                                </p>
                                <p className="text-offWhite-400 mb-3">
                                  {story.detail}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-semibold text-yellow-500">
                                    {story.highlight}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mb-20"
            >
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-10 lg:col-start-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/15 via-metallicGold-600/10 to-metallicGold-900/15 backdrop-blur-lg rounded-[3rem] border border-metallicGold-900/30 transform -rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 via-transparent to-cyan-500/10 backdrop-blur-lg rounded-[3rem] border border-purple-900/20 transform rotate-1"></div>
                    
                    <div className="relative bg-deepBlack-800/60 backdrop-blur-xl rounded-[3rem] p-8 border border-metallicGold-900/30 shadow-[0_20px_60px_-15px_rgba(255,215,0,0.1)]">
                      <h3 className="text-2xl font-bold text-center text-metallicGold-500 mb-8">
                        📊 2025년 AI 자동화 시장 전망 (가트너)
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-offWhite-200">{marketTrends2025.noCodeMarket}</p>
                          <p className="text-sm text-offWhite-500 mt-1">노코드 시장 규모</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-offWhite-200">{marketTrends2025.aiDevelopers}</p>
                          <p className="text-sm text-offWhite-500 mt-1">신규 앱 개발</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-offWhite-200">{marketTrends2025.automationGrowth}</p>
                          <p className="text-sm text-offWhite-500 mt-1">자동화 도구 성장</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-offWhite-200">{marketTrends2025.vibeCodingAdoption}</p>
                          <p className="text-sm text-offWhite-500 mt-1">Y Combinator 채택률</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-8 lg:col-start-3 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/10 to-purple-500/10 blur-3xl rounded-3xl"></div>
                    
                    <div className="relative">
                      <p className="text-xl text-offWhite-300">
                        2025년 대세 <span className="text-metallicGold-500 font-bold">AI 자동화</span>로
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-offWhite-200 mt-2">
                        업무 효율 10배 향상, 비즈니스 자동화를 경험하세요
                      </p>
                      <p className="text-base text-offWhite-400 mt-4">
                        전 세계가 주목하는 바이브코딩으로 당신도 AI 개발자가 될 수 있습니다
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}