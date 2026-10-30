@echo off
cd /d %~dp0..
call npx tsx scripts/clock-out-and-shutdown.mts
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred. PC shutdown was canceled.
    pause
)
