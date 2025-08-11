'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Hash, 
  Search, 
  X, 
  TrendingUp, 
  Filter,
  ChevronDown,
  Star
} from 'lucide-react'

interface Tag {
  id: string
  name: string
  category: 'language' | 'framework' | 'level' | 'topic' | 'industry'
  count: number
  trending?: boolean
  color?: string
}

interface TagSystemProps {
  tags: Tag[]
  selectedTags: string[]
  onTagSelect: (tagId: string) => void
  onTagRemove: (tagId: string) => void
  onSearch: (query: string) => void
  className?: string
  maxVisibleTags?: number
  showSearch?: boolean
  showCategories?: boolean
}

const categoryLabels = {
  'language': { label: '언어', icon: '🔤', color: 'from-blue-500 to-blue-600' },
  'framework': { label: '프레임워크', icon: '⚛️', color: 'from-purple-500 to-purple-600' },
  'level': { label: '레벨', icon: '📊', color: 'from-green-500 to-green-600' },
  'topic': { label: '주제', icon: '💡', color: 'from-yellow-500 to-yellow-600' },
  'industry': { label: '산업', icon: '🏭', color: 'from-red-500 to-red-600' }
}

const tagColors = [
  'from-metallicGold-500 to-metallicGold-600',
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
  'from-orange-500 to-orange-600'
]

