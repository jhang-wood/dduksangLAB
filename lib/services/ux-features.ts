// FastCampus 스타일 UX 기능들을 위한 Supabase 서비스
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ===========================
// 찜하기/북마크 서비스
// ===========================

export interface Bookmark {
  id: string
  user_id: string
  lecture_id: string
  created_at: string
}

export const bookmarkService = {
  // 북마크 추가
  async addBookmark(lectureId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {throw new Error('로그인이 필요합니다')}

      const { error } = await supabase
        .from('bookmarks')
        .insert({ user_id: user.id, lecture_id: lectureId })

      if (error) {throw error}
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 북마크 제거
  async removeBookmark(lectureId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {throw new Error('로그인이 필요합니다')}

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('lecture_id', lectureId)

      if (error) {throw error}
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 북마크 상태 확인
  async isBookmarked(lectureId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {return false}

      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('lecture_id', lectureId)
        .single()

      return !error && !!data
    } catch (error) {
      return false
    }
  },

  // 사용자의 북마크 목록
  async getUserBookmarks(): Promise<Bookmark[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {return []}

      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          lectures (
            id, title, instructor_name, price, discount_price,
            duration, rating, level, thumbnail_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {throw error}
      return data ?? []
    } catch (error) {
      console.error('북마크 조회 오류:', error)
      return []
    }
  }
}

// ===========================
// 리뷰 시스템 서비스
// ===========================

export interface LectureReview {
  id: string
  user_id: string
  lecture_id: string
  rating: number
  title?: string
  content?: string
  is_verified: boolean
  helpful_count: number
  tags: string[]
  created_at: string
  updated_at: string
  profiles?: {
    name: string
    avatar_url?: string
  }
}

export const reviewService = {
  // 리뷰 작성
  async createReview(review: {
    lectureId: string
    rating: number
    title?: string
    content?: string
    tags?: string[]
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {throw new Error('로그인이 필요합니다')}

      // 수강 여부 확인
      const { data: enrollment } = await supabase
        .from('lecture_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('lecture_id', review.lectureId)
        .single()

      const { error } = await supabase
        .from('lecture_reviews')
        .insert({
          user_id: user.id,
          lecture_id: review.lectureId,
          rating: review.rating,
          title: review.title,
          content: review.content,
          tags: review.tags ?? [],
          is_verified: !!enrollment // 수강생인 경우 인증
        })

      if (error) {throw error}
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 강의별 리뷰 조회
  async getLectureReviews(lectureId: string, limit = 10): Promise<LectureReview[]> {
    try {
      const { data, error } = await supabase
        .from('lecture_reviews')
        .select(`
          *,
          profiles (name, avatar_url)
        `)
        .eq('lecture_id', lectureId)
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {throw error}
      return data ?? []
    } catch (error) {
      console.error('리뷰 조회 오류:', error)
      return []
    }
  },

  // 리뷰 도움됨 평가
  async markHelpful(reviewId: string, isHelpful: boolean): Promise<{ success: boolean }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {throw new Error('로그인이 필요합니다')}

      // 기존 평가 확인 및 업데이트/삽입
      const { data: existing } = await supabase
        .from('review_helpfulness')
        .select('id')
        .eq('user_id', user.id)
        .eq('review_id', reviewId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('review_helpfulness')
          .update({ is_helpful: isHelpful })
          .eq('id', existing.id)
        if (error) {throw error}
      } else {
        const { error } = await supabase
          .from('review_helpfulness')
          .insert({
            user_id: user.id,
            review_id: reviewId,
            is_helpful: isHelpful
          })
        if (error) {throw error}
      }

      return { success: true }
    } catch (error) {
      return { success: false }
    }
  }
}

// ===========================
// 게이미피케이션 서비스
// ===========================

export interface Badge {
  id: string
  name: string
  display_name: string
  description: string
  icon: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
}

export interface UserBadge {
  id: string
  badge_id: string
  earned_at: string
  progress: number
  max_progress: number
  badge_definitions: Badge
}

export const gamificationService = {
  // 사용자 배지 조회
  async getUserBadges(): Promise<UserBadge[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {return []}

      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge_definitions (*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

      if (error) {throw error}
      return data ?? []
    } catch (error) {
      console.error('배지 조회 오류:', error)
      return []
    }
  },

  // 학습 목표 조회
  async getLearningGoals(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {return []}

      const { data, error } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {throw error}
      return data ?? []
    } catch (error) {
      console.error('학습 목표 조회 오류:', error)
      return []
    }
  },

  // 학습 목표 생성
  async createLearningGoal(goal: {
    title: string
    target_value: number
    unit: string
    period: 'daily' | 'weekly' | 'monthly'
    deadline?: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {throw new Error('로그인이 필요합니다')}

      const { error } = await supabase
        .from('learning_goals')
        .insert({
          user_id: user.id,
          ...goal
        })

      if (error) {throw error}
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 학습 활동 기록
  async logActivity(activity: {
    activity_type: string
    activity_data?: any
    points_earned?: number
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {return}

      await supabase
        .from('learning_activities')
        .insert({
          user_id: user.id,
          ...activity
        })
    } catch (error) {
      console.error('활동 기록 오류:', error)
    }
  }
}

// ===========================
// 소셜 증명 서비스
// ===========================

export interface ActivityFeedItem {
  id: string
  user_name: string
  activity_type: string
  lecture_id: string
  lecture_title: string
  rating?: number
  message?: string
  created_at: string
}

export const socialProofService = {
  // 실시간 활동 피드 조회
  async getActivityFeed(limit = 10): Promise<ActivityFeedItem[]> {
    try {
      const { data, error } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {throw error}
      return data ?? []
    } catch (error) {
      console.error('활동 피드 조회 오류:', error)
      return []
    }
  },

  // 강의 통계 조회
  async getLectureStats(lectureId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('lecture_stats')
        .select('*')
        .eq('lecture_id', lectureId)
        .single()

      if (error) {throw error}
      return data
    } catch (error) {
      console.error('강의 통계 조회 오류:', error)
      return null
    }
  },

  // 실시간 통계 업데이트
  async updateLectureStats(lectureId: string, stats: {
    active_users_count?: number
    completion_count_today?: number
    total_enrollments?: number
  }): Promise<void> {
    try {
      await supabase
        .from('lecture_stats')
        .upsert({
          lecture_id: lectureId,
          ...stats,
          last_updated: new Date().toISOString()
        })
    } catch (error) {
      console.error('통계 업데이트 오류:', error)
    }
  }
}

// ===========================
// 할인/긴급성 서비스
// ===========================

export interface DiscountCampaign {
  id: string
  name: string
  lecture_id: string
  discount_percentage: number
  start_date: string
  end_date: string
  max_enrollments?: number
  current_enrollments: number
  is_active: boolean
}

export const urgencyService = {
  // 활성화된 할인 캠페인 조회
  async getActiveCampaigns(): Promise<DiscountCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('discount_campaigns')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .order('discount_percentage', { ascending: false })

      if (error) {throw error}
      return data ?? []
    } catch (error) {
      console.error('할인 캠페인 조회 오류:', error)
      return []
    }
  },

  // 강의별 할인 정보 조회
  async getLectureDiscount(lectureId: string): Promise<DiscountCampaign | null> {
    try {
      const { data, error } = await supabase
        .from('discount_campaigns')
        .select('*')
        .eq('lecture_id', lectureId)
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .order('discount_percentage', { ascending: false })
        .limit(1)
        .single()

      if (error) {return null}
      return data
    } catch (error) {
      return null
    }
  }
}

