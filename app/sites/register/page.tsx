'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Upload, Camera, X, Plus, ArrowLeft, 
  Sparkles, Info, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';

const categories = [
  'AI 도구',
  '포트폴리오',
  '블로그',
  '이커머스',
  '교육',
  '서비스',
  '기타',
];

export default function RegisterSitePage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    thumbnail_url: '',
    category: 'AI 도구',
    tags: '',
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadThumbnail = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `site-thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  };

  const formatUrl = (url: string) => {
    // URL에 프로토콜이 없으면 https:// 추가
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    setError(null);
    setUploading(true);
    
    try {
      let thumbnailUrl = formData.thumbnail_url;
      
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }
      
      // URL 자동 포맷팅
      const formattedUrl = formatUrl(formData.url);
      
      // user_sites 테이블에 저장
      const { error: insertError } = await supabase
        .from('user_sites')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          url: formattedUrl,
          thumbnail_url: thumbnailUrl || null,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          is_active: true,
          views_today: 0,
          views_total: 0,
          likes: 0,
          comments: 0,
        });
      
      if (insertError) throw insertError;
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/mypage?tab=sites');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error registering site:', err);
      setError(err.message || '사이트 등록 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setThumbnailFile(file);
      
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setThumbnailPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      
      setFormData({ ...formData, thumbnail_url: '' });
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="sites" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-offWhite-200 mb-4">로그인이 필요합니다</h2>
            <p className="text-offWhite-500 mb-6">사이트를 등록하려면 먼저 로그인해주세요.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="sites" />
      
      <div className="container mx-auto max-w-3xl px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deepBlack-300 rounded-2xl border border-metallicGold-900/30 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 p-8 border-b border-metallicGold-900/30">
            <button
              onClick={() => router.push('/sites')}
              className="flex items-center gap-2 text-metallicGold-500 hover:text-metallicGold-400 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>돌아가기</span>
            </button>
            
            <h1 className="text-3xl font-bold text-offWhite-200 mb-2 flex items-center gap-3">
              <Sparkles className="text-metallicGold-500" />
              사이트 홍보하기
            </h1>
            <p className="text-offWhite-500">
              당신이 만든 멋진 프로젝트를 떡상랩 커뮤니티에 소개해보세요
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3"
              >
                <Check className="text-green-500" size={20} />
                <span className="text-green-400">사이트가 성공적으로 등록되었습니다!</span>
              </motion.div>
            )}
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3"
              >
                <Info className="text-red-500" size={20} />
                <span className="text-red-400">{error}</span>
              </motion.div>
            )}
            
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-offWhite-300 mb-2">
                사이트명 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                placeholder="예: 떡상랩 AI 도구"
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-offWhite-300 mb-2">
                설명 *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 h-32 resize-none"
                placeholder="사이트에 대한 간단한 설명을 작성해주세요 (최소 20자)"
                minLength={20}
              />
            </div>
            
            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-offWhite-300 mb-2">
                사이트 URL *
              </label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                placeholder="예: dduksang.com 또는 https://dduksang.com"
              />
            </div>
            
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-offWhite-300 mb-2">
                썸네일 이미지 (선택사항)
              </label>
              
              {/* Preview */}
              {(thumbnailPreview || formData.thumbnail_url) && (
                <div className="relative mb-4">
                  <div className="relative aspect-video bg-deepBlack-600 rounded-lg overflow-hidden border border-metallicGold-900/30">
                    <img
                      src={thumbnailPreview || formData.thumbnail_url}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 hover:bg-deepBlack-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    <span>파일 업로드</span>
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => alert('화면 캡처 기능은 곧 추가됩니다!')}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 hover:bg-deepBlack-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  <span>화면 캡처</span>
                </button>
              </div>
              
              <div className="mt-4">
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={e => {
                    setFormData({ ...formData, thumbnail_url: e.target.value });
                    if (e.target.value) {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }
                  }}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                  placeholder="또는 이미지 URL 입력"
                  disabled={!!thumbnailFile}
                />
              </div>
              
              <p className="text-xs text-offWhite-600 mt-2">
                💡 이미지는 5MB 이하, JPG/PNG 형식만 가능합니다
              </p>
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-offWhite-300 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-offWhite-300 mb-2">
                태그 (콤마로 구분)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                placeholder="AI, 자동화, 노코드"
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-metallicGold-900/30">
              <button
                type="button"
                onClick={() => router.push('/sites')}
                className="flex-1 px-6 py-3 text-offWhite-500 hover:text-offWhite-200 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={uploading || !formData.name || !formData.description || !formData.url}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-deepBlack-900"></div>
                    <span>등록 중...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>등록하기</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}