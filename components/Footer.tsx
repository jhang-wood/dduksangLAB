'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Youtube, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    service: [
      { name: '온라인 강의', href: '/lectures' },
      { name: '커뮤니티', href: '/community' },
      { name: 'SaaS 홍보', href: '/saas' },
      { name: '멤버십', href: '/membership' },
    ],
    support: [
      { name: '고객센터', href: '/support' },
      { name: 'FAQ', href: '/faq' },
      { name: '문의하기', href: '/contact' },
      { name: '피드백', href: '/feedback' },
    ],
    company: [
      { name: '회사소개', href: '/about' },
      { name: '채용정보', href: '/careers' },
      { name: '투자정보', href: '/investors' },
      { name: '파트너십', href: '/partnership' },
    ],
    legal: [
      { name: '이용약관', href: '/terms' },
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '환불정책', href: '/refund' },
      { name: '저작권 정책', href: '/copyright' },
    ],
  };

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/dduksang-lab',
      icon: Instagram,
      color: 'hover:text-pink-400',
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/dduksang-lab',
      icon: Youtube,
      color: 'hover:text-red-400',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/dduksang-lab',
      icon: Github,
      color: 'hover:text-gray-400',
    },
  ];

  return (
    <footer className="bg-black border-t border-yellow-500/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소 로고"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-yellow-400">떡상연구소</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              AI 시대를 앞서가는 교육 플랫폼으로, 전문적인 강의와 활발한 커뮤니티, 그리고 혁신적인
              SaaS 홍보를 통해 여러분의 성장을 지원합니다.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={16} />
                <span className="text-sm">contact@dduksang-lab.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone size={16} />
                <span className="text-sm">1588-1234</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin size={16} />
                <span className="text-sm">서울시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              {footerLinks.service.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">지원</h4>
            <ul className="space-y-2">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">회사</h4>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">법적 정보</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Newsletter */}
        <div className="mt-12 pt-8 border-t border-yellow-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">팔로우하기</span>
              <div className="flex space-x-4">
                {socialLinks.map(social => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors`}
                    aria-label={social.name}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">뉴스레터 구독</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
                <button className="px-4 py-2 bg-yellow-400 text-black rounded-r-lg hover:bg-yellow-500 transition-colors">
                  구독
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-yellow-500/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            &copy; {currentYear} 떡상연구소. All rights reserved.
          </div>

          <div className="flex items-center space-x-6 text-gray-400 text-sm">
            <span>사업자등록번호: 123-45-67890</span>
            <span>통신판매신고번호: 제2024-서울강남-1234호</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
