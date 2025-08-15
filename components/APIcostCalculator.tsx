'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function APIcostCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  
  // API 비용 계산 (Claude API 기준)
  // Sonnet 4: $3 input / $15 output per 1M tokens
  // 시간당 약 50-100K 토큰 사용 가정
  const apiCostPerHour = 1.5; // 보수적 추정
  const weeklyAPIcost = hoursPerDay * daysPerWeek * apiCostPerHour;
  const monthlyAPIcost = weeklyAPIcost * 4.33;
  
  // Claude Max 플랜 비용
  const claudeMaxCost = 100;
  const claudeMaxHoursPerWeek = 210; // 140-280 중간값
  
  // 절감액 계산
  const monthlySavings = Math.max(0, monthlyAPIcost - claudeMaxCost);
  const yearlySavings = monthlySavings * 12;
  const savingsPercentage = monthlyAPIcost > 0 ? ((monthlySavings / monthlyAPIcost) * 100).toFixed(0) : 0;
  
  // 충분한 시간인지 확인
  const weeklyHours = hoursPerDay * daysPerWeek;
  const hasEnoughHours = weeklyHours <= claudeMaxHoursPerWeek;

  const usageScenarios = [
    {
      title: '프리랜서',
      hours: 6,
      days: 5,
      description: '클라이언트 프로젝트',
      apiCost: 6 * 5 * apiCostPerHour * 4.33,
      icon: '💼'
    },
    {
      title: '스타트업 창업자',
      hours: 10,
      days: 6,
      description: 'MVP 개발',
      apiCost: 10 * 6 * apiCostPerHour * 4.33,
      icon: '🚀'
    },
    {
      title: '취미 개발자',
      hours: 3,
      days: 3,
      description: '사이드 프로젝트',
      apiCost: 3 * 3 * apiCostPerHour * 4.33,
      icon: '🎨'
    },
    {
      title: '풀타임 개발자',
      hours: 8,
      days: 5,
      description: '전문 개발 업무',
      apiCost: 8 * 5 * apiCostPerHour * 4.33,
      icon: '👨‍💻'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full backdrop-blur-sm mb-4">
            <Calculator className="w-4 h-4 text-green-500" />
            <span className="text-green-400 font-bold text-sm">
              실시간 ROI 계산기
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-metallicGold-500">
              얼마나 절약할 수 있을까?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            API 직접 사용 vs Claude Max $100 실제 비용 비교
          </p>
        </motion.div>

        {/* Interactive Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-deepBlack-800/50 to-deepBlack-700/50 rounded-3xl p-8 backdrop-blur-sm border border-metallicGold-500/20 mb-12"
        >
          <h3 className="text-2xl font-bold text-center text-metallicGold-500 mb-8">
            나의 사용 패턴 입력
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Hours per day slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-offWhite-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-metallicGold-500" />
                  일일 사용 시간
                </label>
                <span className="text-2xl font-bold text-metallicGold-500">{hoursPerDay}시간</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full h-2 bg-deepBlack-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${(hoursPerDay - 1) / 11 * 100}%, #4B5563 ${(hoursPerDay - 1) / 11 * 100}%, #4B5563 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-offWhite-500 mt-1">
                <span>1시간</span>
                <span>12시간</span>
              </div>
            </div>

            {/* Days per week slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-offWhite-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-metallicGold-500" />
                  주간 작업 일수
                </label>
                <span className="text-2xl font-bold text-metallicGold-500">{daysPerWeek}일</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-deepBlack-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${(daysPerWeek - 1) / 6 * 100}%, #4B5563 ${(daysPerWeek - 1) / 6 * 100}%, #4B5563 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-offWhite-500 mt-1">
                <span>1일</span>
                <span>7일</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* API Cost */}
            <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold text-red-400">API 직접 사용</h4>
              </div>
              <p className="text-3xl font-bold text-offWhite-200 mb-1">
                ${monthlyAPIcost.toFixed(0)}/월
              </p>
              <p className="text-sm text-offWhite-400">
                주 {weeklyHours}시간 사용 시
              </p>
              <div className="mt-3 pt-3 border-t border-red-500/20">
                <p className="text-xs text-offWhite-500">
                  • 사용량 따라 변동<br />
                  • 예측 불가능한 비용<br />
                  • 초과 시 추가 과금
                </p>
              </div>
            </div>

            {/* Claude Max Cost */}
            <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-green-400">Claude Max $100</h4>
              </div>
              <p className="text-3xl font-bold text-offWhite-200 mb-1">
                ${claudeMaxCost}/월
              </p>
              <p className="text-sm text-offWhite-400">
                고정 비용
              </p>
              <div className="mt-3 pt-3 border-t border-green-500/20">
                <p className="text-xs text-offWhite-500">
                  • 주 140-280시간<br />
                  • 예측 가능한 비용<br />
                  • Opus 4 포함
                </p>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl p-6 border border-metallicGold-500/30">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-metallicGold-400" />
                <h4 className="font-semibold text-metallicGold-400">절감액</h4>
              </div>
              <p className="text-3xl font-bold text-metallicGold-500 mb-1">
                ${monthlySavings.toFixed(0)}/월
              </p>
              <p className="text-sm text-metallicGold-400">
                {savingsPercentage}% 절감
              </p>
              <div className="mt-3 pt-3 border-t border-metallicGold-500/20">
                <p className="text-xs text-offWhite-500">
                  • 연간 ${yearlySavings.toFixed(0)} 절감<br />
                  • 강의료 {(yearlySavings / 149).toFixed(0)}배 회수<br />
                  • 즉시 ROI 달성
                </p>
              </div>
            </div>
          </div>

          {/* Usage Status */}
          {hasEnoughHours ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-400 font-semibold">
                  Claude Max $100으로 충분합니다!
                </p>
              </div>
              <p className="text-sm text-offWhite-400 mt-1">
                주 {weeklyHours}시간은 Max 플랜의 140-280시간 내에서 충분히 사용 가능합니다.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <p className="text-yellow-400 font-semibold">
                  Max $200 플랜 고려해보세요
                </p>
              </div>
              <p className="text-sm text-offWhite-400 mt-1">
                주 {weeklyHours}시간 사용 시 Max $200 (주 240-480시간)이 더 적합할 수 있습니다.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Usage Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center text-offWhite-200 mb-8">
            사용자별 비용 시나리오
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-deepBlack-600/30 rounded-2xl p-6 border border-metallicGold-500/10 hover:border-metallicGold-500/30 transition-all"
              >
                <div className="text-3xl mb-3">{scenario.icon}</div>
                <h4 className="text-lg font-bold text-offWhite-200 mb-1">{scenario.title}</h4>
                <p className="text-xs text-offWhite-500 mb-3">{scenario.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-offWhite-400">사용:</span>
                    <span className="text-offWhite-300">{scenario.hours}시간 × {scenario.days}일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-offWhite-400">API:</span>
                    <span className="text-red-400">${scenario.apiCost.toFixed(0)}/월</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-offWhite-400">Max:</span>
                    <span className="text-green-400">$100/월</span>
                  </div>
                  <div className="pt-2 border-t border-offWhite-700/20 flex justify-between">
                    <span className="text-offWhite-400 font-semibold">절감:</span>
                    <span className="text-metallicGold-400 font-bold">
                      ${Math.max(0, scenario.apiCost - 100).toFixed(0)}/월
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-3xl p-8 border border-metallicGold-500/20"
        >
          <h3 className="text-2xl font-bold text-center text-metallicGold-500 mb-6">
            Claude Max $100의 경제성
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-offWhite-200 mb-2">예측 가능한 비용</h4>
              <p className="text-sm text-offWhite-400">
                월 $100 고정<br />
                예산 관리 용이
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-offWhite-200 mb-2">충분한 사용량</h4>
              <p className="text-sm text-offWhite-400">
                주 140-280시간<br />
                대부분 사용자 충분
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-offWhite-200 mb-2">Opus 4 포함</h4>
              <p className="text-sm text-offWhite-400">
                최고급 모델 사용<br />
                복잡한 작업 가능
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ChevronRight className="w-5 h-5 text-metallicGold-500" />
              <p className="text-xl font-bold text-metallicGold-500">투자 대비 수익</p>
            </div>
            <p className="text-2xl font-bold text-offWhite-200 mb-2">
              강의료 <span className="text-metallicGold-500">149,000원</span> = 
              <span className="text-green-500"> 1.5개월</span>만에 회수
            </p>
            <p className="text-offWhite-400">
              이후 매달 <span className="text-metallicGold-400 font-semibold">${monthlySavings.toFixed(0)}</span> 절감 효과
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}