#!/usr/bin/env node

/**
 * Integration 자동화 에이전트 - 전체 워크플로우 통합 검증
 * 
 * 이 스크립트는 모든 자동화 에이전트들을 조율하고 통합된 워크플로우를
 * 실행하여 전체 시스템의 건전성을 검증합니다.
 * 
 * 주요 기능:
 * - 전체 CI/CD 파이프라인 시뮬레이션
 * - 각 에이전트들의 순차적/병렬 실행
 * - 에이전트 간 의존성 관리
 * - 종합 결과 리포트 생성
 * - 실패 시 자동 복구 시나리오 실행
 * - 알림 및 로깅 통합 관리
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

class WorkflowOrchestrator {
  constructor(options = {}) {
    this.options = {
      mode: options.mode || 'full', // full, quick, custom
      parallel: options.parallel !== false,
      stopOnError: options.stopOnError !== false,
      generateReport: options.generateReport !== false,
      notifications: options.notifications !== false,
      ...options
    };
    
    this.agents = {
      qa: {
        name: 'QA 자동화 에이전트',
        script: './scripts/qa/test-env-scenarios.js',
        description: '환경 변수 및 품질 검증',
        dependencies: [],
        timeout: 300000, // 5분
        critical: true
      },
      security: {
        name: 'Security 자동화 에이전트',
        script: './scripts/security/vulnerability-scanner.js',
        description: '보안 취약점 및 의존성 검사',
        dependencies: ['qa'],
        timeout: 600000, // 10분
        critical: true
      },
      performance: {
        name: 'Performance 자동화 에이전트',
        script: './scripts/performance/performance-analyzer.js',
        description: '성능 분석 및 최적화 권장사항',
        dependencies: [],
        timeout: 900000, // 15분
        critical: false
      },
      devops: {
        name: 'DevOps 자동화 에이전트',
        script: './scripts/devops/deployment-monitor.js',
        description: '배포 상태 및 건강성 모니터링',
        dependencies: ['qa', 'security'],
        timeout: 180000, // 3분
        critical: false
      }
    };
    
    this.executionPlan = [];
    this.results = {};
    this.overallStatus = 'pending';
    this.startTime = null;
    this.endTime = null;
    
    this.metrics = {
      totalAgents: 0,
      successfulAgents: 0,
      failedAgents: 0,
      skippedAgents: 0,
      criticalFailures: 0,
      totalExecutionTime: 0,
      issues: {
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0
      }
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
      error: '🚨',
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

  // 실행 계획 생성
  generateExecutionPlan() {
    this.log('info', '📋 워크플로우 실행 계획 생성...');
    
    const plan = {
      phases: [],
      totalEstimatedTime: 0
    };
    
    if (this.options.mode === 'quick') {
      // 빠른 모드: 중요한 검사만
      plan.phases = [
        {
          name: 'Phase 1: Critical Checks',
          agents: ['qa', 'security'],
          parallel: true,
          description: '핵심 품질 및 보안 검사'
        }
      ];
    } else if (this.options.mode === 'full') {
      // 전체 모드: 모든 검사
      plan.phases = [
        {
          name: 'Phase 1: Foundation',
          agents: ['qa'],
          parallel: false,
          description: '기본 환경 및 설정 검증'
        },
        {
          name: 'Phase 2: Security & Performance',
          agents: ['security', 'performance'],
          parallel: this.options.parallel,
          description: '보안 및 성능 분석'
        },
        {
          name: 'Phase 3: Deployment Verification',
          agents: ['devops'],
          parallel: false,
          description: '배포 상태 및 운영 준비성 확인'
        }
      ];
    } else {
      // 커스텀 모드
      plan.phases = [
        {
          name: 'Phase 1: Custom Selection',
          agents: Object.keys(this.agents).filter(agent => 
            this.options.agents?.includes(agent) || 
            !this.options.agents
          ),
          parallel: this.options.parallel,
          description: '사용자 지정 에이전트 실행'
        }
      ];
    }
    
    // 예상 실행 시간 계산
    plan.phases.forEach(phase => {
      if (phase.parallel) {
        const maxTime = Math.max(...phase.agents.map(agent => this.agents[agent]?.timeout || 0));
        plan.totalEstimatedTime += maxTime;
      } else {
        const totalTime = phase.agents.reduce((sum, agent) => 
          sum + (this.agents[agent]?.timeout || 0), 0
        );
        plan.totalEstimatedTime += totalTime;
      }
    });
    
    this.executionPlan = plan;
    
    this.log('success', '실행 계획 생성 완료');
    this.log('info', `예상 실행 시간: ${Math.round(plan.totalEstimatedTime / 1000 / 60)}분`);
    
    // 실행 계획 출력
    console.log('\n📋 실행 계획:');
    plan.phases.forEach((phase, index) => {
      console.log(`\n${index + 1}. ${phase.name}`);
      console.log(`   📝 ${phase.description}`);
      console.log(`   🔧 에이전트: ${phase.agents.map(a => this.agents[a]?.name).join(', ')}`);
      console.log(`   ⚡ 실행 방식: ${phase.parallel ? '병렬' : '순차'}`);
    });
    
    return plan;
  }

  // 개별 에이전트 실행
  async executeAgent(agentKey) {
    const agent = this.agents[agentKey];
    
    if (!agent) {
      throw new Error(`알 수 없는 에이전트: ${agentKey}`);
    }
    
    this.log('info', `🚀 ${agent.name} 실행 시작...`);
    
    const startTime = Date.now();
    
    try {
      // 스크립트 파일 존재 확인
      if (!fs.existsSync(agent.script)) {
        throw new Error(`스크립트 파일을 찾을 수 없습니다: ${agent.script}`);
      }
      
      // 에이전트 실행
      const result = await this.runScript(agent.script, agent.timeout);
      
      const executionTime = Date.now() - startTime;
      
      this.results[agentKey] = {
        ...agent,
        status: 'success',
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
        executionTime,
        timestamp: new Date().toISOString()
      };
      
      // 결과에서 이슈 수 추출 (간단한 파싱)
      this.extractIssuesFromOutput(result.stdout, agentKey);
      
      this.log('success', `${agent.name} 완료 (${Math.round(executionTime / 1000)}초)`);
      this.metrics.successfulAgents++;
      
      return this.results[agentKey];
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      this.results[agentKey] = {
        ...agent,
        status: 'failed',
        error: error.message,
        exitCode: error.exitCode || 1,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        executionTime,
        timestamp: new Date().toISOString()
      };
      
      this.log('error', `${agent.name} 실패: ${error.message}`);
      this.metrics.failedAgents++;
      
      if (agent.critical) {
        this.metrics.criticalFailures++;
      }
      
      return this.results[agentKey];
    }
  }

  // 스크립트 실행 유틸리티
  runScript(scriptPath, timeout) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: timeout
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        
        // 실시간 출력 (디버그 모드에서만)
        if (process.env.DEBUG) {
          process.stdout.write(output);
        }
      });
      
      child.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        
        if (process.env.DEBUG) {
          process.stderr.write(output);
        }
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            exitCode: code,
            stdout: stdout,
            stderr: stderr
          });
        } else {
          const error = new Error(`스크립트 종료 코드: ${code}`);
          error.exitCode = code;
          error.stdout = stdout;
          error.stderr = stderr;
          reject(error);
        }
      });
      
      child.on('error', (error) => {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      });
      
      // 타임아웃 처리
      setTimeout(() => {
        child.kill('SIGTERM');
        const error = new Error('에이전트 실행 타임아웃');
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }, timeout);
    });
  }

  // 출력에서 이슈 수 추출
  extractIssuesFromOutput(output, agentKey) {
    // 간단한 패턴 매칭으로 이슈 수 추출
    const patterns = {
      critical: /critical[:\s]*(\d+)/gi,
      high: /high[:\s]*(\d+)/gi,
      moderate: /moderate[:\s]*(\d+)/gi,
      low: /low[:\s]*(\d+)/gi
    };
    
    Object.keys(patterns).forEach(severity => {
      const matches = output.match(patterns[severity]);
      if (matches) {
        const count = parseInt(matches[matches.length - 1]) || 0;
        this.metrics.issues[severity] += count;
      }
    });
  }

  // 페이즈별 에이전트 실행
  async executePhase(phase) {
    this.log('info', `📊 ${phase.name} 시작...`);
    
    if (phase.parallel) {
      // 병렬 실행
      const promises = phase.agents.map(agent => this.executeAgent(agent));
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => {
        const agentKey = phase.agents[index];
        return {
          agent: agentKey,
          status: result.status === 'fulfilled' ? 'success' : 'failed',
          result: result.value || result.reason
        };
      });
    } else {
      // 순차 실행
      const results = [];
      
      for (const agentKey of phase.agents) {
        try {
          const result = await this.executeAgent(agentKey);
          results.push({
            agent: agentKey,
            status: 'success',
            result: result
          });
          
          // 중요한 에이전트가 실패하면 중단
          if (result.status === 'failed' && this.agents[agentKey].critical && this.options.stopOnError) {
            this.log('error', '중요한 에이전트 실패로 인한 실행 중단');
            break;
          }
        } catch (error) {
          results.push({
            agent: agentKey,
            status: 'failed',
            result: error
          });
          
          if (this.agents[agentKey].critical && this.options.stopOnError) {
            this.log('error', '중요한 에이전트 실패로 인한 실행 중단');
            break;
          }
        }
      }
      
      return results;
    }
  }

  // 전체 워크플로우 실행
  async executeWorkflow() {
    this.log('info', '🚀 통합 워크플로우 실행 시작...');
    this.startTime = Date.now();
    
    try {
      // 실행 계획 생성
      const plan = this.generateExecutionPlan();
      
      this.metrics.totalAgents = plan.phases.reduce((sum, phase) => sum + phase.agents.length, 0);
      
      // 각 페이즈 실행
      for (const phase of plan.phases) {
        const phaseResults = await this.executePhase(phase);
        
        // 페이즈 결과 검토
        const failedInPhase = phaseResults.filter(r => r.status === 'failed');
        
        if (failedInPhase.length > 0 && this.options.stopOnError) {
          const criticalFailures = failedInPhase.filter(r => 
            this.agents[r.agent]?.critical
          );
          
          if (criticalFailures.length > 0) {
            this.log('error', `중요한 에이전트 실패로 워크플로우 중단: ${criticalFailures.map(f => f.agent).join(', ')}`);
            this.overallStatus = 'failed';
            break;
          }
        }
      }
      
      this.endTime = Date.now();
      this.metrics.totalExecutionTime = this.endTime - this.startTime;
      
      // 전체 상태 결정
      if (this.overallStatus !== 'failed') {
        if (this.metrics.criticalFailures > 0) {
          this.overallStatus = 'failed';
        } else if (this.metrics.failedAgents > 0) {
          this.overallStatus = 'partial';
        } else {
          this.overallStatus = 'success';
        }
      }
      
      this.log('success', '워크플로우 실행 완료');
      
      // 결과 리포트 생성
      if (this.options.generateReport) {
        await this.generateIntegratedReport();
      }
      
      // 알림 전송
      if (this.options.notifications) {
        await this.sendNotification();
      }
      
      return {
        status: this.overallStatus,
        metrics: this.metrics,
        results: this.results,
        executionTime: this.metrics.totalExecutionTime
      };
      
    } catch (error) {
      this.endTime = Date.now();
      this.metrics.totalExecutionTime = this.endTime - this.startTime;
      this.overallStatus = 'error';
      
      this.log('error', '워크플로우 실행 중 오류 발생', error);
      throw error;
    }
  }

  // 통합 결과 리포트 생성
  async generateIntegratedReport() {
    this.log('info', '📊 통합 결과 리포트 생성...');
    
    const report = {
      timestamp: new Date().toISOString(),
      executionPlan: this.executionPlan,
      overallStatus: this.overallStatus,
      metrics: this.metrics,
      agents: Object.keys(this.agents).map(key => ({
        key,
        ...this.agents[key],
        result: this.results[key]
      })),
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations()
    };
    
    // 콘솔 리포트 출력
    this.printIntegratedReport(report);
    
    // JSON 파일로 저장
    await this.saveReportToFile(report);
    
    return report;
  }

  // 요약 생성
  generateSummary() {
    const summary = {
      totalAgents: this.metrics.totalAgents,
      successful: this.metrics.successfulAgents,
      failed: this.metrics.failedAgents,
      skipped: this.metrics.skippedAgents,
      criticalFailures: this.metrics.criticalFailures,
      executionTime: Math.round(this.metrics.totalExecutionTime / 1000),
      successRate: this.metrics.totalAgents > 0 
        ? Math.round((this.metrics.successfulAgents / this.metrics.totalAgents) * 100)
        : 0,
      totalIssues: Object.values(this.metrics.issues).reduce((sum, count) => sum + count, 0),
      issueBreakdown: this.metrics.issues
    };
    
    return summary;
  }

  // 권장사항 생성
  generateRecommendations() {
    const recommendations = [];
    
    // 실패한 중요 에이전트
    const criticalFailures = Object.keys(this.results).filter(key => 
      this.results[key].status === 'failed' && this.agents[key].critical
    );
    
    if (criticalFailures.length > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'workflow',
        title: '중요 에이전트 실패 해결 필요',
        description: `${criticalFailures.length}개의 중요 에이전트가 실패했습니다: ${criticalFailures.join(', ')}`,
        action: '실패한 에이전트의 로그를 확인하고 근본 원인을 해결하세요.'
      });
    }
    
    // 높은 이슈 수
    if (this.metrics.issues.critical > 0) {
      recommendations.push({
        priority: 'high',
        category: 'issues',
        title: 'Critical 이슈 해결',
        description: `${this.metrics.issues.critical}개의 Critical 이슈가 발견되었습니다.`,
        action: 'Critical 이슈를 우선적으로 해결하세요.'
      });
    }
    
    // 성능 개선
    if (this.metrics.totalExecutionTime > 1800000) { // 30분 이상
      recommendations.push({
        priority: 'moderate',
        category: 'performance',
        title: '워크플로우 실행 시간 최적화',
        description: `전체 실행 시간이 ${Math.round(this.metrics.totalExecutionTime / 1000 / 60)}분으로 깁니다.`,
        action: '에이전트별 최적화 및 병렬 실행 옵션 검토'
      });
    }
    
    return recommendations;
  }

  // 콘솔 리포트 출력
  printIntegratedReport(report) {
    console.log('\n' + '='.repeat(80));
    this.log('info', '🎯 통합 워크플로우 결과 리포트');
    console.log('='.repeat(80));
    
    // 전체 상태
    const statusEmoji = {
      success: '✅',
      partial: '⚠️ ',
      failed: '❌',
      error: '🚨'
    }[report.overallStatus] || '❓';
    
    console.log(`\n${statusEmoji} 전체 상태: ${report.overallStatus.toUpperCase()}`);
    
    // 실행 통계
    console.log(`\n📊 실행 통계:`);
    console.log(`  총 에이전트: ${report.summary.totalAgents}개`);
    console.log(`  성공: ${report.summary.successful}개`);
    console.log(`  실패: ${report.summary.failed}개`);
    console.log(`  성공률: ${report.summary.successRate}%`);
    console.log(`  실행 시간: ${report.summary.executionTime}초`);
    
    // 이슈 통계
    if (report.summary.totalIssues > 0) {
      console.log(`\n🔍 발견된 이슈:`);
      console.log(`  🚨 Critical: ${report.summary.issueBreakdown.critical}개`);
      console.log(`  ⚠️  High: ${report.summary.issueBreakdown.high}개`);
      console.log(`  📋 Moderate: ${report.summary.issueBreakdown.moderate}개`);
      console.log(`  ℹ️  Low: ${report.summary.issueBreakdown.low}개`);
    }
    
    // 에이전트별 결과
    console.log(`\n🤖 에이전트별 결과:`);
    report.agents.forEach(agent => {
      const result = agent.result;
      if (result) {
        const statusIcon = result.status === 'success' ? '✅' : '❌';
        const time = Math.round((result.executionTime || 0) / 1000);
        console.log(`  ${statusIcon} ${agent.name}: ${result.status} (${time}초)`);
        
        if (result.status === 'failed' && result.error) {
          console.log(`    └─ 오류: ${result.error}`);
        }
      }
    });
    
    // 권장사항
    if (report.recommendations.length > 0) {
      console.log(`\n💡 권장사항:`);
      report.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
        console.log(`     ${rec.description}`);
        console.log(`     → ${rec.action}`);
      });
    }
    
    console.log('='.repeat(80));
  }

  // 리포트 파일 저장
  async saveReportToFile(report) {
    try {
      const reportDir = path.join(process.cwd(), 'workflow-reports');
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      
      const filename = `workflow-report-${new Date().toISOString().split('T')[0]}.json`;
      const filepath = path.join(reportDir, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
      this.log('success', `리포트 저장됨: ${filepath}`);
      
      // 요약 파일도 생성
      const summaryFilename = `workflow-summary-${new Date().toISOString().split('T')[0]}.txt`;
      const summaryFilepath = path.join(reportDir, summaryFilename);
      
      const summaryText = this.generateTextSummary(report);
      fs.writeFileSync(summaryFilepath, summaryText);
      
    } catch (error) {
      this.log('error', '리포트 저장 실패', error);
    }
  }

  // 텍스트 요약 생성
  generateTextSummary(report) {
    return `
dduksangLAB 통합 워크플로우 실행 결과
========================================

실행 시간: ${report.timestamp}
전체 상태: ${report.overallStatus.toUpperCase()}
실행 시간: ${report.summary.executionTime}초

에이전트 실행 결과:
- 총 ${report.summary.totalAgents}개 에이전트
- 성공: ${report.summary.successful}개
- 실패: ${report.summary.failed}개
- 성공률: ${report.summary.successRate}%

발견된 이슈:
- Critical: ${report.summary.issueBreakdown.critical}개
- High: ${report.summary.issueBreakdown.high}개
- Moderate: ${report.summary.issueBreakdown.moderate}개
- Low: ${report.summary.issueBreakdown.low}개

${report.recommendations.length > 0 ? `
권장사항:
${report.recommendations.map((rec, i) => `${i+1}. [${rec.priority.toUpperCase()}] ${rec.title}\n   ${rec.description}\n   → ${rec.action}`).join('\n\n')}
` : ''}

상세한 결과는 JSON 리포트를 확인하세요.
    `.trim();
  }

  // 알림 전송
  async sendNotification() {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      this.log('warn', 'Telegram 설정 없음 - 알림 전송 스킵');
      return;
    }
    
    try {
      const summary = this.generateSummary();
      const statusEmoji = {
        success: '✅',
        partial: '⚠️ ',
        failed: '❌',
        error: '🚨'
      }[this.overallStatus] || '❓';
      
      const message = `${statusEmoji} **dduksangLAB 워크플로우 실행 완료**

📊 **실행 결과:**
• 전체 상태: ${this.overallStatus.toUpperCase()}
• 에이전트: ${summary.successful}/${summary.totalAgents} 성공
• 성공률: ${summary.successRate}%
• 실행 시간: ${summary.executionTime}초

🔍 **발견된 이슈:**
• Critical: ${summary.issueBreakdown.critical}개
• High: ${summary.issueBreakdown.high}개
• Moderate: ${summary.issueBreakdown.moderate}개

⏰ ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`;

      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      });
      
      if (response.ok) {
        this.log('success', '📨 Telegram 알림 전송됨');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      this.log('error', 'Telegram 알림 전송 실패', error);
    }
  }

  // 헬스 체크 (간단한 상태 확인)
  async performHealthCheck() {
    this.log('info', '🏥 시스템 헬스 체크...');
    
    const healthChecks = {
      scripts: true,
      node: true,
      dependencies: true
    };
    
    try {
      // 스크립트 파일들 존재 확인
      Object.keys(this.agents).forEach(key => {
        const agent = this.agents[key];
        if (!fs.existsSync(agent.script)) {
          healthChecks.scripts = false;
          this.log('error', `스크립트 파일 없음: ${agent.script}`);
        }
      });
      
      // Node.js 버전 확인
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1));
      if (majorVersion < 16) {
        healthChecks.node = false;
        this.log('error', `Node.js 버전이 낮습니다: ${nodeVersion} (최소 v16 필요)`);
      }
      
      // 기본 의존성 확인 (package.json)
      if (!fs.existsSync('package.json')) {
        healthChecks.dependencies = false;
        this.log('error', 'package.json 파일이 없습니다');
      }
      
      const allHealthy = Object.values(healthChecks).every(check => check);
      
      this.log(allHealthy ? 'success' : 'error', 
        `헬스 체크 ${allHealthy ? '통과' : '실패'}`);
      
      return {
        healthy: allHealthy,
        checks: healthChecks
      };
      
    } catch (error) {
      this.log('error', '헬스 체크 실행 중 오류', error);
      return {
        healthy: false,
        checks: healthChecks,
        error: error.message
      };
    }
  }
}

// CLI 실행 처리
async function main() {
  const args = process.argv.slice(2);
  
  // 명령어 파싱
  const mode = args.find(arg => ['quick', 'full', 'custom'].includes(arg)) || 'full';
  const options = {
    mode: mode,
    parallel: !args.includes('--sequential'),
    stopOnError: !args.includes('--continue-on-error'),
    generateReport: !args.includes('--no-report'),
    notifications: !args.includes('--no-notifications'),
    agents: args.find(arg => arg.startsWith('--agents='))?.split('=')[1]?.split(',')
  };
  
  const orchestrator = new WorkflowOrchestrator(options);
  
  try {
    // 헬스 체크 먼저 실행
    const healthCheck = await orchestrator.performHealthCheck();
    if (!healthCheck.healthy) {
      console.error('❌ 시스템 헬스 체크 실패. 문제를 해결 후 다시 시도하세요.');
      process.exit(1);
    }
    
    // 메인 워크플로우 실행
    const result = await orchestrator.executeWorkflow();
    
    // 종료 코드 설정
    if (result.status === 'success') {
      console.log('\n✅ 모든 워크플로우가 성공적으로 완료되었습니다.');
      process.exit(0);
    } else if (result.status === 'partial') {
      console.log('\n⚠️ 일부 에이전트가 실패했지만 전체적으로 실행되었습니다.');
      process.exit(0); // CI에서는 부분 성공도 성공으로 처리
    } else {
      console.log('\n❌ 워크플로우 실행이 실패했습니다.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 워크플로우 실행 중 오류:', error.message);
    process.exit(1);
  }
}

// 도움말 출력
function printUsage() {
  console.log(`
사용법: node workflow-orchestrator.js [모드] [옵션]

모드:
  quick    빠른 검사 (QA + Security만)
  full     전체 검사 (모든 에이전트) [기본값]
  custom   사용자 지정

옵션:
  --sequential           순차 실행 (병렬 실행 비활성화)
  --continue-on-error    에러 발생 시 중단하지 않음
  --no-report           리포트 생성 비활성화
  --no-notifications    알림 전송 비활성화
  --agents=qa,security  실행할 에이전트 지정 (custom 모드)

예시:
  node workflow-orchestrator.js quick
  node workflow-orchestrator.js full --sequential
  node workflow-orchestrator.js custom --agents=qa,security
`);
}

// 도움말 요청 처리
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printUsage();
  process.exit(0);
}

// 스크립트 직접 실행시에만 main 함수 호출
if (require.main === module) {
  main();
}

module.exports = WorkflowOrchestrator;