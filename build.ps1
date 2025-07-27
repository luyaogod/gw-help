# 1. 运行 pnpm 构建命令
pnpm --filter ./frontend run build

# 检查 pnpm 命令是否成功执行
if ($LASTEXITCODE -ne 0) {
    Write-Host "pnpm run err: $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

# 2. 检查并创建 build 目录
$buildDir = "./dist"
if (-not (Test-Path -Path $buildDir)) {
    Write-Host "create ./dist..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

# 3. 复制构建结果到目标目录
$sourceDir = "./frontend/dist"
$targetDir = "./backend/f_dist"

if (Test-Path -Path $sourceDir) {
    Write-Host "copy to $targetDir ..." -ForegroundColor Cyan
    
    # 如果目标目录已存在，先删除
    if (Test-Path -Path $targetDir) {
        Remove-Item -Path $targetDir -Recurse -Force
    }
    
    # 复制目录
    Copy-Item -Path $sourceDir -Destination $targetDir -Recurse
    
    Write-Host "copy $targetDir success." -ForegroundColor Green
} else {
    Write-Host "err: cant find $sourceDir" -ForegroundColor Red
    exit 1
}

# 4. 复制 .env 文件到 backend 目录
$envSourceFile = "./.env"
$envTargetFile = "./backend/.env"

if (Test-Path -Path $envSourceFile) {
    Write-Host "copy $envSourceFile to $envTargetFile ..." -ForegroundColor Cyan
    
    # 复制 .env 文件，如果目标文件存在则覆盖
    Copy-Item -Path $envSourceFile -Destination $envTargetFile -Force
    
    Write-Host "copy $envTargetFile success." -ForegroundColor Green
} else {
    Write-Host "warning: cant find $envSourceFile" -ForegroundColor Yellow
}

Write-Host "build succes." -ForegroundColor Green
