'use client';

import { userNotification, logger } from '@/lib/logger';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { useAuth } from '@/lib/auth-context';
import { generateSlug } from '@/utils/helpers';

const categories = [
  { id: 'AI 기술', label: 'AI 기술' },
  { id: 'AI 도구', label: 'AI 도구' },
  { id: 'AI 활용', label: 'AI 활용' },
  { id: 'AI 비즈니스', label: 'AI 비즈니스' },
  { id: 'AI 교육', label: 'AI 교육' },
];

export default function NewAITrendPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnail_url: '',
    category: 'AI 기술',
    tags: '',
    source_url: '',
    source_name: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    is_featured: false,
    is_published: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title using improved function
    if (name === 'title' && value.trim() && !formData.slug) {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.summary || !formData.content || !formData.category) {
      userNotification.alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
      const seoKeywords = formData.seo_keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(Boolean);

      const response = await fetch('/api/ai-trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          ...formData,
          tags,
          seo_keywords: seoKeywords,
          seo_title: formData.seo_title ?? formData.title.substring(0, 70),
          seo_description: formData.seo_description ?? formData.summary.substring(0, 160),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (response.ok) {
        userNotification.alert('AI 트렌드가 생성되었습니다.');
        void router.push('/admin/ai-trends');
      } else {
        userNotification.alert(data.error ?? 'AI 트렌드 생성에 실패했습니다.');
      }
    } catch (error) {
      logger.error('Error creating trend:', error);
      userNotification.alert('AI 트렌드 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-bold text-offWhite-200 mb-4 mt-8">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-bold text-offWhite-200 mb-6 mt-10">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-offWhite-400">
            {items.map((item, i) => (
              <li key={i}>{item.replace('- ', '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-lg text-offWhite-400 mb-6 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <AdminHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/ai-trends"
              className="flex items-center gap-2 text-offWhite-500 hover:text-metallicGold-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>목록으로</span>
            </Link>
            <h1 className="text-3xl font-bold text-offWhite-200">새 AI 트렌드 작성</h1>
          </div>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 bg-deepBlack-300/50 text-offWhite-500 rounded-lg hover:bg-deepBlack-300/70 transition-colors"
          >
            <Eye className="w-5 h-5" />
            {preview ? '편집' : '미리보기'}
          </button>
        </div>

        {preview ? (
          <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-offWhite-200 mb-4">
              {formData.title ?? '제목'}
            </h2>
            <p className="text-xl text-offWhite-500 mb-6">{formData.summary ?? '요약'}</p>
            <div className="prose prose-invert max-w-none">
              {renderContent(formData.content ?? '내용이 여기에 표시됩니다.')}
            </div>
          </div>
        ) : (
          <form onSubmit={e => void handleSubmit(e)} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-offWhite-200 mb-4">기본 정보</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">제목 *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="AI 트렌드 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">
                    슬러그 (URL)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="url-friendly-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">
                    카테고리 *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">요약 *</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="트렌드 요약 (100자 이내 권장)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="AI, GPT, 자동화"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">
                    썸네일 URL
                  </label>
                  <input
                    type="text"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-offWhite-200 mb-4">내용</h2>

              <div>
                <label className="block text-sm font-medium text-offWhite-400 mb-2">
                  본문 내용 * (마크다운 지원)
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={15}
                  className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500 font-mono text-sm"
                  placeholder="## 제목&#10;&#10;내용을 입력하세요...&#10;&#10;- 리스트 항목&#10;- 리스트 항목"
                />
                <p className="mt-2 text-xs text-offWhite-600">
                  ## 큰 제목, ### 작은 제목, - 리스트 지원
                </p>
              </div>
            </div>

            {/* Source & SEO */}
            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-offWhite-200 mb-4">출처 및 SEO</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-offWhite-400 mb-2">
                      출처명
                    </label>
                    <input
                      type="text"
                      name="source_name"
                      value={formData.source_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                      placeholder="AI 트렌드 연구소"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-offWhite-400 mb-2">
                      출처 URL
                    </label>
                    <input
                      type="text"
                      name="source_url"
                      value={formData.source_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">
                    SEO 제목 (70자 이내)
                  </label>
                  <input
                    type="text"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="검색 결과에 표시될 제목"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">
                    SEO 설명 (160자 이내)
                  </label>
                  <textarea
                    name="seo_description"
                    value={formData.seo_description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="검색 결과에 표시될 설명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-400 mb-2">
                    SEO 키워드 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    name="seo_keywords"
                    value={formData.seo_keywords}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:border-metallicGold-500"
                    placeholder="AI 트렌드, 인공지능, 머신러닝"
                  />
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-offWhite-200 mb-4">발행 옵션</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-metallicGold-900/50 bg-deepBlack-600 text-metallicGold-500 focus:ring-metallicGold-500"
                  />
                  <span className="text-sm text-offWhite-400">즉시 발행</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-metallicGold-900/50 bg-deepBlack-600 text-metallicGold-500 focus:ring-metallicGold-500"
                  />
                  <span className="text-sm text-offWhite-400">추천 트렌드로 설정</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/admin/ai-trends"
                className="px-6 py-3 bg-deepBlack-300/50 text-offWhite-500 rounded-lg hover:bg-deepBlack-300/70 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
