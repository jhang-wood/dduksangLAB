"use client";

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#ff6b6b'
        }}>
          🚨 오류가 발생했습니다
        </h1>
        
        <p style={{
          marginBottom: '24px',
          color: '#a0a0a0',
          lineHeight: '1.5'
        }}>
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
              개발자 정보
            </summary>
            <code style={{ fontSize: '12px', color: '#ff9999' }}>
              {error?.message}
            </code>
          </details>
        )}
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              backgroundColor: '#D4AF37',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            다시 시도
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#f5f5f5',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}