'use client';

// 전체 앱 CSR 전환으로 단순화
export const dynamic = 'force-dynamic';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="terms" />

        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-8 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  이용약관
                </span>
              </h1>

              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8">
                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-metallicGold-500 mb-3 sm:mb-4">
                    제1조 (목적)
                  </h2>
                  <p className="text-sm sm:text-base text-offWhite-400 leading-relaxed">
                    이 약관은 떡상연구소(이하 "회사")가 제공하는 온라인 교육 서비스(이하 "서비스")의
                    이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로
                    합니다.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-metallicGold-500 mb-3 sm:mb-4">
                    제2조 (정의)
                  </h2>
                  <ul className="space-y-2 text-sm sm:text-base text-offWhite-400">
                    <li>1. "서비스"란 회사가 제공하는 AI 교육 관련 모든 서비스를 의미합니다.</li>
                    <li>
                      2. "회원"이란 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을
                      체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
                    </li>
                    <li>3. "강의"란 회사가 제공하는 온라인 교육 콘텐츠를 의미합니다.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-metallicGold-500 mb-3 sm:mb-4">
                    제3조 (약관의 효력 및 변경)
                  </h2>
                  <p className="text-sm sm:text-base text-offWhite-400 leading-relaxed">
                    1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써
                    효력을 발생합니다.
                    <br />
                    <br />
                    2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은
                    제1항과 같은 방법으로 공지함으로써 효력을 발생합니다.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">
                    제4조 (서비스의 제공 및 변경)
                  </h2>
                  <p className="text-offWhite-400 leading-relaxed">
                    1. 회사는 다음과 같은 서비스를 제공합니다:
                    <br />- AI 관련 온라인 강의
                    <br />- 학습 자료 및 콘텐츠 제공
                    <br />- 커뮤니티 서비스
                    <br />
                    <br />
                    2. 회사는 서비스의 내용을 변경할 수 있으며, 변경된 내용은 서비스 내 공지사항을
                    통해 회원에게 통지합니다.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">
                    제5조 (개인정보보호)
                  </h2>
                  <p className="text-offWhite-400 leading-relaxed">
                    회사는 회원의 개인정보를 보호하기 위하여 개인정보보호정책을 수립하고 이를
                    준수합니다. 회사의 개인정보보호정책은 별도로 정하는 바에 따릅니다.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-metallicGold-500 mb-4">
                    제6조 (회원의 의무)
                  </h2>
                  <ul className="space-y-2 text-offWhite-400">
                    <li>
                      1. 회원은 다음 행위를 하여서는 안 됩니다:
                      <ul className="ml-4 mt-2 space-y-1">
                        <li>- 타인의 정보 도용</li>
                        <li>- 회사의 저작권 등 지적재산권 침해</li>
                        <li>- 서비스의 정상적인 운영을 방해하는 행위</li>
                      </ul>
                    </li>
                    <li>
                      2. 회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한
                      주의사항을 준수하여야 합니다.
                    </li>
                  </ul>
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
  );
}
