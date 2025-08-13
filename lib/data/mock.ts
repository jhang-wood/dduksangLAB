import { Lecture, Enrollment, User } from "./types";

// Mock lecture data
const mockLectures: Lecture[] = [
  {
    id: 'mock-1',
    title: 'AI 자동화로 비즈니스 혁신하기',
    description: 'ChatGPT와 자동화 도구를 활용해 업무 효율성을 10배 높이는 실전 가이드. 최신 AI 기술을 활용한 워크플로우 자동화부터 실무 적용까지 완벽 마스터.',
    instructor_name: '김떡상',
    duration: 180,
    price: 89000,
    thumbnail_url: '/images/lectures/ai-automation.jpg',
    category: 'AI',
    level: 'beginner',
    status: 'active',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z'
  },
  {
    id: 'mock-2',
    title: '노코드 자동화 마스터 클래스',
    description: '코딩 없이도 강력한 자동화 시스템을 구축하는 방법. Zapier, Notion, Airtable 등을 활용한 완전 자동화 워크플로우 구축.',
    instructor_name: '박자동화',
    duration: 240,
    price: 129000,
    thumbnail_url: '/images/lectures/nocode-automation.jpg',
    category: 'Automation',
    level: 'intermediate',
    status: 'active',
    created_at: '2024-01-14T10:30:00Z',
    updated_at: '2024-01-14T10:30:00Z'
  },
  {
    id: 'mock-3',
    title: '프로그래밍 기초부터 실전까지',
    description: 'JavaScript와 Python을 활용한 웹 개발 완전 정복. 기초 문법부터 실전 프로젝트까지, 0에서 개발자가 되는 완벽한 로드맵.',
    instructor_name: '이개발',
    duration: 300,
    price: 0,
    thumbnail_url: '/images/lectures/programming-basics.jpg',
    category: 'Programming',
    level: 'all',
    status: 'active',
    created_at: '2024-01-13T14:00:00Z',
    updated_at: '2024-01-13T14:00:00Z'
  },
  {
    id: 'mock-4',
    title: '데이터 분석과 시각화 마스터',
    description: 'Python과 R을 활용한 데이터 분석의 모든 것. 데이터 수집부터 전처리, 분석, 시각화까지 실무에서 바로 쓸 수 있는 스킬셋.',
    instructor_name: '최데이터',
    duration: 200,
    price: 99000,
    thumbnail_url: '/images/lectures/data-analysis.jpg',
    category: 'Programming',
    level: 'intermediate',
    status: 'active',
    created_at: '2024-01-12T11:15:00Z',
    updated_at: '2024-01-12T11:15:00Z'
  },
  {
    id: 'mock-5',
    title: '창업과 비즈니스 모델 설계',
    description: '성공하는 스타트업의 비밀. 아이디어 검증부터 비즈니스 모델 설계, 투자 유치까지 실전 창업 가이드.',
    instructor_name: '정창업',
    duration: 150,
    price: 149000,
    thumbnail_url: '/images/lectures/startup-business.jpg',
    category: 'Business',
    level: 'beginner',
    status: 'active',
    created_at: '2024-01-11T16:45:00Z',
    updated_at: '2024-01-11T16:45:00Z'
  },
  {
    id: 'mock-6',
    title: 'AI 트레이딩 시스템 구축',
    description: '머신러닝을 활용한 자동 트레이딩 시스템 개발. 알고리즘 트레이딩의 원리부터 실제 구현까지, 퀀트 전문가가 되는 방법.',
    instructor_name: '한퀀트',
    duration: 280,
    price: 199000,
    thumbnail_url: '/images/lectures/ai-trading.jpg',
    category: 'AI',
    level: 'advanced',
    status: 'active',
    created_at: '2024-01-10T08:30:00Z',
    updated_at: '2024-01-10T08:30:00Z'
  },
  {
    id: 'mock-7',
    title: '마케팅 자동화 완전 정복',
    description: '디지털 마케팅의 모든 것을 자동화하는 방법. 이메일 마케팅, SNS 자동화, 고객 여정 관리까지 완벽한 마케팅 시스템 구축.',
    instructor_name: '송마케팅',
    duration: 220,
    price: 119000,
    thumbnail_url: '/images/lectures/marketing-automation.jpg',
    category: 'Business',
    level: 'intermediate',
    status: 'active',
    created_at: '2024-01-09T13:20:00Z',
    updated_at: '2024-01-09T13:20:00Z'
  },
  {
    id: 'mock-8',
    title: '블록체인과 웹3 개발 입문',
    description: '미래 기술 블록체인과 웹3 개발의 모든 것. Solidity 스마트 컨트랙트부터 DApp 개발까지, 웹3 개발자로 성장하는 완벽한 가이드.',
    instructor_name: '윤블록체인',
    duration: 320,
    price: 179000,
    thumbnail_url: '/images/lectures/blockchain-web3.jpg',
    category: 'Programming',
    level: 'advanced',
    status: 'active',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z'
  }
];

// Mock enrollment data
const mockEnrollments: Enrollment[] = [
  { lecture_id: 'mock-1', progress: 45, completed: false, user_id: 'user-1' },
  { lecture_id: 'mock-3', progress: 100, completed: true, user_id: 'user-1' },
  { lecture_id: 'mock-5', progress: 23, completed: false, user_id: 'user-1' },
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