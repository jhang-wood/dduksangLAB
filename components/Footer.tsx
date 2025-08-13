'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deepBlack-900 border-t border-metallicGold-900/20">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content - Single Row Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          {/* Logo & Company Info */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-24 h-16">
              <Image
                src="/images/떡상연구소_로고/누끼_떡상연구소.png"
                alt="떡상연구소"
                fill
                className="object-contain filter brightness-110"
              />
            </div>
            <div className="text-center md:text-left text-xs text-offWhite-500">
              <p className="font-semibold text-offWhite-400">떡상연구소</p>
              <p>사업자번호: 405-10-71617</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            <Link href="/register" className="text-metallicGold-500 hover:text-metallicGold-400 transition-colors font-semibold text-sm">
              무료 강의
            </Link>
            <Link href="/lectures" className="text-offWhite-400 hover:text-metallicGold-500 transition-colors text-sm">
              강의
            </Link>
            <Link href="/ai-trends" className="text-offWhite-400 hover:text-metallicGold-500 transition-colors text-sm">
              AI 트렌드
            </Link>
            <Link href="/community" className="text-offWhite-400 hover:text-metallicGold-500 transition-colors text-sm">
              커뮤니티
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-offWhite-500">
            <div className="flex items-center gap-1">
              <Phone size={12} className="text-metallicGold-500" />
              <span>010-7200-8322</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={12} className="text-metallicGold-500" />
              <span>dduksanglab@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center text-offWhite-600 text-xs mt-4 pt-4 border-t border-metallicGold-900/10">
          <p>&copy; {currentYear} 떡상연구소. All rights reserved. | AI 노코드 교육 플랫폼</p>
          <p className="mt-1">인천시 연수구 인천타워대로 323 (송도 센트로드) A동 31층 더블유엑스60호</p>
        </div>
      </div>
    </footer>
  );
}
