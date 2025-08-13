'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Brain, Cpu, Zap, Rocket, Globe } from 'lucide-react';

const aiLeaders = [
  {
    id: 1,
    name: '샘 알트먼',
    role: 'OpenAI 최고경영자',
    company: 'OpenAI',
    quote: 'AI 에이전트가 2025년 직장에 합류할 것입니다. AGI는 우리가 생각하는 방식대로 구현 가능합니다.',
    source: '블룸버그 인터뷰 2025',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgGradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
    icon: Brain,
    avatar: '/images/Ai_human/샘알트먼.png',
    glow: 'shadow-emerald-500/50',
  },
  {
    id: 2,
    name: '일론 머스크',
    role: 'xAI 창립자',
    company: 'xAI',
    quote: 'AGI는 2025-2026년 사이에 도래할 것입니다. 인간보다 똑똑한 AI가 내년에 현실이 됩니다.',
    source: '노르웨이 국부펀드 인터뷰',
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    bgGradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10',
    icon: Rocket,
    avatar: '/images/Ai_human/일론머스크.png',
    glow: 'shadow-blue-500/50',
  },
  {
    id: 3,
    name: '젠슨 황',
    role: 'NVIDIA 최고경영자',
    company: 'NVIDIA',
    quote: '5년 안에 AGI가 모든 테스트에서 인간을 능가할 것입니다. GPU가 AI 혁명의 중심입니다.',
    source: 'GTC 2025 키노트',
    gradient: 'from-green-500 via-lime-500 to-yellow-500',
    bgGradient: 'from-green-500/10 via-lime-500/10 to-yellow-500/10',
    icon: Cpu,
    avatar: '/images/Ai_human/젠슨황.png',
    glow: 'shadow-green-500/50',
  },
  {
    id: 4,
    name: '데미스 하사비스',
    role: 'DeepMind 최고경영자',
    company: 'Google DeepMind',
    quote: '5-10년 내에 AGI가 도래할 것입니다. 산업혁명보다 10배 크고 10배 빠른 변화가 올 것입니다.',
    source: '포춘 인터뷰 2025',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    bgGradient: 'from-purple-500/10 via-pink-500/10 to-rose-500/10',
    icon: Zap,
    avatar: '/images/Ai_human/Hassabis.png',
    glow: 'shadow-purple-500/50',
  },
  {
    id: 5,
    name: '사티아 나델라',
    role: 'Microsoft 최고경영자',
    company: 'Microsoft',
    quote: 'AI 에이전트가 비즈니스 애플리케이션의 개념 자체를 완전히 바꿀 것입니다.',
    source: 'Microsoft AI Tour 2025',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    bgGradient: 'from-orange-500/10 via-amber-500/10 to-yellow-500/10',
    icon: Globe,
    avatar: '/images/Ai_human/Satya Nadella.png',
    glow: 'shadow-orange-500/50',
  },
  {
    id: 6,
    name: '제프리 힌튼',
    role: 'AI의 아버지',
    company: '토론토 대학교',
    quote: 'AI가 인간의 지능을 뛰어넘는 순간이 생각보다 빨리 올 것입니다. 우리는 준비해야 합니다.',
    source: 'AI 안전성 연구 2025',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    bgGradient: 'from-indigo-500/10 via-purple-500/10 to-pink-500/10',
    icon: Brain,
    avatar: '/images/Ai_human/Geoffrey Hinton.png',
    glow: 'shadow-indigo-500/50',
  },
];

export default function AILeadersCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 via-purple-500/10 to-cyan-500/10" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-metallicGold-500/30 rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
            }}
            animate={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-12 h-12 text-metallicGold-500" />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-metallicGold-500 to-purple-500">
              AI 거물들의 AGI 예언
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            2025년, 인류 역사상 가장 중요한 순간이 다가옵니다
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {aiLeaders.map((leader, index) => {
            const Icon = leader.icon;
            const isHovered = hoveredCard === leader.id;
            
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCard(leader.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Card Container */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl blur-2xl ${leader.glow} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                    animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Card */}
                  <div className={`relative h-full bg-gradient-to-br ${leader.bgGradient} backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl`}>
                    {/* Top Gradient Bar */}
                    <div className={`h-2 bg-gradient-to-r ${leader.gradient}`} />

                    {/* Avatar Section */}
                    <div className="p-6 pb-0">
                      <div className="relative">
                        {/* Holographic Background */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${leader.gradient} rounded-2xl blur-xl opacity-30`}
                          animate={isHovered ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Avatar Container */}
                        <div className={`relative h-32 bg-gradient-to-br ${leader.gradient} rounded-2xl flex items-center justify-center overflow-hidden`}>
                          {/* Circuit Pattern Background */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0 bg-circuit-pattern" />
                          </div>
                          
                          {/* Avatar */}
                          <motion.div
                            animate={isHovered ? { scale: [1, 1.05, 1], x: [0, 2, -2, 0] } : {}}
                            transition={{ duration: 2 }}
                            className="relative z-10"
                          >
                            {leader.avatar.startsWith('/images') ? (
                              <img 
                                src={leader.avatar} 
                                alt={leader.name}
                                className="w-full h-full rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="text-6xl">{leader.avatar}</div>
                            )}
                          </motion.div>
                          
                          {/* Icon */}
                          <motion.div
                            className="absolute top-2 right-2"
                            animate={isHovered ? { rotate: 360 } : {}}
                            transition={{ duration: 2 }}
                          >
                            <Icon className="w-8 h-8 text-white/50" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Quote */}
                      <div className="relative mb-6">
                        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-metallicGold-500/20" />
                        <p className="text-sm sm:text-base text-offWhite-300 leading-relaxed italic pl-4">
                          "{leader.quote}"
                        </p>
                      </div>

                      {/* Leader Info */}
                      <div className="space-y-2">
                        <h3 className={`text-xl font-bold bg-gradient-to-r ${leader.gradient} bg-clip-text text-transparent`}>
                          {leader.name}
                        </h3>
                        <p className="text-sm text-offWhite-400">
                          {leader.role}
                        </p>
                        <p className="text-xs text-offWhite-500">
                          {leader.company}
                        </p>
                      </div>

                      {/* Source */}
                      <div className="mt-4 pt-4">
                        <p className="text-xs text-offWhite-600 flex items-center gap-1">
                          <span className="w-2 h-2 bg-metallicGold-500 rounded-full animate-pulse" />
                          {leader.source}
                        </p>
                      </div>
                    </div>

                    {/* Hover Overlay Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      initial={false}
                      animate={isHovered ? { y: [100, -100] } : {}}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4">
              <p className="text-lg sm:text-xl font-bold text-offWhite-200">
                ⚠️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  경고: AGI 시대, 준비된 자만이 살아남습니다
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .bg-circuit-pattern {
          background-image: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.03) 10px,
            rgba(255, 255, 255, 0.03) 20px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.03) 10px,
            rgba(255, 255, 255, 0.03) 20px
          );
        }
      `}</style>
    </section>
  );
}