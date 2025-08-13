'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 헤더 동적 임포트 - 완전히 클라이언트에서만 렌더링
const HeaderSimple = dynamic(() => import('@/components/HeaderSimple'), {
  ssr: false,
  loading: () => <div style={{ height: '64px', backgroundColor: '#0f0f0f' }} />
});

export default function ClientHomePage() {
  const [isClient, setIsClient] = useState(false);
  
  // 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }}>
        로딩 중...
      </div>
    );
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <HeaderSimple />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 16px'
      }}>
        {/* 헤더 */}
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#f5f5f5',
            marginBottom: '24px'
          }}>
            <span style={{
              background: 'linear-gradient(to right, #D4AF37, #B8860B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              dduksangLAB
            </span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#a0a0a0',
            maxWidth: '768px',
            margin: '0 auto'
          }}>
            AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 압도적인 방법
          </p>
        </header>

        {/* 메인 콘텐츠 */}
        <main style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#f5f5f5',
            marginBottom: '32px'
          }}>
            AI 300만원짜리 강의, 더 이상 돈 주고 듣지 마세요
          </h2>
          
          <div style={{
            backgroundColor: 'rgba(30, 30, 30, 0.5)',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '48px',
            maxWidth: '896px',
            margin: '0 auto 48px auto'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#D4AF37',
              marginBottom: '16px'
            }}>
              2025년 8월 12일 (화) 오후 7시 Grand Open
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: '#a0a0a0',
              marginBottom: '24px'
            }}>
              비개발자인 제가 해냈으니, 당신은 더 빨리 할 수 있습니다.
            </p>
            
            <a 
              href="/auth/signup"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'linear-gradient(to right, #D4AF37, #B8860B)',
                color: '#0f0f0f',
                fontWeight: 'bold',
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              무료 강의 신청하기
            </a>
          </div>

          {/* 특징 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '64px'
          }}>
            <div style={{
              backgroundColor: 'rgba(30, 30, 30, 0.5)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#f5f5f5',
                marginBottom: '16px'
              }}>🧠 최정상 1% AI Toolset</h4>
              <p style={{ color: '#a0a0a0' }}>Claude Code + Super Claude로 압도적인 도구를 10분 만에</p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(30, 30, 30, 0.5)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#f5f5f5',
                marginBottom: '16px'
              }}>💬 텔레그램 코딩</h4>
              <p style={{ color: '#a0a0a0' }}>언제 어디서든 채팅 하나로 아이디어를 즉시 프로그램으로</p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(30, 30, 30, 0.5)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#f5f5f5',
                marginBottom: '16px'
              }}>🚀 메타 자동화</h4>
              <p style={{ color: '#a0a0a0' }}>명령어 한 줄로 복잡한 시스템을 1분 만에 구축</p>
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <footer style={{
          textAlign: 'center',
          paddingTop: '64px',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <p style={{ color: '#666' }}>© 2025 dduksangLAB. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}