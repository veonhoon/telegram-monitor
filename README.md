# ADB Monitor Telegram Bot

A Telegram bot system that monitors ADB device statuses across multiple servers. Track device connectivity, authorization status, and get real-time alerts for offline or unauthorized devices.

## 🚀 NEW USER? READ THIS FIRST!

### **👉 [START-HERE.md](START-HERE.md) 👈**

**Or just double-click `setup.bat` and follow the prompts!**

---

## 📚 Documentation

**New here? Start with these guides:**

1. **[START-HERE.md](START-HERE.md)** ⭐ - Overview and quick links to all guides
2. **[QUICK-START.md](QUICK-START.md)** - Simple step-by-step setup guide
3. **[GROUP-CHAT-SUPPORT.md](GROUP-CHAT-SUPPORT.md)** - Using the bot in Telegram groups 👥
4. **[BOT-SERVER-URL-EXPLAINED.md](BOT-SERVER-URL-EXPLAINED.md)** - Understanding the bot server URL
5. **[GITHUB-SETUP.md](GITHUB-SETUP.md)** - Push to GitHub and deploy to multiple servers
6. **[SETUP-DIAGRAM.md](SETUP-DIAGRAM.md)** - Visual diagrams and architecture

---

## Features

- ✅ Monitor ADB devices across unlimited servers
- ✅ Real-time status updates via Telegram
- ✅ **Full Telegram group chat support** - Add to groups for team monitoring! 👥
- ✅ Track device status: Online, Offline, Unauthorized, Missing
- ✅ Upload and manage device lists per server
- ✅ Automatic alerts every 5 minutes for devices needing attention
- ✅ **100% interactive setup - no manual .env editing required!**
- ✅ Simple deployment with batch files
- ✅ Support for multiple users and groups simultaneously

## Architecture

The system consists of two components:

1. **Bot Server** (`bot-server.js`) - Main Telegram bot that receives status updates and manages device lists
2. **Server Agent** (`server-agent.js`) - Runs on each device server to monitor ADB devices and report status

## Prerequisites

- Node.js (v14 or higher)
- Android SDK Platform Tools (ADB)
- Telegram Bot Token (get from [@BotFather](https://t.me/botfather))

## Interactive Setup (Recommended)

### 1. Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow instructions
3. Copy the bot token you receive

### 2. Setup Bot Server (Main Server)

**Simply double-click `start-bot-server.bat` and answer the prompts:**

```
> start-bot-server.bat

1. Telegram Bot Token (from @BotFather): <paste your token>
2. Server Port (default: 3001): <press Enter>

[Configuration saved automatically!]
[Bot server starts...]
```

**Note:** The script shows you the URL to use for agents. Write it down!
Example: `http://192.168.1.100:3001`

**Don't know what the Bot Server URL is?** Read [BOT-SERVER-URL-EXPLAINED.md](BOT-SERVER-URL-EXPLAINED.md)

### 3. Deploy Agent to Device Servers

**Simply double-click `deploy.bat` on each device server and answer the prompts:**

```
> deploy.bat

1. Server ID: server1
2. Server Name: Production Server 1
3. Bot Server URL: http://192.168.1.100:3001
4. Update Interval in seconds: 10

[Shows connected ADB devices]
[Configuration saved automatically!]
[Dependencies installed!]
[Agent starts monitoring...]
```

Repeat for each server with different Server IDs (server1, server2, server3, etc.)

## Telegram Bot Commands

### `/start`
Initialize the bot and register your chat for notifications

### `/status`
Get current status of all servers and devices

Example output:
```
📊 ADB Device Status Report

🖥️ Server 1
Last update: 5s ago
✅ 192.168.1.101:5555: ONLINE
✅ 192.168.1.103:5555: ONLINE
✅ 192.168.1.105:5555: ONLINE
✅ 192.168.1.107:5555: ONLINE

🖥️ Server 2
Last update: 3s ago
✅ 192.168.1.102:5555: ONLINE
🔴 192.168.1.104:5555: OFFLINE
✅ 192.168.1.106:5555: ONLINE
```

### `/servers`
List all registered servers

### `/upload`
Get instructions for uploading device lists

### `/setdevices [SERVER_ID]`
Set the expected device list for a server

Example:
```
/setdevices server1
192.168.1.101:5555
192.168.1.103:5555
192.168.1.105:5555
192.168.1.107:5555
```

### `/help`
Show help message with all commands

## Device Status Icons

- ✅ **ONLINE** - Device connected and authorized
- 🔴 **OFFLINE** - Device detected but offline
- 🔒 **UNAUTHORIZED** - Device needs authorization (check device for prompt)
- ❌ **MISSING** - Expected device not detected
- ⚡ **UNEXPECTED** - Device detected but not in expected list

## Configuration

### Bot Server (.env)
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
PORT=3000
```

### Agent (.env)
```
SERVER_ID=server1
SERVER_NAME=Production Server 1
BOT_SERVER_URL=http://192.168.1.100:3001
UPDATE_INTERVAL=10000
```

## Automatic Alerts

The bot automatically sends alerts every 5 minutes if any devices are:
- Offline
- Unauthorized
- Missing

## File Structure

```
telegram-bot/
├── bot-server.js          # Main Telegram bot server
├── server-agent.js        # Agent for device servers
├── package.json           # Dependencies
├── deploy.bat             # Agent deployment script
├── start-bot-server.bat   # Bot server startup script
├── .env.example           # Example configuration
├── .env                   # Your configuration (create this)
├── data.json              # Persisted data (auto-created)
└── README.md              # This file
```

## Example Multi-Server Setup

### Server 1 Configuration
```
SERVER_ID=server1
SERVER_NAME=Production Server 1
```
Expected devices: 1, 3, 5, 7

### Server 2 Configuration
```
SERVER_ID=server2
SERVER_NAME=Production Server 2
```
Expected devices: 2, 4, 6

Upload device lists via Telegram:
```
/setdevices server1
192.168.1.101:5555
192.168.1.103:5555
192.168.1.105:5555
192.168.1.107:5555

/setdevices server2
192.168.1.102:5555
192.168.1.104:5555
192.168.1.106:5555
```

## Troubleshooting

### Agent can't connect to bot server
- Verify bot server is running
- Check firewall settings on bot server (allow port 3001)
- Verify BOT_SERVER_URL in agent's .env file
- Ensure bot server is accessible from agent servers

### ADB devices not showing
- Verify ADB is installed and in PATH: `adb devices`
- Check USB debugging is enabled on devices
- For network ADB: ensure devices are connected: `adb connect IP:5555`

### Bot not responding
- Verify TELEGRAM_BOT_TOKEN is correct
- Check bot server console for errors
- Ensure internet connection is working

### Devices showing as UNAUTHORIZED
- Check the physical device for authorization prompt
- Tap "Allow" on the device
- For persistent authorization, check "Always allow from this computer"

## Running as a Service

### Windows (using NSSM)
1. Download NSSM from https://nssm.cc/
2. Install bot server as service:
   ```
   nssm install ADBBotServer "C:\Program Files\nodejs\node.exe" "C:\path\to\bot-server.js"
   nssm start ADBBotServer
   ```
3. Install agent as service:
   ```
   nssm install ADBAgent "C:\Program Files\nodejs\node.exe" "C:\path\to\server-agent.js"
   nssm start ADBAgent
   ```

### Linux (using systemd)
Create service file `/etc/systemd/system/adb-agent.service`:
```ini
[Unit]
Description=ADB Monitor Agent
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/telegram-bot
ExecStart=/usr/bin/node server-agent.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable adb-agent
sudo systemctl start adb-agent
```

## License

MIT
