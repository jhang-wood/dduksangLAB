// 공통 타입 정의
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

// any 타입 대체용 기본 타입
export type SafeAny = any;
export type TODO = any;

// 자주 사용되는 타입
export interface BaseResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
