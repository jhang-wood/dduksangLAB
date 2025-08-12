'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  TrendingUp,
  Flame,
  Users,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function CountUp({ end, duration = 2000, suffix = '', prefix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // 이징 함수 적용 (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (end - startValue) * easedProgress;
      
      setCount(Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

function CircularProgress({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 8,
  color = '#FFD700',
  backgroundColor = '#2A2A2A'
}: CircularProgressProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [animatedValue, setAnimatedValue] = useState(0);

  const circumference = 2 * Math.PI * (size / 2 - strokeWidth);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedValue / max) * circumference;

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 2000, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(value * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* 진행률 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-metallicGold-500">
          {Math.round((animatedValue / max) * 100)}%
        </span>
      </div>
    </div>
  );
}

export default function EnhancedStatisticsSection() {
  const statisticsData = [
    {
      id: 'students',
      icon: <Users className="w-8 h-8" />,
      number: 2847,
      label: '누적 수강생',
      description: '실제 수익 창출 경험',
      color: 'text-blue-400',
      bgColor: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-500/30',
      details: '매월 평균 247명 신규 가입'
    },
    {
      id: 'revenue',
      icon: <DollarSign className="w-8 h-8" />,
      number: 100,
      suffix: '만원+',
      label: '평균 월 수익',
      description: 'AI 도구만으로 달성',
      color: 'text-metallicGold-500',
      bgColor: 'from-metallicGold-500/10 to-metallicGold-600/5',
      borderColor: 'border-metallicGold-500/30',
      details: '최고 수익: 월 780만원'
    },
    {
      id: 'time',
      icon: <Clock className="w-8 h-8" />,
      number: 3,
      suffix: '개월',
      label: '평균 첫 수익',
      description: '빠른 수익 창출',
      color: 'text-green-400',
      bgColor: 'from-green-500/10 to-green-600/5',
      borderColor: 'border-green-500/30',
      details: '최단 기록: 45일'
    },
    {
      id: 'completion',
      icon: <Target className="w-8 h-8" />,
      number: 87,
      suffix: '%',
      label: '강의 완주율',
      description: '높은 만족도',
      color: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-purple-600/5',
      borderColor: 'border-purple-500/30',
      details: '업계 평균의 3.2배'
    }
  ];

  const additionalMetrics = [
    {
      title: '수강생 성과 분포',
      items: [
        { label: '월 10만원 이상', percentage: 92, count: 2620 },
        { label: '월 50만원 이상', percentage: 67, count: 1908 },
        { label: '월 100만원 이상', percentage: 45, count: 1281 },
        { label: '월 500만원 이상', percentage: 12, count: 342 }
      ]
    },
    {
      title: '업계 대비 성과',
      items: [
        { label: '완주율', percentage: 87, comparison: '업계 평균 27%' },
        { label: '만족도', percentage: 96, comparison: '업계 평균 73%' },
        { label: '재등록률', percentage: 78, comparison: '업계 평균 34%' },
        { label: '추천율', percentage: 94, comparison: '업계 평균 58%' }
      ]
    }
  ];

  return (
    <section className="py-20 bg-deepBlack-800 border-t border-deepBlack-700">
      <div className="container mx-auto max-w-7xl px-4">
        {/* 메인 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-4">
            숫자로 보는 <span className="text-metallicGold-500">떡상연구소</span>
          </h2>
          <p className="text-xl text-offWhite-400 mb-8">
            데이터가 증명하는 확실한 성과
          </p>
          
          {/* 실시간 업데이트 표시 */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 text-sm text-green-400"
          >
            <Activity className="w-4 h-4" />
            <span>실시간 업데이트 중</span>
          </motion.div>
        </motion.div>

        {/* 메인 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statisticsData.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden text-center p-8 bg-gradient-to-br ${stat.bgColor} rounded-2xl border ${stat.borderColor} backdrop-blur-sm group hover:scale-105 transition-all duration-300`}
            >
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent rounded-full transform translate-x-16 -translate-y-16" />
              </div>

              {/* 아이콘 */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
                className={`${stat.color} mb-6 flex justify-center group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </motion.div>

              {/* 메인 숫자 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                viewport={{ once: true }}
                className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
              >
                <CountUp 
                  end={stat.number} 
                  suffix={stat.suffix || ''} 
                  duration={2000 + index * 200} 
                />
              </motion.div>

              {/* 라벨 */}
              <div className="text-lg font-semibold text-offWhite-200 mb-2">
                {stat.label}
              </div>

              {/* 설명 */}
              <div className="text-sm text-offWhite-400 mb-4">
                {stat.description}
              </div>

              {/* 상세 정보 */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
                viewport={{ once: true }}
                className={`text-xs ${stat.color} font-medium`}
              >
                {stat.details}
              </motion.div>

              {/* 호버 효과 */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${stat.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}
                initial={false}
              />
            </motion.div>
          ))}
        </div>

        {/* 상세 성과 분석 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 mb-16"
        >
          {additionalMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-deepBlack-900 rounded-2xl p-8 border border-deepBlack-700"
            >
              <h3 className="text-2xl font-bold text-metallicGold-500 mb-6 flex items-center gap-3">
                {index === 0 ? <PieChart className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
                {metric.title}
              </h3>
              
              <div className="space-y-6">
                {metric.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + itemIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-offWhite-200 font-medium">
                          {item.label}
                        </span>
                        <span className="text-metallicGold-500 font-bold">
                          {item.percentage}%
                        </span>
                      </div>
                      
                      {/* 진행률 바 */}
                      <div className="w-full bg-deepBlack-700 rounded-full h-2 mb-1">
                        <motion.div
                          initial={{ width: '0%' }}
                          whileInView={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1.5, delay: 1 + itemIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 h-2 rounded-full"
                        />
                      </div>
                      
                      <div className="text-xs text-offWhite-400">
                        {'count' in item ? `${item.count.toLocaleString()}명` : item.comparison}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 성취도 원형 차트 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="bg-deepBlack-900 rounded-2xl p-8 border border-deepBlack-700 text-center"
        >
          <h3 className="text-2xl font-bold text-metallicGold-500 mb-8">
            수강생 성취도 현황
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-12">
            {[
              { label: '강의 완주', value: 87, max: 100, color: '#10B981' },
              { label: '프로젝트 완성', value: 78, max: 100, color: '#F59E0B' },
              { label: '수익 달성', value: 92, max: 100, color: '#EF4444' },
              { label: '목표 달성', value: 85, max: 100, color: '#8B5CF6' }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <CircularProgress
                  value={achievement.value}
                  max={achievement.max}
                  color={achievement.color}
                  size={120}
                />
                <div className="mt-4 text-center">
                  <div className="font-bold text-offWhite-200">
                    {achievement.label}
                  </div>
                  <div className="text-sm text-offWhite-400">
                    {achievement.value}% 달성
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 하단 강조 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-full text-metallicGold-500">
            <Flame className="w-5 h-5 mr-2" />
            매월 새로운 성공 사례가 계속 업데이트되고 있습니다!
            <TrendingUp className="w-5 h-5 ml-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}