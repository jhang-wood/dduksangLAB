'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/providers/auth-store-provider';

export default function LoginPageClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      setLoading(false);
      return;
    }
    
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        let errorMessage = error.message ?? '로그인에 실패했습니다.';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.';
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
        }
        
        setError(errorMessage);
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 중 예기치 못한 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      color: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: '#1a1a1a',
        padding: '32px',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{
            display: 'inline-block',
            marginBottom: '16px',
            color: '#f5f5f5',
            textDecoration: 'none'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffd700'
            }}>떡상연구소</div>
          </Link>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#ffd700',
            margin: '0'
          }}>로그인</h2>
          <p style={{
            marginTop: '8px',
            color: '#999',
            fontSize: '14px'
          }}>
            떡상연구소에 오신 것을 환영합니다
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#f87171',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ccc'
            }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#f5f5f5',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ccc'
            }}>
              비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '40px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#f5f5f5',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              href="/auth/forgot-password"
              style={{
                fontSize: '14px',
                color: '#ffd700',
                textDecoration: 'none'
              }}
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#555' : '#ffd700',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: '#999' }}>
              아직 계정이 없으신가요?{' '}
              <Link
                href="/auth/signup"
                style={{
                  color: '#ffd700',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                회원가입
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}