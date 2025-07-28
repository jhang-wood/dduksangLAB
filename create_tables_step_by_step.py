#!/usr/bin/env python3
"""
Supabase 테이블 단계별 생성 스크립트
"""
import requests
import json
import time

# Supabase 설정
SUPABASE_URL = "https://wpzvocfgfwvsxmpckdnu.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2Nzg1MiwiZXhwIjoyMDY4MjQzODUyfQ.c7vRQStMHbBZRjkDDM_iXdLWq4t0HWBvDNbkC7P6Z6c"

def execute_supabase_query(table, method="GET", data=None, select="*"):
    """Supabase REST API 호출"""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    if method == "GET":
        url += f"?select={select}&limit=1"
    
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        
        print(f"🔍 {table} 테이블 {method}: {response.status_code}")
        if response.status_code < 400:
            print(f"✅ 성공: {response.text[:200]}")
            return True, response.json() if response.text else None
        else:
            print(f"❌ 실패: {response.text}")
            return False, response.text
    except Exception as e:
        print(f"❌ 오류: {e}")
        return False, str(e)

def check_table_exists(table_name):
    """테이블 존재 여부 확인"""
    success, result = execute_supabase_query(table_name, "GET", select="*")
    return success

def create_sample_data():
    """샘플 데이터 생성"""
    
    print("\n📋 1. profiles 테이블에 author_name 추가용 샘플 데이터 확인...")
    # profiles 테이블은 auth.users와 연결되어 있어서 직접 생성 불가
    
    print("\n📋 2. community_posts 테이블에 author_name 추가...")
    # community_posts에 샘플 데이터 추가 (author_name 포함)
    sample_post = {
        "id": "sample-post-1",
        "title": "AI Agent 마스터과정 수강 후기",
        "content": "정말 유익한 강의였습니다. ChatGPT API를 활용한 실전 프로젝트를 통해 많은 것을 배웠어요!",
        "category": "review",
        "author_name": "수강생1",
        "tags": ["AI", "후기", "ChatGPT"],
        "views": 156,
        "likes": 23,
        "comments_count": 5,
        "is_pinned": False,
        "is_featured": True
    }
    
    success, result = execute_supabase_query("community_posts", "POST", sample_post)
    if success:
        print("✅ community_posts 샘플 데이터 생성 성공")
    else:
        print("❌ community_posts 생성 실패 - 이미 존재하거나 스키마 문제")
    
    print("\n📋 3. showcase_sites 테이블에 샘플 데이터 추가...")
    sample_site = {
        "id": "sample-site-1",
        "name": "AI 콘텐츠 생성기",
        "description": "ChatGPT를 활용한 자동 콘텐츠 생성 도구입니다.",
        "url": "https://ai-content-generator.example.com",
        "thumbnail_url": "https://via.placeholder.com/400x300/1a1a1a/f4c430?text=AI+Content",
        "category": "AI",
        "tags": ["AI", "Content", "ChatGPT"],
        "views": 1234,
        "likes": 89,
        "is_featured": True
    }
    
    success, result = execute_supabase_query("showcase_sites", "POST", sample_site)
    if success:
        print("✅ showcase_sites 샘플 데이터 생성 성공")
    else:
        print("❌ showcase_sites 생성 실패 - 이미 존재하거나 스키마 문제")
    
    print("\n📋 4. lecture_chapters 테이블에 샘플 데이터 추가...")
    sample_chapter = {
        "id": "chapter-1",
        "lecture_id": "ai-agent-master",  # 기존 강의 ID 사용
        "title": "강의 소개 및 개요",
        "description": "AI Agent 마스터과정의 전체적인 내용과 학습 목표를 소개합니다.",
        "video_url": "https://www.youtube.com/watch?v=sample1",
        "duration": 900,
        "order_index": 1,
        "is_preview": True
    }
    
    success, result = execute_supabase_query("lecture_chapters", "POST", sample_chapter)
    if success:
        print("✅ lecture_chapters 샘플 데이터 생성 성공")
    else:
        print("❌ lecture_chapters 생성 실패 - 테이블이 없거나 스키마 문제")
    
    print("\n📋 5. saas_products 테이블에 샘플 데이터 추가...")
    sample_product = {
        "id": "product-1",
        "name": "ChatGPT Plus",
        "description": "OpenAI의 프리미엄 AI 어시스턴트 서비스",
        "category": "AI Assistant",
        "pricing_model": "subscription",
        "price_monthly": 20000,
        "website_url": "https://chat.openai.com",
        "features": ["GPT-4 접근", "무제한 사용", "플러그인 지원"],
        "tags": ["AI", "ChatGPT", "OpenAI"],
        "rating": 4.8,
        "is_recommended": True
    }
    
    success, result = execute_supabase_query("saas_products", "POST", sample_product)
    if success:
        print("✅ saas_products 샘플 데이터 생성 성공")
    else:
        print("❌ saas_products 생성 실패 - 테이블이 없음")

