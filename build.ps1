try{
    Write-Host "build frontend..." -ForegroundColor Yellow
    ./fbuild.ps1
    Write-Host "build frontend success." -ForegroundColor Green
} catch {
    Write-Host "err: build frontend fail" -ForegroundColor Red
    exit 1
}

try{
    Write-Host "build backend..." -ForegroundColor Yellow
    ./bbuild.ps1
    Write-Host "build backend success." -ForegroundColor Green
} catch {
    Write-Host "err: build backend fail" -ForegroundColor Red
    exit 1
}

Write-Host "build success." -ForegroundColor Green