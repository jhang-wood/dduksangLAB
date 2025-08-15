'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

export const FAQSection = ({ faqs, className = '' }: { faqs: FAQ[]; className?: string }) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="text-metallicGold-500" size={36} />
            자주 묻는 질문
          </h2>
          <p className="text-lg text-offWhite-500">수강 전 궁금한 점들을 확인해보세요</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-deepBlack-600/30 rounded-2xl border border-offWhite-800/20 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-deepBlack-500/30 transition-all"
              >
                <span className="text-offWhite-200 font-semibold text-lg pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: activeId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-metallicGold-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2 border-t border-offWhite-800/20">
                      <p className="text-offWhite-400 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* 추가 문의 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-8 border border-metallicGold-500/30">
            <h3 className="text-xl font-bold text-metallicGold-500 mb-4">
              다른 궁금한 점이 있으신가요?
            </h3>
            <p className="text-offWhite-400 mb-6">언제든 문의해 주시면 빠르게 답변 드리겠습니다.</p>
            <button className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-700 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-600 transition-all">
              1:1 문의하기
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 샘플 FAQ 데이터
export const sampleFAQs: FAQ[] = [
  {
    id: 1,
    question: '정말 비개발자도 따라할 수 있나요?',
    answer:
      '네, 물론입니다! 이 강의는 코딩을 전혀 모르는 분들을 위해 설계되었습니다.\n\nPeter Levels도 기술적 실수가 많았지만 바이브코딩으로 100만 달러를 벌었습니다. 코드를 이해할 필요 없이, 복사-붙여넣기로 시작해서 AI와 대화하며 원하는 것을 만들 수 있습니다.\n\n실제로 2025년 통계에 따르면 비개발자의 40%가 이제 AI로 코딩을 시작했습니다.',
    category: '난이도',
  },
  {
    id: 2,
    question: 'CLI(터미널)이 어렵지 않을까요? GUI가 더 편하지 않나요?',
    answer:
      'GUI(Cursor 등)가 시각적으로는 편해 보이지만, 실제로는 한계가 많습니다:\n\n• Cursor는 18,000줄 이상 파일 처리 실패\n• 자동화 작업에서 CLI가 압도적 우위\n• 대규모 코드베이스는 CLI만 가능\n\n처음 13시간만 투자하면 CLI의 강력함을 체감하실 겁니다. 복사-붙여넣기로 시작하니 걱정 마세요!',
    category: 'CLI',
  },
  {
    id: 3,
    question: 'Claude Code CLI는 정말 무제한인가요?',
    answer:
      '무제한은 아니지만 충분합니다!\n\n• Claude Max $100: 주 140-280시간 Sonnet 4 사용\n• 일반적으로 하루 8시간씩 사용해도 충분\n• API 직접 사용시 월 $300-500 vs Max $100 고정\n\n예측 가능한 월정액으로 API 비용 걱정 없이 마음껏 사용할 수 있습니다.',
    category: '비용',
  },
  {
    id: 4,
    question: '타사 도구(Cursor, Replit)와 뭐가 다른가요?',
    answer:
      'Claude Code CLI만의 차별점:\n\n• Cursor: $20/월 + API 추가 비용 발생\n• Replit: $30/월 + 체크포인트 추가 구매\n• Claude Code: Max $100 고정 비용\n\n특히 자동화와 대규모 프로젝트에서 Claude Code CLI가 압도적입니다. 터미널 기반이라 처음엔 낯설지만, 이것이 진짜 프로의 도구입니다.',
    category: '비교',
  },
  {
    id: 5,
    question: '13시간 만에 정말 실력이 늘까요?',
    answer:
      '단순히 실력이 느는 게 아니라, 13개 실제 프로젝트를 완성합니다!\n\n• 각 모듈당 30분, 총 13시간\n• 이론 10%, 실습 90%\n• 매 프로젝트마다 실제 배포까지\n\nY Combinator CEO도 "10명의 바이브 코더가 100명 개발자의 일을 한다"고 했습니다. 13시간이면 충분합니다.',
    category: '학습시간',
  },
  {
    id: 6,
    question: '수강료 외에 추가 비용이 있나요?',
    answer:
      '강의료 149,000원 외에 권장사항:\n\n• Claude Max $100/월 (선택사항)\n• 또는 Claude Pro $20/월로 시작 가능\n• 무료 플랜으로도 학습 가능 (제한적)\n\n하지만 Max $100 투자시 API 대비 월 $200-400 절감 효과가 있어, 실제로는 비용을 아끼게 됩니다.',
    category: '비용',
  },
  {
    id: 7,
    question: '정말 코드를 전혀 몰라도 되나요?',
    answer:
      'Andrej Karpathy(OpenAI 공동창업자)의 말:\n"바이브코딩으로 코드의 존재조차 잊게 된다"\n\n실제로 Base44는 6개월 만에 25만 사용자를 모아 8천만 달러에 인수되었습니다. 코드를 아는 것보다 AI와 대화하는 능력이 더 중요한 시대입니다.\n\n이 강의는 코드가 아닌 "바이브"를 가르칩니다.',
    category: '난이도',
  },
  {
    id: 8,
    question: '수강 후 어떤 수준이 되나요?',
    answer:
      '13개 포트폴리오를 보유한 AI 개발자가 됩니다:\n\n• 자동화 봇 개발 가능\n• SaaS 사이트 구축 가능\n• 월 구독 서비스 런칭 가능\n• MVP 1시간 내 제작 가능\n\n2025년 현재, AI 코딩 도구 시장이 250억 달러 규모로 성장 중입니다. 당신도 이 시장의 주인공이 될 수 있습니다.',
    category: '결과',
  },
  {
    id: 9,
    question: '환불 정책은 어떻게 되나요?',
    answer:
      '수강생 만족을 최우선으로 합니다:\n\n• 1년 수강 기간 제공\n• 7일 이내 100% 환불 (진도율 30% 미만)\n• 지속적인 커리큘럼 업데이트\n• Q&A 지원\n\n투명하고 공정한 정책으로 운영합니다.',
    category: '환불정책',
  },
  {
    id: 10,
    question: 'Windows에서도 Claude Code CLI가 작동하나요?',
    answer:
      'Windows는 WSL(Windows Subsystem for Linux) 필요:\n\n• WSL 설치 방법 상세 가이드 제공\n• 한 번 설치하면 완벽 작동\n• Mac/Linux는 네이티브 지원\n\n설치 과정도 강의에 포함되어 있으니 걱정 마세요. 복사-붙여넣기로 따라하면 됩니다.',
    category: '시스템',
  },
];
