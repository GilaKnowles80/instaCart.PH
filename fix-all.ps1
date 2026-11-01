# fix-all.ps1 - Complete fix for instaCart.PH
Write-Host "🚀 instaCart.PH Complete Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Fix Backend .env Database URL
Write-Host "`n[1/6] Fixing backend .env database URL..." -ForegroundColor Yellow
$envFile = "backend\.env"
$content = Get-Content $envFile -Raw
$content = $content -replace 'ep-[a-z0-9-]+\.pooler\.ap-southeast-1\.aws\.neon\.tech', 'ep-divine-wildflower-a1smbssh-pooler.ap-southeast-1.aws.neon.tech'
Set-Content $envFile $content
Write-Host "   ✅ DATABASE_URL updated" -ForegroundColor Green

# 2. Install Backend Dependencies
Write-Host "`n[2/6] Installing backend dependencies..." -ForegroundColor Yellow
cd "backend"
npm install 2>&1 | Out-Null
Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green

# 3. Compile Backend TypeScript
Write-Host "`n[3/6] Compiling backend TypeScript..." -ForegroundColor Yellow
npx tsc 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Backend compiled successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend compilation failed" -ForegroundColor Red
}

# 4. Install Frontend Dependencies
Write-Host "`n[4/6] Installing frontend dependencies..." -ForegroundColor Yellow
cd "../frontend"
npm install 2>&1 | Out-Null
Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green

# 5. Build Frontend
Write-Host "`n[5/6] Building frontend..." -ForegroundColor Yellow
npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend build failed" -ForegroundColor Red
}

# 6. Verify Installation
Write-Host "`n[6/6] Verifying installation..." -ForegroundColor Yellow
$backendExists = Test-Path "backend\dist\server.js"
$frontendExists = Test-Path "frontend\dist\index.html"
Write-Host "   Backend dist: $backendExists" -ForegroundColor Green
Write-Host "   Frontend dist: $frontendExists" -ForegroundColor Green

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "🎉 Auto-Fix Complete!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run the SQL schema in Neon Console"
Write-Host "2. Start backend: cd backend && npx tsx src/server.ts"
Write-Host "3. Start frontend: cd frontend && npm run dev"
Write-Host "4. Access: http://localhost:5176"
