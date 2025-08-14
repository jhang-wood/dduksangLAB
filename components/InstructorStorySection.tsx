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
  const [showUsageImage, setShowUsageImage] = useState(false);

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-metallicGold-500/5 via-transparent to-metallicGold-500/5" />
      </div>
      
      {/* 소개 섹션 - 상단에 추가 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl relative z-10 mb-12"
      >
        <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-8 border border-metallicGold-500/20">
          <div className="flex items-center gap-6">
            <div className="text-4xl">🤯</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-metallicGold-500 mb-3">
                충격적 사실: 이 사이트를 만든 강사는 코드를 볼 줄 모릅니다
              </h3>
              <p className="text-lg text-offWhite-300 leading-relaxed">
                네, 맞습니다. 지금 보고 계신 모든 기능, 모든 페이지를 
                <span className="text-metallicGold-400 font-semibold"> 코드 한 줄 이해하지 못하는 제가 전부 구축했습니다.</span>
              </p>
              <p className="text-offWhite-400 mt-2">
                믿기 어려우시겠지만, 이것이 바로 제가 이 강의를 만든 이유입니다.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
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
              강사의 진솔한 이야기
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            왜 이 강의를 만들게 되었는지, 당신에게 어떤 가치를 줄 수 있는지
          </p>
        </motion.div>

        {/* Story Content */}
        <div className="space-y-8">
          {/* 1. 충격적 시작 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-metallicGold-500/10 to-transparent rounded-3xl p-8 border-l-4 border-metallicGold-500"
          >
            <div className="flex items-start gap-4">
              <Code2 className="w-8 h-8 text-metallicGold-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-metallicGold-500 mb-4">
                  "실제로 저는 아직도 코드를 볼 줄 모릅니다"
                </h3>
                <p className="text-lg text-offWhite-300 leading-relaxed">
                  네, 맞습니다. 지금 보고 계신 이 사이트, 모든 기능, 모든 페이지를 
                  <span className="text-offWhite-200 font-semibold"> 코드 한 줄 이해하지 못하는 제가 전부 구축했습니다.</span>
                </p>
                <p className="text-offWhite-400 mt-3">
                  믿기 어려우시겠지만, 이것이 바로 제가 이 강의를 만든 이유입니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2. 문제 인식 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-deepBlack-800/50 rounded-3xl p-8 backdrop-blur-sm border border-red-500/20"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-3">
                  기존 바이브코딩 강의의 실망스러운 현실
                </h3>
                <p className="text-offWhite-400 leading-relaxed">
                  저도 처음엔 유명한 바이브코딩 강의 1~2개를 들어봤습니다. 
                  하지만 <span className="text-red-400">제대로 보지도 못하고 포기했죠.</span> 
                  왜일까요? <span className="font-semibold text-offWhite-300">너무 개발자 중심의 강의였기 때문입니다.</span>
                </p>
                <p className="text-offWhite-400 mt-3">
                  "바이브코딩"이라면서 결국 변수, 함수, 클래스... 개발 용어로 가득했습니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. 전환점 - 진짜 바이브 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20"
          >
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-3">
                  "바이브코딩인데, 진짜 그냥 바이브로 하고 싶었습니다"
                </h3>
                <p className="text-offWhite-400 leading-relaxed">
                  저는 코드를 이해하고 싶지 않았습니다. 
                  <span className="text-offWhite-300 font-semibold"> 어떻게든 바이브만으로 쉽게 코딩이 가능한 환경</span>을 
                  구축하고 싶었습니다. 그래서 특유의 연구 기질과 시간적 여유를 활용해 
                  직접 길을 찾기로 했습니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. 극한의 연구 과정 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl p-8 border border-blue-500/20"
          >
            <div className="flex items-start gap-4">
              <Brain className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">
                  밤낮없는 연구, 엄청난 시행착오의 연속
                </h3>
                <p className="text-offWhite-400 leading-relaxed mb-4">
                  정말 개발 지식 없이 어디까지 구현이 가능한지 알아보기 위해 
                  <span className="text-blue-400 font-semibold"> Claude Max X20 요금제(월 30만원)</span>를 결제했습니다.
                  밤이고 낮이고 새벽이고 하루종일 테스트하고 연구했죠.
                </p>
                
                {/* Usage 정보 표시 영역 */}
                <div className="bg-deepBlack-900/50 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-offWhite-500">API 사용량 환산</span>
                    <button
                      onClick={() => setShowUsageImage(!showUsageImage)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {showUsageImage ? '닫기' : 'bunx usage 캡처 보기'}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-400">300-400불</p>
                      <p className="text-xs text-offWhite-500">하루 사용량</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">50만원</p>
                      <p className="text-xs text-offWhite-500">하루 비용</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">1500만원</p>
                      <p className="text-xs text-offWhite-500">한달 환산</p>
                    </div>
                  </div>
                  {showUsageImage && (
                    <div className="mt-4 p-4 bg-deepBlack-800 rounded-lg">
                      <p className="text-xs text-offWhite-500 text-center">
                        [bunx usage 스크린샷 업로드 영역]
                      </p>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-offWhite-500 mt-3 italic">
                  (PS. 이 정도면 개발 지식을 배우는 게 더 빨랐을 수도... 😅)
                </p>
              </div>
            </div>
          </motion.div>

          {/* 5. 깨달음의 순간 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-green-500/20"
          >
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">
                  드디어 찾은 최소 지식의 기준점
                </h3>
                <p className="text-offWhite-400 leading-relaxed">
                  그렇게 긴 연구 끝에 <span className="text-green-400 font-semibold">정말 최소한의 지식에 대한 기준점과 선</span>을 
                  직접 잡을 수 있었습니다. 이 기준점은 정말 
                  <span className="text-offWhite-300"> "누구나 이 정도만 배워도 나 정도는 따라오겠다"</span> 싶은 수준이었죠.
                </p>
                <p className="text-green-400 font-bold mt-4 text-lg">
                  아직도 코드를 볼 줄 몰라도 이 정도 사이트를 만든 겁니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 6. 가치 제안 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-3xl p-8 border border-metallicGold-500/30"
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-metallicGold-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-metallicGold-500 mb-3">
                  여러분의 시행착오를 제가 대신했습니다
                </h3>
                <p className="text-offWhite-400 leading-relaxed">
                  여러분에게는 <span className="text-metallicGold-400 font-semibold">시행착오를 줄이고</span>, 
                  처음부터 개발 지식이 아닌 <span className="text-metallicGold-400 font-semibold">진짜 최소한의 세팅, 
                  최소한의 학습으로 최대한의 아웃풋</span>을 만들어낼 수 있게 해드리겠습니다.
                </p>
                <p className="text-offWhite-300 mt-3">
                  원하는 온라인 사업을 만들 수 있겠다는 확신이 들어서 이 강의를 런칭하게 되었습니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 7. 솔직한 조언 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* 혼자 하면 */}
            <div className="bg-red-500/10 rounded-3xl p-6 border border-red-500/20">
              <h4 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                혼자 AI에게 물어보며 하신다면...
              </h4>
              <ul className="space-y-2 text-offWhite-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>막대한 시간 손실 (최소 3-6개월)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>AI 결제 비용 손실 (월 30만원+)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>방향성을 잃고 휘둘림</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>고수준 정보에 압도당함</span>
                </li>
              </ul>
              <p className="text-sm text-red-400 mt-4">
                "컨텍스트 한계에 맞춰 쏟아지는 정보의 홍수"
              </p>
            </div>

            {/* 강의와 함께 */}
            <div className="bg-green-500/10 rounded-3xl p-6 border border-green-500/20">
              <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                이 강의와 함께라면...
              </h4>
              <ul className="space-y-2 text-offWhite-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>27시간으로 압축된 커리큘럼</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>검증된 최소 지식만 학습</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>명확한 방향성과 가이드</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>바로 적용 가능한 실전 기술</span>
                </li>
              </ul>
              <p className="text-sm text-green-400 mt-4">
                "몇 달의 시행착오를 단 149,000원에"
              </p>
            </div>
          </motion.div>

          {/* 8. 가격의 가치 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl p-8 border border-yellow-500/20"
          >
            <div className="flex items-start gap-4">
              <DollarSign className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">
                  이 강의 금액은 시장 기준가 대비 매우 저렴합니다
                </h3>
                <p className="text-offWhite-400 leading-relaxed">
                  <span className="text-yellow-400 font-semibold">여러분의 몇 달간의 시행착오 시간을 이 금액에 사는 것</span>이라고 
                  생각하시면 됩니다. 제가 대신 투자한 시간과 비용, 그리고 찾아낸 지름길의 가치를 
                  고려하면 이 가격은 정말 합리적입니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 9. Claude Code CLI 철학 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl p-8 border border-cyan-500/20"
          >
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-cyan-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-3">
                  가장 자유도가 높기에 어려울 수도 있는 Claude Code CLI
                </h3>
                <p className="text-offWhite-400 leading-relaxed">
                  하지만 저는 <span className="text-cyan-400 font-semibold">어떻게 바이브만으로 완벽히 컨트롤하는지</span>, 
                  내가 원하는 것들을 어떻게 만들어가는지 <span className="text-offWhite-300">전 과정을 공개하겠습니다.</span>
                </p>
                <p className="text-offWhite-400 mt-3">
                  지금은 충분히 가능해진 상황입니다. 제가 증명이죠.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 10. 비전 제시 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-metallicGold-500/30 to-metallicGold-900/30 rounded-3xl p-10 border-2 border-metallicGold-500/50 text-center"
          >
            <TrendingUp className="w-12 h-12 text-metallicGold-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-metallicGold-500 mb-4">
              이 강의는 단순한 기술 전수를 넘어섭니다
            </h3>
            <p className="text-lg text-offWhite-300 leading-relaxed max-w-3xl mx-auto">
              바이브코딩 하는 법, 단순히 AI 정보를 주는 강의를 아득히 넘어서 
              <span className="text-metallicGold-400 font-semibold"> 여러분이 AI 시대에 어떻게 발 빠르게 움직이며, 
              어떤 포지셔닝을 유지하며, AI 시대에서 뒤처지지 않게, 
              정신없지 않게, 여유롭게 AI 시대를 따라갈 수 있게</span> 만드는 
              강의일 거라 확신합니다.
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-deepBlack-800/80 to-deepBlack-700/80 rounded-2xl px-8 py-6 backdrop-blur-sm border border-metallicGold-500/30">
            <p className="text-xl font-bold text-offWhite-200 mb-2">
              💡 <span className="text-metallicGold-500">"코드 못 봐도 괜찮습니다."</span>
            </p>
            <p className="text-offWhite-400">
              제가 직접 증명했고, 여러분도 할 수 있습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}