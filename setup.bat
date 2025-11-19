@echo off
REM Universal Setup Script for ADB Monitor
REM This script helps you choose between Bot Server or Agent setup

title ADB Monitor - Setup Wizard

:menu
cls
echo ========================================
echo   ADB Monitor Setup Wizard
echo ========================================
echo.
echo What would you like to set up?
echo.
echo 1. Bot Server (Main Telegram bot - set up once)
echo 2. Agent (Device monitoring agent - deploy to each server)
echo 3. Exit
echo.
set /p CHOICE="Enter your choice (1, 2, or 3): "

if "%CHOICE%"=="1" goto :bot_server
if "%CHOICE%"=="2" goto :agent
if "%CHOICE%"=="3" goto :exit
echo.
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto :menu

:bot_server
cls
echo ========================================
echo   Bot Server Setup
echo ========================================
echo.
echo Starting Bot Server setup...
echo This is the MAIN server that runs the Telegram bot.
echo You only need to do this ONCE.
echo.
pause
call start-bot-server.bat
goto :end

:agent
cls
echo ========================================
echo   Agent Setup
echo ========================================
echo.
echo Starting Agent setup...
echo This should be run on each server with ADB devices.
echo.
pause
call deploy.bat
goto :end

:exit
cls
echo.
echo Exiting setup wizard...
echo.
timeout /t 1 >nul
exit /b 0

:end
echo.
echo.
echo ========================================
echo   Setup Complete
echo ========================================
echo.
set /p RETURN="Return to main menu? (Y/N): "
if /i "%RETURN%"=="Y" goto :menu
exit /b 0
