'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deepBlack-900 border-t border-metallicGold-900/20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Company & Contact Info */}
          <div className="text-center md:text-left">
            <div className="relative w-32 h-20 mb-6 mx-auto md:mx-0">
              <Image
                src="/images/떡상연구소_로고/누끼_떡상연구소.png"
                alt="떡상연구소"
                fill
                className="object-contain filter brightness-110"
              />
            </div>
            <div className="space-y-2 text-offWhite-400 text-sm">
              <p>대표: 박지후 | 사업자번호: 405-10-71617</p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone size={14} className="text-metallicGold-500" />
                <span>010-7200-8322</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={14} className="text-metallicGold-500" />
                <span>dduksanglab@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links & Address */}
          <div className="text-center md:text-right">
            <div className="flex flex-wrap gap-4 justify-center md:justify-end mb-6">
              <Link href="/register" className="text-metallicGold-500 hover:text-metallicGold-400 transition-colors font-semibold">
                무료 강의 신청
              </Link>
              <Link href="/lectures" className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">
                강의
              </Link>
              <Link href="/ai-trends" className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">
                AI 트렌드
              </Link>
              <Link href="/community" className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">
                커뮤니티
              </Link>
            </div>
            <div className="text-offWhite-400 text-sm">
              <div className="flex items-start gap-2 justify-center md:justify-end">
                <MapPin size={14} className="text-metallicGold-500 mt-1" />
                <div>
                  <p>인천시 연수구 인천타워대로 323</p>
                  <p>(송도 센트로드) A동 31층 더블유엑스60호</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center text-offWhite-600 text-xs mt-8 pt-8 border-t border-metallicGold-900/10">
          <p>&copy; {currentYear} 떡상연구소. All rights reserved.</p>
          <p className="mt-1">AI 노코드로 SaaS 만들고 수익화하는 실전 교육 플랫폼</p>
        </div>
      </div>
    </footer>
  );
}
