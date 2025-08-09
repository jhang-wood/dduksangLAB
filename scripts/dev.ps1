# dduksangLAB 개발 서버 실행 스크립트
Write-Host "🚀 Starting dduksangLAB development server..." -ForegroundColor Green

# 컨테이너 시작
Write-Host "📦 Starting container..." -ForegroundColor Yellow
devcontainer up --workspace-folder "$PSScriptRoot\.."

# 개발 서버 실행
Write-Host "💻 Running Next.js dev server..." -ForegroundColor Cyan
devcontainer exec --workspace-folder "$PSScriptRoot\.." npm run dev

Write-Host "`n✅ Development server is running at http://localhost:3000" -ForegroundColor Green