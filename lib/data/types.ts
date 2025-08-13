// Shared types for lectures and related data
export interface Lecture {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  duration: number;
  price: number;
  thumbnail_url?: string;
  category: string;
  level: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Enrollment {
  lecture_id: string;
  progress: number;
  completed: boolean;
  user_id?: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}