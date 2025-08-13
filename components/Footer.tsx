'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Building2, User, FileText } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deepBlack-900 border-t border-metallicGold-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">떡상연구소</h3>
            <div className="space-y-3 text-offWhite-400">
              <div className="flex items-start space-x-3">
                <User size={18} className="text-metallicGold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-offWhite-200">대표</p>
                  <p>박지후</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText size={18} className="text-metallicGold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-offWhite-200">사업자번호</p>
                  <p>405-10-71617</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-offWhite-200 mb-6">연락처</h4>
            <div className="space-y-3 text-offWhite-400">
              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-metallicGold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-offWhite-200">전화</p>
                  <p>010-7200-8322</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-metallicGold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-offWhite-200">이메일</p>
                  <p>dduksanglab@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Location */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-offWhite-200 mb-6">사무실</h4>
            <div className="space-y-3 text-offWhite-400">
              <div className="flex items-start space-x-3">
                <Building2 size={18} className="text-metallicGold-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-offWhite-200">주소</p>
                  <p>인천시 연수구 인천타워대로 323</p>
                  <p>(송도 센트로드) A동 31층</p>
                  <p>더블유엑스60호</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-metallicGold-900/20">
          <div className="flex flex-wrap gap-6 justify-center text-offWhite-400 mb-8">
            <Link href="/" className="hover:text-metallicGold-500 transition-colors">
              홈
            </Link>
            <Link href="/lectures" className="hover:text-metallicGold-500 transition-colors">
              강의
            </Link>
            <Link href="/ai-trends" className="hover:text-metallicGold-500 transition-colors">
              AI 트렌드
            </Link>
            <Link href="/community" className="hover:text-metallicGold-500 transition-colors">
              커뮤니티
            </Link>
            <Link href="/auth/login" className="hover:text-metallicGold-500 transition-colors">
              로그인
            </Link>
            <Link href="/register" className="hover:text-metallicGold-500 transition-colors">
              회원가입
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center text-offWhite-600 text-sm pt-8 border-t border-metallicGold-900/10">
          <p>&copy; {currentYear} 떡상연구소. All rights reserved.</p>
          <p className="mt-2">AI 노코드로 SaaS 만들고 수익화하는 실전 교육 플랫폼</p>
        </div>
      </div>
    </footer>
  );
}
