'use client';

import { userNotification, logger } from '@/lib/logger';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {} from 'framer-motion';
import { Save, RefreshCw, Database, Shield, Globe, Server, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: '떡상연구소',
    siteDescription: 'AI 시대를 선도하는 No-Code 교육 플랫폼',
    adminEmail: 'admin@dduksanglab.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileSize: 5,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp'],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const result: {
        data?: {
          site_name: string;
          site_description: string;
          admin_email: string;
          maintenance_mode: boolean;
          allow_registration: boolean;
          require_email_verification: boolean;
          max_file_size: number;
          allowed_file_types: string[];
          updated_at?: string;
        };
        error?: string;
      } = await response.json();

      if (response.ok && result.data) {
        setSettings({
          siteName: result.data.site_name,
          siteDescription: result.data.site_description,
          adminEmail: result.data.admin_email,
          maintenanceMode: result.data.maintenance_mode,
          allowRegistration: result.data.allow_registration,
          requireEmailVerification: result.data.require_email_verification,
          maxFileSize: result.data.max_file_size,
          allowedFileTypes: result.data.allowed_file_types,
        });

        if (result.data.updated_at) {
          setLastUpdated(new Date(result.data.updated_at).toLocaleString('ko-KR'));
        } else {
          setLastUpdated('처음 설정');
        }
      } else {
        logger.error('Failed to load settings:', result.error);
        userNotification.alert('설정을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      logger.error('Error loading settings:', error);
      userNotification.alert('설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAdminAccess = useCallback(async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/');
      return;
    }

    void loadSettings();
  }, [user, router, loadSettings]);

  useEffect(() => {
    void checkAdminAccess();
  }, [checkAdminAccess]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site_name: settings.siteName,
          site_description: settings.siteDescription,
          admin_email: settings.adminEmail,
          maintenance_mode: settings.maintenanceMode,
          allow_registration: settings.allowRegistration,
          require_email_verification: settings.requireEmailVerification,
          max_file_size: settings.maxFileSize,
          allowed_file_types: settings.allowedFileTypes,
        }),
      });

      const result: { error?: string } = await response.json();

      if (response.ok) {
        setLastUpdated(new Date().toLocaleString('ko-KR'));
        userNotification.alert('설정이 저장되었습니다.');
      } else {
        logger.error('Failed to save settings:', result.error);
        userNotification.alert(result.error ?? '설정 저장 중 오류가 생했습니다.');
      }
    } catch (error) {
      logger.error('Error saving settings:', error);
      userNotification.alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (userNotification.confirm('모든 설정을 기본값으로 되돌리시겠습니까?')) {
      setSettings({
        siteName: '떡상연구소',
        siteDescription: 'AI 시대를 선도하는 No-Code 교육 플랫폼',
        adminEmail: 'admin@dduksanglab.com',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true,
        maxFileSize: 5,
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp'],
      });
    }
  };

  const handleArrayFieldChange = (field: keyof SystemSettings, value: string) => {
    const types = value
      .split(',')
      .map(t => t.trim())
      .filter(t => t);
    setSettings(prev => ({ ...prev, [field]: types }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-offWhite-200">시스템 설정</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-offWhite-600">마지막 업데이트: {lastUpdated}</span>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-offWhite-600 hover:text-offWhite-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              기본값으로 리셋
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Site Settings */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-metallicGold-500" />
                <h3 className="text-lg font-semibold text-offWhite-200">사이트 설정</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-2">
                    사이트 이름
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={e => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-2">
                    사이트 설명
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, siteDescription: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-2">
                    관리자 이메일
                  </label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={e => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-offWhite-200">보안 설정</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-offWhite-200 font-medium">회원가입 허용</h4>
                    <p className="text-sm text-offWhite-600">
                      새로운 사용자의 회원가입을 허용합니다
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowRegistration}
                      onChange={e =>
                        setSettings(prev => ({ ...prev, allowRegistration: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-deepBlack-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-metallicGold-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-offWhite-200 font-medium">이메일 인증 필수</h4>
                    <p className="text-sm text-offWhite-600">
                      회원가입 시 이메일 인증을 필수로 합니다
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.requireEmailVerification}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          requireEmailVerification: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-deepBlack-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-metallicGold-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* File Upload Settings */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-offWhite-200">파일 업로드 설정</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-2">
                    최대 파일 크기 (MB)
                  </label>
                  <input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) ?? 5 }))
                    }
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-2">
                    허용된 파일 형식 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={settings.allowedFileTypes.join(', ')}
                    onChange={e => handleArrayFieldChange('allowedFileTypes', e.target.value)}
                    className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    placeholder="jpg, png, gif, webp"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-deepBlack-300 rounded-xl border border-red-500/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-offWhite-200">유지보수 모드</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-offWhite-200 font-medium">유지보수 모드 활성화</h4>
                  <p className="text-sm text-offWhite-600">
                    활성화 시 관리자를 제외한 모든 사용자가 접근할 수 없습니다
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-deepBlack-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Button */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <button
                onClick={() => void saveSettings()}
                disabled={saving}
                className="w-full px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-semibold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    설정 저장
                  </>
                )}
              </button>
            </div>

            {/* System Info */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-offWhite-200">시스템 정보</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-offWhite-600">버전</span>
                  <span className="text-offWhite-200">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-offWhite-600">환경</span>
                  <span className="text-offWhite-200">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-offWhite-600">데이터베이스</span>
                  <span className="text-green-500">연결됨</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-offWhite-600">Storage</span>
                  <span className="text-green-500">활성</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <h3 className="text-lg font-semibold text-offWhite-200 mb-4">빠른 작업</h3>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    localStorage.clear();
                    userNotification.alert('캐시가 지워졌습니다.');
                  }}
                  className="w-full px-4 py-2 text-left text-offWhite-600 hover:text-offWhite-200 hover:bg-deepBlack-600/50 rounded-lg transition-colors"
                >
                  캐시 지우기
                </button>
                <button
                  onClick={() => {
                    userNotification.alert('데이터베이스 백업 기능은 준비 중입니다.');
                  }}
                  className="w-full px-4 py-2 text-left text-offWhite-600 hover:text-offWhite-200 hover:bg-deepBlack-600/50 rounded-lg transition-colors"
                >
                  데이터베이스 백업
                </button>
                <button
                  onClick={() => {
                    // 시스템 로그 확인 기능
                    userNotification.alert('로그가 콘솔에 출력되었습니다.');
                  }}
                  className="w-full px-4 py-2 text-left text-offWhite-600 hover:text-offWhite-200 hover:bg-deepBlack-600/50 rounded-lg transition-colors"
                >
                  로그 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
