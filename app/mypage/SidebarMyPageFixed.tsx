'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Eye, Trophy, Coins, UserPlus, Copy, Check,
  Flame, Star, Users, MessageSquare, Activity, TrendingUp,
  Globe, Clock, Heart, ChevronRight, Plus, Gift,
  Home, History, Settings, Bell, BarChart3,
  User, Menu, X, ArrowUp, ArrowDown, Edit, Save, Upload, Camera, Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';

type TabType = 'dashboard' | 'sites' | 'activity' | 'settings';

interface UserStats {
  totalViews: number;
  todayViews: number;
  totalPoints: number;
  currentRank: number;
  totalSites: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  consecutiveDays: number;
}

interface SiteData {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail_url?: string;
  views_today: number;
  views_total: number;
  rank_today: number;
  rank_change: number;
  likes: number;
  comments: number;
  created_at: string;
  is_active: boolean;
}

interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'site_view' | 'site_registered';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

export default function SidebarMyPageFixed() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);
  const [_loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 사용자 데이터 상태
  const [userStats, setUserStats] = useState<UserStats>({
    totalViews: 0,
    todayViews: 0,
    totalPoints: 0,
    currentRank: 0,
    totalSites: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    consecutiveDays: 1
  });
  
  const [userSites, setUserSites] = useState<SiteData[]>([]);
  const [allSites, setAllSites] = useState<SiteData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [userName, setUserName] = useState('사용자');
  const [editingSite, setEditingSite] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<SiteData>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // 프로필 정보
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setUserName(profile.name || profile.email?.split('@')[0] || '사용자');
      }

      // 사용자 사이트 정보
      const { data: sites, error: sitesError } = await supabase
        .from('user_sites')
        .select('*')
        .eq('user_id', user.id)
        .order('views_today', { ascending: false });
      
      // 사이트 데이터 처리 (에러가 있어도 빈 배열로 처리)
      const userSitesData = sites || [];
      setUserSites(userSitesData);
      
      // 통계 계산
      const totalViews = userSitesData.reduce((sum: number, site: any) => sum + (site.views_total || 0), 0);
      const todayViews = userSitesData.reduce((sum: number, site: any) => sum + (site.views_today || 0), 0);
      const validRanks = userSitesData.filter((s: any) => s.rank_today && s.rank_today > 0).map((s: any) => s.rank_today!);
      const bestRank = validRanks.length > 0 ? Math.min(...validRanks) : 0;
      
      setUserStats(prev => ({
        ...prev,
        totalViews,
        todayViews,
        totalSites: userSitesData.length,
        currentRank: bestRank
      }));

      if (sitesError) {
        // 사이트 데이터 로드 실패 시 무시 (선택사항: 사용자에게 표시하는 로직 추가 가능)
      }

      // 전체 사이트 순위 가져오기
      const { data: allSitesData } = await supabase
        .from('user_sites')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .eq('is_active', true)
        .order('views_today', { ascending: false })
        .limit(20);

      if (allSitesData) {
        setAllSites(allSitesData);
      }

      // 최근 활동 내역
      setRecentActivities([
        {
          id: '1',
          type: 'site_registered',
          title: '새 사이트 등록',
          description: '떡상랩 사이트를 등록했습니다',
          timestamp: '1시간 전',
          icon: <Globe className="w-4 h-4" />
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 추천인 코드 복사
  const copyReferralCode = () => {
    const fullLink = `https://dduksang.com?ref=${userName.toUpperCase()}2025`;
    navigator.clipboard.writeText(fullLink);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  // 사이트 수정 시작
  const startEditSite = (site: SiteData) => {
    setEditingSite(site.id);
    setEditFormData({
      name: site.name,
      description: site.description,
      url: site.url,
      category: site.category,
      tags: site.tags,
      thumbnail_url: site.thumbnail_url
    });
  };

  // 사이트 수정 취소
  const cancelEditSite = () => {
    setEditingSite(null);
    setEditFormData({});
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 썸네일 업로드
  const uploadThumbnail = async (file: File) => {
    try {
      console.log('Starting upload with file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `site-thumbnails/${fileName}`;

      console.log('Upload path:', filePath);
      console.log('Bucket name: uploads');

      // First, let's check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      if (listError) {
        console.error('Error listing buckets:', listError);
      }

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('Upload response data:', uploadData);
      console.log('Upload error:', uploadError);

      if (uploadError) {
        console.error('Detailed upload error:', {
          message: uploadError.message,
          name: uploadError.name,
          stack: uploadError.stack
        });
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('uploads').getPublicUrl(filePath);

      console.log('Upload success, public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert(`이미지 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      throw error;
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setThumbnailFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setThumbnailPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);

      // Clear URL input when file is selected
      setEditFormData({ ...editFormData, thumbnail_url: '' });
    }
  };

  // 썸네일 제거
  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setEditFormData({ ...editFormData, thumbnail_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 사이트 정보 업데이트
  const updateSite = async (siteId: string) => {
    try {
      setUploading(true);
      console.log('Updating site:', siteId);
      console.log('Form data:', editFormData);
      console.log('Thumbnail file:', thumbnailFile);

      let thumbnailUrl = editFormData.thumbnail_url;

      // Upload thumbnail if file is selected
      if (thumbnailFile) {
        try {
          console.log('Uploading thumbnail file...');
          thumbnailUrl = await uploadThumbnail(thumbnailFile);
          console.log('Thumbnail uploaded, URL:', thumbnailUrl);
        } catch (uploadError) {
          console.error('File upload failed, but continuing with URL input:', uploadError);
          // 파일 업로드 실패 시에도 URL 입력값이 있으면 계속 진행
          if (!editFormData.thumbnail_url) {
            alert('이미지 업로드에 실패했습니다. Supabase Storage "uploads" 버킷이 생성되지 않았을 수 있습니다.\n\nURL을 직접 입력하여 저장해주세요.');
            return;
          }
          thumbnailUrl = editFormData.thumbnail_url;
        }
      }

      console.log('Final thumbnail URL:', thumbnailUrl);

      const updateData = {
        name: editFormData.name,
        description: editFormData.description,
        url: editFormData.url,
        category: editFormData.category,
        tags: editFormData.tags,
        thumbnail_url: thumbnailUrl
      };

      console.log('Updating with data:', updateData);

      const { error } = await supabase
        .from('user_sites')
        .update(updateData)
        .eq('id', siteId);

      if (error) {
        console.error('Error updating site:', error);
        alert('사이트 업데이트 중 오류가 발생했습니다.');
        return;
      }

      console.log('Database update successful');

      // 로컬 상태 업데이트
      setUserSites(sites => sites.map(site => 
        site.id === siteId 
          ? { ...site, ...updateData }
          : site
      ));

      console.log('Local state updated');

      // 편집 모드 종료
      setEditingSite(null);
      setEditFormData({});
      setThumbnailFile(null);
      setThumbnailPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('사이트 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating site:', error);
      alert('사이트 업데이트 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const deleteSite = async (siteId: string) => {
    if (!confirm('정말로 이 사이트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      setUploading(true);

      const { error } = await supabase
        .from('user_sites')
        .delete()
        .eq('id', siteId);

      if (error) {
        console.error('Error deleting site:', error);
        alert('사이트 삭제 중 오류가 발생했습니다.');
        return;
      }

      // 로컬 상태에서 삭제
      setUserSites(sites => sites.filter(site => site.id !== siteId));
      
      // 편집 모드 종료
      if (editingSite === siteId) {
        setEditingSite(null);
        setEditFormData({});
        setThumbnailFile(null);
        setThumbnailPreview(null);
      }

      alert('사이트가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting site:', error);
      alert('사이트 삭제 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 사이트 탭 컨텐츠 컴포넌트
  const SitesTabContent = () => {
    const isUserSite = (siteId: string) => userSites.some(site => site.id === siteId);
    const getRankChange = (site: SiteData) => {
      const change = site.rank_change || 0;
      return change;
    };

    return (
      <div className="space-y-8">
        {/* 내 사이트 현황 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-offWhite-200">내 사이트 현황</h2>
            <button
              onClick={() => router.push('/sites')}
              className="px-4 py-2 bg-metallicGold-500/20 hover:bg-metallicGold-500/30 border border-metallicGold-500/30 rounded-lg text-metallicGold-500 font-medium transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              새 사이트 등록
            </button>
          </div>
          
          {userSites.length === 0 ? (
            <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-8 text-center">
              <Globe className="w-12 h-12 text-metallicGold-500/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-offWhite-200 mb-2">아직 등록한 사이트가 없습니다</h3>
              <p className="text-offWhite-500 mb-4">지금 사이트를 등록하고 홍보를 시작해보세요!</p>
              <button
                onClick={() => router.push('/sites')}
                className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold"
              >
                첫 사이트 등록하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSites.map((site) => (
                <div
                  key={site.id}
                  className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6 hover:border-metallicGold-700/50 transition-all"
                >
                  {editingSite === site.id ? (
                    // 편집 모드
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-metallicGold-500">사이트 정보 수정</h3>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateSite(site.id);
                            }}
                            disabled={uploading}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                            title="저장"
                          >
                            {uploading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400"></div>
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteSite(site.id);
                            }}
                            disabled={uploading}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              cancelEditSite();
                            }}
                            disabled={uploading}
                            className="p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors disabled:opacity-50"
                            title="취소"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-offWhite-500 mb-1">사이트명</label>
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-offWhite-500 mb-1">설명</label>
                        <textarea
                          value={editFormData.description || ''}
                          onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-offWhite-500 mb-1">URL</label>
                        <input
                          type="url"
                          value={editFormData.url || ''}
                          onChange={(e) => setEditFormData({...editFormData, url: e.target.value})}
                          className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-offWhite-500 mb-1">카테고리</label>
                        <select
                          value={editFormData.category || ''}
                          onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                          className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                        >
                          <option value="AI 도구">AI 도구</option>
                          <option value="포트폴리오">포트폴리오</option>
                          <option value="블로그">블로그</option>
                          <option value="이커머스">이커머스</option>
                          <option value="교육">교육</option>
                          <option value="서비스">서비스</option>
                          <option value="기타">기타</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-offWhite-500 mb-1">태그 (콤마로 구분)</label>
                        <input
                          type="text"
                          value={Array.isArray(editFormData.tags) ? editFormData.tags.join(', ') : ''}
                          onChange={(e) => setEditFormData({...editFormData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                          className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                          placeholder="AI, 자동화, 노코드"
                        />
                      </div>
                      
                      {/* 썸네일 이미지 */}
                      <div>
                        <label className="block text-sm font-medium text-offWhite-500 mb-2">
                          썸네일 이미지 (선택사항)
                        </label>

                        {/* Preview Area */}
                        {(thumbnailPreview || editFormData.thumbnail_url) && (
                          <div className="relative mb-4">
                            <div className="relative aspect-video bg-deepBlack-600 rounded-lg overflow-hidden border border-metallicGold-900/30 max-w-xs">
                              <Image
                                src={thumbnailPreview || editFormData.thumbnail_url || ''}
                                alt="썸네일 미리보기"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={removeThumbnail}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Upload Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* File Upload */}
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
                              className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 hover:bg-deepBlack-900 transition-colors flex items-center justify-center gap-2"
                            >
                              <Upload size={18} />
                              <span>파일 업로드</span>
                            </button>
                          </div>

                          {/* URL Input */}
                          <div className="relative">
                            <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offWhite-600" />
                            <input
                              type="url"
                              value={editFormData.thumbnail_url || ''}
                              onChange={(e) => {
                                setEditFormData({ ...editFormData, thumbnail_url: e.target.value });
                                if (e.target.value) {
                                  // Clear file selection when URL is entered
                                  setThumbnailFile(null);
                                  setThumbnailPreview(null);
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                  }
                                }
                              }}
                              className="w-full pl-10 pr-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                              placeholder="이미지 URL"
                              disabled={!!thumbnailFile}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-offWhite-600 mt-2">
                          💡 이미지는 5MB 이하, JPG/PNG 형식만 가능합니다
                        </p>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <>
                      {/* 썸네일 이미지 (있는 경우) */}
                      {site.thumbnail_url && (
                        <div className="relative aspect-video bg-deepBlack-600 rounded-lg overflow-hidden mb-4 border border-metallicGold-900/20">
                          <Image
                            src={site.thumbnail_url}
                            alt={site.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-offWhite-200 mb-1">{site.name}</h3>
                          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-sm text-metallicGold-500 hover:text-metallicGold-400">
                            {site.url}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-xl font-bold text-metallicGold-500">#{site.rank_today || '---'}</div>
                            {getRankChange(site) !== 0 && (
                              <div className={`text-xs flex items-center ${getRankChange(site) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {getRankChange(site) > 0 ? (
                                  <ArrowDown className="w-3 h-3 mr-1" />
                                ) : (
                                  <ArrowUp className="w-3 h-3 mr-1" />
                                )}
                                {Math.abs(getRankChange(site))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => startEditSite(site)}
                            className="p-2 bg-metallicGold-500/20 text-metallicGold-500 rounded-lg hover:bg-metallicGold-500/30 transition-colors"
                            title="사이트 정보 수정"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-offWhite-500 mb-3 line-clamp-2">{site.description}</p>
                      
                      {/* 카테고리와 태그 표시 */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-metallicGold-500/10 text-metallicGold-500 rounded text-xs font-medium">
                          {site.category || '미분류'}
                        </span>
                        {site.tags && site.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-deepBlack-600 text-offWhite-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                        {site.tags && site.tags.length > 2 && (
                          <span className="text-xs text-offWhite-500">+{site.tags.length - 2}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-deepBlack-900/30 rounded-lg">
                          <Eye className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-offWhite-200">{formatNumber(site.views_today)}</p>
                          <p className="text-xs text-offWhite-500">오늘</p>
                        </div>
                        <div className="text-center p-3 bg-deepBlack-900/30 rounded-lg">
                          <BarChart3 className="w-4 h-4 text-green-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-offWhite-200">{formatNumber(site.views_total)}</p>
                          <p className="text-xs text-offWhite-500">총 조회</p>
                        </div>
                        <div className="text-center p-3 bg-deepBlack-900/30 rounded-lg">
                          <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-offWhite-200">{formatNumber(site.likes)}</p>
                          <p className="text-xs text-offWhite-500">좋아요</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 전체 실시간 순위 */}
        <div>
          <h2 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-metallicGold-500" />
            실시간 사이트 순위
          </h2>
          
          <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
            {allSites.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-metallicGold-500/30 mx-auto mb-4" />
                <p className="text-offWhite-500">아직 등록된 사이트가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allSites.map((site, index) => {
                  const isMysite = isUserSite(site.id);
                  const rankChange = getRankChange(site);
                  
                  return (
                    <div
                      key={site.id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        isMysite 
                          ? 'bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 border border-metallicGold-500/30' 
                          : 'bg-deepBlack-700/30 hover:bg-deepBlack-600/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index < 3 
                            ? 'bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                            : isMysite
                            ? 'bg-metallicGold-500/30 text-metallicGold-400'
                            : 'bg-deepBlack-600 text-offWhite-500'
                        }`}>
                          {index + 1}
                        </div>
                        {isMysite && (
                          <span className="px-2 py-1 bg-metallicGold-500/30 rounded text-xs text-metallicGold-400 font-bold">
                            MY
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${isMysite ? 'text-metallicGold-400' : 'text-offWhite-200'}`}>
                            {site.name}
                          </h3>
                          {rankChange !== 0 && (
                            <div className={`text-xs flex items-center ${rankChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {rankChange > 0 ? (
                                <ArrowDown className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowUp className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(rankChange)}
                            </div>
                          )}
                        </div>
                        <a 
                          href={site.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-offWhite-500 hover:text-metallicGold-400 transition-colors"
                        >
                          {site.url}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className={`text-lg font-bold ${isMysite ? 'text-metallicGold-400' : 'text-offWhite-200'}`}>
                            {formatNumber(site.views_today)}
                          </p>
                          <p className="text-xs text-offWhite-500">오늘 조회수</p>
                        </div>
                        <div className="flex items-center gap-2 text-offWhite-500">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{formatNumber(site.likes)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 사이드바 메뉴 아이템
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: <Home className="w-5 h-5" /> },
    { id: 'sites', label: '내 사이트', icon: <Globe className="w-5 h-5" /> },
    { id: 'activity', label: '활동 내역', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: '설정', icon: <Settings className="w-5 h-5" /> }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="mypage" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-offWhite-200 mb-4">로그인이 필요합니다</h2>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold"
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
      {/* 공통 헤더 */}
      <Header currentPage="mypage" />
      
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 pt-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 헤더 아래부터 시작하는 컨테이너 */}
      <div className="flex pt-20">
        {/* 모바일 메뉴 토글 */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 p-2 bg-deepBlack-800 rounded-lg border border-metallicGold-900/30"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-metallicGold-500" /> : <Menu className="w-6 h-6 text-metallicGold-500" />}
        </button>
        
        {/* 사이드바 */}
        <aside
          className={`w-64 bg-deepBlack-800 border-r border-metallicGold-900/30 fixed lg:static top-20 left-0 h-[calc(100vh-5rem)] lg:h-auto z-45 ${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block`}
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* 사용자 정보 */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-deepBlack-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-offWhite-200">{userName}</h3>
                  <p className="text-sm text-offWhite-500">
                    {userStats.currentRank > 0 ? (
                      <span className="text-metallicGold-500">#{userStats.currentRank}</span>
                    ) : (
                      <span className="text-offWhite-500">순위 없음</span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* 빠른 통계 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-deepBlack-900/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-metallicGold-500">{formatNumber(userStats.totalViews)}</p>
                  <p className="text-xs text-offWhite-500">총 조회수</p>
                </div>
                <div className="bg-deepBlack-900/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-yellow-500">{formatNumber(userStats.totalPoints)}</p>
                  <p className="text-xs text-offWhite-500">포인트</p>
                </div>
              </div>
            </div>
            
            {/* 메뉴 */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 text-metallicGold-500 border border-metallicGold-500/30' 
                      : 'text-offWhite-400 hover:text-offWhite-200 hover:bg-deepBlack-700/30'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            
          </div>
        </aside>
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-5rem)]">
          {/* 대시보드 */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-offWhite-200 mb-6">대시보드</h1>
              
              {/* 통계 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 border border-metallicGold-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8 text-metallicGold-500" />
                    {userStats.currentRank > 0 && userStats.currentRank <= 10 && (
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">TOP 10</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-metallicGold-500">
                    {userStats.currentRank > 0 ? `#${formatNumber(userStats.currentRank)}` : '순위 없음'}
                  </p>
                  <p className="text-sm text-offWhite-500">현재 순위</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Eye className="w-8 h-8 text-blue-500" />
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">오늘</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{formatNumber(userStats.todayViews)}</p>
                  <p className="text-sm text-offWhite-500">조회수</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Coins className="w-8 h-8 text-yellow-500" />
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">+0P</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{formatNumber(userStats.totalPoints)}P</p>
                  <p className="text-sm text-offWhite-500">보유 포인트</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">누적</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">{formatNumber(userStats.totalViews)}</p>
                  <p className="text-sm text-offWhite-500">총 조회수</p>
                </div>
              </div>
              
              {/* 활동 통계 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 커뮤니티 활동 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-metallicGold-500" />
                    커뮤니티 활동
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.totalPosts}</p>
                      <p className="text-sm text-offWhite-500">작성글</p>
                    </div>
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.totalComments}</p>
                      <p className="text-sm text-offWhite-500">댓글</p>
                    </div>
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.totalLikes}</p>
                      <p className="text-sm text-offWhite-500">좋아요</p>
                    </div>
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.consecutiveDays}</p>
                      <p className="text-sm text-offWhite-500">연속출석</p>
                    </div>
                  </div>
                </div>
                
                {/* 친구 초대 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-metallicGold-500" />
                    친구 초대
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-3 text-center">
                      <Gift className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-400">500P</p>
                      <p className="text-xs text-offWhite-500">친구 가입 시</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <Star className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-400">2,000P</p>
                      <p className="text-xs text-offWhite-500">친구 활동 시</p>
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400 text-center">
                      포인트로 곧 이용하실 수 있는 추가적인 서비스를 구축 중이니까 우선 포인트를 모아두시는 것을 추천드립니다.
                    </p>
                  </div>
                  <div className="p-4 bg-deepBlack-900/50 rounded-lg">
                    <p className="text-xs text-offWhite-500 mb-2">내 추천 코드</p>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-metallicGold-500">{userName.toUpperCase()}2025</code>
                      <button
                        onClick={copyReferralCode}
                        className="p-2 hover:bg-deepBlack-700 rounded transition-colors"
                      >
                        {referralCodeCopied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-offWhite-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 내 사이트 */}
          {activeTab === 'sites' && <SitesTabContent />}
          
          {/* 활동 내역 */}
          {activeTab === 'activity' && (
            <div>
              <h1 className="text-2xl font-bold text-offWhite-200 mb-6">활동 내역</h1>
              
              <div className="space-y-4">
                {recentActivities.map((activity, _index) => (
                  <div
                    key={activity.id}
                    className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-4 hover:border-metallicGold-700/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-metallicGold-500/20 rounded-full flex items-center justify-center text-metallicGold-500">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-offWhite-200 font-medium">{activity.title}</h4>
                        <p className="text-sm text-offWhite-500 mt-1">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-offWhite-500" />
                          <span className="text-xs text-offWhite-500">{activity.timestamp}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-offWhite-500" />
                    </div>
                  </div>
                ))}
              </div>
              
              {recentActivities.length === 0 && (
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-12 text-center">
                  <History className="w-16 h-16 text-metallicGold-500/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-offWhite-200 mb-2">아직 활동 내역이 없습니다</h3>
                  <p className="text-offWhite-500">사이트를 등록하거나 커뮤니티에 참여해보세요!</p>
                </div>
              )}
            </div>
          )}
          
          {/* 설정 */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-offWhite-200 mb-6">설정</h1>
              
              <div className="space-y-6">
                {/* 알림 설정 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-metallicGold-500" />
                    알림 설정
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'site_views', label: '내 사이트 조회 알림', enabled: true },
                      { id: 'comments', label: '댓글 알림', enabled: true },
                      { id: 'likes', label: '좋아요 알림', enabled: false },
                      { id: 'newsletter', label: '뉴스레터 수신', enabled: false }
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between">
                        <span className="text-offWhite-300">{setting.label}</span>
                        <button 
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            setting.enabled 
                              ? 'bg-metallicGold-500' 
                              : 'bg-deepBlack-700 border border-offWhite-700'
                          }`}
                        >
                          <div 
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 계정 설정 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-metallicGold-500" />
                    계정 설정
                  </h3>
                  
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-lg font-medium hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all text-left px-4">
                      프로필 편집
                    </button>
                    <button className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-lg font-medium hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all text-left px-4">
                      비밀번호 변경
                    </button>
                    <button 
                      onClick={() => {
                        supabase.auth.signOut();
                        router.push('/');
                      }}
                      className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg font-medium hover:bg-red-500/20 hover:border-red-500/50 transition-all text-left px-4"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}