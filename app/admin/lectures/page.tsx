'use client'

import { userNotification, logger } from '@/lib/logger'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface Lecture {
  id: string
  title: string
  description: string
  instructor_name: string
  category: string
  level: string
  duration: number
  price: number
  is_published: boolean
  created_at: string
  student_count?: number
  chapters?: Chapter[]
  preview_url?: string
  thumbnail_url?: string
  objectives?: string[]
  requirements?: string[]
  target_audience?: string[]
  rating?: number
}

interface Chapter {
  id?: string
  title: string
  description?: string | null
  video_url: string
  duration: number
  order_index: number
  is_preview: boolean
}

const categories = ["AI", "노코드", "자동화", "마케팅", "개발"]
const levels = ["beginner", "intermediate", "advanced"]
const levelLabels = {
  'beginner': '초급',
  'intermediate': '중급',
  'advanced': '고급'
}

export default function AdminLecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor_name: '',
    category: 'AI',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    price: 0,
    preview_url: '',
    thumbnail_url: '',
    objectives: [''],
    requirements: [''],
    target_audience: ['']
  })
  const [chapters, setChapters] = useState<Chapter[]>([])

  const fetchLectures = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .select(`
          *,
          chapters:lecture_chapters(count)
        `)
        .order('created_at', { ascending: false })

      if (error) { throw error }
      setLectures(data ?? [])
    } catch (error) {
      logger.error('Error fetching lectures:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const checkAdminAccess = useCallback(async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/')
      return
    }

    void fetchLectures()
  }, [user, router, fetchLectures])

  useEffect(() => {
    void checkAdminAccess()
  }, [checkAdminAccess])

  const handleCreateLecture = async () => {
    try {
      // Calculate total duration from chapters
      const totalDuration = chapters.reduce((sum, ch) => sum + ch.duration, 0)

      // Create lecture
      const { data: lecture, error: lectureError } = await supabase
        .from('lectures')
        .insert({
          ...formData,
          duration: Math.ceil(totalDuration / 60), // Convert to minutes
          objectives: formData.objectives.filter(o => o.trim()),
          requirements: formData.requirements.filter(r => r.trim()),
          target_audience: formData.target_audience.filter(t => t.trim()),
          tags: [] // You can add tag management later
        })
        .select()
        .single()

      if (lectureError) { throw lectureError }

      // Create chapters
      if (chapters.length > 0) {
        const chaptersData = chapters.map((ch, index) => ({
          lecture_id: lecture.id,
          title: ch.title,
          description: ch.description ?? null,
          video_url: ch.video_url,
          duration: ch.duration,
          order_index: index + 1,
          is_preview: ch.is_preview
        }))

        const { error: chaptersError } = await supabase
          .from('lecture_chapters')
          .insert(chaptersData)

        if (chaptersError) { throw chaptersError }
      }

      // Reset form
      setShowCreateModal(false)
      resetForm()
      void fetchLectures()
    } catch (error) {
      logger.error('Error creating lecture:', error)
      userNotification.alert('강의 생성 중 오류가 발생했습니다.')
    }
  }

  const handleUpdateLecture = async () => {
    if (!editingLecture) {return}

    try {
      const totalDuration = chapters.reduce((sum, ch) => sum + ch.duration, 0)

      const { error: updateError } = await supabase
        .from('lectures')
        .update({
          ...formData,
          duration: Math.ceil(totalDuration / 60),
          objectives: formData.objectives.filter(o => o.trim()),
          requirements: formData.requirements.filter(r => r.trim()),
          target_audience: formData.target_audience.filter(t => t.trim()),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLecture.id)

      if (updateError) { throw updateError }

      // Handle chapters update (simplified - in production you'd handle adds/updates/deletes)
      // This is a basic implementation that deletes all and re-inserts
      await supabase
        .from('lecture_chapters')
        .delete()
        .eq('lecture_id', editingLecture.id)

      if (chapters.length > 0) {
        const chaptersData = chapters.map((ch, index) => ({
          lecture_id: editingLecture.id,
          title: ch.title,
          description: ch.description ?? null,
          video_url: ch.video_url,
          duration: ch.duration,
          order_index: index + 1,
          is_preview: ch.is_preview
        }))

        await supabase
          .from('lecture_chapters')
          .insert(chaptersData)
      }

      setEditingLecture(null)
      resetForm()
      void fetchLectures()
    } catch (error) {
      logger.error('Error updating lecture:', error)
      userNotification.alert('강의 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteLecture = async (lectureId: string) => {
    if (!userNotification.confirm('정말 이 강의를 삭제하시겠습니까? 모든 챕터와 수강 기록이 삭제됩니다.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', lectureId)

      if (error) { throw error }
      void fetchLectures()
    } catch (error) {
      logger.error('Error deleting lecture:', error)
      userNotification.alert('강의 삭제 중 오류가 발생했습니다.')
    }
  }

  const togglePublish = async (lecture: Lecture) => {
    try {
      const { error } = await supabase
        .from('lectures')
        .update({ is_published: !lecture.is_published })
        .eq('id', lecture.id)

      if (error) { throw error }
      void fetchLectures()
    } catch (error) {
      logger.error('Error toggling publish status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor_name: '',
      category: 'AI',
      level: 'beginner',
      price: 0,
      preview_url: '',
      thumbnail_url: '',
      objectives: [''],
      requirements: [''],
      target_audience: ['']
    })
    setChapters([])
  }

  const addChapter = () => {
    setChapters([...chapters, {
      title: '',
      description: null,
      video_url: '',
      duration: 0,
      order_index: chapters.length + 1,
      is_preview: false
    }])
  }

  const updateChapter = (index: number, field: keyof Chapter, value: string | number | boolean | null) => {
    const updated = [...chapters]
    const updatedChapter = { ...updated[index] } as Chapter
    if (field === 'description') {
      updatedChapter[field] = value as string | null
    } else if (field === 'title') {
      updatedChapter[field] = value as string
    } else if (field === 'video_url') {
      updatedChapter[field] = value as string
    } else if (field === 'duration' || field === 'order_index') {
      updatedChapter[field] = value as number
    } else if (field === 'is_preview') {
      updatedChapter[field] = value as boolean
    }
    updated[index] = updatedChapter
    setChapters(updated)
  }

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index))
  }

  const addArrayField = (field: 'objectives' | 'requirements' | 'target_audience') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    })
  }

  const updateArrayField = (field: 'objectives' | 'requirements' | 'target_audience', index: number, value: string) => {
    const updated = [...formData[field]]
    updated[index] = value
    setFormData({ ...formData, [field]: updated })
  }

  const removeArrayField = (field: 'objectives' | 'requirements' | 'target_audience', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    )
  }

  // Chapter Management Component
  const ChapterManagement = ({ lectureId, onChaptersUpdated }: { lectureId: string, onChaptersUpdated: () => void }) => {
    const [lectureChapters, setLectureChapters] = useState<Chapter[]>([])
    const [loadingChapters, setLoadingChapters] = useState(true)
    const [editingChapter, setEditingChapter] = useState<string | null>(null)
    const [newChapter, setNewChapter] = useState({
      title: '',
      description: '' as string | null,
      video_url: '',
      duration: 0,
      is_preview: false
    })

    const fetchChapters = useCallback(async () => {
      try {
        const { data, error } = await supabase
          .from('lecture_chapters')
          .select('*')
          .eq('lecture_id', lectureId)
          .order('order_index', { ascending: true })

        if (error) { throw error }
        setLectureChapters(data ?? [])
      } catch (error) {
        logger.error('Error fetching chapters:', error)
      } finally {
        setLoadingChapters(false)
      }
    }, [lectureId])

    useEffect(() => {
      void fetchChapters()
    }, [fetchChapters])

    const addNewChapter = async () => {
      if (!newChapter.title || !newChapter.video_url) {
        userNotification.alert('제목과 비디오 URL은 필수입니다.')
        return
      }

      try {
        const { error } = await supabase
          .from('lecture_chapters')
          .insert({
            lecture_id: lectureId,
            title: newChapter.title,
            description: newChapter.description ?? null,
            video_url: newChapter.video_url,
            duration: newChapter.duration,
            order_index: lectureChapters.length + 1,
            is_preview: newChapter.is_preview
          })

        if (error) { throw error }

        setNewChapter({
          title: '',
          description: '',
          video_url: '',
          duration: 0,
          is_preview: false
        })
        
        void fetchChapters()
        onChaptersUpdated()
        userNotification.alert('챕터가 추가되었습니다.')
      } catch (error) {
        logger.error('Error adding chapter:', error)
        userNotification.alert('챕터 추가 중 오류가 발생했습니다.')
      }
    }

    const updateChapter = async (chapterId: string, updates: Record<string, string | number | boolean | null>) => {
      try {
        const { error } = await supabase
          .from('lecture_chapters')
          .update(updates)
          .eq('id', chapterId)

        if (error) { throw error }

        void fetchChapters()
        onChaptersUpdated()
        userNotification.alert('챕터가 수정되었습니다.')
      } catch (error) {
        logger.error('Error updating chapter:', error)
        userNotification.alert('챕터 수정 중 오류가 발생했습니다.')
      }
    }

    const deleteChapter = async (chapterId: string) => {
      if (!userNotification.confirm('정말 이 챕터를 삭제하시겠습니까?')) {
        return
      }

      try {
        const { error } = await supabase
          .from('lecture_chapters')
          .delete()
          .eq('id', chapterId)

        if (error) { throw error }

        void fetchChapters()
        onChaptersUpdated()
        userNotification.alert('챕터가 삭제되었습니다.')
      } catch (error) {
        logger.error('Error deleting chapter:', error)
        userNotification.alert('챕터 삭제 중 오류가 발생했습니다.')
      }
    }

    if (loadingChapters) {
      return (
        <div className="border-t border-metallicGold-900/30 p-6 bg-deepBlack-600/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-metallicGold-500 mx-auto mb-2"></div>
            <p className="text-offWhite-600">챕터를 불러오는 중...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="border-t border-metallicGold-900/30 p-6 bg-deepBlack-600/50">
        <h4 className="text-lg font-bold text-offWhite-200 mb-4">챕터 관리</h4>
        
        {/* Add New Chapter */}
        <div className="mb-6 p-4 bg-deepBlack-900 rounded-lg">
          <h5 className="font-medium text-offWhite-200 mb-3">새 챕터 추가</h5>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="챕터 제목"
              value={newChapter.title}
              onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
              className="px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
            />
            <input
              type="number"
              placeholder="재생시간 (초)"
              value={newChapter.duration}
              onChange={(e) => setNewChapter({ ...newChapter, duration: parseInt(e.target.value) ?? 0 })}
              className="px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
            />
          </div>
          <input
            type="text"
            placeholder="비디오 URL"
            value={newChapter.video_url}
            onChange={(e) => setNewChapter({ ...newChapter, video_url: e.target.value })}
            className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 mb-3"
          />
          <textarea
            placeholder="챕터 설명 (선택사항)"
            value={newChapter.description ?? ''}
            onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value ?? null })}
            className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 mb-3 h-20"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-offWhite-500">
              <input
                type="checkbox"
                checked={newChapter.is_preview}
                onChange={(e) => setNewChapter({ ...newChapter, is_preview: e.target.checked })}
                className="rounded text-metallicGold-500"
              />
              미리보기 가능
            </label>
            <button
              onClick={() => void addNewChapter()}
              className="px-4 py-2 bg-metallicGold-500 text-deepBlack-900 rounded font-medium hover:bg-metallicGold-400 transition-colors"
            >
              챕터 추가
            </button>
          </div>
        </div>

        {/* Existing Chapters */}
        <div className="space-y-3">
          {lectureChapters.length === 0 ? (
            <p className="text-offWhite-600 text-center py-4">등록된 챕터가 없습니다.</p>
          ) : (
            lectureChapters.map((chapter) => (
              <div key={chapter.id} className="p-4 bg-deepBlack-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-medium text-offWhite-200">
                    챕터 {chapter.order_index}: {chapter.title}
                  </h6>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingChapter(editingChapter === chapter.id ? null : (chapter.id ?? null))}
                      className="p-1 text-metallicGold-500 hover:text-metallicGold-400"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => void deleteChapter(chapter.id ?? '')}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-offWhite-600 mb-2">
                  <span className="mr-4">재생시간: {Math.floor((chapter.duration ?? 0) / 60)}분 {(chapter.duration ?? 0) % 60}초</span>
                  {chapter.is_preview && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">미리보기</span>}
                </div>

                {chapter.description && (
                  <p className="text-sm text-offWhite-600 mb-2">{chapter.description}</p>
                )}

                <div className="text-xs text-offWhite-700">
                  비디오: {chapter.video_url}
                </div>

                {editingChapter === chapter.id && (
                  <div className="mt-3 pt-3 border-t border-metallicGold-900/30">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        defaultValue={chapter.title}
                        onBlur={(e) => void updateChapter(chapter.id ?? '', { title: e.target.value })}
                        className="px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      />
                      <input
                        type="number"
                        defaultValue={chapter.duration}
                        onBlur={(e) => void updateChapter(chapter.id ?? '', { duration: parseInt(e.target.value) ?? 0 })}
                        className="px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      />
                    </div>
                    <input
                      type="text"
                      defaultValue={chapter.video_url}
                      onBlur={(e) => void updateChapter(chapter.id ?? '', { video_url: e.target.value })}
                      className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 mb-3"
                    />
                    <textarea
                      defaultValue={chapter.description ?? ''}
                      onBlur={(e) => void updateChapter(chapter.id ?? '', { description: e.target.value ?? null })}
                      className="w-full px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 h-20"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-offWhite-200">강의 관리</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-semibold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            새 강의 추가
          </button>
        </div>

        {/* Lectures List */}
        <div className="space-y-4">
          {lectures.map((lecture) => (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-offWhite-200">{lecture.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lecture.is_published
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {lecture.is_published ? '게시됨' : '미게시'}
                      </span>
                      <span className="px-3 py-1 bg-deepBlack-600 text-offWhite-500 rounded-full text-xs">
                        {lecture.category}
                      </span>
                      <span className="px-3 py-1 bg-deepBlack-600 text-offWhite-500 rounded-full text-xs">
                        {levelLabels[lecture.level as keyof typeof levelLabels]}
                      </span>
                    </div>
                    <p className="text-offWhite-600 mb-2">{lecture.description}</p>
                    <div className="flex items-center gap-6 text-sm text-offWhite-600">
                      <span>₩{lecture.price.toLocaleString()}</span>
                      <span>{lecture.duration}분</span>
                      <span>{lecture.student_count ?? 0}명 수강</span>
                      <span>{lecture.chapters?.length ?? 0}개 챕터</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void togglePublish(lecture)}
                      className="p-2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
                    >
                      {lecture.is_published ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingLecture(lecture)
                        setFormData({
                          title: lecture.title,
                          description: lecture.description,
                          instructor_name: lecture.instructor_name,
                          category: lecture.category,
                          level: lecture.level as 'beginner' | 'intermediate' | 'advanced',
                          price: lecture.price,
                          preview_url: lecture.preview_url ?? '',
                          thumbnail_url: lecture.thumbnail_url ?? '',
                          objectives: lecture.objectives ?? [''],
                          requirements: lecture.requirements ?? [''],
                          target_audience: lecture.target_audience ?? ['']
                        })
                        // Load chapters when editing
                        setExpandedLecture(lecture.id)
                      }}
                      className="p-2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => void handleDeleteLecture(lecture.id)}
                      className="p-2 text-offWhite-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => setExpandedLecture(expandedLecture === lecture.id ? null : lecture.id)}
                      className="p-2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
                    >
                      {expandedLecture === lecture.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Chapter Management */}
              {expandedLecture === lecture.id && (
                <ChapterManagement 
                  lectureId={lecture.id}
                  onChaptersUpdated={() => void fetchLectures()}
                />
              )}
            </motion.div>
          ))}
        </div>

        {lectures.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-offWhite-600 mb-4">
              아직 등록된 강의가 없습니다
            </h3>
            <p className="text-offWhite-600">
              새 강의를 추가하여 시작하세요
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal ?? editingLecture) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-metallicGold-900/30">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-offWhite-200">
                  {editingLecture ? '강의 수정' : '새 강의 추가'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingLecture(null)
                    resetForm()
                  }}
                  className="text-offWhite-600 hover:text-offWhite-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-offWhite-200">기본 정보</h3>
                
                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-2">
                    강의 제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    placeholder="강의 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-2">
                    강의 설명 *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 h-32"
                    placeholder="강의 설명을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">
                      강사명 *
                    </label>
                    <input
                      type="text"
                      value={formData.instructor_name}
                      onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      placeholder="강사명"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">
                      가격 *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) ?? 0 })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">
                      카테고리 *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">
                      난이도 *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>
                          {levelLabels[level as keyof typeof levelLabels]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">
                      썸네일 URL
                    </label>
                    <input
                      type="text"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">
                      미리보기 URL
                    </label>
                    <input
                      type="text"
                      value={formData.preview_url}
                      onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-offWhite-200">학습 목표</h3>
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateArrayField('objectives', index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      placeholder="학습 목표를 입력하세요"
                    />
                    <button
                      onClick={() => removeArrayField('objectives', index)}
                      className="p-3 text-red-500 hover:bg-deepBlack-600 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('objectives')}
                  className="text-metallicGold-500 hover:text-metallicGold-400"
                >
                  + 학습 목표 추가
                </button>
              </div>

              {/* Chapters */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-offWhite-200">챕터 관리</h3>
                  <button
                    onClick={addChapter}
                    className="px-4 py-2 bg-metallicGold-500 text-deepBlack-900 rounded-lg font-medium hover:bg-metallicGold-400 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    챕터 추가
                  </button>
                </div>

                {chapters.map((chapter, index) => (
                  <div key={index} className="p-4 bg-deepBlack-600 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-offWhite-200">챕터 {index + 1}</h4>
                      <button
                        onClick={() => removeChapter(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(index, 'title', e.target.value)}
                        className="px-3 py-2 bg-deepBlack-900 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                        placeholder="챕터 제목"
                      />
                      <input
                        type="number"
                        value={chapter.duration}
                        onChange={(e) => updateChapter(index, 'duration', parseInt(e.target.value) ?? 0)}
                        className="px-3 py-2 bg-deepBlack-900 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                        placeholder="재생시간 (초)"
                      />
                    </div>

                    <input
                      type="text"
                      value={chapter.video_url}
                      onChange={(e) => updateChapter(index, 'video_url', e.target.value)}
                      className="w-full px-3 py-2 bg-deepBlack-900 border border-metallicGold-900/30 rounded text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                      placeholder="비디오 URL"
                    />

                    <label className="flex items-center gap-2 text-offWhite-500">
                      <input
                        type="checkbox"
                        checked={chapter.is_preview}
                        onChange={(e) => updateChapter(index, 'is_preview', e.target.checked)}
                        className="rounded text-metallicGold-500"
                      />
                      미리보기 가능
                    </label>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-metallicGold-900/30">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingLecture(null)
                    resetForm()
                  }}
                  className="px-6 py-3 text-offWhite-600 hover:text-offWhite-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => void (editingLecture ? handleUpdateLecture() : handleCreateLecture())}
                  className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-semibold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all flex items-center gap-2"
                >
                  <Save size={20} />
                  {editingLecture ? '수정하기' : '생성하기'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}