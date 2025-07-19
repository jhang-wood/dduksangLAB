import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  user_type: 'visitor' | 'student' | 'admin'
  created_at: string
  updated_at: string
  last_login: string
  is_active: boolean
}

export interface Lecture {
  id: string
  title: string
  description: string
  instructor: string
  duration: number
  price: number
  thumbnail_url: string
  video_url: string
  category: string
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
  is_published: boolean
}

export interface CommunityPost {
  id: string
  title: string
  content: string
  author_id: string
  category: string
  tags: string[]
  likes: number
  views: number
  created_at: string
  updated_at: string
  is_published: boolean
}

export interface CommunityComment {
  id: string
  post_id: string
  author_id: string
  content: string
  parent_id: string | null
  likes: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface SaaSProduct {
  id: string
  name: string
  description: string
  website_url: string
  logo_url: string
  category: string
  tags: string[]
  price: string
  rating: number
  users_count: number
  creator_id: string
  created_at: string
  updated_at: string
  is_approved: boolean
  is_featured: boolean
  is_trending: boolean
}

export interface UserProgress {
  id: string
  user_id: string
  lecture_id: string
  progress_percentage: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .single()
  return { data, error }
}

export const getLectures = async (filters?: {
  category?: string
  level?: string
  search?: string
}) => {
  let query = supabase.from('lectures').select('*').eq('is_published', true)
  
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.level) {
    query = query.eq('level', filters.level)
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

export const getCommunityPosts = async (filters?: {
  category?: string
  search?: string
}) => {
  let query = supabase
    .from('community_posts')
    .select(`
      *,
      profiles (
        name,
        avatar_url
      ),
      community_comments!inner (
        count
      )
    `)
    .eq('is_published', true)
  
  if (filters?.category && filters.category !== '전체') {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

export const getPostComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('community_comments')
    .select(`
      *,
      profiles (
        name,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .eq('is_published', true)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export const createCommunityPost = async (post: {
  title: string
  content: string
  category: string
  tags: string[]
  author_id: string
}) => {
  const { data, error } = await supabase
    .from('community_posts')
    .insert([post])
    .select()
    .single()
  
  return { data, error }
}

export const createComment = async (comment: {
  post_id: string
  content: string
  author_id: string
  parent_id?: string
}) => {
  const { data, error } = await supabase
    .from('community_comments')
    .insert([comment])
    .select()
    .single()
  
  return { data, error }
}

export const likePost = async (postId: string) => {
  const { data, error } = await supabase.rpc('increment_post_likes', {
    post_uuid: postId
  })
  
  return { data, error }
}

export const incrementPostViews = async (postId: string) => {
  const { data, error } = await supabase.rpc('increment_post_views', {
    post_uuid: postId
  })
  
  return { data, error }
}

export const getSaaSProducts = async (filters?: {
  category?: string
  search?: string
  featured?: boolean
  trending?: boolean
}) => {
  let query = supabase.from('saas_products').select('*').eq('is_approved', true)
  
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  
  if (filters?.featured) {
    query = query.eq('is_featured', true)
  }
  
  if (filters?.trending) {
    query = query.eq('is_trending', true)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

// Helper function to create like increment function in database
export const createLikeFunctions = `
-- 게시글 좋아요 증가 함수
CREATE OR REPLACE FUNCTION increment_post_likes(post_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts
  SET likes = likes + 1
  WHERE id = post_uuid;
END;
$$;
`