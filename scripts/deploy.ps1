# سكريبت النشر التلقائي - Windows PowerShell
# الاستخدام: .\scripts\deploy.ps1

param(
    [string]$RepoName = "edu-center",
    [string]$BackendUrl = ""
)

$ErrorActionPreference = "Stop"

# إضافة الأدوات للـ PATH
$env:PATH = "C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;" + $env:PATH

Write-Host "=== نشر منصة إدارة المراكز التعليمية ===" -ForegroundColor Cyan

# --- الخطوة 1: GitHub ---
Write-Host "`n[1/4] رفع الكود على GitHub..." -ForegroundColor Yellow

$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "تسجيل الدخول في GitHub..." -ForegroundColor Yellow
    gh auth login --web --git-protocol https
}

# إنشاء repo ورفع الكود
$repoExists = gh repo view $RepoName 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "إنشاء repo: $RepoName" -ForegroundColor Green
    gh repo create $RepoName --public --source=. --remote=origin --push
} else {
    Write-Host "الـ repo موجود، رفع التحديثات..." -ForegroundColor Green
    git push origin master 2>&1
}

$repoUrl = gh repo view $RepoName --json url --jq .url
Write-Host "GitHub repo: $repoUrl" -ForegroundColor Green

# --- الخطوة 2: Vercel ---
Write-Host "`n[2/4] نشر Frontend على Vercel..." -ForegroundColor Yellow

$vercelInstalled = npx vercel --version 2>&1
if ($LASTEXITCODE -ne 0) {
    npm install -g vercel --silent
}

if ($BackendUrl -eq "") {
    Write-Host "تحذير: لم يتم تحديد BackendUrl" -ForegroundColor Red
    Write-Host "بعد نشر Backend على Railway، شغّل:" -ForegroundColor Yellow
    Write-Host "  .\scripts\deploy.ps1 -BackendUrl 'https://your-backend.up.railway.app'" -ForegroundColor White
} else {
    Push-Location frontend
    $env:NEXT_PUBLIC_API_URL = $BackendUrl
    npx vercel --prod --yes --env NEXT_PUBLIC_API_URL=$BackendUrl
    Pop-Location
}

# --- الخطوة 3: تعليمات Railway ---
Write-Host "`n[3/4] تعليمات نشر Backend على Railway:" -ForegroundColor Yellow
Write-Host @"

1. اذهب إلى: https://railway.app/new
2. اختر: Deploy from GitHub repo
3. اختر repo: $RepoName
4. اضبط Root Directory: backend
5. أضف PostgreSQL و Redis من "+ New" → "Database"
6. أضف متغيرات البيئة:
   NODE_ENV=production
   POSTGRES_URL=`${{Postgres.DATABASE_URL}}
   REDIS_URL=`${{Redis.REDIS_URL}}
   JWT_SECRET=<كلمة سر قوية>
   PORT=3000
   ADMIN_EMAIL=admin@edu.com
   ADMIN_PASSWORD=Admin@123

"@ -ForegroundColor White

# --- الخطوة 4: ملخص ---
Write-Host "[4/4] ملخص النشر:" -ForegroundColor Yellow
Write-Host "GitHub: $repoUrl" -ForegroundColor Green
Write-Host "Railway: https://railway.app (يدوي)" -ForegroundColor Yellow
Write-Host "Vercel: https://vercel.com/dashboard" -ForegroundColor Green
Write-Host "`nبيانات الدخول: admin@edu.com / Admin@123" -ForegroundColor Cyan
