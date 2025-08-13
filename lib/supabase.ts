// Re-export client functions only
export { supabase, signUp, signIn, signOut, getCurrentUser } from './supabase-client';

// Re-export unified types
export type {
  UserProfile as User,
  AITrend,
  SystemSettings,
  APIResponse,
  PaginationInfo,
  PaginatedResponse,
} from '@/types';

// Database helpers with unified types

// Import supabase client for database operations
import { supabase } from './supabase-client';
import type { UserProfile } from '@/types';

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return { data: data as UserProfile | null, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).single();
  return { data: data as UserProfile | null, error };
};

// Helper function to build query filters
function applyLectureFilters(
  query: any,
  filters?: {
    category?: string;
    level?: string;
    search?: string;
  }
) {
  if (!filters) {
    return query;
  }

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.level) {
    query = query.eq('level', filters.level);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  return query;
}

export const getLectures = async (filters?: {
  category?: string;
  level?: string;
  search?: string;
}) => {
  let query = supabase.from('lectures').select('*').eq('is_published', true);
  query = applyLectureFilters(query, filters);

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// Helper function for community posts query building
function buildCommunityPostsQuery() {
  return supabase
    .from('community_posts')
    .select(
      `
      *,
      profiles (
        name,
        avatar_url
      ),
      community_comments!inner (
        count
      )
    `
    )
    .eq('is_published', true);
}

function applyCommunityFilters(
  query: any,
  filters?: {
    category?: string;
    search?: string;
  }
) {
  if (!filters) {
    return query;
  }

  if (filters.category && filters.category !== '전체') {
    query = query.eq('category', filters.category);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }

  return query;
}

export const getCommunityPosts = async (filters?: { category?: string; search?: string }) => {
  let query = buildCommunityPostsQuery();
  query = applyCommunityFilters(query, filters);

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getPostComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('community_comments')
    .select(
      `
      *,
      profiles (
        name,
        avatar_url
      )
    `
    )
    .eq('post_id', postId)
    .eq('is_published', true)
    .order('created_at', { ascending: true });

  return { data, error };
};

export const createCommunityPost = async (post: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id: string;
}) => {
  const { data, error } = await supabase.from('community_posts').insert([post]).select().single();

  return { data, error };
};

export const createComment = async (comment: {
  post_id: string;
  content: string;
  author_id: string;
  parent_id?: string;
}) => {
  const { data, error } = await supabase
    .from('community_comments')
    .insert([comment])
    .select()
    .single();

  return { data, error };
};

export const likePost = async (postId: string) => {
  const { data, error } = await supabase.rpc('increment_post_likes', {
    post_uuid: postId,
  });

  return { data, error };
};

export const incrementPostViews = async (postId: string) => {
  const { data, error } = await supabase.rpc('increment_post_views', {
    post_uuid: postId,
  });

  return { data, error };
};

// Helper function for SaaS products filters
function applySaaSFilters(
  query: any,
  filters?: {
    category?: string;
    search?: string;
    featured?: boolean;
    trending?: boolean;
  }
) {
  if (!filters) {
    return query;
  }

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.featured) {
    query = query.eq('is_featured', true);
  }

  if (filters.trending) {
    query = query.eq('is_trending', true);
  }

  return query;
}

export const getSaaSProducts = async (filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
  trending?: boolean;
}) => {
  let query = supabase.from('saas_products').select('*').eq('is_approved', true);
  query = applySaaSFilters(query, filters);

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// Lecture Progress helpers
export const updateLectureProgress = async (
  userId: string,
  lectureId: string,
  chapterId: string,
  watchTime: number,
  completed: boolean
) => {
  const { data, error } = await supabase.from('lecture_progress').upsert(
    {
      user_id: userId,
      lecture_id: lectureId,
      chapter_id: chapterId,
      watch_time: watchTime,
      completed,
      last_watched_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,lecture_id,chapter_id',
    }
  );
  return { data, error };
};

export const getLectureProgress = async (userId: string, lectureId: string) => {
  const { data, error } = await supabase
    .from('lecture_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lecture_id', lectureId);
  return { data, error };
};

export const getLectureWithChapters = async (lectureId: string) => {
  const { data, error } = await supabase
    .from('lectures')
    .select(
      `
      *,
      chapters:lecture_chapters(*)
    `
    )
    .eq('id', lectureId)
    .single();

  if (data) {
    data.chapters =
      data.chapters?.sort(
        (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
      ) ?? [];
  }

  return { data, error };
};

export const checkEnrollment = async (userId: string, lectureId: string) => {
  const { data, error } = await supabase
    .from('lecture_enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('lecture_id', lectureId)
    .eq('status', 'active')
    .single();

  return { data, error };
};

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
`;
