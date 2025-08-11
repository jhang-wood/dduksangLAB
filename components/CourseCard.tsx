'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Star, Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import BookmarkButton from './BookmarkButton'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    instructor: string
    duration: string
    students: number
    rating: number
    price: number
    discountPrice?: number
    thumbnail?: string
    level: 'beginner' | 'intermediate' | 'advanced'
    tags: string[]
    preview?: string
  }
  index?: number
  variant?: 'default' | 'compact' | 'featured'
}

export default function CourseCard({ course, index = 0, variant = 'default' }: CourseCardProps) {
  const isDiscounted = course.discountPrice && course.discountPrice < course.price
  const discountPercent = isDiscounted 
    ? Math.round(((course.price - course.discountPrice!) / course.price) * 100)
    : 0

  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const levelLabels = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급'
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative"
      >
        <Link href={`/courses/${course.id}`} className="block">
          <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4 hover:border-metallicGold-500/40 transition-all duration-300">
            <div className="flex items-start gap-4">
              {/* 썸네일 */}
              <div className="w-20 h-16 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play className="w-6 h-6 text-metallicGold-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-offWhite-200 text-sm mb-1 truncate">
                  {course.title}
                </h3>
                <p className="text-xs text-offWhite-500 mb-2">
                  {course.instructor}
                </p>
                <div className="flex items-center gap-2 text-xs text-offWhite-600">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>

              <BookmarkButton 
                courseId={course.id} 
                courseName={course.title}
                size="sm"
              />
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.2 }}
        className="group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <Link href={`/courses/${course.id}`} className="block">
          <div className="relative bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8 hover:border-metallicGold-500/40 transition-all duration-300 overflow-hidden">
            {/* Featured Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg text-xs font-bold">
              추천
            </div>

            <BookmarkButton 
              courseId={course.id} 
              courseName={course.title}
              className="absolute top-4 right-4"
              size="md"
            />

            {/* 썸네일 */}
            <div className="w-full h-48 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-2xl mb-6 flex items-center justify-center">
              <Play className="w-16 h-16 text-metallicGold-500" />
            </div>

            {/* 컨텐츠 */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-lg text-xs border ${levelColors[course.level]}`}>
                    {levelLabels[course.level]}
                  </span>
                  {isDiscounted && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold">
                      {discountPercent}% 할인
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-offWhite-200 mb-2">
                  {course.title}
                </h3>
                <p className="text-offWhite-400 line-clamp-2 mb-4">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-offWhite-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {isDiscounted ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-metallicGold-500">
                        ₩{course.discountPrice!.toLocaleString()}
                      </span>
                      <span className="text-lg text-offWhite-600 line-through">
                        ₩{course.price.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-metallicGold-500">
                      ₩{course.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-metallicGold-500 font-semibold group-hover:text-metallicGold-400 transition-colors">
                  <span>자세히 보기</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link href={`/courses/${course.id}`} className="block">
        <div className="relative bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6 hover:border-metallicGold-500/40 transition-all duration-300">
          {/* 북마크 버튼 */}
          <BookmarkButton 
            courseId={course.id} 
            courseName={course.title}
            className="absolute top-4 right-4"
            size="md"
          />

          {/* 썸네일 */}
          <div className="w-full h-40 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl mb-4 flex items-center justify-center">
            <Play className="w-12 h-12 text-metallicGold-500" />
          </div>

          {/* 레벨 & 할인 배지 */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-lg text-xs border ${levelColors[course.level]}`}>
              {levelLabels[course.level]}
            </span>
            {isDiscounted && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold">
                {discountPercent}% 할인
              </span>
            )}
          </div>

          {/* 제목 및 설명 */}
          <h3 className="text-lg font-bold text-offWhite-200 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-offWhite-400 text-sm line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* 강사 정보 */}
          <p className="text-offWhite-500 text-sm mb-4">{course.instructor}</p>

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-offWhite-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-metallicGold-500/10 text-metallicGold-500 rounded-lg text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 가격 */}
          <div className="flex items-center justify-between">
            <div>
              {isDiscounted ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-metallicGold-500">
                    ₩{course.discountPrice!.toLocaleString()}
                  </span>
                  <span className="text-sm text-offWhite-600 line-through">
                    ₩{course.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-metallicGold-500">
                  ₩{course.price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-metallicGold-500 font-medium group-hover:text-metallicGold-400 transition-colors">
              <span>자세히 보기</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}