import { supabase } from './supabase';
import { logger } from './logger';

export async function createAdminUser(email: string, password: string, name: string) {
  try {
    logger.log('[Admin Utils] Creating admin user:', email);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      logger.error('[Admin Utils] Auth creation error:', authError);
      return { success: false, error: authError };
    }

    if (!authData.user) {
      return { success: false, error: { message: 'Failed to create user' } };
    }

    // 2. Create profile with admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        name,
        role: 'admin',
        is_active: true,
        email_verified: true, // Admin users are pre-verified
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      logger.error('[Admin Utils] Profile creation error:', profileError);
      // Cleanup auth user if profile creation fails
      if (authData.user) {
        await supabase.auth.admin.deleteUser(authData.user.id);
      }
      return { success: false, error: profileError };
    }

    logger.log('[Admin Utils] Admin user created successfully');
    return { success: true, user: authData.user, profile };
  } catch (error) {
    logger.error('[Admin Utils] Unexpected error creating admin:', error);
    return { success: false, error };
  }
}

export async function promoteUserToAdmin(userId: string) {
  try {
    logger.log('[Admin Utils] Promoting user to admin:', userId);

    const { data, error } = await supabase
      .from('profiles')
      .update({
        role: 'admin',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('[Admin Utils] Error promoting user:', error);
      return { success: false, error };
    }

    logger.log('[Admin Utils] User promoted to admin successfully');
    return { success: true, profile: data };
  } catch (error) {
    logger.error('[Admin Utils] Unexpected error promoting user:', error);
    return { success: false, error };
  }
}

export async function demoteAdminToUser(userId: string) {
  try {
    logger.log('[Admin Utils] Demoting admin to user:', userId);

    // Check if this is the last admin
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (count && count <= 1) {
      return {
        success: false,
        error: { message: 'Cannot demote the last admin user' },
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        role: 'user',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('[Admin Utils] Error demoting admin:', error);
      return { success: false, error };
    }

    logger.log('[Admin Utils] Admin demoted to user successfully');
    return { success: true, profile: data };
  } catch (error) {
    logger.error('[Admin Utils] Unexpected error demoting admin:', error);
    return { success: false, error };
  }
}

export async function checkAdminExists(): Promise<boolean> {
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    return (count ?? 0) > 0;
  } catch (error) {
    logger.error('[Admin Utils] Error checking admin existence:', error);
    return false;
  }
}

export async function initializeAdminUser() {
  try {
    logger.log('[Admin Utils] Checking for admin users...');

    const adminExists = await checkAdminExists();

    if (!adminExists) {
      logger.log('[Admin Utils] No admin found, creating default admin...');

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@dduksang.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

      const result = await createAdminUser(adminEmail, adminPassword, '관리자');

      if (result.success) {
        logger.log('[Admin Utils] Default admin created successfully');
        console.log(`🔑 Default admin created: ${adminEmail}`);
        console.log(`🔐 Default password: ${adminPassword}`);
        console.log('⚠️  Please change the password immediately after first login!');
      } else {
        logger.error('[Admin Utils] Failed to create default admin:', result.error);
      }

      return result;
    } else {
      logger.log('[Admin Utils] Admin user already exists');
      return { success: true, message: 'Admin already exists' };
    }
  } catch (error) {
    logger.error('[Admin Utils] Error initializing admin:', error);
    return { success: false, error };
  }
}

// API route helper for admin operations
export async function requireAdmin(userId: string) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return profile?.role === 'admin';
  } catch (error) {
    logger.error('[Admin Utils] Error checking admin status:', error);
    return false;
  }
}