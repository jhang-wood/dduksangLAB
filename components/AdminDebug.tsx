'use client';

import { logger, userNotification } from '@/lib/logger';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase';

export default function AdminDebug() {
  const { user, userProfile, isAdmin } = useAuth();
  const [debugInfo, setDebugInfo] = useState<{
    userId: string;
    email: string | undefined;
    profileRole: string | undefined;
    isAdmin: boolean;
    profileName: string | undefined;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setDebugInfo({
        userId: user.id,
        email: user.email,
        profileRole: userProfile?.role,
        isAdmin: isAdmin,
        profileName: userProfile?.name,
      });
    }
  }, [user, userProfile, isAdmin]);

  const updateToAdmin = async () => {
    if (!user) {
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);

      if (!error) {
        userNotification.alert('관리자 권한이 부여되었습니다. 페이지를 새로고침합니다.');
        window.location.reload();
      } else {
        userNotification.alert(`오류 발생: ${error.message}`);
      }
    } catch (err: unknown) {
      logger.error(err);
      userNotification.alert('업데이트 중 오류가 발생했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-deepBlack-900 border-2 border-metallicGold-500 rounded-lg p-4 max-w-sm z-[9999] shadow-2xl">
      <h3 className="text-lg font-bold text-metallicGold-500 mb-2">🔧 디버그 정보</h3>
      <div className="text-xs text-offWhite-400 space-y-1">
        <p>User ID: {debugInfo?.userId}</p>
        <p>Email: {debugInfo?.email}</p>
        <p>Profile Role: {debugInfo?.profileRole ?? 'null'}</p>
        <p>Is Admin: {debugInfo?.isAdmin ? 'Yes' : 'No'}</p>
        <p>Name: {debugInfo?.profileName ?? 'null'}</p>
      </div>

      {!isAdmin && (
        <button
          onClick={() => {
            void updateToAdmin();
          }}
          disabled={updating}
          className="mt-3 w-full px-3 py-1 bg-metallicGold-500 text-deepBlack-900 text-xs font-semibold rounded hover:bg-metallicGold-600 disabled:opacity-50"
        >
          {updating ? '업데이트 중...' : '관리자 권한 부여'}
        </button>
      )}
    </div>
  );
}
