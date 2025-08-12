import { supabase } from './supabase';
import { logger } from './logger';

export interface CreateProfileData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export async function createUserProfile(data: CreateProfileData) {
  try {
    logger.log('[Auth Utils] Creating profile for user:', data.id);

    // 기존 프로필 확인
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.id)
      .single();

    if (existingProfile) {
      logger.log('[Auth Utils] Profile already exists');
      return { success: true, profile: existingProfile };
    }

    // 새 프로필 생성
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        role: data.role || 'user',
        is_active: true,
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error('[Auth Utils] Error creating profile:', error);
      return { success: false, error };
    }

    logger.log('[Auth Utils] Profile created successfully:', newProfile);
    return { success: true, profile: newProfile };
  } catch (error) {
    logger.error('[Auth Utils] Unexpected error creating profile:', error);
    return { success: false, error };
  }
}

export async function updateUserProfile(userId: string, updates: Partial<CreateProfileData>) {
  try {
    logger.log('[Auth Utils] Updating profile for user:', userId);

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('[Auth Utils] Error updating profile:', error);
      return { success: false, error };
    }

    logger.log('[Auth Utils] Profile updated successfully:', data);
    return { success: true, profile: data };
  } catch (error) {
    logger.error('[Auth Utils] Unexpected error updating profile:', error);
    return { success: false, error };
  }
}

export async function getUserProfile(userId: string) {
  try {
    logger.log('[Auth Utils] Fetching profile for user:', userId);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.log('[Auth Utils] Profile not found');
        return { success: false, error: 'Profile not found' };
      }
      logger.error('[Auth Utils] Error fetching profile:', error);
      return { success: false, error };
    }

    logger.log('[Auth Utils] Profile fetched successfully');
    return { success: true, profile: data };
  } catch (error) {
    logger.error('[Auth Utils] Unexpected error fetching profile:', error);
    return { success: false, error };
  }
}

export async function deleteUserProfile(userId: string) {
  try {
    logger.log('[Auth Utils] Deleting profile for user:', userId);

    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      logger.error('[Auth Utils] Error deleting profile:', error);
      return { success: false, error };
    }

    logger.log('[Auth Utils] Profile deleted successfully');
    return { success: true };
  } catch (error) {
    logger.error('[Auth Utils] Unexpected error deleting profile:', error);
    return { success: false, error };
  }
}

export function validateSignupData(data: { email: string; password: string; name?: string; phone?: string }) {
  const errors: string[] = [];

  if (!data.email) {
    errors.push('이메일을 입력해주세요.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('올바른 이메일 형식을 입력해주세요.');
  }

  if (!data.password) {
    errors.push('비밀번호를 입력해주세요.');
  } else if (data.password.length < 6) {
    errors.push('비밀번호는 최소 6자 이상이어야 합니다.');
  }

  if (data.name && data.name.length < 2) {
    errors.push('이름은 최소 2자 이상이어야 합니다.');
  }

  if (data.phone && !/^[0-9-+\s()]*$/.test(data.phone)) {
    errors.push('올바른 전화번호 형식을 입력해주세요.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}