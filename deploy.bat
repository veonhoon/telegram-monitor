@echo off
REM ADB Monitor Agent Deployment Script
REM This script installs and runs the ADB monitoring agent on a server

title ADB Monitor Agent Setup

echo ========================================
echo   ADB Monitor Agent Deployment
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if ADB is installed
where adb >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: ADB is not installed or not in PATH!
    echo Please install Android SDK Platform Tools
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.
echo [OK] ADB found:
adb version | findstr /r "Version"
echo.

REM Show current ADB devices
echo ========================================
echo   Checking ADB Devices
echo ========================================
echo.
echo Current ADB devices connected:
adb devices
echo.

REM Always prompt for configuration (allows reconfiguration)
echo ========================================
echo   Configuration Setup
echo ========================================
echo.

if exist ".env" (
    echo Found existing configuration. You can update it now.
    echo.
    set /p RECONFIGURE="Do you want to reconfigure? (Y/N, default: N): "
    if /i not "%RECONFIGURE%"=="Y" (
        echo.
        echo Using existing configuration...
        echo.
        goto :install_deps
    )
    echo.
)

echo Please answer the following questions:
echo (Press Enter to skip and use default values where applicable)
echo.

REM Prompt for Server ID
:prompt_server_id
set /p SERVER_ID="1. Server ID (unique identifier, e.g., server1, server2): "
if "%SERVER_ID%"=="" (
    echo    ERROR: Server ID is required!
    goto :prompt_server_id
)
echo    [OK] Server ID: %SERVER_ID%
echo.

REM Prompt for Server Name
set /p SERVER_NAME="2. Server Name (friendly name, e.g., Production Server 1): "
if "%SERVER_NAME%"=="" set SERVER_NAME=%SERVER_ID%
echo    [OK] Server Name: %SERVER_NAME%
echo.

REM Prompt for Bot Server URL
:prompt_bot_url
set /p BOT_SERVER_URL="3. Bot Server URL (e.g., http://192.168.1.100:3001): "
if "%BOT_SERVER_URL%"=="" (
    echo    ERROR: Bot Server URL is required!
    goto :prompt_bot_url
)
echo    [OK] Bot Server URL: %BOT_SERVER_URL%
echo.

REM Prompt for Update Interval
set /p UPDATE_INTERVAL="4. Update Interval in seconds (default: 10): "
if "%UPDATE_INTERVAL%"=="" (
    set UPDATE_INTERVAL=10
)
set /a UPDATE_INTERVAL_MS=%UPDATE_INTERVAL%*1000
echo    [OK] Update Interval: %UPDATE_INTERVAL% seconds
echo.

REM Create .env file
(
    echo SERVER_ID=%SERVER_ID%
    echo SERVER_NAME=%SERVER_NAME%
    echo BOT_SERVER_URL=%BOT_SERVER_URL%
    echo UPDATE_INTERVAL=%UPDATE_INTERVAL_MS%
) > .env

echo ========================================
echo   Configuration Saved
echo ========================================
echo.
type .env
echo.

:install_deps

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.

REM Ask if user wants to start the agent now
set /p START_NOW="Start the agent now? (Y/N): "
if /i "%START_NOW%"=="Y" (
    echo.
    echo Starting ADB Monitor Agent...
    echo Press Ctrl+C to stop the agent
    echo.
    node server-agent.js
) else (
    echo.
    echo To start the agent later, run: node server-agent.js
    echo Or run: npm run agent
    echo.
)

pause
