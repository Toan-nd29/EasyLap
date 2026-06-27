@echo off
setlocal

cd /d "%~dp0backend"

if not exist node_modules (
  echo Installing backend dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Backend dependency install failed.
    pause
    exit /b 1
  )
)

echo Starting EasyLap backend...
call npm.cmd run dev

if errorlevel 1 (
  echo Backend stopped with an error.
  pause
)
