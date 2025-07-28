# Telegram Webhook Setup for Vercel

## 1. Vercel 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 추가하세요:

```bash
# Telegram Bot 설정
TELEGRAM_BOT_TOKEN=7749285507:AAFWjQPZQ1n7BVh10P14cqhvdXc-iefnOZ4
TELEGRAM_ALLOWED_USER_ID=7590898112
TELEGRAM_WEBHOOK_SECRET=telegram-automation-webhook-secret-2025

# n8n 연결 설정  
N8N_WEBHOOK_URL=http://localhost:5678/webhook/telegram
# 또는 공개 n8n 인스턴스 사용 시
# N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/telegram
```

## 2. Telegram Bot 웹훅 설정

### 2.1. 웹훅 URL 설정
```bash
curl -X POST "https://api.telegram.org/bot7749285507:AAFWjQPZQ1n7BVh10P14cqhvdXc-iefnOZ4/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.dduksang.com/api/webhook/telegram",
    "secret_token": "telegram-automation-webhook-secret-2025"
  }'
```

### 2.2. 웹훅 상태 확인
```bash
curl "https://api.telegram.org/bot7749285507:AAFWjQPZQ1n7BVh10P14cqhvdXc-iefnOZ4/getWebhookInfo"
```

### 2.3. 웹훅 제거 (필요시)
```bash
curl -X POST "https://api.telegram.org/bot7749285507:AAFWjQPZQ1n7BVh10P14cqhvdXc-iefnOZ4/deleteWebhook"
```

## 3. n8n 워크플로우 수정

### 3.1. Telegram Trigger 수정
기존 `telegramTrigger` 노드를 `webhook` 노드로 변경:

```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "telegram",
    "responseMode": "lastNode",
    "options": {}
  },
  "id": "telegram-webhook",
  "name": "Telegram Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1.1,
  "position": [100, 300]
}
```

### 3.2. 데이터 구조 변경
Vercel 웹훅에서 받은 데이터 구조에 맞게 수정:
- `$json.message` → `$json.telegram_data.message`
- `$json.message.text` → `$json.telegram_data.message.text`
- `$json.message.chat.id` → `$json.telegram_data.message.chat.id`

## 4. 배포 및 테스트

### 4.1. Vercel 배포
```bash
cd /home/qwg18/projects/dduksangLAB
vercel --prod
```

### 4.2. 웹훅 테스트
```bash
# 헬스체크
curl https://www.dduksang.com/api/webhook/telegram

# 테스트 메시지 전송 (Telegram 앱에서)
"테스트 메시지입니다"
```

## 5. 문제 해결

### 5.1. 웹훅이 호출되지 않는 경우
1. Telegram Bot 웹훅 상태 확인
2. Vercel 환경 변수 확인
3. SSL 인증서 문제 확인

### 5.2. n8n 연결 실패
1. N8N_WEBHOOK_URL 확인
2. n8n 인스턴스 실행 상태 확인
3. 방화벽 설정 확인

### 5.3. 로그 확인
```bash
# Vercel 함수 로그 확인
vercel logs --follow

# n8n 워크플로우 실행 로그 확인
# n8n 웹 인터페이스에서 확인
```

## 6. 보안 고려사항

1. **시크릿 토큰**: 반드시 환경 변수로 관리
2. **사용자 ID 검증**: 허용된 사용자만 접근 가능
3. **HTTPS 필수**: Telegram은 HTTPS 웹훅만 지원
4. **Rate Limiting**: 필요시 추가 구현

## 7. 기존 Python 스크립트와의 차이점

| 구분 | 기존 Python | 새로운 Vercel + n8n |
|------|-------------|---------------------|
| 메시지 수신 | Long Polling | Webhook |
| 인프라 | 24/7 Python 프로세스 | Serverless 함수 |
| 확장성 | 수동 관리 | 자동 스케일링 |
| 비용 | 서버 유지비 | 사용량 기반 |
| 안정성 | 프로세스 관리 필요 | 자동 복구 |