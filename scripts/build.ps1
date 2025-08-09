# dduksangLAB 빌드 스크립트
Write-Host "🔨 Building dduksangLAB..." -ForegroundColor Green

# 빌드 실행
Write-Host "📦 Running Next.js build..." -ForegroundColor Yellow
devcontainer exec --workspace-folder "$PSScriptRoot\.." npm run build

Write-Host "`n✅ Build completed successfully!" -ForegroundColor Green