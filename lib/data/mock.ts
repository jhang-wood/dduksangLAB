import { Lecture, Enrollment, User } from "./types";

// Mock lecture data - Claude Code CLI 완전정복 커리큘럼
const mockLectures: Lecture[] = [
  {
    id: 'claude-00',
    title: '0강. 기초 개발환경 세팅 완벽 가이드',
    description: 'MCP, GitHub, Docker까지! 비개발자도 Claude Code CLI로 완벽한 개발환경을 10분만에 구축하는 방법을 배워보세요.',
    instructor_name: 'Claude Master',
    duration: 45,
    price: 0,
    thumbnail_url: '/images/lectures/setup-environment.jpg',
    category: '기초',
    level: '입문',
    status: 'active',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-01T09:00:00Z'
  },
  {
    id: 'claude-01',
    title: '1강. 서브에이전트 협업 시스템',
    description: '여러 AI 에이전트를 동시에 활용해 복잡한 작업을 자동으로 분담 처리하는 혁신적인 방법을 마스터하세요.',
    instructor_name: 'Claude Master',
    duration: 60,
    price: 49000,
    thumbnail_url: '/images/lectures/multi-agent.jpg',
    category: '자동화',
    level: '중급',
    status: 'active',
    created_at: '2024-01-02T09:00:00Z',
    updated_at: '2024-01-02T09:00:00Z'
  },
  {
    id: 'claude-02',
    title: '2강. Claude Code CLI 자동화 워크플로우',
    description: '반복 업무를 완전 자동화! 프로그래밍 지식 없이도 강력한 워크플로우를 구축하는 비법을 공개합니다.',
    instructor_name: 'Claude Master',
    duration: 75,
    price: 59000,
    thumbnail_url: '/images/lectures/workflow-automation.jpg',
    category: '자동화',
    level: '초급',
    status: 'active',
    created_at: '2024-01-03T09:00:00Z',
    updated_at: '2024-01-03T09:00:00Z'
  },
  {
    id: 'claude-03',
    title: '3강. 숏폼 자동화 업로드 시스템',
    description: 'YouTube, TikTok, Instagram 동시 업로드! AI가 알아서 콘텐츠를 생성하고 업로드하는 시스템을 만들어보세요.',
    instructor_name: 'Claude Master',
    duration: 80,
    price: 69000,
    thumbnail_url: '/images/lectures/shortform-automation.jpg',
    category: '콘텐츠',
    level: '중급',
    status: 'active',
    created_at: '2024-01-04T09:00:00Z',
    updated_at: '2024-01-04T09:00:00Z'
  },
  {
    id: 'claude-04',
    title: '4강. 블로그 자동화 업로드 마스터',
    description: 'Tistory, Naver, Medium 동시 포스팅! SEO 최적화된 글을 자동 생성하고 발행하는 완전자동 시스템 구축.',
    instructor_name: 'Claude Master',
    duration: 70,
    price: 65000,
    thumbnail_url: '/images/lectures/blog-automation.jpg',
    category: '콘텐츠',
    level: '중급',
    status: 'active',
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2024-01-05T09:00:00Z'
  },
  {
    id: 'claude-05',
    title: '5강. 주식 자동 분석 프로그램',
    description: '실시간 주가 데이터 수집부터 AI 분석, 투자 리포트 자동 생성까지! 나만의 주식 분석 봇을 만들어보세요.',
    instructor_name: 'Claude Master',
    duration: 90,
    price: 89000,
    thumbnail_url: '/images/lectures/stock-analysis.jpg',
    category: '투자',
    level: '고급',
    status: 'active',
    created_at: '2024-01-06T09:00:00Z',
    updated_at: '2024-01-06T09:00:00Z'
  },
  {
    id: 'claude-06',
    title: '6강. n8n 자동화 워크플로우 생성',
    description: 'No-Code 자동화의 끝판왕! n8n으로 복잡한 비즈니스 프로세스를 시각적으로 설계하고 실행하는 방법.',
    instructor_name: 'Claude Master',
    duration: 85,
    price: 75000,
    thumbnail_url: '/images/lectures/n8n-workflow.jpg',
    category: '자동화',
    level: '중급',
    status: 'active',
    created_at: '2024-01-07T09:00:00Z',
    updated_at: '2024-01-07T09:00:00Z'
  },
  {
    id: 'claude-07',
    title: '7강. 홈페이지 외주 완전정복',
    description: 'React, Next.js 홈페이지를 AI와 함께 30분만에 완성! 외주 받아서 실제로 납품하는 전체 프로세스 공개.',
    instructor_name: 'Claude Master',
    duration: 120,
    price: 129000,
    thumbnail_url: '/images/lectures/website-outsourcing.jpg',
    category: '개발',
    level: '고급',
    status: 'active',
    created_at: '2024-01-08T09:00:00Z',
    updated_at: '2024-01-08T09:00:00Z'
  },
  {
    id: 'claude-08',
    title: '8강. SaaS 생성 완벽 가이드',
    description: '아이디어부터 런칭까지! 구독 서비스 SaaS를 Claude Code CLI로 빠르게 개발하고 수익화하는 방법.',
    instructor_name: 'Claude Master',
    duration: 150,
    price: 189000,
    thumbnail_url: '/images/lectures/saas-creation.jpg',
    category: '창업',
    level: '고급',
    status: 'active',
    created_at: '2024-01-09T09:00:00Z',
    updated_at: '2024-01-09T09:00:00Z'
  },
  {
    id: 'claude-09',
    title: '9강. Supabase 완전 활용법',
    description: '백엔드 없이도 강력한 데이터베이스! 인증, 실시간 데이터, 파일 저장까지 Supabase로 모든 걸 해결하세요.',
    instructor_name: 'Claude Master',
    duration: 95,
    price: 99000,
    thumbnail_url: '/images/lectures/supabase-mastery.jpg',
    category: '데이터베이스',
    level: '중급',
    status: 'active',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  {
    id: 'claude-10',
    title: '10강. 나만의 AI비서 자동생성',
    description: '24시간 일하는 개인 비서 만들기! 업무 관리, 일정 조율, 이메일 답장까지 자동으로 처리하는 AI 비서 구축.',
    instructor_name: 'Claude Master',
    duration: 110,
    price: 149000,
    thumbnail_url: '/images/lectures/ai-assistant.jpg',
    category: 'AI',
    level: '고급',
    status: 'active',
    created_at: '2024-01-11T09:00:00Z',
    updated_at: '2024-01-11T09:00:00Z'
  },
  {
    id: 'claude-11',
    title: '11강. RAG구축 자동생성 시스템',
    description: '나만의 지식창고 만들기! 문서, PDF, 웹사이트 내용을 학습하여 전문가 수준의 답변을 제공하는 RAG 시스템.',
    instructor_name: 'Claude Master',
    duration: 130,
    price: 179000,
    thumbnail_url: '/images/lectures/rag-system.jpg',
    category: 'AI',
    level: '고급',
    status: 'active',
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z'
  },
  {
    id: 'claude-12',
    title: '12강. 휴대폰 코딩 완전정복',
    description: '언제 어디서나 개발하기! 스마트폰만으로도 Claude Code CLI를 활용해 실제 프로젝트를 개발하는 모바일 코딩 비법.',
    instructor_name: 'Claude Master',
    duration: 65,
    price: 79000,
    thumbnail_url: '/images/lectures/mobile-coding.jpg',
    category: '모바일',
    level: '초급',
    status: 'active',
    created_at: '2024-01-13T09:00:00Z',
    updated_at: '2024-01-13T09:00:00Z'
  }
];

// Mock enrollment data
const mockEnrollments: Enrollment[] = [
  { lecture_id: 'claude-00', progress: 100, completed: true, user_id: 'user-1' },
  { lecture_id: 'claude-01', progress: 65, completed: false, user_id: 'user-1' },
  { lecture_id: 'claude-02', progress: 30, completed: false, user_id: 'user-1' },
];

// Mock user data
const mockUser: User = {
  id: 'user-1',
  email: 'test@dduksang.com',
  name: '떡상맨',
  role: 'user'
};

export async function listLectures(): Promise<Lecture[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockLectures.sort((a, b) => 
    new Date(b.updated_at || b.created_at || '').getTime() - 
    new Date(a.updated_at || a.created_at || '').getTime()
  );
}

export async function getLectureById(id: string): Promise<Lecture | null> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockLectures.find(lecture => lecture.id === id) || null;
}

export async function getLecturesByCategory(category: string): Promise<Lecture[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (category === 'all') return mockLectures;
  return mockLectures.filter(lecture => lecture.category === category);
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockEnrollments.filter(enrollment => enrollment.user_id === userId);
}

export async function getCurrentUser(): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockUser;
}

export async function signOut(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log("[mock] User signed out");
}