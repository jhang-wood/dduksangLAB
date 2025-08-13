"use client";

import { useAuth } from "@/lib/auth/context";

export default function LecturesClient() {
  const { user, loading } = useAuth();

  if (loading) return <div>로딩중...</div>;
  if (!user) return <div>로그인이 필요합니다.</div>;

  return <div>수업 목록을 불러왔습니다.</div>;
}