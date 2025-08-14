'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const aiLeaders = [
  {
    id: 1,
    name: '샘 알트먼',
    role: 'OpenAI CEO',
    company: 'ChatGPT 개발사',
    quote: 'AGI가 이번 대통령 임기 내에 개발될 것입니다',
    source: 'Bloomberg 인터뷰',
    urgency: '1-4년 내',
    urgencyLevel: 'critical',
    impact: 'AI가 모든 인간 업무 대체',
    avatar: '/images/Ai_human/샘알트먼.png',
  },
  {
    id: 2,
    name: '일론 머스크',
    role: 'Tesla/xAI CEO',
    company: 'Tesla 자동차, Grok AI 개발',
    quote: 'AI가 가장 똑똑한 인간보다 똑똑해지는 것은 내년, 늦어도 2026년',
    source: '노르웨이 국부펀드 CEO 인터뷰',
    urgency: '1-2년 내',
    urgencyLevel: 'critical',
    impact: '인간 지능 완전 추월',
    avatar: '/images/Ai_human/일론머스크.png',
  },
  {
    id: 3,
    name: '젠슨 황',
    role: 'NVIDIA CEO',
    company: 'AI 칩 시장 90% 점유',
    quote: 'AGI가 5년 내에 대부분의 인간을 능가할 것',
    source: 'GTC 키노트',
    urgency: '5년 내',
    urgencyLevel: 'warning',
    impact: '모든 테스트에서 인간 성능 초과',
    avatar: '/images/Ai_human/젠슨황.png',
  },
  {
    id: 4,
    name: '데미스 하사비스',
    role: 'Google DeepMind CEO',
    company: 'AlphaGo, Gemini AI 개발',
    quote: '산업혁명보다 10배 크고 10배 빠른 변화가 올 것',
    source: 'Fortune 인터뷰',
    urgency: '5-10년',
    urgencyLevel: 'warning',
    impact: '인류 역사상 최대 변혁',
    avatar: '/images/Ai_human/Hassabis.png',
  },
  {
    id: 5,
    name: '사티아 나델라',
    role: 'Microsoft CEO',
    company: 'Windows, Copilot AI 개발',
    quote: 'AI 에이전트가 비즈니스 애플리케이션을 완전히 대체',
    source: 'Microsoft Build',
    urgency: '즉시 진행 중',
    urgencyLevel: 'critical',
    impact: '모든 업무 방식 재정의',
    avatar: '/images/Ai_human/Satya Nadella.png',
  },
  {
    id: 6,
    name: '앤드류 응',
    role: 'Stanford 교수',
    company: 'AI 교육의 아버지',
    quote: 'AI를 모르면 읽기 쓰기를 모르는 것과 같다',
    source: 'Stanford 강연',
    urgency: '지금 당장',
    urgencyLevel: 'critical',
    impact: '기본 소양이 된 AI',
    avatar: '/images/Ai_human/Geoffrey Hinton.png',
  },
];

export default function AILeadersCards() {
  const getUrgencyColor = (level: string) => {
    switch(level) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-green-500/50 bg-green-500/10';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch(level) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      default: return '🟢';
    }
  };

  const getUrgencyTextColor = (level: string) => {
    switch(level) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getProgressValue = (urgency: string) => {
    switch(urgency) {
      case '즉시 진행 중': return 95;
      case '지금 당장': return 90;
      case '1-2년 내': return 80;
      case '1-4년 내': return 70;
      case '5년 내': return 50;
      case '5-10년': return 30;
      default: return 20;
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-deepBlack-900">
      {/* 심플한 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/50 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-metallicGold-500 to-red-500">
              AI 리더들의 경고:<br />
              시간이 없습니다
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            실제 발언으로 보는 AGI 도래 타임라인
          </p>
        </motion.div>

        {/* 그리드 레이아웃 - 2열 3행 가로형 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiLeaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <div className={`
                h-full flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border ${getUrgencyColor(leader.urgencyLevel)}
                backdrop-blur-sm transition-all duration-300
                hover:shadow-2xl hover:shadow-metallicGold-500/10
                bg-deepBlack-800/90
              `}>
                {/* 왼쪽: 인물 정보 */}
                <div className="flex-shrink-0">
                  <div className="flex flex-col items-center sm:items-start gap-3">
                    {leader.avatar && (
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20">
                        <img 
                          src={leader.avatar} 
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="text-center sm:text-left">
                      <h3 className="text-metallicGold-500 font-bold text-base">
                        {leader.name}
                      </h3>
                      <p className="text-offWhite-400 text-xs">
                        {leader.role}
                      </p>
                      <p className="text-offWhite-600 text-xs">
                        {leader.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 명언 및 정보 */}
                <div className="flex-1 space-y-3">
                  {/* 긴급도 표시 */}
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-2 text-sm font-bold ${getUrgencyTextColor(leader.urgencyLevel)}`}>
                      <span>{getUrgencyIcon(leader.urgencyLevel)}</span>
                      {leader.urgency}
                    </span>
                    <Clock className={`w-4 h-4 ${getUrgencyTextColor(leader.urgencyLevel)}`} />
                  </div>

                  {/* 명언 */}
                  <div>
                    <p className="text-sm font-semibold text-offWhite-200 leading-relaxed">
                      "{leader.quote}"
                    </p>
                  </div>

                  {/* 프로그레스 바 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-offWhite-500">
                      <span>AGI 도래 임박도</span>
                      <span>{getProgressValue(leader.urgency)}%</span>
                    </div>
                    <div className="w-full bg-deepBlack-900/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${getProgressValue(leader.urgency)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          leader.urgencyLevel === 'critical' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          leader.urgencyLevel === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between pt-2 border-t border-offWhite-700/20">
                    <p className="text-xs text-offWhite-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-metallicGold-500 rounded-full animate-pulse" />
                      {leader.source}
                    </p>
                    <p className="text-xs text-offWhite-400">
                      {leader.impact}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 하단 경고 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4 backdrop-blur-sm">
              <p className="text-lg sm:text-xl font-bold text-offWhite-200">
                ⚠️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  지금 시작하지 않으면, 영원히 뒤처집니다
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}