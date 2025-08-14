'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2,
  Target,
  Clock,
  Zap,
  Brain,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  MessageSquare,
  DollarSign
} from 'lucide-react';

export default function InstructorStorySection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/5 via-transparent to-metallicGold-500/5" />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-8 border border-metallicGold-500/20"
        >
          {/* 헤더 */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-metallicGold-500 mb-2">
              강사 소개
            </h2>
            <p className="text-sm text-offWhite-400">
              왜 이 강의를 만들게 되었는지, 당신에게 어떤 가치를 줄 수 있는지
            </p>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🤯</div>
              <div>
                <h3 className="text-lg font-bold text-metallicGold-400 mb-2">
                  충격적 사실: 이 사이트를 만든 강사는 코드를 볼 줄 모릅니다
                </h3>
                <p className="text-sm text-offWhite-300 leading-relaxed">
                  네, 맞습니다. 지금 보고 계신 모든 기능, 모든 페이지를 
                  <span className="text-metallicGold-400 font-semibold"> 코드 한 줄 이해하지 못하는 제가 전부 구축했습니다.</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="text-md font-bold text-blue-400 mb-2">
                  진짜 바이브코딩을 찾아서
                </h4>
                <p className="text-sm text-offWhite-300 leading-relaxed">
                  기존 바이브코딩 강의들은 결국 개발 용어로 가득했습니다. 
                  저는 <span className="text-blue-400 font-semibold">정말 바이브만으로 쉽게 코딩이 가능한 환경</span>을 구축하고 싶었습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h4 className="text-md font-bold text-green-400 mb-2">
                  극한의 연구 끝에 찾은 답
                </h4>
                <p className="text-sm text-offWhite-300 leading-relaxed">
                  Claude Max X20 요금제(월 30만원)로 밤낮없이 연구한 결과, 
                  <span className="text-green-400 font-semibold">정말 최소한의 지식으로 최대한의 아웃풋</span>을 만드는 방법을 찾았습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="text-md font-bold text-metallicGold-400 mb-2">
                  여러분의 시행착오를 제가 대신했습니다
                </h4>
                <p className="text-sm text-offWhite-300 leading-relaxed">
                  여러분에게는 <span className="text-metallicGold-400 font-semibold">시행착오 없이 바로 실전 기술</span>을 전수합니다. 
                  AI 시대에 뒤처지지 않고 여유롭게 따라갈 수 있게 만드는 강의입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 메시지 */}
          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-metallicGold-500">
              "코드 못 봐도 괜찮습니다. 제가 직접 증명했고, 여러분도 할 수 있습니다."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}