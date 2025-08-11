'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Play,
  Lock,
  CheckCircle,
  Award,
  BookOpen
} from 'lucide-react'

interface Chapter {
  id: string
  title: string
  order_index: number
  duration: number
  is_preview?: boolean
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  objectives?: string[]
}

interface Section {
  id: string
  title: string
  description?: string
  chapters: Chapter[]
  total_duration: number
}

interface CurriculumAccordionProps {
  sections: Section[]
  progress?: Record<string, { completed: boolean; watch_time: number }>
  className?: string
  showPreviewOnly?: boolean
}

const difficultyLabels = {
  'beginner': { label: '초급', color: 'text-green-400 bg-green-500/20 border-green-500/30' },
  'intermediate': { label: '중급', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' },
  'advanced': { label: '고급', color: 'text-red-400 bg-red-500/20 border-red-500/30' }
}

export default function CurriculumAccordion({ 
  sections, 
  progress = {}, 
  className = '',
  showPreviewOnly = false 
}: CurriculumAccordionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const isChapterCompleted = (chapterId: string) => {
    return progress[chapterId]?.completed ?? false
  }

  const getChapterProgress = (chapterId: string, duration: number) => {
    const chapterProgress = progress[chapterId]
    if (!chapterProgress ?? !duration) {return 0}
    return Math.min(100, (chapterProgress.watch_time / duration) * 100)
  }

  const getSectionProgress = (section: Section) => {
    const completedChapters = section.chapters.filter(ch => isChapterCompleted(ch.id)).length
    const totalChapters = section.chapters.length
    return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
  }

  const visibleSections = showPreviewOnly 
    ? sections.map(section => ({
        ...section,
        chapters: section.chapters.filter(ch => ch.is_preview)
      })).filter(section => section.chapters.length > 0)
    : sections

  return (
    <div className={`space-y-4 ${className}`}>
      {visibleSections.map((section, sectionIndex) => {
        const isExpanded = expandedSections.has(section.id)
        const sectionProgress = getSectionProgress(section)
        const completedChapters = section.chapters.filter(ch => isChapterCompleted(ch.id)).length
        
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-deepBlack-600/30 transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`curriculum-section-${section.id}`}
              aria-label={`${section.title} 섹션 ${isExpanded ? '접기' : '펼치기'}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-deepBlack-900" size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-offWhite-200 mb-2">
                    {section.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-offWhite-500 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{formatTime(section.total_duration)}</span>
                    </div>
                    <span>•</span>
                    <span>{section.chapters.length}개 챕터</span>
                    {!showPreviewOnly && (
                      <>
                        <span>•</span>
                        <span className="text-metallicGold-400">
                          {completedChapters}/{section.chapters.length} 완료
                        </span>
                      </>
                    )}
                  </div>
                  
                  {section.description && (
                    <p className="text-offWhite-600 text-sm mt-2 line-clamp-2">
                      {section.description}
                    </p>
                  )}
                  
                  {/* Progress Bar */}
                  {!showPreviewOnly && sectionProgress > 0 && (
                    <div className="mt-3">
                      <div className="h-2 bg-deepBlack-900 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900"
                          initial={{ width: 0 }}
                          animate={{ width: `${sectionProgress}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-offWhite-600 mt-1">
                        <span>진도율</span>
                        <span>{Math.round(sectionProgress)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                {!showPreviewOnly && sectionProgress === 100 && (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={18} />
                  </div>
                )}
                
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="text-offWhite-400" size={24} />
                </motion.div>
              </div>
            </button>

            {/* Section Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-t border-metallicGold-900/30 overflow-hidden"
                  id={`curriculum-section-${section.id}`}
                  role="region"
                  aria-label={`${section.title} 섹션 내용`}
                >
                  <div className="divide-y divide-metallicGold-900/20">
                    {section.chapters.map((chapter, chapterIndex) => {
                      const chapterProgress = getChapterProgress(chapter.id, chapter.duration)
                      const isCompleted = isChapterCompleted(chapter.id)
                      
                      return (
                        <motion.div
                          key={chapter.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: chapterIndex * 0.05 }}
                          className={`p-6 ${chapter.is_preview ? 'hover:bg-metallicGold-500/5 cursor-pointer' : 'hover:bg-deepBlack-600/30'} transition-all group`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Chapter Status Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {chapter.is_preview ? (
                                <div className="w-10 h-10 bg-metallicGold-500/20 rounded-full flex items-center justify-center">
                                  <Play className="text-metallicGold-500" size={18} />
                                </div>
                              ) : isCompleted ? (
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                  <CheckCircle className="text-green-500" size={18} />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-deepBlack-600 rounded-full flex items-center justify-center">
                                  <Lock className="text-offWhite-600" size={18} />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Chapter Title & Duration */}
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h4 className="font-semibold text-offWhite-200 group-hover:text-offWhite-100 transition-colors leading-tight">
                                  {chapterIndex + 1}. {chapter.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="text-sm text-offWhite-500 bg-deepBlack-600 px-3 py-1 rounded-full">
                                    {formatTime(chapter.duration)}
                                  </div>
                                  {chapter.difficulty && (
                                    <div className={`text-xs px-2 py-1 rounded-full border ${difficultyLabels[chapter.difficulty].color}`}>
                                      {difficultyLabels[chapter.difficulty].label}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Chapter Description */}
                              {chapter.description && (
                                <p className="text-sm text-offWhite-600 mb-3 leading-relaxed">
                                  {chapter.description}
                                </p>
                              )}

                              {/* Chapter Objectives */}
                              {chapter.objectives && chapter.objectives.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="text-sm font-medium text-offWhite-300 mb-2 flex items-center gap-2">
                                    <Award size={14} className="text-metallicGold-500" />
                                    학습 목표
                                  </h5>
                                  <ul className="space-y-1">
                                    {chapter.objectives.map((objective, idx) => (
                                      <li key={idx} className="text-sm text-offWhite-500 flex items-start gap-2">
                                        <ChevronRight size={14} className="text-metallicGold-400 mt-0.5 flex-shrink-0" />
                                        <span>{objective}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Chapter Status & Progress */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm">
                                  {chapter.is_preview && (
                                    <span className="text-metallicGold-400 font-medium">
                                      미리보기 가능
                                    </span>
                                  )}
                                  {isCompleted && (
                                    <span className="text-green-400 font-medium flex items-center gap-1">
                                      <CheckCircle size={14} />
                                      완료
                                    </span>
                                  )}
                                </div>

                                {/* Progress Bar */}
                                {!showPreviewOnly && chapterProgress > 0 && chapterProgress < 100 && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 h-1 bg-deepBlack-900 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 transition-all"
                                        style={{ width: `${chapterProgress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-offWhite-500 w-10 text-right">
                                      {Math.round(chapterProgress)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}