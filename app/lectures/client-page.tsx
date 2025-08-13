'use client';

// Next.js 14 완전 동적 렌더링 강제
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Clock, Users, ChevronRight, Play, BookOpen, CheckCircle } from 'lucide-react';

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

export default function LecturesClientPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  
  // 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setIsClient(true);
    
    // 클라이언트에서만 사용자 정보 가져오기 (에러 처리 추가)
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.warn('사용자 인증 정보 로드 실패:', error instanceof Error ? error.message : String(error));
        setUser(null); // 인증 실패 시 null 설정
      }
    };
    
    getUser();
  }, []);

  // 강의 데이터 로드 - Mock 데이터 사용
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        // Supabase 연결 시도하고 실패하면 Mock 데이터 사용
        let lecturesData = [];
        
        try {
          const { data: dbData, error: lecturesError } = await supabase
            .from('lectures')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

          if (!lecturesError && dbData) {
            lecturesData = dbData;
          } else {
            throw new Error('DB 연결 실패 - Mock 데이터 사용');
          }
        } catch (dbError) {
          console.warn('Supabase 연결 실패, Mock 데이터 사용:', dbError instanceof Error ? dbError.message : String(dbError));
          
          // Mock 강의 데이터
          lecturesData = [
            {
              id: 'mock-1',
              title: 'AI 자동화로 비즈니스 혁신하기',
              description: 'ChatGPT와 자동화 도구를 활용해 업무 효율성을 10배 높이는 실전 가이드',
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
              description: '코딩 없이도 강력한 자동화 시스템을 구축하는 방법',
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
            }
          ];
        }

        setLectures(lecturesData);

        // 사용자의 수강 정보 로드 (Mock 데이터)
        if (user) {
          try {
            const { data: enrollmentsData, error: enrollmentsError } = await supabase
              .from('lecture_enrollments')
              .select('lecture_id, progress, completed')
              .eq('user_id', user.id);

            if (!enrollmentsError && enrollmentsData) {
              setEnrollments(enrollmentsData);
            }
          } catch (enrollError) {
            console.warn('수강 정보 로드 실패, Mock 데이터 사용');
            // Mock 수강 데이터 (데모용)
            setEnrollments([
              { lecture_id: 'mock-1', progress: 45, completed: false }
            ]);
          }
        }
      } catch (error) {
        console.error('강의 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [user]);

  // 카테고리 필터링
  const categories = ['all', 'AI', 'Programming', 'Automation', 'Business'];
  const filteredLectures = lectures.filter(lecture => 
    selectedCategory === 'all' || lecture.category === selectedCategory
  );

  // 수강 상태 확인
  const getEnrollmentStatus = (lectureId: string) => {
    return enrollments.find(e => e.lecture_id === lectureId);
  };

  // 강의 클릭 핸들러
  const handleLectureClick = (lectureId: string) => {
    const enrollment = getEnrollmentStatus(lectureId);
    if (enrollment) {
      // 이미 수강중인 경우 강의실로 이동
      router.push(`/lectures/${lectureId}/learn`);
    } else {
      // 아직 수강하지 않은 경우 상세 페이지로 이동
      router.push(`/lectures/${lectureId}`);
    }
  };

  // 시간 포맷팅
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    return mins === 0 ? `${hours}시간` : `${hours}시간 ${mins}분`;
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return `₩${price.toLocaleString()}`;
  };

  if (!isClient) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }}>
        강의 목록 로딩 중...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      color: '#f5f5f5'
    }}>
      {/* 임시 헤더 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(15, 15, 15, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}>
        <h1 style={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}>
          떡상연구소 - 강의
        </h1>
      </div>
      
      {/* 메인 컨텐츠 */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 16px 32px',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {/* 헤더 섹션 */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(to right, #D4AF37, #B8860B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI 마스터 강의
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: '#a0a0a0',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 압도적인 방법
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '32px',
          justifyContent: 'center'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: selectedCategory === category 
                  ? '#D4AF37' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedCategory === category ? '#000' : '#f5f5f5'
              }}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTop: '3px solid #D4AF37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {/* 강의 목록 */}
        {!loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
            gap: 'clamp(16px, 4vw, 24px)',
            marginBottom: '48px'
          }}>
            {filteredLectures.map(lecture => {
              const enrollment = getEnrollmentStatus(lecture.id);
              
              return (
                <div
                  key={lecture.id}
                  onClick={() => handleLectureClick(lecture.id)}
                  style={{
                    backgroundColor: 'rgba(30, 30, 30, 0.5)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {/* 수강 상태 배지 */}
                  {enrollment && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: enrollment.completed 
                        ? 'linear-gradient(45deg, #10B981, #059669)' 
                        : 'linear-gradient(45deg, #3B82F6, #1D4ED8)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 2
                    }}>
                      {enrollment.completed ? (
                        <>
                          <CheckCircle size={12} />
                          완료
                        </>
                      ) : (
                        <>
                          <Play size={12} />
                          {enrollment.progress}%
                        </>
                      )}
                    </div>
                  )}

                  {/* 썸네일 영역 */}
                  <div style={{
                    height: 'clamp(160px, 40vw, 200px)',
                    background: lecture.thumbnail_url 
                      ? `url(${lecture.thumbnail_url}) center/cover` 
                      : 'linear-gradient(135deg, #D4AF37, #B8860B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {!lecture.thumbnail_url && (
                      <BookOpen size={48} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    )}
                    {/* 재생 버튼 오버레이 */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(212, 175, 55, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={24} style={{ color: '#000', marginLeft: '2px' }} />
                      </div>
                    </div>
                  </div>

                  {/* 강의 정보 */}
                  <div style={{ 
                    padding: 'clamp(16px, 5vw, 24px)'
                  }}>
                    {/* 카테고리 & 레벨 */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        color: '#D4AF37',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {lecture.category}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#a0a0a0',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {lecture.level === 'all' ? '전체' : lecture.level}
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 style={{
                      fontSize: 'clamp(1.1rem, 4vw, 1.25rem)',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      lineHeight: '1.4',
                      color: '#f5f5f5'
                    }}>
                      {lecture.title}
                    </h3>

                    {/* 설명 */}
                    <p style={{
                      color: '#a0a0a0',
                      fontSize: 'clamp(13px, 3.5vw, 14px)',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {lecture.description}
                    </p>

                    {/* 강사 정보 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#D4AF37',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000'
                      }}>
                        {lecture.instructor_name?.[0] || '강'}
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#f5f5f5',
                        fontWeight: '500'
                      }}>
                        {lecture.instructor_name}
                      </span>
                    </div>

                    {/* 메타 정보 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#a0a0a0',
                        fontSize: '14px'
                      }}>
                        <Clock size={16} />
                        {formatDuration(lecture.duration)}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#a0a0a0',
                        fontSize: '14px'
                      }}>
                        <Users size={16} />
                        수강생 1.2k+
                      </div>
                    </div>

                    {/* 가격 & 버튼 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{
                        fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
                        fontWeight: 'bold',
                        color: '#D4AF37'
                      }}>
                        {formatPrice(lecture.price)}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#D4AF37',
                        fontSize: 'clamp(13px, 3.5vw, 14px)',
                        fontWeight: '600',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        minHeight: '44px',
                        minWidth: '120px',
                        justifyContent: 'center'
                      }}>
                        {enrollment ? '이어서 학습' : '자세히 보기'}
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && filteredLectures.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#a0a0a0'
          }}>
            <BookOpen size={64} style={{ margin: '0 auto 24px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#f5f5f5' }}>
              강의를 준비중입니다
            </h3>
            <p>곧 새로운 강의로 찾아뵙겠습니다!</p>
          </div>
        )}
      </main>

      {/* 스피너 애니메이션 CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}