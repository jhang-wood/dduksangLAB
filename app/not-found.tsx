import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f0f0f',
      color: '#f5f5f5',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '32px',
        textAlign: 'center',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '16px'
        }}>
          🔍
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#D4AF37'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '20px',
          marginBottom: '16px',
          color: '#f5f5f5'
        }}>
          페이지를 찾을 수 없습니다
        </h2>
        
        <p style={{
          marginBottom: '32px',
          color: '#a0a0a0',
          lineHeight: '1.5'
        }}>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          URL을 다시 확인해주세요.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: '#D4AF37',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
          >
            홈으로 이동
          </Link>
          
          <Link
            href="/lectures"
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#f5f5f5',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'border-color 0.2s'
            }}
          >
            강의 보러가기
          </Link>
        </div>
      </div>
    </div>
  );
}