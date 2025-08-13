"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/lib/auth/context";
import { supabase } from '@/lib/supabase';
import { Clock, Users, ChevronRight, Play, BookOpen, CheckCircle, Filter, Grid, List } from 'lucide-react';

interface Lecture {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  duration: number;
  price: number;
  thumbnail_url?: string;
  category: string;
  level: string;
  status: string;
}

interface Enrollment {
  lecture_id: string;
  progress: number;
  completed: boolean;
}

export default function LecturesClient() {
  const { user, loading: authLoading } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // 강의 데이터 로드
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        // Mock 데이터로 시작 (Supabase 연결 실패 시)
        const mockLectures: Lecture[] = [
          {
            id: 'mock-1',
            title: 'AI 자동화로 비즈니스 혁신하기',
            description: 'ChatGPT와 자동화 도구를 활용해 업무 효율성을 10배 높이는 실전 가이드입니다.',
            instructor_name: '김떡상',
            duration: 180,
            price: 89000,
            thumbnail_url: '',
            category: 'AI',
            level: 'beginner',
            status: 'active'
          },
          {
            id: 'mock-2',
            title: '노코드 자동화 마스터 클래스',
            description: '코딩 없이도 강력한 자동화 시스템을 구축하는 방법을 배워보세요.',
            instructor_name: '박자동화',
            duration: 240,
            price: 129000,
            thumbnail_url: '',
            category: 'Automation',
            level: 'intermediate',
            status: 'active'
          },
          {
            id: 'mock-3',
            title: '프로그래밍 기초부터 실전까지',
            description: 'JavaScript와 Python을 활용한 웹 개발 완전 정복',
            instructor_name: '이개발',
            duration: 300,
            price: 0,
            thumbnail_url: '',
            category: 'Programming',
            level: 'all',
            status: 'active'
          },
          {
            id: 'mock-4',
            title: '텔레그램 봇 개발 마스터',
            description: '텔레그램 봇을 활용한 업무 자동화 완전 정복',
            instructor_name: '최봇마스터',
            duration: 150,
            price: 79000,
            thumbnail_url: '',
            category: 'Programming',
            level: 'intermediate',
            status: 'active'
          }
        ];

        try {
          const { data: dbLectures, error } = await supabase
            .from('lectures')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

          if (!error && dbLectures?.length) {
            setLectures(dbLectures);
          } else {
            setLectures(mockLectures);
          }
        } catch {
          setLectures(mockLectures);
        }

        // 사용자 수강 정보 (Mock)
        if (user) {
          setEnrollments([
            { lecture_id: 'mock-1', progress: 45, completed: false }
          ]);
        }
      } catch (error) {
        console.error('강의 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [user]);

  const categories = ['all', 'AI', 'Programming', 'Automation', 'Business'];
  const filteredLectures = lectures.filter(lecture => 
    selectedCategory === 'all' || lecture.category === selectedCategory
  );

  const getEnrollmentStatus = (lectureId: string) => {
    return enrollments.find(e => e.lecture_id === lectureId);
  };

  const handleLectureClick = (lectureId: string) => {
    const enrollment = getEnrollmentStatus(lectureId);
    if (enrollment) {
      router.push(`/lectures/${lectureId}/learn`);
    } else {
      router.push(`/lectures/${lectureId}`);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    return mins === 0 ? `${hours}시간` : `${hours}시간 ${mins}분`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return `₩${price.toLocaleString()}`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">강의 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 text-center border border-gray-800">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">로그인이 필요해요</h2>
          <p className="text-gray-400 mb-8">강의를 수강하려면 먼저 로그인해주세요.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 모바일 친화적 헤더 */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">강의</h1>
              <p className="text-sm text-gray-400">총 {filteredLectures.length}개 강의</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 필터 (모바일에서 토글) */}
          {showFilters && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category === 'all' ? '전체' : category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 강의 목록 */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">로딩중...</p>
            </div>
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">강의가 없습니다</h3>
            <p className="text-gray-400">곧 새로운 강의로 찾아뵙겠습니다!</p>
          </div>
        ) : (
          <div className={`gap-4 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'space-y-4'
          }`}>
            {filteredLectures.map(lecture => {
              const enrollment = getEnrollmentStatus(lecture.id);
              
              return (
                <div
                  key={lecture.id}
                  onClick={() => handleLectureClick(lecture.id)}
                  className={`bg-gray-900 rounded-2xl border border-gray-800 hover:border-yellow-500/30 transition-all cursor-pointer group ${
                    viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'
                  }`}
                >
                  {/* 썸네일/아이콘 */}
                  <div className={`relative ${
                    viewMode === 'list' ? 'w-20 h-20 flex-shrink-0' : 'w-full h-40 mb-4'
                  }`}>
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                      {lecture.thumbnail_url ? (
                        <img 
                          src={lecture.thumbnail_url} 
                          alt={lecture.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-8 h-8 text-yellow-500" />
                      )}
                      
                      {/* 재생 버튼 오버레이 (그리드 모드에서만) */}
                      {viewMode === 'grid' && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Play className="w-5 h-5 text-black ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* 수강 상태 배지 */}
                      {enrollment && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                          {enrollment.completed ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>완료</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>{enrollment.progress}%</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 강의 정보 */}
                  <div className="flex-1">
                    {/* 카테고리 & 레벨 */}
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg text-xs font-medium">
                        {lecture.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-lg text-xs">
                        {lecture.level === 'all' ? '전체' : lecture.level}
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 className={`font-semibold text-white group-hover:text-yellow-500 transition-colors mb-2 ${
                      viewMode === 'list' ? 'text-lg' : 'text-xl'
                    }`}>
                      {lecture.title}
                    </h3>

                    {/* 설명 (그리드 모드에서만 표시) */}
                    {viewMode === 'grid' && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {lecture.description}
                      </p>
                    )}

                    {/* 강사 정보 */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">
                          {lecture.instructor_name?.[0] || '강'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300">{lecture.instructor_name}</span>
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(lecture.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>1.2k+</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 font-bold">
                          {formatPrice(lecture.price)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 스타일링 */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}