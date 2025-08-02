#!/usr/bin/env node

/**
 * 배포 검증 스크립트
 * 배포 후 시스템 동작 확인
 */

const https = require('https');
const http = require('http');

class DeploymentVerifier {
  constructor(baseUrl = 'https://dduksang.com') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  // HTTP 요청 유틸리티
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.get(url, {
        timeout: 10000,
        ...options
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  // 보안 헤더 검증
  async verifySecurityHeaders() {
    console.log('\n🔒 보안 헤더 검증...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      const headers = response.headers;
      
      const requiredHeaders = {
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'x-xss-protection': '1; mode=block',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'strict-transport-security': null, // 값 확인 안함
        'content-security-policy': null
      };

      let passed = 0;
      let total = Object.keys(requiredHeaders).length;

      Object.entries(requiredHeaders).forEach(([headerName, expectedValue]) => {
        const actualValue = headers[headerName];
        
        if (actualValue) {
          if (expectedValue && actualValue !== expectedValue) {
            console.log(`  ⚠️  ${headerName}: 값 불일치 (실제: ${actualValue})`);
          } else {
            console.log(`  ✅ ${headerName}: ${actualValue}`);
            passed++;
          }
        } else {
          console.log(`  ❌ ${headerName}: 누락`);
        }
      });

      this.results.push({
        test: '보안 헤더',
        passed: passed,
        total: total,
        success: passed === total
      });

    } catch (error) {
      console.log(`  ❌ 보안 헤더 검증 실패: ${error.message}`);
      this.results.push({
        test: '보안 헤더',
        passed: 0,
        total: 1,
        success: false,
        error: error.message
      });
    }
  }

  // 환경변수 노출 검증
  async verifyEnvironmentSecurity() {
    console.log('\n🔍 환경변수 보안 검증...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      const body = response.body;
      
      // 민감한 정보 패턴 검사
      const sensitivePatterns = [
        /sk-[a-zA-Z0-9]{48}/g,  // OpenAI API key
        /eyJ[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*/g,  // JWT tokens
        /[A-Za-z0-9]{32,}/g,    // Long tokens
        /postgres:\/\/[^"'\s]+/g, // Database URLs
      ];

      let issuesFound = 0;
      
      sensitivePatterns.forEach((pattern, index) => {
        const matches = body.match(pattern);
        if (matches) {
          console.log(`  ❌ 패턴 ${index + 1}: 민감한 정보 노출 감지`);
          issuesFound++;
        }
      });

      if (issuesFound === 0) {
        console.log('  ✅ 민감한 정보 노출 없음');
        this.results.push({
          test: '환경변수 보안',
          passed: 1,
          total: 1,
          success: true
        });
      } else {
        this.results.push({
          test: '환경변수 보안',
          passed: 0,
          total: 1,
          success: false
        });
      }

    } catch (error) {
      console.log(`  ❌ 환경변수 보안 검증 실패: ${error.message}`);
      this.results.push({
        test: '환경변수 보안',
        passed: 0,
        total: 1,
        success: false,
        error: error.message
      });
    }
  }

  // API 엔드포인트 검증
  async verifyApiEndpoints() {
    console.log('\n🔌 API 엔드포인트 검증...');
    
    const endpoints = [
      '/api/ai-trends',
      '/api/payment',
      '/api/webhook/telegram'
    ];

    let workingEndpoints = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${endpoint}`);
        
        if (response.statusCode < 500) {
          console.log(`  ✅ ${endpoint}: 응답 가능 (${response.statusCode})`);
          workingEndpoints++;
        } else {
          console.log(`  ❌ ${endpoint}: 서버 오류 (${response.statusCode})`);
        }
      } catch (error) {
        console.log(`  ⚠️  ${endpoint}: 네트워크 오류`);
      }
    }

    this.results.push({
      test: 'API 엔드포인트',
      passed: workingEndpoints,
      total: endpoints.length,
      success: workingEndpoints === endpoints.length
    });
  }

  // 페이지 로딩 검증
  async verifyPageLoading() {
    console.log('\n📄 페이지 로딩 검증...');
    
    const pages = [
      '/',
      '/lectures',
      '/ai-trends',
      '/community',
      '/sites'
    ];

    let workingPages = 0;
    
    for (const page of pages) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(`${this.baseUrl}${page}`);
        const loadTime = Date.now() - startTime;
        
        if (response.statusCode === 200) {
          console.log(`  ✅ ${page}: 정상 로딩 (${loadTime}ms)`);
          workingPages++;
        } else if (response.statusCode === 404) {
          console.log(`  ⚠️  ${page}: 404 페이지`);
        } else {
          console.log(`  ❌ ${page}: 오류 (${response.statusCode})`);
        }
      } catch (error) {
        console.log(`  ❌ ${page}: 로딩 실패`);
      }
    }

    this.results.push({
      test: '페이지 로딩',
      passed: workingPages,
      total: pages.length,
      success: workingPages >= Math.floor(pages.length * 0.8) // 80% 이상
    });
  }

  // 성능 검증
  async verifyPerformance() {
    console.log('\n⚡ 성능 검증...');
    
    try {
      const startTime = Date.now();
      const response = await this.makeRequest(this.baseUrl);
      const loadTime = Date.now() - startTime;
      
      console.log(`  📊 첫 페이지 로딩 시간: ${loadTime}ms`);
      
      const performance = {
        excellent: loadTime < 1000,
        good: loadTime < 3000,
        acceptable: loadTime < 5000
      };

      if (performance.excellent) {
        console.log('  ✅ 성능: 우수 (<1초)');
      } else if (performance.good) {
        console.log('  ✅ 성능: 양호 (<3초)');
      } else if (performance.acceptable) {
        console.log('  ⚠️  성능: 허용 가능 (<5초)');
      } else {
        console.log('  ❌ 성능: 개선 필요 (>5초)');
      }

      this.results.push({
        test: '성능',
        passed: performance.acceptable ? 1 : 0,
        total: 1,
        success: performance.acceptable,
        details: `${loadTime}ms`
      });

    } catch (error) {
      console.log(`  ❌ 성능 검증 실패: ${error.message}`);
      this.results.push({
        test: '성능',
        passed: 0,
        total: 1,
        success: false,
        error: error.message
      });
    }
  }

  // 보고서 생성
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 배포 검증 보고서');
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalTests = 0;
    let allSuccess = true;

    this.results.forEach(result => {
      totalPassed += result.passed;
      totalTests += result.total;
      
      if (!result.success) {
        allSuccess = false;
      }

      const status = result.success ? '✅' : '❌';
      const score = `${result.passed}/${result.total}`;
      
      console.log(`${status} ${result.test}: ${score}`);
      
      if (result.details) {
        console.log(`   └ ${result.details}`);
      }
      
      if (result.error) {
        console.log(`   └ 오류: ${result.error}`);
      }
    });

    console.log('\n' + '-'.repeat(60));
    console.log(`📊 전체 점수: ${totalPassed}/${totalTests} (${Math.round(totalPassed/totalTests*100)}%)`);
    
    if (allSuccess) {
      console.log('🎉 모든 검증 통과! 배포 성공!');
    } else {
      console.log('⚠️  일부 검증 실패. 문제를 확인해주세요.');
    }
    
    console.log('\n📝 권장사항:');
    if (totalPassed / totalTests < 0.8) {
      console.log('- 실패한 검증 항목을 먼저 수정하세요.');
    }
    console.log('- 정기적으로 이 스크립트를 실행하여 시스템 상태를 모니터링하세요.');
    console.log('- 성능이 저하되면 코드 최적화를 고려하세요.');
    
    return allSuccess;
  }

  // 메인 검증 실행
  async verify() {
    console.log(`🔍 dduksangLAB 배포 검증 시작...`);
    console.log(`🌐 대상 URL: ${this.baseUrl}`);
    
    await this.verifySecurityHeaders();
    await this.verifyEnvironmentSecurity();
    await this.verifyApiEndpoints();
    await this.verifyPageLoading();
    await this.verifyPerformance();
    
    return this.generateReport();
  }
}

// 실행
if (require.main === module) {
  const url = process.argv[2] || 'https://dduksang.com';
  const verifier = new DeploymentVerifier(url);
  
  verifier.verify()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ 검증 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = DeploymentVerifier;