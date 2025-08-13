'use client';

export const dynamic = 'force-dynamic';

// App Router 전용 에러 페이지 - Client Component 필수
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error: _error, reset }: ErrorProps) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#D4AF37',
          marginBottom: '1rem'
        }}>500</h1>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#f5f5f5',
          marginBottom: '1rem'
        }}>서버 오류가 발생했습니다</h2>
        <p style={{
          color: '#a0a0a0',
          marginBottom: '2rem'
        }}>잠시 후 다시 시도해주세요.</p>
        <button 
          onClick={reset}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'linear-gradient(to right, #D4AF37, #B8860B)',
            color: '#0f0f0f',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          다시 시도
        </button>
        <a 
          href="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'linear-gradient(to right, #D4AF37, #B8860B)',
            color: '#0f0f0f',
            fontWeight: 'bold',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}