export default function TagSystem({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onSearch,
  className = '',
  maxVisibleTags = 20,
  showSearch = true,
  showCategories = true
}: TagSystemProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAllTags, setShowAllTags] = useState(false)
  const [localTags, setLocalTags] = useState(tags)

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  // 태그 검색 필터링
  const filteredTags = localTags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' ?? tag.category === selectedCategory
    return matchesSearch && matchesCategory && !selectedTags.includes(tag.id)
  })

  // 인기 태그 (조회수 기준 정렬)
  const popularTags = [...filteredTags]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxVisibleTags)

  // 트렌딩 태그
  const trendingTags = filteredTags.filter(tag => tag.trending)

  // 카테고리별 그룹화
  const tagsByCategory = filteredTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {acc[tag.category] = []}
    acc[tag.category]?.push(tag)
    return acc
  }, {} as Record<string, Tag[]>)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleTagClick = (tag: Tag) => {
    onTagSelect(tag.id)
  }

  const getTagColor = (tag: Tag) => {
    if (tag.color) {return tag.color}
    const index = tag.name.length % tagColors.length
    return tagColors[index]
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 검색 및 필터 */}
      {showSearch && (
        <div className="space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-offWhite-600" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="태그를 검색해보세요..."
              className="w-full pl-12 pr-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-xl text-offWhite-200 placeholder-offWhite-600 focus:outline-none focus:border-metallicGold-500 focus:ring-1 focus:ring-metallicGold-500 transition-all"
            />
          </div>

          {/* 카테고리 필터 */}
          {showCategories && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-offWhite-500">
                <Filter size={16} />
                <span className="text-sm font-medium">카테고리:</span>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900'
                    : 'bg-deepBlack-600 text-offWhite-400 hover:text-offWhite-200 hover:bg-deepBlack-500'
                }`}
              >
                전체
              </button>
              {Object.entries(categoryLabels).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${category.color} text-white`
                      : 'bg-deepBlack-600 text-offWhite-400 hover:text-offWhite-200 hover:bg-deepBlack-500'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 선택된 태그 */}
      {selectedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deepBlack-300/50 backdrop-blur-sm rounded-xl p-4 border border-metallicGold-900/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 rounded-full flex items-center justify-center">
              <Hash className="text-deepBlack-900" size={14} />
            </div>
            <h3 className="font-semibold text-offWhite-200">선택된 태그</h3>
            <span className="px-2 py-1 bg-metallicGold-500/20 text-metallicGold-400 text-xs rounded-full">
              {selectedTags.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedTags.map((tagId, index) => {
                const tag = localTags.find(t => t.id === tagId)
                if (!tag) {return null}

                return (
                  <motion.button
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onTagRemove(tag.id)}
                    className={`inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${getTagColor(tag)} text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all group`}
                  >
                    <Hash size={14} />
                    <span>{tag.name}</span>
                    <X size={14} className="group-hover:scale-110 transition-transform" />
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* 트렌딩 태그 */}
      {trendingTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 backdrop-blur-sm rounded-xl p-6 border border-metallicGold-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 rounded-full flex items-center justify-center">
              <TrendingUp className="text-deepBlack-900" size={18} />
            </div>
            <h3 className="text-lg font-bold text-offWhite-200">트렌딩 태그</h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-metallicGold-500/20 rounded-full">
              <Star className="text-metallicGold-400 fill-current" size={12} />
              <span className="text-xs text-metallicGold-400 font-medium">HOT</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingTags.slice(0, 8).map((tag, index) => (
              <motion.button
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getTagColor(tag)} text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Hash size={14} />
                <span>{tag.name}</span>
                <span className="px-2 py-0.5 bg-black/20 rounded-full text-xs">
                  {tag.count}
                </span>
                <TrendingUp size={12} className="text-white/80" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 태그 목록 */}
      <div className="space-y-6">
        {selectedCategory === 'all' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-offWhite-200">인기 태그</h3>
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="flex items-center gap-2 text-sm text-metallicGold-400 hover:text-metallicGold-300 transition-colors"
              >
                {showAllTags ? '접기' : '더 보기'}
                <motion.div
                  animate={{ rotate: showAllTags ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {(showAllTags ? filteredTags : popularTags).map((tag, index) => (
                  <motion.button
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-deepBlack-600 border border-metallicGold-900/30 text-offWhite-300 rounded-full text-sm font-medium hover:border-metallicGold-500 hover:bg-gradient-to-r hover:${getTagColor(tag)} hover:text-white transition-all group`}
                  >
                    <Hash size={14} className="group-hover:scale-110 transition-transform" />
                    <span>{tag.name}</span>
                    <span className="px-2 py-0.5 bg-deepBlack-900 rounded-full text-xs">
                      {tag.count}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          // 카테고리별 태그 표시
          Object.entries(tagsByCategory).map(([categoryKey, categoryTags]) => {
            const category = categoryLabels[categoryKey as keyof typeof categoryLabels]
            if (!category ?? categoryTags.length === 0) {return null}

            return (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-white text-sm`}>
                    {category.icon}
                  </div>
                  <h4 className="font-semibold text-offWhite-200">{category.label}</h4>
                  <span className="px-2 py-1 bg-deepBlack-600 text-offWhite-500 text-xs rounded-full">
                    {categoryTags.length}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3 pl-11">
                  {categoryTags.map((tag, index) => (
                    <motion.button
                      key={tag.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleTagClick(tag)}
                      className={`inline-flex items-center gap-2 px-3 py-2 bg-deepBlack-600 border border-metallicGold-900/30 text-offWhite-300 rounded-full text-sm hover:border-metallicGold-500 hover:bg-gradient-to-r hover:${category.color} hover:text-white transition-all group`}
                    >
                      <Hash size={12} />
                      <span>{tag.name}</span>
                      <span className="px-1.5 py-0.5 bg-deepBlack-900 rounded-full text-xs">
                        {tag.count}
                      </span>
                      {tag.trending && (
                        <TrendingUp size={12} className="text-red-400 group-hover:text-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* 검색 결과가 없을 때 */}
      {filteredTags.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-deepBlack-300/30 rounded-xl border border-metallicGold-900/30"
        >
          <Hash className="mx-auto mb-4 text-offWhite-600" size={48} />
          <p className="text-offWhite-400 text-lg mb-2">
            "{searchQuery}"에 대한 태그가 없습니다
          </p>
          <p className="text-offWhite-600 text-sm">
            다른 키워드로 검색해보세요
          </p>
        </motion.div>
      )}
    </div>
  )
}