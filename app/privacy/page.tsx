'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="privacy" />

        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-8 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  개인정보처리방침
                </span>
              </h1>

              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8">
                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-metallicGold-500 mb-3 sm:mb-4">1. 개인정보의 수집 및 이용목적</h2>
                  <p className="text-sm sm:text-base text-offWhite-400 leading-relaxed">
                    떡상연구소(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 
                    처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                    이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                  </p>
                  <ul className="mt-4 ml-4 space-y-2 text-sm sm:text-base text-offWhite-400">
                    <li>• 회원 가입 및 관리</li>
                    <li>• 서비스 제공 및 계약 이행</li>
                    <li>• 고객 상담 및 불만 처리</li>
                    <li>• 마케팅 및 광고에 활용</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-metallicGold-500 mb-3 sm:mb-4">2. 수집하는 개인정보 항목</h2>
                  <p className="text-sm sm:text-base text-offWhite-400 leading-relaxed mb-4">
                    회사는 다음의 개인정보 항목을 수집하고 있습니다:
                  </p>
                  <div className="bg-deepBlack-600/50 rounded-xl p-4 sm:p-6 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-metallicGold-400 mb-2">필수항목</h3>
                      <p className="text-offWhite-500">이메일, 비밀번호, 이름</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-metallicGold-400 mb-2">선택항목</h3>
                      <p className="text-offWhite-500">전화번호, 생년월일</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-metallicGold-400 mb-2">자동 수집 항목</h3>
                      <p className="text-offWhite-500">IP 주소, 쿠키, 방문 일시, 서비스 이용 기록</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">3. 개인정보의 보유 및 이용기간</h2>
                  <p className="text-offWhite-400 leading-relaxed">
                    회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                  </p>
                  <ul className="mt-4 ml-4 space-y-2 text-offWhite-400">
                    <li>• 회원 정보: 회원 탈퇴 시까지</li>
                    <li>• 계약 또는 청약철회 등에 관한 기록: 5년</li>
                    <li>• 대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                    <li>• 소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">4. 개인정보의 제3자 제공</h2>
                  <p className="text-offWhite-400 leading-relaxed">
                    회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 
                    정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 
                    개인정보를 제3자에게 제공합니다.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">5. 정보주체의 권리·의무 및 행사방법</h2>
                  <p className="text-offWhite-400 leading-relaxed">
                    정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                  </p>
                  <ul className="mt-4 ml-4 space-y-2 text-offWhite-400">
                    <li>• 개인정보 열람요구</li>
                    <li>• 오류 등이 있을 경우 정정 요구</li>
                    <li>• 삭제요구</li>
                    <li>• 처리정지 요구</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">6. 개인정보의 안전성 확보조치</h2>
                  <p className="text-offWhite-400 leading-relaxed">
                    회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
                  </p>
                  <ul className="mt-4 ml-4 space-y-2 text-offWhite-400">
                    <li>• 개인정보의 암호화</li>
                    <li>• 해킹 등에 대비한 기술적 대책</li>
                    <li>• 개인정보에 대한 접근 권한 제한</li>
                    <li>• 개인정보 취급 직원의 최소화 및 교육</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">7. 개인정보 보호책임자</h2>
                  <div className="bg-deepBlack-600/50 rounded-xl p-6">
                    <p className="text-offWhite-400 mb-2">개인정보 보호책임자: 떡상연구소 대표</p>
                    <p className="text-offWhite-400 mb-2">이메일: privacy@dduksang.com</p>
                    <p className="text-offWhite-400">전화번호: 02-1234-5678</p>
                  </div>
                </section>

                <div className="pt-8 text-center text-sm text-offWhite-600">
                  <p>시행일: 2025년 1월 1일</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}