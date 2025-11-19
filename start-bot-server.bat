@echo off
REM Start the Telegram Bot Server

title ADB Monitor - Bot Server Setup

echo ========================================
echo   Telegram Bot Server Setup
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

echo [OK] Node.js found:
node --version
echo.

REM Check if .env file exists and prompt for configuration
if exist ".env" (
    echo Found existing configuration.
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

echo ========================================
echo   Bot Server Configuration
echo ========================================
echo.
echo This is the MAIN server that hosts the Telegram bot.
echo You only need to set this up ONCE.
echo.
echo Please answer the following questions:
echo.

REM Prompt for Telegram Bot Token
:prompt_bot_token
set /p TELEGRAM_BOT_TOKEN="1. Telegram Bot Token (from @BotFather): "
if "%TELEGRAM_BOT_TOKEN%"=="" (
    echo    ERROR: Bot token is required!
    echo    Get your token from https://t.me/botfather
    goto :prompt_bot_token
)
echo    [OK] Bot token saved
echo.

REM Prompt for Port
set /p PORT="2. Server Port (default: 3001): "
if "%PORT%"=="" set PORT=3001
echo    [OK] Port: %PORT%
echo.

REM Create .env file
(
    echo TELEGRAM_BOT_TOKEN=%TELEGRAM_BOT_TOKEN%
    echo PORT=%PORT%
) > .env

echo ========================================
echo   Configuration Saved
echo ========================================
echo.
echo Bot token: %TELEGRAM_BOT_TOKEN%
echo Port: %PORT%
echo.
echo IMPORTANT: Make sure agents can access this server at:
echo http://YOUR_SERVER_IP:%PORT%
echo.
echo You will need this URL when setting up agents on device servers.
echo.

:install_deps

REM Check if node_modules exists
if not exist "node_modules" (
    echo ========================================
    echo   Installing Dependencies
    echo ========================================
    echo.
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
    echo.
)

echo ========================================
echo   Starting Bot Server
echo ========================================
echo.
echo The bot server is now starting...
echo.
echo Next steps:
echo 1. Open Telegram and search for your bot
echo 2. Send /start to initialize the bot
echo 3. Use /help to see available commands
echo 4. Deploy agents to your device servers using deploy.bat
echo.
echo Press Ctrl+C to stop the server
echo.

node bot-server.js

pause
