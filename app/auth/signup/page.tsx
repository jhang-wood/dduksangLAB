'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';

export default function SignupPage() {
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
  const router = useRouter();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
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
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
      });

      if (error) {
        setError(error.message ?? '회원가입에 실패했습니다.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
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

            <div className="space-y-4">
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
