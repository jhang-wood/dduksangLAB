'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check,
  X,
  Terminal,
  Monitor,
  Cloud,
  DollarSign,
  FileCode,
  Zap,
  AlertCircle,
  ChevronRight,
  Crown
} from 'lucide-react';

export default function ClaudeCodeVsOthersSection() {
  const [selectedTool, setSelectedTool] = useState<'claude' | 'cursor' | 'replit'>('claude');

  const tools = {
    claude: {
      name: 'Claude Code CLI',
      logo: '🤖',
      color: 'from-purple-500 to-indigo-600',
      pricing: {
        base: 'Max $100/월',
        details: '주 140-280시간 Sonnet 4',
        opus: '+ 15-35시간 Opus 4',
        extra: '예측 가능한 고정 비용'
      },
      features: [
        { label: '터미널 기반 CLI', status: 'excellent' },
        { label: '200K 토큰 컨텍스트', status: 'excellent' },
        { label: '18,000줄 파일 처리', status: 'excellent' },
        { label: '자동화 최적화', status: 'excellent' },
        { label: 'GUI 지원 (Claudia)', status: 'excellent' },
        { label: 'IDE 통합 (VSCode/JetBrains)', status: 'excellent' }
      ],
      pros: [
        '대규모 코드베이스 처리 우수',
        '자동화와 스크립팅에 최적',
        '예측 가능한 월정액',
        'Claudia GUI로 시각적 작업 가능',
        'VSCode 공식 확장 지원'
      ],
      cons: [
        '초기 CLI 학습 필요',
        'Windows는 WSL 필요',
        '브라우저 네이티브 환경 미지원'
      ],
      bestFor: '자동화, 대규모 프로젝트, 전문 개발'
    },
    cursor: {
      name: 'Cursor',
      logo: '⚡',
      color: 'from-green-500 to-emerald-600',
      pricing: {
        base: '$20/월',
        details: '500 빠른 요청',
        opus: '이후 $0.04/요청',
        extra: 'API 비용 추가 발생'
      },
      features: [
        { label: 'GUI IDE 환경', status: 'excellent' },
        { label: 'VS Code 기반', status: 'excellent' },
        { label: '초보자 친화성', status: 'excellent' },
        { label: '대규모 파일 처리', status: 'poor' },
        { label: '자동화 지원', status: 'moderate' },
        { label: '터미널 통합', status: 'moderate' }
      ],
      pros: [
        'VS Code와 유사한 친숙한 UI',
        '시각적 코드 편집 편리',
        '초보자 접근성 좋음',
        'Windows 네이티브 지원'
      ],
      cons: [
        '18,000줄 파일 처리 실패',
        'API 추가 비용 예측 어려움',
        '자동화 기능 제한적'
      ],
      bestFor: '소규모 프로젝트, GUI 선호자'
    },
    replit: {
      name: 'Replit',
      logo: '☁️',
      color: 'from-orange-500 to-red-600',
      pricing: {
        base: '$30/월',
        details: '100 체크포인트',
        opus: '추가 체크포인트 구매',
        extra: '클라우드 환경 제공'
      },
      features: [
        { label: '클라우드 환경', status: 'excellent' },
        { label: '즉시 시작 가능', status: 'excellent' },
        { label: '협업 기능', status: 'excellent' },
        { label: '로컬 개발', status: 'none' },
        { label: '대규모 처리', status: 'poor' },
        { label: '자동화', status: 'poor' }
      ],
      pros: [
        '설치 없이 즉시 시작',
        '브라우저에서 모든 작업',
        '팀 협업 기능',
        '교육용으로 적합'
      ],
      cons: [
        '전문 개발에 한계',
        '로컬 환경 통합 어려움',
        '체크포인트 시스템 복잡'
      ],
      bestFor: '학습, 프로토타입, 협업'
    }
  };

  const currentTool = tools[selectedTool];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'moderate':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'poor':
      case 'none':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'poor':
      case 'none':
        return 'text-red-500';
      default:
        return 'text-offWhite-500';
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-deepBlack-900 via-deepBlack-800/50 to-deepBlack-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-green-500/5" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-offWhite-200 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-green-500">
              어떤 도구를 선택해야 할까?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-offWhite-400">
            Claude Code CLI vs Cursor vs Replit - 2025년 8월 정확한 비교
          </p>
        </motion.div>

        {/* Tool Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(tools).map(([key, tool]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedTool(key as 'claude' | 'cursor' | 'replit')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedTool === key
                  ? 'bg-gradient-to-r ' + tool.color + ' text-white shadow-lg scale-105'
                  : 'bg-deepBlack-600/50 text-offWhite-400 hover:bg-deepBlack-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mr-2">{tool.logo}</span>
              {tool.name}
            </motion.button>
          ))}
        </div>

        {/* Detailed Comparison */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Pricing Card */}
          <motion.div
            key={selectedTool + '-pricing'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-deepBlack-600/30 rounded-2xl p-6 border border-metallicGold-500/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-metallicGold-500" />
              <h3 className="text-xl font-bold text-offWhite-200">가격 정책</h3>
            </div>
            
            <div className={`bg-gradient-to-r ${currentTool.color} p-[1px] rounded-xl mb-4`}>
              <div className="bg-deepBlack-800 rounded-xl p-4">
                <p className="text-2xl font-bold text-offWhite-200 mb-2">
                  {currentTool.pricing.base}
                </p>
                <p className="text-sm text-offWhite-400 mb-1">
                  {currentTool.pricing.details}
                </p>
                {currentTool.pricing.opus && (
                  <p className="text-sm text-metallicGold-400 mb-1">
                    {currentTool.pricing.opus}
                  </p>
                )}
                <p className="text-xs text-offWhite-500 mt-2 pt-2 border-t border-offWhite-700/20">
                  {currentTool.pricing.extra}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features Card */}
          <motion.div
            key={selectedTool + '-features'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-deepBlack-600/30 rounded-2xl p-6 border border-metallicGold-500/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileCode className="w-5 h-5 text-metallicGold-500" />
              <h3 className="text-xl font-bold text-offWhite-200">주요 기능</h3>
            </div>
            
            <div className="space-y-3">
              {currentTool.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-offWhite-300">{feature.label}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(feature.status)}
                    <span className={`text-xs ${getStatusColor(feature.status)}`}>
                      {feature.status === 'excellent' && '우수'}
                      {feature.status === 'moderate' && '보통'}
                      {feature.status === 'poor' && '미흡'}
                      {feature.status === 'none' && '없음'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pros & Cons Card */}
          <motion.div
            key={selectedTool + '-pros-cons'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-deepBlack-600/30 rounded-2xl p-6 border border-metallicGold-500/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-metallicGold-500" />
              <h3 className="text-xl font-bold text-offWhite-200">장단점</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-green-400 mb-2">장점</p>
                <ul className="space-y-1">
                  {currentTool.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-xs text-offWhite-400">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-red-400 mb-2">단점</p>
                <ul className="space-y-1">
                  {currentTool.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <X className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-xs text-offWhite-400">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-offWhite-700/20">
              <p className="text-xs text-metallicGold-400">
                <span className="font-semibold">최적 사용:</span> {currentTool.bestFor}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Quick Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full bg-deepBlack-600/30 rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-deepBlack-800/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-offWhite-300">비교 항목</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-purple-400">
                  <div className="flex items-center justify-center gap-2">
                    🤖 Claude Code
                    {selectedTool === 'claude' && <Crown className="w-4 h-4 text-metallicGold-500" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-green-400">
                  <div className="flex items-center justify-center gap-2">
                    ⚡ Cursor
                    {selectedTool === 'cursor' && <Crown className="w-4 h-4 text-metallicGold-500" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-orange-400">
                  <div className="flex items-center justify-center gap-2">
                    ☁️ Replit
                    {selectedTool === 'replit' && <Crown className="w-4 h-4 text-metallicGold-500" />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-offWhite-700/10">
                <td className="px-4 py-3 text-sm text-offWhite-400">월 비용</td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">$100</td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">$20 + API</td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">$30 + 체크포인트</td>
              </tr>
              <tr className="border-t border-offWhite-700/10">
                <td className="px-4 py-3 text-sm text-offWhite-400">주당 사용량</td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">140-280시간</td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">500 요청</td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">100 체크포인트</td>
              </tr>
              <tr className="border-t border-offWhite-700/10">
                <td className="px-4 py-3 text-sm text-offWhite-400">인터페이스</td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">
                  <Terminal className="w-4 h-4 mx-auto text-purple-400" />
                </td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">
                  <Monitor className="w-4 h-4 mx-auto text-green-400" />
                </td>
                <td className="px-4 py-3 text-center text-sm text-offWhite-300">
                  <Cloud className="w-4 h-4 mx-auto text-orange-400" />
                </td>
              </tr>
              <tr className="border-t border-offWhite-700/10">
                <td className="px-4 py-3 text-sm text-offWhite-400">대규모 파일</td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-4 h-4 mx-auto text-green-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="w-4 h-4 mx-auto text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="w-4 h-4 mx-auto text-red-500" />
                </td>
              </tr>
              <tr className="border-t border-offWhite-700/10">
                <td className="px-4 py-3 text-sm text-offWhite-400">자동화</td>
                <td className="px-4 py-3 text-center">
                  <Check className="w-4 h-4 mx-auto text-green-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <AlertCircle className="w-4 h-4 mx-auto text-yellow-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="w-4 h-4 mx-auto text-red-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl px-8 py-6 backdrop-blur-sm border border-metallicGold-500/20 inline-block">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ChevronRight className="w-5 h-5 text-metallicGold-500" />
              <p className="text-xl font-bold text-metallicGold-500">왜 Claude Code CLI인가?</p>
            </div>
            <p className="text-offWhite-300">
              초기 CLI 학습은 필요하지만, <span className="text-metallicGold-400 font-semibold">자동화와 대규모 처리</span>에서 압도적 우위<br />
              예측 가능한 월정액으로 <span className="text-metallicGold-400 font-semibold">API 비용 걱정 없이</span> 마음껏 사용
            </p>
          </div>
        </motion.div>

        {/* Claude Code CLI 확장성 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center text-offWhite-200 mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
              Claude Code CLI가 모든 것을 커버합니다
            </span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* GUI 원하는 사람을 위한 Claudia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-offWhite-200">GUI 원하시나요?</h4>
                  <p className="text-xs text-purple-400">Claudia 데스크톱 앱</p>
                </div>
              </div>
              <p className="text-sm text-offWhite-400 mb-4">
                Tauri 2로 만든 네이티브 GUI로 시각적 작업 가능
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">체크포인트 & 포크 기능</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">실시간 diff viewer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">비용 분석 대시보드</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                <p className="text-xs text-purple-400">
                  💡 Cursor의 GUI 장점 + CLI의 강력함
                </p>
              </div>
            </motion.div>

            {/* IDE 통합 원하는 사람을 위한 확장 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FileCode className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-offWhite-200">IDE 통합 원하시나요?</h4>
                  <p className="text-xs text-green-400">공식 확장 프로그램</p>
                </div>
              </div>
              <p className="text-sm text-offWhite-400 mb-4">
                VSCode와 JetBrains IDE에서 직접 사용
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">VSCode 공식 확장</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">IntelliJ, PyCharm 플러그인</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">Cmd+Esc로 즉시 실행</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                <p className="text-xs text-green-400">
                  💡 Cursor처럼 IDE 내에서 직접 작업
                </p>
              </div>
            </motion.div>

            {/* 브라우저 코딩 원하는 사람을 위한 솔루션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-offWhite-200">브라우저 코딩 원하시나요?</h4>
                  <p className="text-xs text-orange-400">클라우드 환경 연동</p>
                </div>
              </div>
              <p className="text-sm text-offWhite-400 mb-4">
                GitHub Codespaces나 Gitpod에서 사용
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">GitHub Codespaces SSH</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">Gitpod 터미널 통합</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-offWhite-300">어디서든 브라우저로 작업</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-orange-500/10 rounded-lg">
                <p className="text-xs text-orange-400">
                  💡 Replit처럼 브라우저에서 개발
                </p>
              </div>
            </motion.div>
          </div>

          {/* 종합 설명 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-8 border border-metallicGold-500/30"
          >
            <div className="text-center">
              <Crown className="w-12 h-12 text-metallicGold-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-metallicGold-500 mb-4">
                Claude Code CLI = 모든 도구의 장점
              </h4>
              <div className="max-w-3xl mx-auto space-y-3 text-offWhite-300">
                <p>
                  <span className="font-semibold text-metallicGold-400">터미널의 강력함</span> + 
                  <span className="font-semibold text-purple-400"> GUI의 편리함</span> + 
                  <span className="font-semibold text-green-400"> IDE 통합</span> + 
                  <span className="font-semibold text-orange-400"> 클라우드 접근성</span>
                </p>
                <p className="text-sm text-offWhite-400">
                  2025년 8월 기준, Claude Code CLI는 확장 생태계를 통해 Cursor와 Replit의 모든 장점을 제공하면서도<br />
                  대규모 코드베이스 처리와 자동화에서 독보적인 성능을 보여줍니다.
                </p>
              </div>
              <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-metallicGold-500">3가지</p>
                  <p className="text-sm text-offWhite-400">작업 환경 선택</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-metallicGold-500">1개</p>
                  <p className="text-sm text-offWhite-400">통합 도구</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-metallicGold-500">무한</p>
                  <p className="text-sm text-offWhite-400">가능성</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}