// ===========================
// 상호작용 서비스
// ===========================

export const interactionService = {
  // 강사에게 질문하기
  async askQuestion(question: {
    lectureId: string
    question: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {throw new Error('로그인이 필요합니다')}

      // 강의 정보 조회로 강사 ID 가져오기
      const { data: lecture } = await supabase
        .from('lectures')
        .select('instructor_id')
        .eq('id', question.lectureId)
        .single()

      const { error } = await supabase
        .from('instructor_qa')
        .insert({
          lecture_id: question.lectureId,
          student_id: user.id,
          instructor_id: lecture?.instructor_id,
          question: question.question
        })

      if (error) {throw error}
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // 무료 체험 접근 기록
  async recordFreeTrialAccess(lectureId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase
        .from('free_trial_access')
        .upsert({
          user_id: user?.id ?? null,
          lecture_id: lectureId,
          ip_address: null, // 클라이언트에서는 IP 주소를 직접 구할 수 없음
          access_duration: 0
        })
    } catch (error) {
      console.error('무료 체험 기록 오류:', error)
    }
  }
}

// ===========================
// 종합 대시보드 서비스
// ===========================

export const dashboardService = {
  // 사용자 학습 대시보드 데이터
  async getUserDashboard(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {return null}

      // 사용자 프로필과 학습 통계
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          *,
          lecture_enrollments (
            id, status, progress_percentage, enrolled_at, completed_at
          ),
          user_badges (
            id,
            badge_definitions (name, display_name, rarity, points)
          )
        `)
        .eq('id', user.id)
        .single()

      return profile
    } catch (error) {
      console.error('대시보드 조회 오류:', error)
      return null
    }
  },

  // 학습 통계 업데이트
  async updateUserStats(stats: {
    learning_streak?: number
    total_learning_hours?: number
    experience_points?: number
    level?: number
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {return}

      await supabase
        .from('profiles')
        .update(stats)
        .eq('id', user.id)
    } catch (error) {
      console.error('통계 업데이트 오류:', error)
    }
  }
}