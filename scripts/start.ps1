# dduksangLAB 프로덕션 서버 실행 스크립트
Write-Host "🚀 Starting dduksangLAB production server..." -ForegroundColor Green

# 프로덕션 서버 실행
Write-Host "💻 Running Next.js production server..." -ForegroundColor Yellow
devcontainer exec --workspace-folder "$PSScriptRoot\.." npm run start

Write-Host "`n✅ Production server is running at http://localhost:3000" -ForegroundColor Green