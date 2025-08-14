'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SimpleInstructorSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-deepBlack-900 to-deepBlack-800">
      <div className="container mx-auto max-w-4xl">
        {/* Lecturer Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
            Lecturer
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-offWhite-200 mb-4">
            아무나 바이브코딩할 수 있다고 아무나 강의할 수는 없었다
          </h2>
          <p className="text-lg text-offWhite-200 mb-2">
            개발자이자 메이커, 개발자이자 교육자인 강사님
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-8 border border-metallicGold-500/20 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Left: Avatar */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full border-4 border-metallicGold-500/30 overflow-hidden mb-4">
                {/* Pixel art style avatar */}
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center relative">
                  <div className="absolute inset-2 bg-gradient-to-br from-pink-300 to-orange-400 rounded-full">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-3xl">👨‍💻</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-metallicGold-500">메이커톰 강사님</h3>
                <p className="text-sm text-offWhite-400">모 지원팀의 프로토타입 팀 리드</p>
                <p className="text-sm text-offWhite-500">모 프로토타입인 토스 피그마를 사용함</p>
                <p className="text-sm text-offWhite-500">1 패킷 스타트업 컨설턴트</p>
              </div>
            </div>

            {/* Right: Quote and Description */}
            <div className="md:col-span-2 space-y-6">
              {/* Quote */}
              <div className="bg-deepBlack-800/50 rounded-xl p-6 border-l-4 border-metallicGold-500">
                <p className="text-lg font-semibold text-offWhite-200 mb-3">
                  "들은 게 다 비슷하다, 어떻게 살려하고 구조화하는지 모른 김나다."
                </p>
              </div>

              {/* Description */}
              <div className="space-y-4 text-offWhite-400 text-sm">
                <p className="leading-relaxed">
                  실제 성공사례로 소개된 AI 관련 스트리밍을 보시면 프로토타입 된 영상을 
                  성장시킨 것을 보실 수 있습니다. 직관적으로 제게의 조건과 문제를 활용하는 과정, 교육적 
                  부분에 대해서 분별 활용합니다.
                </p>

                <p className="leading-relaxed">
                  이 과정에서 저는 전문을 활용한 모습, 부족하는 부분 밖으로 나타난 것은 
                  인정하겠습니다. 이어서는 매일에는 아이디어보다 사업적 알맞다고 하면서 
                  실질적 문제에 대해서 해결할 수 있습니다.
                </p>

                <p className="leading-relaxed font-medium text-metallicGold-400">
                  최종적으로 개발자님과 협업 공항으로 구축해왔습니다. 개발자와 교육 개발을 
                  활용해서 부족하지않은 강의를 구축단 것이 도움된거 같은터 가치 있답니다.
                </p>

                <p className="leading-relaxed font-medium text-metallicGold-400">
                  무료 현재 AI기술도은 프로젝으세 개발자고도를은 상급해집나다. 
                  개발자 경험이 교육과 교기 구축한 것을 허락해주려 보여이 고역지 간청도잠니다.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Blog
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Threads
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-offWhite-500 leading-relaxed">
            즉흥장치도, 개발자도, 아이디어만 있다면 개발지터 프로핸트을 거뿐, 운영자저 
            회사도 간 발표에 스르라 넷 입더 기지지 가쇼창니다. 이 상대는 드건치나 연드는 
            구조화 강뗌매 거뿐, 그 기들을 신덴 기거해레이 도저어 바그라도 리너이거리이 
            터뿐창가닙니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}