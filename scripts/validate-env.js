#!/usr/bin/env node

/**
 * 환경변수 검증 스크립트
 * 배포 전 필수 환경변수 확인 및 보안 검사
 */

const fs = require('fs');
const path = require('path');

// 필수 환경변수 목록
const REQUIRED_ENV_VARS = {
  client: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ],
  server: [
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'CRON_SECRET'
  ]
};

// 선택적 환경변수 목록
const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_TOSS_CLIENT_KEY',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SITE_URL',
  'TOSS_SECRET_KEY',
  'PAYAPP_SECRET_KEY',
  'PAYAPP_VALUE',
  'PAYAPP_USER_CODE',
  'PAYAPP_STORE_ID',
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'TELEGRAM_WEBHOOK_SECRET',
  'TELEGRAM_ALLOWED_USER_ID',
  'N8N_WEBHOOK_URL',
  'DATABASE_URL',
  'ADMIN_ALLOWED_IPS'
];

// 보안 패턴 검사
const SECURITY_PATTERNS = {
  weak_secrets: /^(test|demo|example|secret|password|key|admin|123)$/i,
  short_secrets: /^.{1,15}$/,
  dummy_urls: /^https?:\/\/(example|test|demo|localhost)/i,
  dummy_keys: /^(test_|example|demo|your-)/i
};

class EnvValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  // 환경변수 로드
  loadEnvVars() {
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (!fs.existsSync(envPath)) {
      this.errors.push('❌ .env.local 파일이 존재하지 않습니다.');
      return {};
    }

    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = {};
      
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          }
        }
      });

      this.info.push(`✅ .env.local 파일 로드 완료 (${Object.keys(envVars).length}개 변수)`);
      return envVars;
    } catch (error) {
      this.errors.push(`❌ .env.local 파일 읽기 실패: ${error.message}`);
      return {};
    }
  }

  // 필수 환경변수 검증
  validateRequiredVars(envVars) {
    console.log('\n🔍 필수 환경변수 검증...');
    
    Object.entries(REQUIRED_ENV_VARS).forEach(([type, vars]) => {
      console.log(`\n📋 ${type.toUpperCase()} 변수:`);
      
      vars.forEach(varName => {
        if (envVars[varName]) {
          console.log(`  ✅ ${varName}`);
        } else {
          this.errors.push(`❌ 필수 환경변수 누락: ${varName}`);
          console.log(`  ❌ ${varName} - 누락`);
        }
      });
    });
  }

  // 선택적 환경변수 확인
  validateOptionalVars(envVars) {
    console.log('\n📋 선택적 환경변수 확인...');
    
    const setVars = [];
    const unsetVars = [];
    
    OPTIONAL_ENV_VARS.forEach(varName => {
      if (envVars[varName]) {
        setVars.push(varName);
      } else {
        unsetVars.push(varName);
      }
    });

    if (setVars.length > 0) {
      console.log('\n✅ 설정된 선택적 변수:');
      setVars.forEach(varName => console.log(`  - ${varName}`));
    }

    if (unsetVars.length > 0) {
      console.log('\n⚠️  미설정 선택적 변수:');
      unsetVars.forEach(varName => console.log(`  - ${varName}`));
    }
  }

  // 보안 검사
  validateSecurity(envVars) {
    console.log('\n🔒 보안 검사...');
    
    Object.entries(envVars).forEach(([key, value]) => {
      // NEXT_PUBLIC_ 변수는 클라이언트에 노출됨
      if (key.startsWith('NEXT_PUBLIC_')) {
        // 민감한 정보가 NEXT_PUBLIC_ 변수에 있는지 확인
        if (key.includes('SECRET') || key.includes('PRIVATE') || key.includes('KEY')) {
          if (!key.includes('ANON') && !key.includes('PUBLIC') && !key.includes('CLIENT')) {
            this.warnings.push(`⚠️  ${key}: 민감한 정보가 클라이언트에 노출될 수 있습니다`);
          }
        }
        return;
      }

      // 보안 패턴 검사
      if (key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN')) {
        // 약한 시크릿 검사
        if (SECURITY_PATTERNS.weak_secrets.test(value)) {
          this.errors.push(`❌ ${key}: 약한 시크릿 사용 ('${value}')`);
        }
        
        // 짧은 시크릿 검사
        if (SECURITY_PATTERNS.short_secrets.test(value)) {
          this.warnings.push(`⚠️  ${key}: 시크릿이 너무 짧습니다 (${value.length}자)`);
        }
        
        // 더미 키 검사
        if (SECURITY_PATTERNS.dummy_keys.test(value)) {
          this.warnings.push(`⚠️  ${key}: 더미 키를 사용 중입니다`);
        }
      }

      // URL 검사
      if (key.includes('URL') && SECURITY_PATTERNS.dummy_urls.test(value)) {
        this.warnings.push(`⚠️  ${key}: 더미 URL을 사용 중입니다`);
      }
    });
  }

  // Vercel 환경변수 확인 가이드
  showVercelGuide() {
    console.log('\n📤 Vercel 배포 가이드:');
    console.log('');
    console.log('1. Vercel 대시보드에서 환경변수 설정:');
    console.log('   https://vercel.com/your-team/your-project/settings/environment-variables');
    console.log('');
    console.log('2. 또는 Vercel CLI 사용:');
    console.log('   npm i -g vercel');
    
    [...REQUIRED_ENV_VARS.client, ...REQUIRED_ENV_VARS.server].forEach(varName => {
      console.log(`   vercel env add ${varName}`);
    });
    
    console.log('');
    console.log('3. 배포 전 체크:');
    console.log('   vercel env ls');
    console.log('   vercel build');
  }

  // 보고서 출력
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 환경변수 검증 보고서');
    console.log('='.repeat(60));

    if (this.errors.length > 0) {
      console.log('\n❌ 오류:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  경고:');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
    }

    if (this.info.length > 0) {
      console.log('\n✅ 정보:');
      this.info.forEach(info => console.log(`  ${info}`));
    }

    console.log('\n' + '='.repeat(60));
    
    if (this.errors.length === 0) {
      console.log('🎉 환경변수 검증 성공!');
      if (this.warnings.length > 0) {
        console.log('⚠️  경고사항이 있지만 배포 가능합니다.');
      }
      return true;
    } else {
      console.log('❌ 환경변수 검증 실패!');
      console.log('배포 전 오류를 수정해주세요.');
      return false;
    }
  }

  // 메인 검증 실행
  validate() {
    console.log('🚀 dduksangLAB 환경변수 검증 시작...');
    
    const envVars = this.loadEnvVars();
    
    if (Object.keys(envVars).length === 0) {
      return this.generateReport();
    }

    this.validateRequiredVars(envVars);
    this.validateOptionalVars(envVars);
    this.validateSecurity(envVars);
    this.showVercelGuide();
    
    return this.generateReport();
  }
}

// 실행
if (require.main === module) {
  const validator = new EnvValidator();
  const success = validator.validate();
  process.exit(success ? 0 : 1);
}

module.exports = EnvValidator;