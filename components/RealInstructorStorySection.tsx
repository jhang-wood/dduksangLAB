'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2,
  XCircle,
  CheckCircle,
  Brain,
  Clock,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';

export default function RealInstructorStorySection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-deepBlack-900 via-deepBlack-800 to-deepBlack-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 via-transparent to-purple-500/5" />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* 메인 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              코드 모르는 강사가 만든 이 사이트
            </span>
          </h2>
          <p className="text-lg text-offWhite-400">
            진짜 비개발자가 찾아낸 진짜 바이브코딩
          </p>
        </motion.div>

        {/* 핵심 스토리 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-deepBlack-600/50 backdrop-blur-sm rounded-3xl p-8 border border-metallicGold-500/20 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="w-6 h-6 text-red-400" />
            <h3 className="text-2xl font-bold text-offWhite-200">
              아직도 코드를 볼 줄 모릅니다
            </h3>
          </div>
          
          <p className="text-lg text-offWhite-300 leading-relaxed mb-6">
            네, 맞습니다. 저는 <span className="text-metallicGold-400 font-semibold">아직도 코드를 읽을 줄 모릅니다.</span><br />
            하지만 지금 보고 계신 이 사이트 전체를 직접 구축했습니다.<br />
            어떻게 가능했을까요?
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-deepBlack-800/50 rounded-xl p-5 border border-red-500/10">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold text-offWhite-300">기존 바이브코딩 강의의 문제</h4>
              </div>
              <ul className="space-y-2 text-sm text-offWhite-400">
                <li>• 결국 개발자 중심의 설명</li>
                <li>• 변수, 함수, 클래스 등 개발 용어 투성이</li>
                <li>• "바이브"라고 하면서 코드 설명</li>
              </ul>
            </div>
            
            <div className="bg-deepBlack-800/50 rounded-xl p-5 border border-green-500/10">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-offWhite-300">제가 찾은 진짜 바이브코딩</h4>
              </div>
              <ul className="space-y-2 text-sm text-offWhite-400">
                <li>• 코드 이해 없이 진짜 바이브만으로</li>
                <li>• 최소한의 세팅 지식만 학습</li>
                <li>• AI와 자연스러운 대화로 구현</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 연구 과정 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-metallicGold-400 text-center mb-8">
            밤낮없이 진행한 연구 과정
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-900/10 rounded-2xl p-6 border border-blue-500/20">
              <Brain className="w-10 h-10 text-blue-400 mb-4" />
              <h4 className="text-lg font-bold text-offWhite-200 mb-2">연구 정신</h4>
              <p className="text-sm text-offWhite-400">
                특유의 연구 기질로 시행착오를 반복하며
                진짜 최소한의 지식 기준점을 찾아냄
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 rounded-2xl p-6 border border-purple-500/20">
              <Clock className="w-10 h-10 text-purple-400 mb-4" />
              <h4 className="text-lg font-bold text-offWhite-200 mb-2">투자한 시간</h4>
              <p className="text-sm text-offWhite-400">
                밤낮 새벽 가리지 않고 하루종일 테스트
                Claude Max x20으로 무제한 연구
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-green-900/10 rounded-2xl p-6 border border-green-500/20">
              <DollarSign className="w-10 h-10 text-green-400 mb-4" />
              <h4 className="text-lg font-bold text-offWhite-200 mb-2">실제 투자</h4>
              <p className="text-sm text-offWhite-400">
                Claude Max x20 월 30만원으로
                API 환산시 훨씬 많은 사용량 활용
              </p>
            </div>
          </div>
        </motion.div>

        {/* Usage 증명 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-deepBlack-600/30 rounded-2xl p-8 border border-metallicGold-500/10 text-center">
            <p className="text-sm text-offWhite-500 mb-4">연구 투자 증명</p>
            <div className="bg-deepBlack-800/50 rounded-xl p-6 border-2 border-dashed border-metallicGold-500/30">
              <p className="text-metallicGold-400 font-bold mb-2">
                [bunx usage 캡처 이미지 위치]
              </p>
              <p className="text-xs text-offWhite-500">
                실제 Claude 사용량 증명 - API로 환산시 하루 30-40만원 상당
              </p>
            </div>
          </div>
        </motion.div>

        {/* 핵심 가치 제안 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-3xl p-8 border border-metallicGold-500/20"
        >
          <h3 className="text-2xl font-bold text-metallicGold-400 text-center mb-6">
            이 강의가 특별한 이유
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-metallicGold-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-offWhite-200 mb-1">완벽한 비개발자 관점</h4>
                  <p className="text-sm text-offWhite-400">
                    코드를 모르는 사람이 직접 연구해서 만든
                    진짜 비개발자를 위한 커리큘럼
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-metallicGold-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-offWhite-200 mb-1">검증된 방법론</h4>
                  <p className="text-sm text-offWhite-400">
                    수많은 시행착오 끝에 찾아낸
                    최소 지식으로 최대 결과를 내는 방법
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-metallicGold-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-offWhite-200 mb-1">시간 절약</h4>
                  <p className="text-sm text-offWhite-400">
                    제가 겪은 시행착오를 여러분은 겪지 마세요
                    몇 달의 시간을 단 13시간으로 압축
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-metallicGold-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-offWhite-200 mb-1">비용 절감</h4>
                  <p className="text-sm text-offWhite-400">
                    AI 비용, 시행착오 비용 모두 절감
                    이 강의 가격에 몇 달의 시간을 사는 것
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-deepBlack-800/50 rounded-xl p-6 text-center">
            <p className="text-lg text-offWhite-300 leading-relaxed">
              <span className="text-metallicGold-400 font-bold">클로드코드 CLI</span>를 
              어떻게 바이브만으로 완벽히 컨트롤하는지<br />
              내가 원하는 것들을 어떻게 만들어가는지<br />
              <span className="text-metallicGold-400 font-semibold">전 과정을 공개합니다</span>
            </p>
          </div>
        </motion.div>

        {/* 최종 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xl text-offWhite-300">
            이 강의는 단순히 AI 사용법을 알려주는 강의가 아닙니다<br />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
              AI 시대를 여유롭게 따라갈 수 있게 만드는 강의입니다
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}