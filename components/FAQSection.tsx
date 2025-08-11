'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQ {
  id: number
  question: string
  answer: string
  category?: string
}

export const FAQSection = ({
  faqs,
  className = ""
}: {
  faqs: FAQ[]
  className?: string
}) => {
  const [activeId, setActiveId] = useState<number | null>(null)

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id)
  }

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
          <p className="text-lg text-offWhite-500">
            수강 전 궁금한 점들을 확인해보세요
          </p>
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
                <span className="text-offWhite-200 font-semibold text-lg pr-4">
                  {faq.question}
                </span>
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
            <p className="text-offWhite-400 mb-6">
              언제든 문의해 주시면 빠르게 답변 드리겠습니다.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-700 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-600 transition-all">
              1:1 문의하기
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// 샘플 FAQ 데이터
export const sampleFAQs: FAQ[] = [
  {
    id: 1,
    question: "정말 비개발자도 따라할 수 있나요?",
    answer: "네, 물론입니다! 이 강의는 코딩을 전혀 모르는 분들을 위해 설계되었습니다.\n\n저 역시 비개발자 출신으로, 복잡한 프로그래밍 언어나 개발 환경을 배우지 않고도 AI의 힘을 빌려 원하는 프로그램을 만들 수 있는 방법을 알려드립니다.\n\n실제로 수강생 중 80% 이상이 비개발자이며, 모두 성공적으로 자신만의 자동화 프로그램을 완성했습니다.",
    category: "난이도"
  },
  {
    id: 2,
    question: "Claude Code나 Super Claude를 사용해본 적이 없는데 괜찮을까요?",
    answer: "전혀 문제없습니다!\n\n강의 첫 부분에서 Claude Code와 Super Claude의 설치부터 기본 설정까지 모든 과정을 단계별로 자세히 안내해드립니다.\n\n설치 과정에서 어려움이 있으시면 1:1 멘토링을 통해 직접 도움을 드리니 걱정하지 마세요.",
    category: "준비사항"
  },
  {
    id: 3,
    question: "강의를 완주하면 정말 자동화 프로그램을 만들 수 있나요?",
    answer: "네, 반드시 만들 수 있습니다!\n\n강의에서는 단순히 이론만 설명하는 것이 아니라, 실제 작동하는 프로그램을 함께 만들어보는 실습 위주로 진행됩니다.\n\n• 텔레그램 봇을 활용한 원격 제어 시스템\n• 데이터 수집 및 분석 자동화 도구\n• 반복 업무를 자동화하는 EXE 프로그램\n\n이 모든 것을 직접 만들어보며 완성할 수 있습니다.",
    category: "결과"
  },
  {
    id: 4,
    question: "강의 기간이나 수강 제한이 있나요?",
    answer: "전혀 없습니다!\n\n• 무제한 수강: 한 번 결제하시면 평생 시청 가능합니다\n• 업데이트 제공: 새로운 AI 도구나 기법이 나오면 강의도 함께 업데이트됩니다\n• 1:1 멘토링: 수강 기간 중 언제든 개인적인 질문이나 도움이 필요하면 지원합니다\n\n본인의 속도에 맞춰 천천히 학습하셔도 됩니다.",
    category: "수강정책"
  },
  {
    id: 5,
    question: "할인 가격은 언제까지인가요?",
    answer: "현재 첫 기수 런칭 기념 특가로 45% 할인된 가격으로 제공하고 있습니다.\n\n정확한 마감일은 별도로 공지하지 않으며, 선착순 마감될 예정입니다. 일정 인원이 달성되면 정가(180만원)로 복구됩니다.\n\n지금 이 가격으로는 다시 수강할 수 없으니, 관심이 있으시다면 서둘러 결정하시길 권합니다.",
    category: "가격정책"
  },
  {
    id: 6,
    question: "환불 정책은 어떻게 되나요?",
    answer: "수강생의 만족을 최우선으로 생각합니다.\n\n• 강의 시청 후 7일 이내: 100% 환불\n• 단, 강의 진도율 30% 미만인 경우에만 해당\n• 환불 사유: 강의 내용 불만족, 기대와 다른 내용 등 어떤 이유든 가능\n\n하지만 지금까지 환불 요청은 거의 없었습니다. 그만큼 만족도가 높은 강의라는 증거입니다.",
    category: "환불정책"
  }
]