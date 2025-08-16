'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Eye, 
  Heart, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Star,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Site {
  id: string;
  user_id: string;
  name: string;
  description: string;
  url: string;
  thumbnail_url?: string;
  category: string;
  tags?: string[];
  views_today: number;
  views_total: number;
  likes: number;
  comments: number;
  is_active: boolean;
  is_hot?: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

const categories = [
  '전체',
  'AI 도구',
  '포트폴리오',
  '블로그',
  '이커머스',
  '교육',
  '서비스',
  '기타',
];

export default function AdminSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체'); // 전체, 활성, 비활성

  const fetchSites = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('user_sites')
        .select(`
          *,
          profiles!user_sites_user_id_fkey (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Category filter
      if (selectedCategory !== '전체') {
        query = query.eq('category', selectedCategory);
      }

      // Status filter
      if (statusFilter === '활성') {
        query = query.eq('is_active', true);
      } else if (statusFilter === '비활성') {
        query = query.eq('is_active', false);
      }

      // Search filter
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching sites:', error);
      } else {
        setSites(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [selectedCategory, searchTerm, statusFilter]);

  const toggleSiteStatus = async (siteId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_sites')
        .update({ is_active: !currentStatus })
        .eq('id', siteId);

      if (!error) {
        setSites(sites.map(site => 
          site.id === siteId 
            ? { ...site, is_active: !currentStatus }
            : site
        ));
      }
    } catch (error) {
      console.error('Error toggling site status:', error);
    }
  };

  const toggleHotStatus = async (siteId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_sites')
        .update({ is_hot: !currentStatus })
        .eq('id', siteId);

      if (!error) {
        setSites(sites.map(site => 
          site.id === siteId 
            ? { ...site, is_hot: !currentStatus }
            : site
        ));
      }
    } catch (error) {
      console.error('Error toggling hot status:', error);
    }
  };

  const deleteSite = async (siteId: string) => {
    if (!confirm('정말로 이 사이트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_sites')
        .delete()
        .eq('id', siteId);

      if (!error) {
        setSites(sites.filter(site => site.id !== siteId));
      }
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-deepBlack-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-offWhite-200 mb-2">
                  사이트 홍보관 관리
                </h1>
                <p className="text-offWhite-500">
                  사용자가 등록한 사이트들을 관리하고 승인/거부할 수 있습니다
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-metallicGold-500">
                  {sites.length}
                </div>
                <div className="text-sm text-offWhite-500">총 사이트 수</div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-deepBlack-300/50 backdrop-blur-sm rounded-xl p-4 border border-metallicGold-900/30">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offWhite-600" size={18} />
                    <input
                      type="text"
                      placeholder="사이트명이나 설명으로 검색..."
                      className="w-full pl-10 pr-4 py-2 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-200 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900'
                          : 'bg-deepBlack-600/50 text-offWhite-500 hover:text-metallicGold-400'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  {['전체', '활성', '비활성'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === status
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-deepBlack-600/50 text-offWhite-500 hover:text-blue-400'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sites Table */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
            </div>
          ) : (
            <div className="bg-deepBlack-300/50 backdrop-blur-sm rounded-xl border border-metallicGold-900/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-deepBlack-600/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                        사이트 정보
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                        등록자
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                        카테고리
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                        통계
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                        등록일
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-metallicGold-900/20">
                    {sites.map((site, index) => (
                      <motion.tr
                        key={site.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-deepBlack-600/30 transition-colors"
                      >
                        {/* Site Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-16 h-12 bg-deepBlack-600 rounded-lg overflow-hidden">
                              {site.thumbnail_url ? (
                                <Image
                                  src={site.thumbnail_url}
                                  alt={site.name}
                                  width={64}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Globe className="w-6 h-6 text-metallicGold-500/50" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-offWhite-200 truncate">
                                {site.name}
                              </div>
                              <div className="text-xs text-offWhite-500 truncate max-w-xs">
                                {site.description}
                              </div>
                              <a
                                href={site.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-metallicGold-400 hover:text-metallicGold-300 truncate max-w-xs block"
                              >
                                {site.url}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-offWhite-200">
                            {site.profiles?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-offWhite-500">
                            {site.profiles?.email || 'No email'}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-metallicGold-500/10 text-metallicGold-400">
                            {site.category}
                          </span>
                        </td>

                        {/* Stats */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4 text-xs text-offWhite-500">
                            <div className="flex items-center space-x-1">
                              <Eye size={14} />
                              <span>{site.views_total}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart size={14} />
                              <span>{site.likes}</span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              site.is_active 
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {site.is_active ? '활성' : '비활성'}
                            </span>
                            {site.is_hot && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                                HOT
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-offWhite-500">
                          {formatDate(site.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {/* Visit Site */}
                            <button
                              onClick={() => window.open(site.url, '_blank')}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                              title="사이트 방문"
                            >
                              <ExternalLink size={16} />
                            </button>

                            {/* Toggle Active Status */}
                            <button
                              onClick={() => toggleSiteStatus(site.id, site.is_active)}
                              className={`p-1 transition-colors ${
                                site.is_active
                                  ? 'text-green-400 hover:text-green-300'
                                  : 'text-red-400 hover:text-red-300'
                              }`}
                              title={site.is_active ? '비활성화' : '활성화'}
                            >
                              {site.is_active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </button>

                            {/* Toggle Hot Status */}
                            <button
                              onClick={() => toggleHotStatus(site.id, site.is_hot || false)}
                              className={`p-1 transition-colors ${
                                site.is_hot
                                  ? 'text-yellow-400 hover:text-yellow-300'
                                  : 'text-offWhite-600 hover:text-yellow-400'
                              }`}
                              title={site.is_hot ? 'HOT 해제' : 'HOT 설정'}
                            >
                              <Star size={16} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteSite(site.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              title="삭제"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sites.length === 0 && (
                <div className="text-center py-20">
                  <Globe className="w-16 h-16 text-metallicGold-500/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-offWhite-400 mb-2">
                    등록된 사이트가 없습니다
                  </h3>
                  <p className="text-offWhite-600">
                    아직 사용자가 등록한 사이트가 없습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}