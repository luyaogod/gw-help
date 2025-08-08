# 进入 ./backend 目录
Set-Location -Path "./backend"

# 激活虚拟环境
try{
    Write-Host "active python venv..." -ForegroundColor Yellow
    .\venv\Scripts\activate
}
catch {
    Write-Host "err: active python venv fail" -ForegroundColor Red
    exit 1
}


# 执行 PyInstaller 打包
try{
    Write-Host "packaging python file..." -ForegroundColor Yellow
    pyinstaller --onefile --noconsole --add-data "src/f_dist;f_dist" src/main.py
}
catch {
    Write-Host "err: packaging python file fail" -ForegroundColor Red
    exit 1
}


# 返回原目录
Set-Location -Path ".."