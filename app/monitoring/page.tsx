/**
 * 모니터링 대시보드 페이지
 */
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Database,
  Bot,
  Monitor,
  Wifi,
  Globe,
  RefreshCw,
  Bell,
  // Settings
} from 'lucide-react';

interface DashboardData {
  overview: {
    systemStatus: 'healthy' | 'degraded' | 'unhealthy' | 'down';
    activeAlerts: number;
    resolvedToday: number;
    uptime: number;
  };
  services: ServiceHealth[];
  recentErrors: SystemError[];
  performanceMetrics: PerformanceMetric[];
  notifications: NotificationMessage[];
}

interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'down';
  timestamp: string;
  responseTime: number;
  message?: string;
  metrics?: Record<string, number>;
}

interface SystemError {
  id: string;
  timestamp: string;
  severity: 'info' | 'warn' | 'error' | 'critical';
  service: string;
  message: string;
  resolved: boolean;
}

interface PerformanceMetric {
  id: string;
  timestamp: string;
  service: string;
  metric: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

interface NotificationMessage {
  id: string;
  timestamp: string;
  severity: 'info' | 'warn' | 'error' | 'critical';
  title: string;
  message: string;
  service: string;
  acknowledged: boolean;
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 데이터 로드
  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/monitoring/dashboard');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 자동 새로고침
  useEffect(() => {
    loadDashboardData();

    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000); // 30초마다
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh]);

  // 상태별 색상 및 아이콘
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'unhealthy':
        return 'text-orange-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5" />;
      case 'down':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'text-blue-500 bg-blue-50';
      case 'warn':
        return 'text-yellow-500 bg-yellow-50';
      case 'error':
        return 'text-orange-500 bg-orange-50';
      case 'critical':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'playwright':
        return <Bot className="w-5 h-5" />;
      case 'supabase':
        return <Database className="w-5 h-5" />;
      case 'system':
        return <Server className="w-5 h-5" />;
      case 'network':
        return <Wifi className="w-5 h-5" />;
      case 'blog':
        return <Globe className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">모니터링 데이터를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">시스템 모니터링 대시보드</h1>
            <p className="text-gray-600 mt-1">
              마지막 업데이트: {lastUpdate.toLocaleString('ko-KR')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              자동 새로고침
            </button>
            <button
              onClick={loadDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <RefreshCw className="w-4 h-4" />
              새로고침
            </button>
          </div>
        </div>

        {data && (
          <>
            {/* 시스템 개요 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">시스템 상태</p>
                    <p
                      className={`text-2xl font-bold ${getStatusColor(data.overview.systemStatus)}`}
                    >
                      {data.overview.systemStatus.toUpperCase()}
                    </p>
                  </div>
                  <div className={`${getStatusColor(data.overview.systemStatus)}`}>
                    {getStatusIcon(data.overview.systemStatus)}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">활성 알림</p>
                    <p className="text-2xl font-bold text-red-500">{data.overview.activeAlerts}</p>
                  </div>
                  <Bell className="w-8 h-8 text-red-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">오늘 해결</p>
                    <p className="text-2xl font-bold text-green-500">
                      {data.overview.resolvedToday}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">가동률</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {(data.overview.uptime * 100).toFixed(2)}%
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </motion.div>
            </div>

            {/* 서비스 상태 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-sm mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">서비스 상태</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.services.map(service => (
                  <div key={service.service} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(service.service)}
                        <h3 className="font-semibold">{service.service.toUpperCase()}</h3>
                      </div>
                      <div className={`flex items-center gap-1 ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        <span className="text-sm font-medium">{service.status.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>응답시간: {service.responseTime}ms</p>
                      <p>마지막 체크: {new Date(service.timestamp).toLocaleTimeString('ko-KR')}</p>
                      {service.message && (
                        <p className="mt-1 text-xs bg-gray-50 p-2 rounded">{service.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 최근 에러 및 알림 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 최근 에러 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">최근 에러</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.recentErrors.map(error => (
                    <div key={error.id} className="border-l-4 border-l-red-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`px-2 py-1 text-xs rounded ${getSeverityColor(error.severity)}`}
                        >
                          {error.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(error.timestamp).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{error.service.toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{error.message}</p>
                      {error.resolved && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                          <CheckCircle className="w-3 h-3" />
                          해결됨
                        </span>
                      )}
                    </div>
                  ))}
                  {data.recentErrors.length === 0 && (
                    <p className="text-gray-500 text-center py-8">최근 에러가 없습니다.</p>
                  )}
                </div>
              </motion.div>

              {/* 알림 히스토리 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">알림 히스토리</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.notifications.map(notification => (
                    <div key={notification.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${getSeverityColor(notification.severity)}`}
                        >
                          {notification.severity.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.acknowledged && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleString('ko-KR')}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                  ))}
                  {data.notifications.length === 0 && (
                    <p className="text-gray-500 text-center py-8">알림 히스토리가 없습니다.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
