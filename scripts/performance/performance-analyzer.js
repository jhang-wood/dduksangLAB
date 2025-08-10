#!/usr/bin/env node

/**
 * Performance 자동화 에이전트 - 성능 모니터링 및 최적화
 * 
 * 이 스크립트는 웹 애플리케이션의 성능을 종합적으로 분석하고
 * 최적화 방안을 제시하는 자동화된 성능 테스트 도구입니다.
 * 
 * 주요 기능:
 * - Lighthouse 성능 감사
 * - Core Web Vitals 측정
 * - 번들 크기 분석
 * - 이미지 최적화 검사
 * - JavaScript 최적화 분석
 * - 데이터베이스 쿼리 성능 분석
 * - 자동 최적화 권장사항 생성
 */

const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const execAsync = promisify(exec);

class PerformanceAnalyzer {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://dduksang.com',
      lighthouse: options.lighthouse !== false,
      bundleAnalysis: options.bundleAnalysis !== false,
      imageAnalysis: options.imageAnalysis !== false,
      apiPerformance: options.apiPerformance !== false,
      outputFormat: options.outputFormat || 'console', // console, json, html
      thresholds: {
        performance: options.performanceThreshold || 90,
        accessibility: options.accessibilityThreshold || 95,
        bestPractices: options.bestPracticesThreshold || 90,
        seo: options.seoThreshold || 95,
        lcp: options.lcpThreshold || 2500, // ms
        fid: options.fidThreshold || 100,  // ms
        cls: options.clsThreshold || 0.1,   // score
        ...options.thresholds
      },
      ...options
    };
    
    this.results = {
      lighthouse: null,
      webVitals: {},
      bundleAnalysis: {},
      imageAnalysis: {},
      apiPerformance: {},
      recommendations: []
    };
    
    this.metrics = {
      scores: {},
      timings: {},
      sizes: {},
      issues: []
    };
  }

  // 로그 유틸리티
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
    
    if (data && process.env.DEBUG) {
      console.log(`${color}   ${JSON.stringify(data, null, 2)}\x1b[0m`);
    }
  }

  // Lighthouse 성능 감사 실행
  async runLighthouseAudit() {
    if (!this.options.lighthouse) {
      this.log('info', 'Lighthouse 감사 건너뜀');
      return null;
    }
    
    this.log('info', '🚢 Lighthouse 성능 감사 시작...');
    
    try {
      // Lighthouse CLI 설치 확인
      try {
        execSync('lighthouse --version', { stdio: 'pipe' });
      } catch (error) {
        this.log('info', 'Lighthouse 설치 중...');
        execSync('npm install -g lighthouse', { stdio: 'inherit' });
      }
      
      // Lighthouse 실행
      const outputPath = path.join(process.cwd(), 'lighthouse-report.json');
      const command = `lighthouse "${this.options.baseUrl}" --output=json --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox" --quiet`;
      
      this.log('debug', `Lighthouse 명령어: ${command}`);
      
      await execAsync(command);
      
      // 결과 파일 읽기
      if (fs.existsSync(outputPath)) {
        const reportData = fs.readFileSync(outputPath, 'utf8');
        const report = JSON.parse(reportData);
        
        this.results.lighthouse = this.parseLighthouseReport(report);
        this.log('success', 'Lighthouse 감사 완료');
        
        // 임시 파일 정리
        fs.unlinkSync(outputPath);
        
        return this.results.lighthouse;
      } else {
        throw new Error('Lighthouse 결과 파일을 찾을 수 없습니다');
      }
      
    } catch (error) {
      this.log('error', 'Lighthouse 감사 실패', { error: error.message });
      
      // 수동 성능 테스트 시도
      return await this.performManualPerformanceTest();
    }
  }

  // Lighthouse 보고서 파싱
  parseLighthouseReport(report) {
    const scores = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100)
    };
    
    // Core Web Vitals 추출
    const webVitals = {
      lcp: report.audits['largest-contentful-paint']?.numericValue || 0,
      fid: report.audits['max-potential-fid']?.numericValue || 0,
      cls: report.audits['cumulative-layout-shift']?.numericValue || 0,
      fcp: report.audits['first-contentful-paint']?.numericValue || 0,
      si: report.audits['speed-index']?.numericValue || 0,
      tti: report.audits['interactive']?.numericValue || 0
    };
    
    // 주요 성능 이슈 추출
    const issues = [];
    
    // 큰 이미지 확인
    if (report.audits['uses-optimized-images'] && report.audits['uses-optimized-images'].score < 1) {
      issues.push({
        category: 'images',
        severity: 'moderate',
        title: '최적화되지 않은 이미지',
        description: report.audits['uses-optimized-images'].description,
        savings: report.audits['uses-optimized-images'].details?.overallSavingsMs || 0
      });
    }
    
    // 사용하지 않는 JavaScript 확인
    if (report.audits['unused-javascript'] && report.audits['unused-javascript'].score < 1) {
      issues.push({
        category: 'javascript',
        severity: 'high',
        title: '사용하지 않는 JavaScript',
        description: report.audits['unused-javascript'].description,
        savings: report.audits['unused-javascript'].details?.overallSavingsMs || 0
      });
    }
    
    // 텍스트 압축 확인
    if (report.audits['uses-text-compression'] && report.audits['uses-text-compression'].score < 1) {
      issues.push({
        category: 'compression',
        severity: 'moderate',
        title: '텍스트 압축 누락',
        description: report.audits['uses-text-compression'].description,
        savings: report.audits['uses-text-compression'].details?.overallSavingsMs || 0
      });
    }
    
    // 메트릭 저장
    this.metrics.scores = scores;
    this.metrics.timings = webVitals;
    this.metrics.issues.push(...issues);
    
    return {
      scores,
      webVitals,
      issues,
      url: this.options.baseUrl,
      timestamp: new Date().toISOString()
    };
  }

  // 수동 성능 테스트
  async performManualPerformanceTest() {
    this.log('info', '📊 수동 성능 테스트 실행...');
    
    try {
      const performanceTests = [
        {
          name: 'Homepage Load Time',
          url: this.options.baseUrl,
          timeout: 30000
        },
        {
          name: 'AI Trends Page',
          url: `${this.options.baseUrl}/ai-trends`,
          timeout: 30000
        },
        {
          name: 'Login Page',
          url: `${this.options.baseUrl}/auth/login`,
          timeout: 30000
        }
      ];
      
      const results = {};
      
      for (const test of performanceTests) {
        const startTime = Date.now();
        
        try {
          await this.makeHttpRequest(test.url, { timeout: test.timeout });
          const loadTime = Date.now() - startTime;
          
          results[test.name] = {
            loadTime,
            success: true,
            url: test.url
          };
          
          this.log('success', `${test.name}: ${loadTime}ms`);
          
        } catch (error) {
          results[test.name] = {
            loadTime: null,
            success: false,
            error: error.message,
            url: test.url
          };
          
          this.log('error', `${test.name} 테스트 실패: ${error.message}`);
        }
      }
      
      return {
        method: 'manual',
        results,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      this.log('error', '수동 성능 테스트 실패', error);
      return null;
    }
  }

  // HTTP 요청 유틸리티
  makeHttpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: options.timeout || 30000,
        headers: {
          'User-Agent': 'dduksangLAB-Performance-Analyzer/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      };
      
      const client = urlObj.protocol === 'https:' ? https : require('http');
      
      const req = client.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            size: Buffer.byteLength(data, 'utf8')
          });
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  // 번들 크기 분석
  async analyzeBundleSize() {
    if (!this.options.bundleAnalysis) {
      this.log('info', '번들 분석 건너뜀');
      return null;
    }
    
    this.log('info', '📦 번들 크기 분석 시작...');
    
    try {
      const buildDir = path.join(process.cwd(), '.next');
      
      if (!fs.existsSync(buildDir)) {
        this.log('warn', '.next 디렉토리를 찾을 수 없습니다. 빌드를 먼저 실행하세요.');
        return null;
      }
      
      // .next/static 디렉토리 분석
      const staticDir = path.join(buildDir, 'static');
      const analysis = {
        totalSize: 0,
        jsSize: 0,
        cssSize: 0,
        imageSize: 0,
        chunks: [],
        largeFiles: []
      };
      
      if (fs.existsSync(staticDir)) {
        await this.analyzeDirectory(staticDir, analysis);
      }
      
      // 서버 사이드 코드 분석
      const serverDir = path.join(buildDir, 'server');
      if (fs.existsSync(serverDir)) {
        await this.analyzeDirectory(serverDir, analysis);
      }
      
      // 큰 파일들 식별
      analysis.largeFiles = analysis.chunks
        .filter(chunk => chunk.size > 100 * 1024) // 100KB 이상
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);
      
      // 최적화 권장사항 생성
      this.generateBundleRecommendations(analysis);
      
      this.results.bundleAnalysis = analysis;
      this.log('success', `번들 분석 완료: 총 ${this.formatBytes(analysis.totalSize)}`);
      
      return analysis;
      
    } catch (error) {
      this.log('error', '번들 분석 실패', error);
      return null;
    }
  }

  // 디렉토리 분석
  async analyzeDirectory(dirPath, analysis) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        await this.analyzeDirectory(itemPath, analysis);
      } else {
        const ext = path.extname(item).toLowerCase();
        const size = stats.size;
        
        analysis.totalSize += size;
        
        // 파일 타입별 분류
        if (ext === '.js') {
          analysis.jsSize += size;
        } else if (ext === '.css') {
          analysis.cssSize += size;
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
          analysis.imageSize += size;
        }
        
        // 개별 파일 정보 저장
        analysis.chunks.push({
          file: path.relative(process.cwd(), itemPath),
          size: size,
          type: ext.slice(1) || 'unknown'
        });
      }
    }
  }

  // 번들 최적화 권장사항 생성
  generateBundleRecommendations(analysis) {
    const recommendations = [];
    
    // JavaScript 크기 체크
    if (analysis.jsSize > 1024 * 1024) { // 1MB 이상
      recommendations.push({
        category: 'bundle',
        priority: 'high',
        title: 'JavaScript 번들 크기 최적화',
        description: `JavaScript 파일이 ${this.formatBytes(analysis.jsSize)}로 큽니다.`,
        action: 'Code splitting, dynamic import, tree shaking 적용',
        impact: 'high'
      });
    }
    
    // CSS 크기 체크
    if (analysis.cssSize > 200 * 1024) { // 200KB 이상
      recommendations.push({
        category: 'bundle',
        priority: 'moderate',
        title: 'CSS 파일 최적화',
        description: `CSS 파일이 ${this.formatBytes(analysis.cssSize)}로 큽니다.`,
        action: 'CSS minification, 사용하지 않는 스타일 제거',
        impact: 'moderate'
      });
    }
    
    // 큰 개별 파일들
    analysis.largeFiles.slice(0, 3).forEach(file => {
      if (file.size > 500 * 1024) { // 500KB 이상
        recommendations.push({
          category: 'bundle',
          priority: 'high',
          title: '큰 개별 파일 최적화',
          description: `${file.file} 파일이 ${this.formatBytes(file.size)}입니다.`,
          action: '파일 분할, 지연 로딩, 압축 적용',
          impact: 'high'
        });
      }
    });
    
    this.results.recommendations.push(...recommendations);
  }

  // 이미지 최적화 분석
  async analyzeImages() {
    if (!this.options.imageAnalysis) {
      this.log('info', '이미지 분석 건너뜀');
      return null;
    }
    
    this.log('info', '🖼️  이미지 최적화 분석 시작...');
    
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const imageAnalysis = {
        totalImages: 0,
        totalSize: 0,
        formats: {},
        largeImages: [],
        unoptimizedImages: []
      };
      
      if (!fs.existsSync(publicDir)) {
        this.log('warn', 'public 디렉토리를 찾을 수 없습니다.');
        return null;
      }
      
      await this.analyzeImagesInDirectory(publicDir, imageAnalysis);
      
      // 최적화 권장사항 생성
      this.generateImageRecommendations(imageAnalysis);
      
      this.results.imageAnalysis = imageAnalysis;
      this.log('success', `이미지 분석 완료: ${imageAnalysis.totalImages}개 파일, ${this.formatBytes(imageAnalysis.totalSize)}`);
      
      return imageAnalysis;
      
    } catch (error) {
      this.log('error', '이미지 분석 실패', error);
      return null;
    }
  }

  // 이미지 디렉토리 분석
  async analyzeImagesInDirectory(dirPath, analysis) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        await this.analyzeImagesInDirectory(itemPath, analysis);
      } else {
        const ext = path.extname(item).toLowerCase();
        
        if (imageExtensions.includes(ext)) {
          const size = stats.size;
          const format = ext.slice(1);
          
          analysis.totalImages++;
          analysis.totalSize += size;
          analysis.formats[format] = (analysis.formats[format] || 0) + 1;
          
          // 큰 이미지 파일 식별 (500KB 이상)
          if (size > 500 * 1024) {
            analysis.largeImages.push({
              file: path.relative(process.cwd(), itemPath),
              size: size,
              format: format
            });
          }
          
          // 최적화가 필요한 이미지 식별
          if ((format === 'png' || format === 'jpg' || format === 'jpeg') && size > 100 * 1024) {
            analysis.unoptimizedImages.push({
              file: path.relative(process.cwd(), itemPath),
              size: size,
              format: format,
              recommendation: 'WebP 또는 AVIF 형식 고려'
            });
          }
        }
      }
    }
  }

  // 이미지 최적화 권장사항 생성
  generateImageRecommendations(analysis) {
    const recommendations = [];
    
    // 큰 이미지 파일들
    if (analysis.largeImages.length > 0) {
      recommendations.push({
        category: 'images',
        priority: 'high',
        title: '큰 이미지 파일 최적화',
        description: `${analysis.largeImages.length}개의 큰 이미지 파일이 발견되었습니다.`,
        action: '이미지 크기 조정, 압축, 또는 지연 로딩 적용',
        files: analysis.largeImages.slice(0, 5),
        impact: 'high'
      });
    }
    
    // WebP 형식 권장
    const legacyFormats = ['png', 'jpg', 'jpeg'].reduce((sum, format) => {
      return sum + (analysis.formats[format] || 0);
    }, 0);
    
    if (legacyFormats > 5 && !analysis.formats['webp']) {
      recommendations.push({
        category: 'images',
        priority: 'moderate',
        title: '차세대 이미지 형식 사용',
        description: `${legacyFormats}개의 레거시 형식 이미지가 있습니다.`,
        action: 'WebP 또는 AVIF 형식으로 변환',
        impact: 'moderate'
      });
    }
    
    this.results.recommendations.push(...recommendations);
  }

  // API 성능 분석
  async analyzeAPIPerformance() {
    if (!this.options.apiPerformance) {
      this.log('info', 'API 성능 분석 건너뜀');
      return null;
    }
    
    this.log('info', '🚀 API 성능 분석 시작...');
    
    const apiEndpoints = [
      {
        name: 'AI Trends API',
        url: `${this.options.baseUrl}/api/ai-trends`,
        method: 'GET',
        expectedTime: 2000 // 2초
      },
      {
        name: 'Health Check API',
        url: `${this.options.baseUrl}/api/health`,
        method: 'GET',
        expectedTime: 500 // 500ms
      },
      {
        name: 'Auth Check API',
        url: `${this.options.baseUrl}/api/auth/check`,
        method: 'GET',
        expectedTime: 1000 // 1초
      }
    ];
    
    const apiResults = {
      endpoints: [],
      averageResponseTime: 0,
      slowEndpoints: [],
      failedEndpoints: []
    };
    
    let totalResponseTime = 0;
    let successfulRequests = 0;
    
    for (const endpoint of apiEndpoints) {
      this.log('debug', `API 테스트: ${endpoint.name}`);
      
      const testRuns = 3; // 각 엔드포인트를 3번 테스트
      const runs = [];
      
      for (let i = 0; i < testRuns; i++) {
        try {
          const startTime = Date.now();
          const response = await this.makeHttpRequest(endpoint.url, {
            timeout: 10000
          });
          const responseTime = Date.now() - startTime;
          
          runs.push({
            responseTime,
            statusCode: response.statusCode,
            success: response.statusCode >= 200 && response.statusCode < 300
          });
          
          if (runs[i].success) {
            totalResponseTime += responseTime;
            successfulRequests++;
          }
          
        } catch (error) {
          runs.push({
            responseTime: null,
            statusCode: null,
            success: false,
            error: error.message
          });
        }
      }
      
      // 평균 응답 시간 계산
      const successfulRuns = runs.filter(run => run.success);
      const avgResponseTime = successfulRuns.length > 0 
        ? successfulRuns.reduce((sum, run) => sum + run.responseTime, 0) / successfulRuns.length
        : null;
      
      const endpointResult = {
        ...endpoint,
        runs,
        averageResponseTime: avgResponseTime,
        successRate: (successfulRuns.length / testRuns) * 100,
        isHealthy: avgResponseTime && avgResponseTime < endpoint.expectedTime,
        timestamp: new Date().toISOString()
      };
      
      apiResults.endpoints.push(endpointResult);
      
      // 느린 엔드포인트 식별
      if (avgResponseTime && avgResponseTime > endpoint.expectedTime) {
        apiResults.slowEndpoints.push(endpointResult);
      }
      
      // 실패한 엔드포인트 식별
      if (successfulRuns.length === 0) {
        apiResults.failedEndpoints.push(endpointResult);
      }
      
      this.log('success', `${endpoint.name}: ${avgResponseTime ? Math.round(avgResponseTime) + 'ms' : '실패'}`);
    }
    
    // 전체 평균 응답 시간
    apiResults.averageResponseTime = successfulRequests > 0 
      ? totalResponseTime / successfulRequests 
      : null;
    
    // API 성능 권장사항 생성
    this.generateAPIRecommendations(apiResults);
    
    this.results.apiPerformance = apiResults;
    this.log('success', `API 성능 분석 완료: 평균 ${Math.round(apiResults.averageResponseTime)}ms`);
    
    return apiResults;
  }

  // API 성능 권장사항 생성
  generateAPIRecommendations(apiResults) {
    const recommendations = [];
    
    // 느린 API 엔드포인트
    if (apiResults.slowEndpoints.length > 0) {
      recommendations.push({
        category: 'api',
        priority: 'high',
        title: '느린 API 엔드포인트 최적화',
        description: `${apiResults.slowEndpoints.length}개의 엔드포인트가 예상보다 느립니다.`,
        action: '데이터베이스 쿼리 최적화, 캐싱 적용, 인덱스 추가',
        endpoints: apiResults.slowEndpoints.map(ep => ({
          name: ep.name,
          averageTime: Math.round(ep.averageResponseTime),
          expectedTime: ep.expectedTime
        })),
        impact: 'high'
      });
    }
    
    // 실패한 API 엔드포인트
    if (apiResults.failedEndpoints.length > 0) {
      recommendations.push({
        category: 'api',
        priority: 'critical',
        title: '실패하는 API 엔드포인트',
        description: `${apiResults.failedEndpoints.length}개의 엔드포인트가 실패합니다.`,
        action: '에러 원인 조사 및 수정, 에러 핸들링 개선',
        endpoints: apiResults.failedEndpoints.map(ep => ep.name),
        impact: 'critical'
      });
    }
    
    // 전체적으로 느린 API 성능
    if (apiResults.averageResponseTime > 2000) {
      recommendations.push({
        category: 'api',
        priority: 'moderate',
        title: '전반적인 API 성능 개선',
        description: `전체 평균 API 응답 시간이 ${Math.round(apiResults.averageResponseTime)}ms입니다.`,
        action: '서버 성능 튜닝, 데이터베이스 최적화, CDN 적용',
        impact: 'moderate'
      });
    }
    
    this.results.recommendations.push(...recommendations);
  }

  // 종합 성능 분석 실행
  async runFullAnalysis() {
    this.log('info', '🚀 종합 성능 분석 시작...');
    const analysisStart = Date.now();
    
    try {
      // 병렬로 모든 분석 실행
      await Promise.all([
        this.runLighthouseAudit(),
        this.analyzeBundleSize(),
        this.analyzeImages(),
        this.analyzeAPIPerformance()
      ]);
      
      const analysisDuration = Date.now() - analysisStart;
      this.log('success', `성능 분석 완료 (${analysisDuration}ms)`);
      
      // 종합 성능 점수 계산
      this.calculateOverallScore();
      
      // 결과 리포트 생성
      return this.generatePerformanceReport();
      
    } catch (error) {
      this.log('error', '성능 분석 실행 중 오류 발생', error);
      throw error;
    }
  }

  // 전체 성능 점수 계산
  calculateOverallScore() {
    const scores = this.metrics.scores;
    
    if (Object.keys(scores).length > 0) {
      this.metrics.overallScore = Math.round(
        (scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4
      );
    } else {
      // Lighthouse 데이터가 없으면 다른 메트릭 기반으로 계산
      let score = 100;
      
      // API 성능 기반 점수 차감
      if (this.results.apiPerformance?.averageResponseTime > 2000) {
        score -= 20;
      } else if (this.results.apiPerformance?.averageResponseTime > 1000) {
        score -= 10;
      }
      
      // 번들 크기 기반 점수 차감
      if (this.results.bundleAnalysis?.jsSize > 1024 * 1024) {
        score -= 15;
      } else if (this.results.bundleAnalysis?.jsSize > 512 * 1024) {
        score -= 8;
      }
      
      // 이미지 최적화 기반 점수 차감
      if (this.results.imageAnalysis?.largeImages?.length > 5) {
        score -= 10;
      }
      
      this.metrics.overallScore = Math.max(score, 0);
    }
  }

  // 성능 리포트 생성
  generatePerformanceReport() {
    this.log('info', '📊 성능 리포트 생성 중...');
    
    const report = {
      timestamp: new Date().toISOString(),
      url: this.options.baseUrl,
      overallScore: this.metrics.overallScore,
      lighthouse: this.results.lighthouse,
      bundleAnalysis: this.results.bundleAnalysis,
      imageAnalysis: this.results.imageAnalysis,
      apiPerformance: this.results.apiPerformance,
      recommendations: this.results.recommendations,
      summary: this.generateSummary()
    };
    
    // 콘솔 출력
    this.printPerformanceReport(report);
    
    // 파일로 저장
    if (this.options.outputFormat === 'json') {
      this.saveJsonReport(report);
    }
    
    if (this.options.outputFormat === 'html') {
      this.saveHtmlReport(report);
    }
    
    return report;
  }

  // 요약 생성
  generateSummary() {
    const summary = {
      totalIssues: this.results.recommendations.length,
      criticalIssues: this.results.recommendations.filter(r => r.priority === 'critical').length,
      highIssues: this.results.recommendations.filter(r => r.priority === 'high').length,
      categories: {}
    };
    
    // 카테고리별 이슈 수 계산
    this.results.recommendations.forEach(rec => {
      summary.categories[rec.category] = (summary.categories[rec.category] || 0) + 1;
    });
    
    return summary;
  }

  // 콘솔 리포트 출력
  printPerformanceReport(report) {
    console.log('\n' + '='.repeat(60));
    this.log('info', '🚀 성능 분석 결과 리포트');
    console.log('='.repeat(60));
    
    // 전체 점수
    console.log(`\n🎯 전체 성능 점수: ${report.overallScore}/100`);
    
    // Lighthouse 점수 (있는 경우)
    if (report.lighthouse?.scores) {
      console.log('\n📊 Lighthouse 점수:');
      console.log(`  성능: ${report.lighthouse.scores.performance}/100`);
      console.log(`  접근성: ${report.lighthouse.scores.accessibility}/100`);
      console.log(`  모범 사례: ${report.lighthouse.scores.bestPractices}/100`);
      console.log(`  SEO: ${report.lighthouse.scores.seo}/100`);
    }
    
    // Core Web Vitals
    if (report.lighthouse?.webVitals) {
      console.log('\n⚡ Core Web Vitals:');
      console.log(`  LCP: ${Math.round(report.lighthouse.webVitals.lcp)}ms`);
      console.log(`  FID: ${Math.round(report.lighthouse.webVitals.fid)}ms`);
      console.log(`  CLS: ${report.lighthouse.webVitals.cls.toFixed(3)}`);
    }
    
    // 번들 분석
    if (report.bundleAnalysis?.totalSize) {
      console.log('\n📦 번들 분석:');
      console.log(`  총 크기: ${this.formatBytes(report.bundleAnalysis.totalSize)}`);
      console.log(`  JavaScript: ${this.formatBytes(report.bundleAnalysis.jsSize)}`);
      console.log(`  CSS: ${this.formatBytes(report.bundleAnalysis.cssSize)}`);
    }
    
    // API 성능
    if (report.apiPerformance?.averageResponseTime) {
      console.log('\n🚀 API 성능:');
      console.log(`  평균 응답 시간: ${Math.round(report.apiPerformance.averageResponseTime)}ms`);
      console.log(`  느린 엔드포인트: ${report.apiPerformance.slowEndpoints.length}개`);
    }
    
    // 주요 권장사항
    if (report.recommendations.length > 0) {
      console.log('\n💡 주요 권장사항:');
      const topRecommendations = report.recommendations
        .filter(r => ['critical', 'high'].includes(r.priority))
        .slice(0, 5);
        
      topRecommendations.forEach((rec, index) => {
        const priority = rec.priority.toUpperCase();
        console.log(`  ${index + 1}. [${priority}] ${rec.title}`);
        console.log(`     ${rec.description}`);
      });
    }
    
    console.log('='.repeat(60));
  }

  // 바이트 포맷팅 유틸리티
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // JSON 리포트 저장
  saveJsonReport(report) {
    const filename = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(process.cwd(), 'performance-reports', filename);
    
    try {
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
      this.log('success', `JSON 리포트 저장됨: ${filepath}`);
    } catch (error) {
      this.log('error', 'JSON 리포트 저장 실패', error);
    }
  }

  // HTML 리포트 저장
  saveHtmlReport(report) {
    const filename = `performance-report-${new Date().toISOString().split('T')[0]}.html`;
    const filepath = path.join(process.cwd(), 'performance-reports', filename);
    
    const html = this.generateHtmlReport(report);
    
    try {
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, html);
      this.log('success', `HTML 리포트 저장됨: ${filepath}`);
    } catch (error) {
      this.log('error', 'HTML 리포트 저장 실패', error);
    }
  }

  // HTML 리포트 생성
  generateHtmlReport(report) {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>dduksangLAB 성능 분석 리포트</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .score { font-size: 48px; font-weight: bold; color: ${report.overallScore >= 90 ? '#10B981' : report.overallScore >= 70 ? '#F59E0B' : '#EF4444'}; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; }
        .recommendations { margin-top: 40px; }
        .recommendation { background: #fff; border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 6px; }
        .priority-critical { border-left: 4px solid #EF4444; }
        .priority-high { border-left: 4px solid #F59E0B; }
        .priority-moderate { border-left: 4px solid #3B82F6; }
        .priority-low { border-left: 4px solid #6B7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 dduksangLAB 성능 분석 리포트</h1>
            <div class="score">${report.overallScore}/100</div>
            <p>분석 시간: ${new Date(report.timestamp).toLocaleString('ko-KR')}</p>
            <p>URL: ${report.url}</p>
        </div>
        
        ${report.lighthouse ? `
        <div class="metrics">
            <div class="metric">
                <h3>🎯 성능</h3>
                <div style="font-size: 24px; font-weight: bold; color: ${report.lighthouse.scores.performance >= 90 ? '#10B981' : '#F59E0B'}">
                    ${report.lighthouse.scores.performance}/100
                </div>
            </div>
            <div class="metric">
                <h3>♿ 접근성</h3>
                <div style="font-size: 24px; font-weight: bold; color: ${report.lighthouse.scores.accessibility >= 90 ? '#10B981' : '#F59E0B'}">
                    ${report.lighthouse.scores.accessibility}/100
                </div>
            </div>
            <div class="metric">
                <h3>📋 모범 사례</h3>
                <div style="font-size: 24px; font-weight: bold; color: ${report.lighthouse.scores.bestPractices >= 90 ? '#10B981' : '#F59E0B'}">
                    ${report.lighthouse.scores.bestPractices}/100
                </div>
            </div>
            <div class="metric">
                <h3>🔍 SEO</h3>
                <div style="font-size: 24px; font-weight: bold; color: ${report.lighthouse.scores.seo >= 90 ? '#10B981' : '#F59E0B'}">
                    ${report.lighthouse.scores.seo}/100
                </div>
            </div>
        </div>
        ` : ''}
        
        ${report.bundleAnalysis ? `
        <div class="metric">
            <h3>📦 번들 분석</h3>
            <p>총 크기: <strong>${this.formatBytes(report.bundleAnalysis.totalSize)}</strong></p>
            <p>JavaScript: ${this.formatBytes(report.bundleAnalysis.jsSize)}</p>
            <p>CSS: ${this.formatBytes(report.bundleAnalysis.cssSize)}</p>
            <p>이미지: ${this.formatBytes(report.bundleAnalysis.imageSize)}</p>
        </div>
        ` : ''}
        
        <div class="recommendations">
            <h2>💡 권장사항</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation priority-${rec.priority}">
                    <h3>${rec.title} <span style="color: #666; font-size: 14px;">[${rec.priority.toUpperCase()}]</span></h3>
                    <p>${rec.description}</p>
                    <p><strong>권장 조치:</strong> ${rec.action}</p>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `;
  }
}

// CLI 실행 처리
async function main() {
  const args = process.argv.slice(2);
  
  const options = {
    baseUrl: args.find(arg => arg.startsWith('--url='))?.split('=')[1] || process.env.NEXT_PUBLIC_APP_URL,
    outputFormat: args.includes('--json') ? 'json' : args.includes('--html') ? 'html' : 'console',
    lighthouse: !args.includes('--no-lighthouse'),
    bundleAnalysis: !args.includes('--no-bundle'),
    imageAnalysis: !args.includes('--no-images'),
    apiPerformance: !args.includes('--no-api')
  };
  
  const analyzer = new PerformanceAnalyzer(options);
  
  try {
    const report = await analyzer.runFullAnalysis();
    
    // CI/CD에서 사용 시 종료 코드 설정
    if (process.env.CI === 'true') {
      const overallScore = report.overallScore || 0;
      const criticalIssues = report.summary.criticalIssues || 0;
      
      if (criticalIssues > 0) {
        console.log(`\n❌ Critical 성능 이슈 ${criticalIssues}개로 인해 빌드 실패`);
        process.exit(1);
      } else if (overallScore < 70) {
        console.log(`\n⚠️ 성능 점수 ${overallScore}가 기준점(70) 미달입니다`);
        process.exit(1);
      }
    }
    
    console.log('\n✅ 성능 분석 완료');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 성능 분석 실행 중 오류:', error);
    process.exit(1);
  }
}

// 스크립트 직접 실행시에만 main 함수 호출
if (require.main === module) {
  main();
}

module.exports = PerformanceAnalyzer;