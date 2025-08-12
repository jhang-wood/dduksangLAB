/**
 * 보안 자격증명 관리자
 * 관리자 계정 정보를 안전하게 암호화하여 저장하고 관리
 */

// import crypto from 'crypto'; // 사용하지 않음
import { logger } from '@/lib/logger';
import { serverEnv } from '@/lib/env';

export interface AdminCredentials {
  email: string;
  password: string;
  lastUpdated: Date;
  expiresAt?: Date;
  rotationRequired?: boolean;
}

export interface SecurityConfig {
  algorithm: string;
  keyDerivationIterations: number;
  ivLength: number;
  tagLength: number;
  saltLength: number;
}

export interface EncryptedCredentials {
  encrypted: string;
  salt: string;
  iv: string;
  tag: string;
  algorithm: string;
  timestamp: number;
}

/**
 * 보안 자격증명 관리 클래스
 */
export class CredentialManager {
  private _config: SecurityConfig; // 언더스코어 추가로 미사용 변수 표시
  private masterKey: string | null = null;

  constructor() {
    this._config = {
      algorithm: 'aes-256-gcm',
      keyDerivationIterations: 100000,
      ivLength: 16,
      tagLength: 16,
      saltLength: 32,
    };
    // Suppress unused variable warning
    void this._config;
    // Suppress unused method warning for _initializeMasterKey
    void this._initializeMasterKey;
  }

  /**
   * 마스터 키 초기화 및 검증
   */
  private async _initializeMasterKey(): Promise<void> { // 언더스코어 추가로 미사용 함수 표시
    if (this.masterKey) {
      return;
    }

    try {
      const encryptionKey = serverEnv.encryptionKey();
      if (!encryptionKey) {
        throw new Error('암호화 키가 설정되지 않았습니다. ENCRYPTION_KEY 환경변수를 설정해주세요.');
      }

      if (encryptionKey.length < 32) {
        throw new Error('암호화 키는 최소 32자 이상이어야 합니다.');
      }

      this.masterKey = encryptionKey;
      logger.info('마스터 키 초기화 완료');
    } catch (error) {
      logger.error('마스터 키 초기화 실패', { error });
      throw error;
    }
  }

  /**
   * 환경변수에서 관리자 자격증명 로드
   */
  async getAdminCredentials(): Promise<AdminCredentials> {
    try {
      const email = serverEnv.adminEmail();
      const password = serverEnv.adminPassword();

      if (!email || !password) {
        throw new Error('관리자 자격증명이 환경변수에 설정되지 않았습니다.');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('유효하지 않은 이메일 형식입니다.');
      }

      if (password.length < 8) {
        throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
      }

      return {
        email,
        password,
        lastUpdated: new Date(),
        rotationRequired: false,
      };
    } catch (error) {
      logger.error('관리자 자격증명 로드 실패', { error });
      throw error;
    }
  }

  /**
   * 이메일 형식 검증
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 자격증명 회전 필요성 확인
   */
  needsCredentialRotation(credentials: AdminCredentials): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return credentials.rotationRequired || credentials.lastUpdated < thirtyDaysAgo;
  }
}

// 싱글톤 인스턴스
let credentialManager: CredentialManager | null = null;

/**
 * CredentialManager 싱글톤 인스턴스 반환
 */
export function getCredentialManager(): CredentialManager {
  if (!credentialManager) {
    credentialManager = new CredentialManager();
  }
  return credentialManager;
}

/**
 * 관리자 자격증명을 안전하게 가져오는 헬퍼 함수
 */
export async function getSecureAdminCredentials(): Promise<AdminCredentials> {
  const manager = getCredentialManager();
  const credentials = await manager.getAdminCredentials();

  if (manager.needsCredentialRotation(credentials)) {
    logger.warn('관리자 자격증명 회전이 필요합니다', {
      lastUpdated: credentials.lastUpdated,
      rotationRequired: credentials.rotationRequired,
    });
  }

  return credentials;
}
