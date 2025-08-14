'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Trophy, Flame, ChevronUp, ChevronDown, Activity, TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function SimplifiedMyPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Mock 데이터 - 실제 구현 전까지 사용
  const [viewCount, setViewCount] = useState(2456);
  const [yesterdayCount] = useState(2222);
  const [rank, setRank] = useState(8);
  
  const topRankings = [
    { rank: 1, name: 'AI마스터', views: 15234 },
    { rank: 2, name: '떡상킹', views: 8901 },
    { rank: 3, name: '노코드신', views: 5432 },
    { rank: 4, name: '프로개발자', views: 4321 },
    { rank: 5, name: '코딩천재', views: 3210 }
  ];

  // 5초마다 조회수 시뮬레이션 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => {
        const increase = Math.floor(Math.random() * 5);
        return prev + increase;
      });
      
      // 가끔 순위 변동
      if (Math.random() > 0.8) {
        setRank(prev => Math.max(1, prev + (Math.random() > 0.5 ? -1 : 1)));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 변화율 계산
  const getChangeRate = () => {
    if (yesterdayCount === 0) return 0;
    return Math.round(((viewCount - yesterdayCount) / yesterdayCount) * 100);
  };

  // 로그인 체크 완전 제거 - 안정적인 동작을 위해

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="mypage" />

        <div className="container mx-auto max-w-4xl px-4 pt-24 pb-20">
          {/* 메인 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-offWhite-200 mb-2">
              내 사이트 조회수 경쟁
            </h1>
            <p className="text-offWhite-500">
              실시간으로 업데이트되는 조회수를 확인하세요
            </p>
          </motion.div>

          {/* 내 사이트 조회수 카드 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 border-2 border-metallicGold-500/40 rounded-3xl p-8 mb-8"
          >
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Trophy className="w-8 h-8 text-metallicGold-500" />
                <span className="text-2xl font-bold text-metallicGold-500">
                  현재 {rank}위
                </span>
              </div>
              
              {/* 조회수 표시 */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-offWhite-200 mb-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={viewCount}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatNumber(viewCount)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-1 text-offWhite-400">
                  <Eye className="w-5 h-5" />
                  <span>오늘 조회수</span>
                </div>
              </div>

              {/* 어제 대비 */}
              <div className="flex justify-center items-center gap-4 text-lg">
                <span className="text-offWhite-400">어제 대비</span>
                <div className={`flex items-center gap-1 font-bold ${
                  viewCount > yesterdayCount ? 'text-green-500' : 'text-red-500'
                }`}>
                  {viewCount > yesterdayCount ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                  <span>{Math.abs(getChangeRate())}%</span>
                  <span className="text-offWhite-400 text-base ml-1">
                    ({viewCount > yesterdayCount ? '+' : ''}{formatNumber(viewCount - yesterdayCount)})
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TOP 5 랭킹 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-offWhite-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-metallicGold-500" />
              실시간 TOP 5
            </h2>

            <div className="space-y-3">
              {topRankings.map((item, index) => (
                <motion.div
                  key={item.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    item.rank === rank 
                      ? 'bg-metallicGold-500/10 border border-metallicGold-500/30' 
                      : 'bg-deepBlack-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      item.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                      item.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                      item.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                      'bg-deepBlack-900 text-offWhite-500'
                    }`}>
                      {item.rank === 1 ? '🥇' :
                       item.rank === 2 ? '🥈' :
                       item.rank === 3 ? '🥉' :
                       item.rank}
                    </div>
                    <div>
                      <div className="font-medium text-offWhite-200 flex items-center gap-2">
                        {item.name}
                        {item.rank === rank && (
                          <span className="px-2 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-offWhite-200">
                      {formatNumber(item.views)}
                    </div>
                    <div className="text-xs text-offWhite-500">조회</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 내가 TOP 5 밖일 때 */}
            {rank > 5 && (
              <div className="mt-4 pt-4 border-t border-metallicGold-900/20">
                <div className="flex items-center justify-between p-3 rounded-xl bg-metallicGold-500/10 border border-metallicGold-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-metallicGold-500/20 flex items-center justify-center">
                      <span className="font-bold text-metallicGold-500">{rank}</span>
                    </div>
                    <div className="font-medium text-offWhite-200">
                      나 
                      <span className="ml-2 px-2 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">
                        YOU
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-offWhite-200">
                      {formatNumber(viewCount)}
                    </div>
                    <div className="text-xs text-offWhite-500">조회</div>
                  </div>
                </div>
                <p className="text-center text-sm text-offWhite-500 mt-3">
                  TOP 5까지 <span className="text-metallicGold-500 font-bold">{rank - 5}위</span> 남았습니다!
                </p>
              </div>
            )}
          </motion.div>

          {/* 하단 액션 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => router.push('/sites')}
              className="px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all transform hover:scale-105"
            >
              내 사이트 등록하고 경쟁 시작하기
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}