'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';
import CountdownTimer from '@/components/CountdownTimer';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="register" />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-full border border-metallicGold-500/30 mb-8">
                <Sparkles className="w-5 h-5 text-metallicGold-500" />
                <span className="text-metallicGold-500 font-semibold">GRAND OPEN SPECIAL</span>
                <Sparkles className="w-5 h-5 text-metallicGold-500" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  사전 등록하고
                  <br className="sm:hidden" />
                  오픈런 혜택 받기
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-offWhite-500 max-w-3xl mx-auto mb-12 px-4 sm:px-0 leading-relaxed">
                떡상연구소의 첫 번째
                <br className="sm:hidden" />
                공식 클래스 오픈을 기념하여
                <br />
                사전 등록하신 분들께
                <br className="sm:hidden" />
                특별한 혜택을 드립니다.
              </p>

              {/* Countdown */}
              <div className="mb-16">
                <p className="text-base sm:text-lg text-offWhite-500 mb-8 tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                  Grand Open D-Day
                </p>
                <CountdownTimer />
                <p className="text-lg sm:text-xl md:text-2xl text-metallicGold-500 mt-8 font-semibold px-4 sm:px-0">
                  2025년 8월 5일 (화) 오후 7시
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-3xl p-6 sm:p-8 md:p-12 border border-metallicGold-500/30"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-offWhite-200 text-center mb-8 sm:mb-12">
                사전 등록 혜택
              </h2>

              <div className="space-y-6">
                {[
                  '그랜드 오픈 특별가 45% 할인',
                  '선착순 100명 한정 추가 보너스',
                  '1:1 맞춤형 멘토링 우선권',
                  '평생 무료 업데이트 보장',
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                    <span className="text-base sm:text-lg md:text-xl text-offWhite-300">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                >
                  <span>지금 바로 사전 등록하기</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
