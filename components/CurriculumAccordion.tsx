'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  Play,
  Lock,
  CheckCircle,
  BookOpen,
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  order_index: number;
  duration: number;
  is_preview?: boolean;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  objectives?: string[];
}

interface Section {
  id: string;
  title: string;
  description?: string;
  chapters: Chapter[];
  total_duration: number;
}

interface CurriculumAccordionProps {
  sections: Section[];
  progress?: Record<string, { completed: boolean; watch_time: number }>;
  className?: string;
  showPreviewOnly?: boolean;
}


export default function CurriculumAccordion({
  sections,
  progress = {},
  className = '',
  showPreviewOnly = false,
}: CurriculumAccordionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const isChapterCompleted = (chapterId: string) => {
    return progress[chapterId]?.completed ?? false;
  };


  const getSectionProgress = (section: Section) => {
    const completedChapters = section.chapters.filter(ch => isChapterCompleted(ch.id)).length;
    const totalChapters = section.chapters.length;
    return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const visibleSections = showPreviewOnly
    ? sections
        .map(section => ({
          ...section,
          chapters: section.chapters.filter(ch => ch.is_preview),
        }))
        .filter(section => section.chapters.length > 0)
    : sections;

  return (
    <div className={`space-y-4 ${className}`}>
      {visibleSections.map((section, sectionIndex) => {
        const isExpanded = expandedSections.has(section.id);
        const sectionProgress = getSectionProgress(section);
        const completedChapters = section.chapters.filter(ch => isChapterCompleted(ch.id)).length;

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-deepBlack-300 rounded-xl overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-deepBlack-600/50 transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`curriculum-section-${section.id}`}
              aria-label={`${section.title} 섹션 ${isExpanded ? '접기' : '펼치기'}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <BookOpen className="text-metallicGold-500" size={20} />

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-offWhite-200 mb-1">{section.title}</h3>

                  <div className="flex items-center gap-3 text-sm text-offWhite-500">
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
                    <div className="mt-2">
                      <div className="h-1 bg-deepBlack-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-metallicGold-500 transition-all duration-500"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ChevronDown 
                className={`text-offWhite-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>

            {/* Section Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="border-t border-deepBlack-600 overflow-hidden"
                  id={`curriculum-section-${section.id}`}
                  role="region"
                  aria-label={`${section.title} 섹션 내용`}
                >
                  <div className="divide-y divide-deepBlack-600">
                    {section.chapters.map((chapter, chapterIndex) => {
                      const isCompleted = isChapterCompleted(chapter.id);

                      return (
                        <motion.div
                          key={chapter.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: chapterIndex * 0.05 }}
                          className={`p-4 ${chapter.is_preview ? 'hover:bg-deepBlack-600/50 cursor-pointer' : 'hover:bg-deepBlack-600/30'} transition-all group`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Chapter Status Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {chapter.is_preview ? (
                                <Play className="text-metallicGold-500" size={16} />
                              ) : isCompleted ? (
                                <CheckCircle className="text-green-500" size={16} />
                              ) : (
                                <Lock className="text-offWhite-600" size={16} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Chapter Title & Duration */}
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h4 className="font-semibold text-offWhite-200 group-hover:text-offWhite-100 transition-colors leading-tight">
                                  {chapterIndex + 1}. {chapter.title}
                                </h4>
                                <div className="text-sm text-offWhite-500">
                                  {formatTime(chapter.duration)}
                                </div>
                              </div>

                              {/* Chapter Description */}
                              {chapter.description && (
                                <p className="text-sm text-offWhite-600 mb-3 leading-relaxed">
                                  {chapter.description}
                                </p>
                              )}


                              {/* Chapter Status */}
                              <div className="flex items-center gap-3 text-sm">
                                {chapter.is_preview && (
                                  <span className="text-metallicGold-400">
                                    미리보기
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-green-400">
                                    완료
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
