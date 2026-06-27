@echo off
setlocal

cd /d "%~dp0frontend"

if not exist node_modules (
  echo Installing frontend dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Frontend dependency install failed.
    pause
    exit /b 1
  )
)

echo Starting EasyLap frontend...
call npm.cmd run dev

if errorlevel 1 (
  echo Frontend stopped with an error.
  pause
)
