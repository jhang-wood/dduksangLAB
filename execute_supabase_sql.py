#!/usr/bin/env python3
"""
Supabase SQL 실행 스크립트
"""
import requests
import os
import json

# Supabase 설정
SUPABASE_URL = "https://wpzvocfgfwvsxmpckdnu.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2Nzg1MiwiZXhwIjoyMDY4MjQzODUyfQ.c7vRQStMHbBZRjkDDM_iXdLWq4t0HWBvDNbkC7P6Z6c"

def execute_sql(sql_command):
    """SQL 명령어 실행"""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "sql": sql_command
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response
    except Exception as e:
        print(f"Error: {e}")
        return None

def read_sql_file(file_path):
    """SQL 파일 읽기"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

def main():
    """메인 함수"""
    print("🚀 Supabase SQL 실행 시작...")
    
    # SQL 파일 읽기
    sql_content = read_sql_file("FIXED_ADMIN_DATABASE_COMPATIBLE.sql")
    if not sql_content:
        print("❌ SQL 파일을 읽을 수 없습니다.")
        return
    
    # SQL을 작은 단위로 분할해서 실행
    sql_commands = sql_content.split(';')
    
    success_count = 0
    error_count = 0
    
    for i, command in enumerate(sql_commands):
        command = command.strip()
        if not command or command.startswith('--'):
            continue
            
        print(f"\n📝 실행 중 ({i+1}/{len(sql_commands)}): {command[:100]}...")
        
        # Supabase REST API는 RPC 방식으로 SQL 실행이 제한될 수 있으므로
        # 각 명령을 개별적으로 실행하는 대신 핵심 테이블만 생성
        
        response = execute_sql(command)
        if response and response.status_code == 200:
            success_count += 1
            print("✅ 성공")
        else:
            error_count += 1
            print("❌ 실패")
    
    print(f"\n🎉 완료! 성공: {success_count}, 실패: {error_count}")

if __name__ == "__main__":
    main()