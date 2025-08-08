# 打包前端文件到PythonAPP目录下

# 1. 运行 pnpm 构建命令
try{
pnpm --filter ./frontend run build
} catch {
    Write-Host "pnpm run err" -ForegroundColor Red
    exit 1
}

# 3. 复制构建结果到目标目录
$sourceDir = "./frontend/dist"
$targetDir = "./backend/src/f_dist"

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


