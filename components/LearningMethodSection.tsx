'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code2, 
  Copy, 
  Rocket,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function LearningMethodSection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden bg-deepBlack-900">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/20 to-transparent" />
      
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
              이론 10% : 실습 90%
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            긴 설명 없이 바로 만들면서 배우는 실전형 커리큘럼
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 기존 학습 방식 (문제점) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
                <h3 className="text-2xl font-bold text-red-400">기존 강의의 문제점</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">이론 80% + 실습 20%</p>
                    <p className="text-offWhite-500 text-sm">지루한 개념 설명에 시간 낭비</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">처음부터 코딩 배우기</p>
                    <p className="text-offWhite-500 text-sm">변수, 함수, 클래스... 포기하게 만드는 진입장벽</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">실제 결과물 없음</p>
                    <p className="text-offWhite-500 text-sm">강의 끝나도 포트폴리오 0개</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">강사 혼자 코딩</p>
                    <p className="text-offWhite-500 text-sm">수강생은 구경만, 실제로 해보지 못함</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 우리의 학습 방식 (해결책) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h3 className="text-2xl font-bold text-green-400">우리의 해결책</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">실습 90% + 이론 10%</p>
                    <p className="text-offWhite-500 text-sm">바로 만들면서 필요한 것만 학습</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">복사-붙여넣기로 시작</p>
                    <p className="text-offWhite-500 text-sm">작동하는 코드부터 시작, 점진적 이해</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">27개 실제 프로젝트</p>
                    <p className="text-offWhite-500 text-sm">강의 끝 = 포트폴리오 27개 완성</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-offWhite-300 font-semibold">함께 만들기</p>
                    <p className="text-offWhite-500 text-sm">따라하며 직접 구축, 즉시 배포까지</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Learning Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-deepBlack-800/50 to-deepBlack-700/50 rounded-3xl p-8 backdrop-blur-sm border border-metallicGold-500/20"
        >
          <h3 className="text-2xl font-bold text-center text-metallicGold-500 mb-8">
            우리의 학습 프로세스
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                icon: Copy,
                title: '복사/붙여넣기',
                description: '작동하는 코드를 먼저 실행'
              },
              {
                step: 2,
                icon: Code2,
                title: '수정하며 이해',
                description: '변경해보며 원리 파악'
              },
              {
                step: 3,
                icon: BookOpen,
                title: '필요한 이론만',
                description: '막힐 때만 최소한의 설명'
              },
              {
                step: 4,
                icon: Rocket,
                title: '즉시 배포',
                description: '실제 서비스로 바로 런칭'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon className="w-8 h-8 text-deepBlack-900" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-deepBlack-900 rounded-full flex items-center justify-center border-2 border-metallicGold-500">
                      <span className="text-xs font-bold text-metallicGold-500">{item.step}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-offWhite-200 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-offWhite-400">
                    {item.description}
                  </p>
                  
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 -right-12 text-metallicGold-500/50">
                      →
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xl font-bold text-offWhite-200">
            <span className="text-metallicGold-500">"오늘 배워서 오늘 쓰는"</span> 실전 AI 코딩
          </p>
          <p className="text-offWhite-400 mt-2">
            이론은 최소화, 결과물은 최대화
          </p>
        </motion.div>
      </div>
    </section>
  );
}