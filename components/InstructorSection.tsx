'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Award,
  Briefcase,
  BookOpen,
  Heart,
  Lightbulb,
  Code2,
  Users
} from 'lucide-react';

export default function InstructorSection() {
  const achievements = [
    {
      icon: '🚀',
      title: 'AI 자동화 전문가',
      description: 'Claude Code CLI 국내 최초 마스터'
    },
    {
      icon: '💡',
      title: '실전 중심 교육',
      description: '이론 10% 실습 90% 철학'
    },
    {
      icon: '🛠️',
      title: '27개 프로젝트',
      description: '실제 작동하는 서비스 구축'
    },
    {
      icon: '🎯',
      title: '비개발자 전문',
      description: '코딩 몰라도 이해 가능한 설명'
    }
  ];

  const philosophy = [
    {
      number: '01',
      title: '배우는 것보다 만드는 것',
      description: '긴 이론 설명보다 바로 결과물을 만들면서 자연스럽게 이해하는 방식'
    },
    {
      number: '02',
      title: '완벽보다 완성',
      description: 'MVP를 빠르게 만들고 개선해나가는 실리콘밸리 방식'
    },
    {
      number: '03',
      title: '혼자보다 함께',
      description: 'AI와 협업하여 개발 속도를 10배 이상 높이는 방법'
    }
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/30 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/5 via-transparent to-metallicGold-500/5" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              떡상연구소와 함께하는 이유
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            비개발자도 AI 시대의 주인공이 될 수 있습니다
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Instructor Profile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-deepBlack-800/80 to-deepBlack-700/80 rounded-3xl p-8 border border-metallicGold-500/20 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-deepBlack-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-offWhite-200">떡상연구소</h3>
                  <p className="text-metallicGold-500 font-medium">AI 자동화 전문가</p>
                  <p className="text-sm text-offWhite-500 mt-1">Claude Code CLI 마스터</p>
                </div>
              </div>

              {/* Story */}
              <div className="space-y-4 mb-8">
                <p className="text-offWhite-400 leading-relaxed">
                  "저도 처음엔 코딩을 전혀 몰랐습니다. 
                  하지만 AI 도구를 제대로 활용하니 3개월 만에 27개의 프로젝트를 완성할 수 있었죠."
                </p>
                <p className="text-offWhite-400 leading-relaxed">
                  "복잡한 이론보다 <span className="text-metallicGold-500 font-semibold">실제로 작동하는 것</span>을 만드는 게 중요합니다. 
                  여러분도 할 수 있습니다."
                </p>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-deepBlack-900/50 rounded-xl p-4 border border-metallicGold-500/10"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="text-sm font-semibold text-offWhite-200 mb-1">{item.title}</h4>
                    <p className="text-xs text-offWhite-500">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Teaching Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Philosophy Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-metallicGold-500 mb-4">
                강의 철학
              </h3>
              <p className="text-offWhite-400">
                개발자가 되는 것이 목표가 아닙니다. 
                <span className="text-offWhite-200 font-semibold"> AI를 활용해 원하는 것을 만드는 것</span>이 목표입니다.
              </p>
            </div>

            {/* Philosophy Points */}
            <div className="space-y-4">
              {philosophy.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-metallicGold-500/10 to-transparent rounded-2xl p-6 border-l-4 border-metallicGold-500"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-metallicGold-500/50">
                      {item.number}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-offWhite-200 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-offWhite-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Why Different */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20"
            >
              <div className="flex items-start gap-4">
                <Heart className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-2">
                    왜 이 강의가 다른가요?
                  </h4>
                  <p className="text-sm text-offWhite-400">
                    대부분의 강의는 "개발자처럼 생각하기"를 가르칩니다. 
                    하지만 우리는 <span className="text-green-400 font-semibold">"AI와 대화하기"</span>를 가르칩니다. 
                    코드 한 줄 못 써도 원하는 걸 만들 수 있는 시대가 왔습니다.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: BookOpen, value: '27개', label: '실습 프로젝트' },
            { icon: Code2, value: '0줄', label: '직접 코딩 필요' },
            { icon: Users, value: '100%', label: '초보자 친화적' },
            { icon: Award, value: '1년', label: '수강 기간' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center p-4 bg-deepBlack-800/50 rounded-xl border border-metallicGold-500/10"
              >
                <Icon className="w-8 h-8 text-metallicGold-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-offWhite-200">{stat.value}</div>
                <div className="text-sm text-offWhite-500">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl px-8 py-6 backdrop-blur-sm border border-metallicGold-500/20">
            <p className="text-xl font-bold text-offWhite-200 mb-2">
              💬 "코딩 몰라도 괜찮습니다. <span className="text-metallicGold-500">AI와 대화할 수 있다면</span> 충분합니다."
            </p>
            <p className="text-offWhite-400">
              - 떡상연구소
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}