def check_all_tables():
    """모든 필요한 테이블 존재 여부 확인"""
    tables = [
        "profiles",
        "lectures", 
        "community_posts",
        "showcase_sites",
        "lecture_chapters",
        "saas_products",
        "payments",
        "lecture_enrollments"
    ]
    
    print("🔍 기존 테이블 확인...")
    existing_tables = []
    missing_tables = []
    
    for table in tables:
        print(f"\n📋 {table} 테이블 확인 중...")
        if check_table_exists(table):
            existing_tables.append(table)
            print(f"✅ {table} 존재")
        else:
            missing_tables.append(table)
            print(f"❌ {table} 없음")
    
    print(f"\n📊 결과:")
    print(f"✅ 존재하는 테이블: {existing_tables}")
    print(f"❌ 누락된 테이블: {missing_tables}")
    
    return existing_tables, missing_tables

def main():
    """메인 함수"""
    print("🚀 Supabase 관리자페이지 테이블 확인 및 수정 시작...")
    
    # 1. 기존 테이블 확인
    existing_tables, missing_tables = check_all_tables()
    
    # 2. 누락된 테이블이 있는 경우 알림
    if missing_tables:
        print(f"\n⚠️  누락된 테이블들: {missing_tables}")
        print("이 테이블들은 Supabase 대시보드에서 SQL Editor로 직접 생성해야 합니다.")
        
        # 각 누락된 테이블에 대한 생성 SQL 제공
        table_sqls = {
            "lecture_chapters": """
CREATE TABLE public.lecture_chapters (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    lecture_id TEXT NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lecture_id, order_index)
);
ALTER TABLE public.lecture_chapters ENABLE ROW LEVEL SECURITY;
""",
            "saas_products": """
CREATE TABLE public.saas_products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    pricing_model TEXT NOT NULL CHECK (pricing_model IN ('free', 'freemium', 'paid', 'subscription')),
    price_monthly INTEGER DEFAULT 0,
    price_yearly INTEGER DEFAULT 0,
    website_url TEXT,
    logo_url TEXT,
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_recommended BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.saas_products ENABLE ROW LEVEL SECURITY;
""",
            "payments": """
CREATE TABLE public.payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lecture_id TEXT REFERENCES public.lectures(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'KRW',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    transaction_id TEXT,
    provider TEXT,
    provider_payment_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
""",
            "lecture_enrollments": """
CREATE TABLE public.lecture_enrollments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lecture_id TEXT NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    last_watched_chapter_id TEXT REFERENCES public.lecture_chapters(id),
    UNIQUE(user_id, lecture_id)
);
ALTER TABLE public.lecture_enrollments ENABLE ROW LEVEL SECURITY;
"""
        }
        
        print("\n📋 누락된 테이블 생성 SQL:")
        for table in missing_tables:
            if table in table_sqls:
                print(f"\n-- {table.upper()} 테이블 생성")
                print(table_sqls[table])
    
    # 3. 기존 테이블에 샘플 데이터 추가
    print("\n🎯 기존 테이블에 샘플 데이터 추가...")
    create_sample_data()
    
    print("\n🎉 작업 완료!")
    print("\n📝 다음 단계:")
    print("1. Supabase 대시보드 → SQL Editor로 이동")
    print("2. 위에 출력된 누락된 테이블 생성 SQL을 복사해서 실행")
    print("3. 관리자페이지에서 정상 작동 확인")

if __name__ == "__main__":
    main()