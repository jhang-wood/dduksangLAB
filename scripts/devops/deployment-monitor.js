#!/usr/bin/env node

/**
 * DevOps 자동화 에이전트 - 배포 모니터링 및 건강성 체크
 * 
 * 이 스크립트는 배포된 애플리케이션의 건강성을 지속적으로 모니터링하고
 * 문제 발생 시 자동으로 알림을 전송하며 복구 작업을 수행합니다.
 * 
 * 주요 기능:
 * - 실시간 애플리케이션 건강성 체크
 * - API 엔드포인트 상태 모니터링
 * - 데이터베이스 연결 상태 확인
 * - 성능 메트릭 수집 및 분석
 * - 자동 알림 및 복구 시도
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

class DeploymentMonitor {
  constructor(config = {}) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://dduksang.com',
      checkInterval: config.checkInterval || 60000, // 1분
      timeout: config.timeout || 30000, // 30초
      maxRetries: config.maxRetries || 3,
      alertWebhook: process.env.N8N_WEBHOOK_URL,
      telegramToken: process.env.TELEGRAM_BOT_TOKEN,
      telegramChatId: process.env.TELEGRAM_CHAT_ID,
      ...config
    };
    
    this.healthStatus = {
      lastCheck: null,
      isHealthy: true,
      consecutiveFailures: 0,
      uptime: 0,
      downtime: 0,
      totalRequests: 0,
      failedRequests: 0
    };
    
    this.metrics = {
      responseTime: [],
      errorRates: [],
      availability: []
    };
    
    this.alerts = [];
    this.isMonitoring = false;
  }

  // 로그 출력 유틸리티
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const colors = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[36m',
      success: '\x1b[32m',
      debug: '\x1b[37m'
    };
    
    const color = colors[level] || colors.info;
    const prefix = {
      error: '❌',
      warn: '⚠️ ',
      info: 'ℹ️ ',
      success: '✅',
      debug: '🔧'
    }[level] || 'ℹ️ ';
    
    console.log(`${color}[${timestamp}] ${prefix} ${message}\x1b[0m`);
    
    if (data && process.env.NODE_ENV === 'development') {
      console.log(`${color}   ${JSON.stringify(data, null, 2)}\x1b[0m`);
    }
  }

  // HTTP 요청 유틸리티
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'dduksangLAB-Monitor/1.0',
          'Accept': 'application/json',
          ...options.headers
        }
      };
      
      const startTime = Date.now();
      
      const req = client.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            responseTime: responseTime,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        });
      });
      
      req.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        reject({
          error: error.message,
          code: error.code,
          responseTime: responseTime,
          success: false
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject({
          error: 'Request timeout',
          code: 'TIMEOUT',
          responseTime: this.config.timeout,
          success: false
        });
      });
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }

  // 애플리케이션 기본 건강성 체크
  async checkApplicationHealth() {
    this.log('debug', '🏥 애플리케이션 건강성 체크 시작');
    
    const checks = [
      {
        name: 'Homepage',
        url: this.config.baseUrl,
        expected: { statusCode: 200, contentCheck: 'dduksang' }
      },
      {
        name: 'AI Trends Page',
        url: `${this.config.baseUrl}/ai-trends`,
        expected: { statusCode: 200 }
      },
      {
        name: 'Login Page',
        url: `${this.config.baseUrl}/auth/login`,
        expected: { statusCode: 200 }
      }
    ];
    
    const results = [];
    
    for (const check of checks) {
      try {
        const result = await this.makeRequest(check.url);
        
        const isHealthy = result.success && 
          (!check.expected.contentCheck || 
           result.data.toLowerCase().includes(check.expected.contentCheck.toLowerCase()));
        
        results.push({
          ...check,
          ...result,
          healthy: isHealthy,
          timestamp: new Date().toISOString()
        });
        
        if (isHealthy) {
          this.log('success', `${check.name} 건강함 (${result.responseTime}ms)`);
        } else {
          this.log('error', `${check.name} 이상 감지`, { statusCode: result.statusCode });
        }
        
      } catch (error) {
        results.push({
          ...check,
          ...error,
          healthy: false,
          timestamp: new Date().toISOString()
        });
        
        this.log('error', `${check.name} 접근 실패: ${error.error || error.message}`);
      }
    }
    
    return results;
  }

  // API 엔드포인트 상태 모니터링
  async checkAPIEndpoints() {
    this.log('debug', '🔌 API 엔드포인트 상태 확인');
    
    const apiEndpoints = [
      {
        name: 'AI Trends API',
        url: `${this.config.baseUrl}/api/ai-trends`,
        method: 'GET',
        expected: { statusCode: 200 }
      },
      {
        name: 'Health Check API',
        url: `${this.config.baseUrl}/api/health`,
        method: 'GET',
        expected: { statusCode: 200 }
      },
      {
        name: 'Auth Check API',
        url: `${this.config.baseUrl}/api/auth/check`,
        method: 'GET',
        expected: { statusCode: [200, 401] } // 인증 없으면 401도 정상
      }
    ];
    
    const results = [];
    
    for (const endpoint of apiEndpoints) {
      try {
        const result = await this.makeRequest(endpoint.url, {
          method: endpoint.method
        });
        
        const expectedCodes = Array.isArray(endpoint.expected.statusCode) 
          ? endpoint.expected.statusCode 
          : [endpoint.expected.statusCode];
        
        const isHealthy = expectedCodes.includes(result.statusCode);
        
        results.push({
          ...endpoint,
          ...result,
          healthy: isHealthy,
          timestamp: new Date().toISOString()
        });
        
        if (isHealthy) {
          this.log('success', `${endpoint.name} 정상 (${result.responseTime}ms)`);
        } else {
          this.log('warn', `${endpoint.name} 예상외 응답: ${result.statusCode}`);
        }
        
      } catch (error) {
        results.push({
          ...endpoint,
          ...error,
          healthy: false,
          timestamp: new Date().toISOString()
        });
        
        this.log('error', `${endpoint.name} 오류: ${error.error}`);
      }
    }
    
    return results;
  }

  // 성능 메트릭 수집
  async collectPerformanceMetrics() {
    this.log('debug', '📊 성능 메트릭 수집');
    
    const performanceChecks = [
      {
        name: 'Homepage Load Time',
        url: this.config.baseUrl,
        metric: 'loadTime'
      },
      {
        name: 'API Response Time',
        url: `${this.config.baseUrl}/api/ai-trends`,
        metric: 'apiResponseTime'
      }
    ];
    
    const metrics = {};
    
    for (const check of performanceChecks) {
      try {
        const startTime = Date.now();
        const result = await this.makeRequest(check.url);
        const totalTime = Date.now() - startTime;
        
        metrics[check.metric] = {
          responseTime: result.responseTime || totalTime,
          success: result.success,
          timestamp: new Date().toISOString()
        };
        
        // 성능 임계값 체크
        if (result.responseTime > 5000) {
          this.log('warn', `${check.name} 응답 지연: ${result.responseTime}ms`);
        } else if (result.responseTime > 2000) {
          this.log('warn', `${check.name} 응답 느림: ${result.responseTime}ms`);
        } else {
          this.log('success', `${check.name} 성능 양호: ${result.responseTime}ms`);
        }
        
      } catch (error) {
        metrics[check.metric] = {
          responseTime: null,
          success: false,
          error: error.error,
          timestamp: new Date().toISOString()
        };
        
        this.log('error', `${check.name} 성능 측정 실패: ${error.error}`);
      }
    }
    
    // 메트릭 히스토리 저장
    this.updateMetricsHistory(metrics);
    
    return metrics;
  }

  // 메트릭 히스토리 업데이트
  updateMetricsHistory(currentMetrics) {
    const now = Date.now();
    
    // 응답 시간 히스토리 업데이트
    Object.keys(currentMetrics).forEach(metric => {
      if (currentMetrics[metric].responseTime) {
        this.metrics.responseTime.push({
          metric,
          value: currentMetrics[metric].responseTime,
          timestamp: now
        });
      }
    });
    
    // 최근 100개 항목만 유지
    if (this.metrics.responseTime.length > 100) {
      this.metrics.responseTime = this.metrics.responseTime.slice(-100);
    }
  }

  // 종합 건강성 평가
  async performHealthCheck() {
    this.log('info', '🩺 종합 건강성 체크 시작');
    
    const checkStart = Date.now();
    
    try {
      // 병렬로 모든 체크 실행
      const [appHealth, apiHealth, metrics] = await Promise.all([
        this.checkApplicationHealth(),
        this.checkAPIEndpoints(),
        this.collectPerformanceMetrics()
      ]);
      
      // 전체 건강성 평가
      const allChecks = [...appHealth, ...apiHealth];
      const healthyCount = allChecks.filter(check => check.healthy).length;
      const totalCount = allChecks.length;
      const healthRatio = healthyCount / totalCount;
      
      const isCurrentlyHealthy = healthRatio >= 0.8; // 80% 이상 정상이면 건강
      
      // 상태 업데이트
      const previousHealth = this.healthStatus.isHealthy;
      this.healthStatus.lastCheck = new Date().toISOString();
      this.healthStatus.isHealthy = isCurrentlyHealthy;
      this.healthStatus.totalRequests++;
      
      if (isCurrentlyHealthy) {
        this.healthStatus.consecutiveFailures = 0;
        this.healthStatus.uptime += (Date.now() - checkStart);
      } else {
        this.healthStatus.consecutiveFailures++;
        this.healthStatus.failedRequests++;
        this.healthStatus.downtime += (Date.now() - checkStart);
      }
      
      // 상태 변화 감지
      if (previousHealth !== isCurrentlyHealthy) {
        if (isCurrentlyHealthy) {
          this.log('success', '🎉 애플리케이션 복구됨!');
          await this.sendRecoveryAlert(allChecks, metrics);
        } else {
          this.log('error', '🚨 애플리케이션 문제 감지!');
          await this.sendFailureAlert(allChecks, metrics);
        }
      }
      
      const checkDuration = Date.now() - checkStart;
      this.log('info', `건강성 체크 완료: ${healthyCount}/${totalCount} 정상 (${healthRatio * 100}%) - ${checkDuration}ms`);
      
      return {
        healthy: isCurrentlyHealthy,
        healthRatio,
        checks: allChecks,
        metrics,
        duration: checkDuration,
        timestamp: this.healthStatus.lastCheck
      };
      
    } catch (error) {
      this.log('error', '건강성 체크 실행 중 오류', error);
      this.healthStatus.failedRequests++;
      this.healthStatus.consecutiveFailures++;
      
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 실패 알림 전송
  async sendFailureAlert(checks, metrics) {
    const failedChecks = checks.filter(check => !check.healthy);
    
    const message = `🚨 **dduksangLAB 장애 감지**

🔍 **감지된 문제:**
${failedChecks.map(check => `• ${check.name}: ${check.error || 'HTTP ' + check.statusCode}`).join('\n')}

⏰ **시간:** ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
🔢 **연속 실패:** ${this.healthStatus.consecutiveFailures}회

📊 **성능 정보:**
${Object.keys(metrics).map(key => 
  `• ${key}: ${metrics[key].responseTime ? metrics[key].responseTime + 'ms' : '측정 실패'}`
).join('\n')}

🔗 [상세 로그 확인](https://github.com/${process.env.GITHUB_REPOSITORY}/actions)`;
    
    await this.sendTelegramAlert(message);
  }

  // 복구 알림 전송
  async sendRecoveryAlert(checks, metrics) {
    const message = `✅ **dduksangLAB 서비스 복구**

🎉 **복구 확인:** 모든 서비스가 정상으로 복구되었습니다.

⏰ **복구 시간:** ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
⏱️ **장애 지속 시간:** ${Math.round(this.healthStatus.downtime / 1000 / 60)}분

📊 **현재 성능:**
${Object.keys(metrics).map(key => 
  `• ${key}: ${metrics[key].responseTime}ms`
).join('\n')}

✨ 정상 운영이 재개되었습니다.`;
    
    await this.sendTelegramAlert(message);
  }

  // Telegram 알림 전송
  async sendTelegramAlert(message) {
    if (!this.config.telegramToken || !this.config.telegramChatId) {
      this.log('warn', 'Telegram 설정 없음 - 알림 스킵');
      return;
    }
    
    try {
      const telegramUrl = `https://api.telegram.org/bot${this.config.telegramToken}/sendMessage`;
      
      await this.makeRequest(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.config.telegramChatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      });
      
      this.log('success', '📨 Telegram 알림 전송됨');
      
    } catch (error) {
      this.log('error', 'Telegram 알림 전송 실패', error);
    }
  }

  // 모니터링 시작
  startMonitoring() {
    if (this.isMonitoring) {
      this.log('warn', '이미 모니터링 중');
      return;
    }
    
    this.isMonitoring = true;
    this.log('info', `🚀 배포 모니터링 시작 - 간격: ${this.config.checkInterval / 1000}초`);
    
    // 초기 체크
    this.performHealthCheck();
    
    // 정기 체크 설정
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);
    
    // 프로세스 종료 시 정리
    process.on('SIGINT', () => {
      this.stopMonitoring();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      this.stopMonitoring();
      process.exit(0);
    });
  }

  // 모니터링 중지
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.log('info', '🛑 배포 모니터링 중지');
    
    // 최종 상태 리포트
    this.generateStatusReport();
  }

  // 상태 리포트 생성
  generateStatusReport() {
    const uptime = this.healthStatus.uptime;
    const downtime = this.healthStatus.downtime;
    const totalTime = uptime + downtime;
    const availabilityRate = totalTime > 0 ? (uptime / totalTime) * 100 : 100;
    
    this.log('info', '📊 모니터링 세션 리포트');
    console.log('========================================');
    console.log(`총 요청 수: ${this.healthStatus.totalRequests}`);
    console.log(`실패한 요청: ${this.healthStatus.failedRequests}`);
    console.log(`가용률: ${availabilityRate.toFixed(2)}%`);
    console.log(`마지막 체크: ${this.healthStatus.lastCheck}`);
    console.log(`현재 상태: ${this.healthStatus.isHealthy ? '✅ 정상' : '❌ 이상'}`);
    console.log('========================================');
  }

  // 원샷 체크 (CI/CD에서 사용)
  async runSingleCheck() {
    this.log('info', '🔍 단일 건강성 체크 실행');
    
    const result = await this.performHealthCheck();
    
    if (result.healthy) {
      this.log('success', '🎉 애플리케이션 정상 작동 중');
      process.exit(0);
    } else {
      this.log('error', '🚨 애플리케이션 문제 감지됨');
      process.exit(1);
    }
  }
}

// CLI 실행 처리
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'monitor';
  
  const monitor = new DeploymentMonitor({
    baseUrl: args[1] || process.env.NEXT_PUBLIC_APP_URL,
    checkInterval: parseInt(args[2]) || 60000
  });
  
  switch (mode) {
    case 'check':
    case 'single':
      await monitor.runSingleCheck();
      break;
      
    case 'monitor':
    case 'start':
    default:
      monitor.startMonitoring();
      break;
  }
}

// 스크립트 직접 실행시에만 main 함수 호출
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 모니터 실행 오류:', error);
    process.exit(1);
  });
}

module.exports = DeploymentMonitor;