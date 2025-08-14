'use client';

import { Suspense } from 'react';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, CheckCircle, Gift } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';

function SignupPageComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralInfo, setReferralInfo] = useState<{
    code: string;
    referrer_name: string;
    is_valid: boolean;
  } | null>(null);
  const [validatingRef, setValidatingRef] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();

  // URL에서 추천코드 파라미터 확인
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferralCode(refParam);
      validateReferralCode(refParam);
    }
  }, [searchParams]);

  // 추천코드 검증 함수
  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralInfo(null);
      return;
    }

    setValidatingRef(true);
    try {
      const response = await fetch(`/api/referral/validate?code=${encodeURIComponent(code)}`);
      const result = await response.json();
      
      if (result.success) {
        setReferralInfo(result.data);
      } else {
        setReferralInfo(null);
        // URL 파라미터가 아닌 수동 입력인 경우에만 에러 표시
        if (!searchParams.get('ref')) {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('추천코드 검증 오류:', err);
      setReferralInfo(null);
    } finally {
      setValidatingRef(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'referralCode') {
      setReferralCode(value);
      // 실시간 검증 (디바운스 없이)
      if (value.trim()) {
        validateReferralCode(value);
      } else {
        setReferralInfo(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    // 기본 필드 검증
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    if (!formData.password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      setError('이름은 최소 2자 이상이어야 합니다.');
      return false;
    }

    // 전화번호는 선택사항이지만 입력된 경우 유효성 검사
    if (formData.phone && !/^[0-9-+\s()]*$/.test(formData.phone)) {
      setError('올바른 전화번호 형식을 입력해주세요.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        name: formData.name.trim(),
        phone: formData.phone?.trim() || undefined,
      });

      const { error } = result;
      const authData = (result as any).data;
      
      if (error) {
        // Supabase 에러 메시지를 한국어로 번역
        let errorMessage = error.message ?? '회원가입에 실패했습니다.';
        
        if (error.message?.includes('already registered')) {
          errorMessage = '이미 가입된 이메일 주소입니다.';
        } else if (error.message?.includes('Password should be at least 6 characters')) {
          errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = '올바른 이메일 형식을 입력해주세요.';
        } else if (error.message?.includes('email rate limit')) {
          errorMessage = '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        
        setError(errorMessage);
      } else {
        // 회원가입 성공 후 추천코드 처리
        if (referralCode && referralInfo?.is_valid && authData?.user?.id) {
          try {
            await fetch('/api/referral/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                referral_code: referralCode,
                referee_id: authData.user.id
              })
            });
          } catch (refError) {
            console.error('추천코드 처리 오류:', refError);
            // 추천코드 처리 실패해도 회원가입은 성공이므로 계속 진행
          }
        }

        setSuccess(true);
        setTimeout(() => {
          const message = referralInfo 
            ? `회원가입이 완료되었습니다! ${referralInfo.referrer_name}님의 추천으로 500P를 받았습니다. 로그인해주세요.`
            : '회원가입이 완료되었습니다. 로그인해주세요.';
          router.push(`/auth/login?message=${encodeURIComponent(message)}`);
        }, 2000);
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError('회원가입 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div>
            <Link href="/" className="flex justify-center mb-8">
              <Image
                src="/images/떡상연구소_로고-removebg-preview.png"
                alt="떡상연구소"
                width={60}
                height={60}
                className="object-contain"
              />
            </Link>
            <h2 className="text-center text-3xl font-extrabold text-metallicGold-500">회원가입</h2>
            <p className="mt-2 text-center text-sm text-offWhite-600">
              AI 자동화의 세계로 첫걸음을 내딛으세요
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={e => void handleSubmit(e)}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-400">
                  회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
                </p>
              </motion.div>
            )}

            {/* 추천코드 정보 표시 */}
            {referralInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <Gift className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-400 font-medium">
                    🎉 {referralInfo.referrer_name}님의 추천코드가 적용되었습니다!
                  </p>
                  <p className="text-xs text-offWhite-500 mt-1">
                    회원가입 완료 시 500P를 받게 됩니다.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              {/* 추천코드 입력 필드 */}
              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-offWhite-500 mb-2">
                  추천코드 (선택사항)
                </label>
                <div className="relative">
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    value={referralCode}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 pl-12 bg-deepBlack-300 border rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      referralInfo ? 'border-green-500/50 focus:ring-green-500' : 'border-metallicGold-900/30 focus:ring-metallicGold-500'
                    }`}
                    placeholder="추천코드를 입력하세요 (예: JOHN2025)"
                  />
                  <Gift className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    referralInfo ? 'text-green-500' : 'text-offWhite-600'
                  }`} />
                  {validatingRef && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg className="animate-spin h-4 w-4 text-metallicGold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                {referralCode && !referralInfo && !validatingRef && (
                  <p className="text-xs text-red-400 mt-1">
                    유효하지 않은 추천코드입니다.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-offWhite-500 mb-2">
                  이름 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 pl-12 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent transition-all"
                    placeholder="홍길동"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-offWhite-600" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-offWhite-500 mb-2">
                  이메일 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 pl-12 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent transition-all"
                    placeholder="example@email.com"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-offWhite-600" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-offWhite-500 mb-2">
                  전화번호
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 pl-12 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent transition-all"
                    placeholder="010-1234-5678"
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-offWhite-600" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-offWhite-500 mb-2"
                >
                  비밀번호 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 pl-12 pr-12 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent transition-all"
                    placeholder="최소 6자 이상"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-offWhite-600" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-offWhite-500 mb-2"
                >
                  비밀번호 확인 <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 pl-12 pr-12 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent transition-all"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-offWhite-600" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-offWhite-600 space-y-1">
              <p>
                회원가입 시{' '}
                <Link href="/terms" className="text-metallicGold-500 hover:text-metallicGold-400">
                  이용약관
                </Link>{' '}
                및{' '}
                <Link href="/privacy" className="text-metallicGold-500 hover:text-metallicGold-400">
                  개인정보처리방침
                </Link>
                에 동의하게 됩니다.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading ?? success}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-deepBlack-900 font-medium bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 hover:from-metallicGold-400 hover:to-metallicGold-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-metallicGold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    가입 중...
                  </span>
                ) : (
                  '회원가입'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-offWhite-600">
                이미 계정이 있으신가요?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-metallicGold-500 hover:text-metallicGold-400 transition-colors"
                >
                  로그인
                </Link>
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageComponent />
    </Suspense>
  );
}
