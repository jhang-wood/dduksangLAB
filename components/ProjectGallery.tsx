'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Bot, 
  Briefcase,
  Clock,
  Database,
  Server,
  Globe,
  Code,
  Layers
} from 'lucide-react';

const projects = [
  {
    id: 1,
    title: '온라인 쇼핑몰',
    description: '상품 등록부터 결제까지 완벽한 이커머스 플랫폼',
    difficulty: 3,
    duration: '3시간',
    icon: ShoppingCart,
    features: ['상품 관리', '장바구니', '결제 연동', '주문 관리'],
    gradient: 'from-purple-500 to-pink-500',
    category: '이커머스',
    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&auto=format',
    techStack: [
      { name: 'Claude', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/anthropic.svg', bgColor: 'bg-orange-500' },
      { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nextdotjs.svg', bgColor: 'bg-black' },
      { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/supabase.svg', bgColor: 'bg-green-500' }
    ],
    workflow: {
      steps: [
        { icon: Database, label: 'DB 설계' },
        { icon: Server, label: 'API 구축' },
        { icon: Globe, label: 'UI 개발' },
        { icon: Code, label: '결제 연동' }
      ]
    }
  },
  {
    id: 2,
    title: 'SaaS 대시보드',
    description: '구독형 서비스를 위한 관리자 대시보드',
    difficulty: 4,
    duration: '4시간',
    icon: BarChart3,
    features: ['사용자 관리', '구독 결제', '데이터 분석', '실시간 차트'],
    gradient: 'from-blue-500 to-cyan-500',
    category: '대시보드',
    preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format',
    techStack: [
      { name: 'Claude', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/anthropic.svg', bgColor: 'bg-orange-500' },
      { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/react.svg', bgColor: 'bg-blue-500' },
      { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/supabase.svg', bgColor: 'bg-green-500' }
    ],
    workflow: {
      steps: [
        { icon: Layers, label: '인증 시스템' },
        { icon: Database, label: '데이터 모델' },
        { icon: BarChart3, label: '차트 구현' },
        { icon: Server, label: 'API 통합' }
      ]
    }
  },
  {
    id: 3,
    title: '자동화 봇 시스템',
    description: '업무 자동화를 위한 스마트 봇',
    difficulty: 2,
    duration: '2시간',
    icon: Bot,
    features: ['스케줄링', '자동 응답', '데이터 수집', 'API 연동'],
    gradient: 'from-green-500 to-emerald-500',
    category: '자동화',
    preview: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop&auto=format',
    techStack: [
      { name: 'Claude', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/anthropic.svg', bgColor: 'bg-orange-500' },
      { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nodedotjs.svg', bgColor: 'bg-green-600' },
      { name: 'Telegram', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg', bgColor: 'bg-blue-500' }
    ],
    workflow: {
      steps: [
        { icon: Bot, label: '봇 설정' },
        { icon: Clock, label: '스케줄러' },
        { icon: Server, label: 'API 연결' },
        { icon: Database, label: '로그 저장' }
      ]
    }
  },
  {
    id: 4,
    title: '블로그 플랫폼',
    description: 'SEO 최적화된 개인 블로그 사이트',
    difficulty: 2,
    duration: '2시간',
    icon: FileText,
    features: ['글 작성/편집', '카테고리', '댓글 시스템', 'SEO 최적화'],
    gradient: 'from-orange-500 to-amber-500',
    category: 'CMS',
    preview: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop&auto=format',
    techStack: [
      { name: 'Claude', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/anthropic.svg', bgColor: 'bg-orange-500' },
      { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nextdotjs.svg', bgColor: 'bg-black' },
      { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/supabase.svg', bgColor: 'bg-green-500' }
    ],
    workflow: {
      steps: [
        { icon: FileText, label: 'CMS 구축' },
        { icon: Database, label: '포스트 DB' },
        { icon: Globe, label: 'SEO 설정' },
        { icon: MessageSquare, label: '댓글 기능' }
      ]
    }
  },
  {
    id: 5,
    title: '실시간 채팅 앱',
    description: '웹소켓 기반 실시간 메시징 플랫폼',
    difficulty: 3,
    duration: '3시간',
    icon: MessageSquare,
    features: ['실시간 채팅', '파일 공유', '알림 기능', '그룹 채팅'],
    gradient: 'from-indigo-500 to-purple-500',
    category: '실시간 앱',
    preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&auto=format',
    techStack: [
      { name: 'Claude', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/anthropic.svg', bgColor: 'bg-orange-500' },
      { name: 'Socket.io', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/socketdotio.svg', bgColor: 'bg-black' },
      { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/supabase.svg', bgColor: 'bg-green-500' }
    ],
    workflow: {
      steps: [
        { icon: Server, label: '웹소켓' },
        { icon: MessageSquare, label: '채팅 UI' },
        { icon: Database, label: '메시지 저장' },
        { icon: Globe, label: '알림 시스템' }
      ]
    }
  },
  {
    id: 6,
    title: '웹사이트 제작사업 시작',
    description: '고객 홈페이지 제작으로 수익 창출하기',
    difficulty: 1,
    duration: '1시간',
    icon: Briefcase,
    features: ['클라이언트 관리', '견적서 시스템', '포트폴리오 갤러리', '수익 계산기'],
    gradient: 'from-red-500 to-rose-500',
    category: '비즈니스',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&auto=format',
    techStack: [
      { name: 'Claude', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/anthropic.svg', bgColor: 'bg-orange-500' },
      { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nextdotjs.svg', bgColor: 'bg-black' },
      { name: 'Vercel', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/vercel.svg', bgColor: 'bg-black' }
    ],
    workflow: {
      steps: [
        { icon: Layers, label: '비즈니스 설정' },
        { icon: Globe, label: '포트폴리오 구축' },
        { icon: Briefcase, label: '클라이언트 확보' },
        { icon: MessageSquare, label: '수익 창출' }
      ]
    }
  },
];

export default function ProjectGallery() {

  return (
    <div className="relative">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-offWhite-200 mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              실제로 만들 수 있는 것들
            </span>
          </h2>
          <p className="text-base sm:text-lg text-offWhite-400">
            바이브코딩으로 배우는 서비스 구축과 비즈니스 성장 전략
          </p>
        </motion.div>

        {/* Clean & Simple Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                {/* Simple Clean Card */}
                <div className="bg-deepBlack-800/40 backdrop-blur-sm rounded-2xl p-6 border border-offWhite-700/20 hover:border-metallicGold-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-metallicGold-500/5 h-full flex flex-col">
                  
                  {/* Header: Project # + Level */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-bold text-offWhite-300">Project {project.id}</span>
                    <div className="px-2 py-1 bg-metallicGold-500/20 rounded text-xs font-bold text-metallicGold-400">
                      Lv.{project.difficulty}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-offWhite-200 mb-2">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-offWhite-400 mb-4 flex-grow">
                    {project.description}
                  </p>

                  {/* Real Preview Image */}
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-4 border border-offWhite-700/10">
                    <img 
                      src={project.preview} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                      자동화 업무
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                      {project.duration}
                    </span>
                  </div>

                  {/* Main Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-offWhite-500 mb-2">주요 내용</h4>
                    <p className="text-xs text-offWhite-400 leading-relaxed">
                      {project.features.slice(0, 2).join(', ')}부터 {project.features.slice(2).join(', ')}까지 실습
                    </p>
                  </div>

                  {/* Tech Stack Icons */}
                  <div className="mt-auto">
                    <h4 className="text-xs font-semibold text-offWhite-500 mb-2">사용하는 툴</h4>
                    <div className="flex gap-2">
                      {project.techStack.map((tech, techIndex) => (
                        <div 
                          key={techIndex}
                          className={`w-8 h-8 ${tech.bgColor} rounded flex items-center justify-center p-1`}
                          title={tech.name}
                        >
                          <img 
                            src={tech.logo} 
                            alt={tech.name}
                            className="w-full h-full object-contain filter brightness-0 invert"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl px-6 py-3 backdrop-blur-sm border border-metallicGold-500/20">
            <p className="text-base font-bold text-offWhite-200">
              🎯 <span className="text-metallicGold-500">100% 실습</span> · 
              <span className="text-metallicGold-500"> 실제 서비스</span> · 
              <span className="text-metallicGold-500"> 비즈니스 관점</span>
            </p>
            <p className="text-xs text-offWhite-400 mt-1">
              실제 배포부터 효과적인 성장, 지속 가능한 마케팅까지 함께 배웁니다
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}