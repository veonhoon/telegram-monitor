# Quick Start Guide - ADB Monitor

## Super Easy Setup (No Manual Configuration Needed!)

### Step 1: Get Your Telegram Bot Token

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow the prompts to create your bot
5. **Copy the bot token** you receive (you'll need this in a moment)

---

### Step 2: Setup the Main Bot Server (Do This Once)

On your main server:

1. **Double-click** `start-bot-server.bat`
2. The script will ask you:
   - **Bot Token**: Paste the token from BotFather
   - **Port**: Press Enter to use default (3001)
3. That's it! The bot server is now running.

**Write down the server URL** - you'll need it for agents.
Example: `http://192.168.1.100:3001`

---

### Step 3: Deploy Agents to Device Servers

On each server with ADB devices:

1. Copy these 3 files to the server:
   - `deploy.bat`
   - `server-agent.js`
   - `package.json`

2. **Double-click** `deploy.bat`

3. The script will ask you:
   - **Server ID**: Give it a unique name (e.g., `server1`, `server2`, `prod-1`)
   - **Server Name**: Friendly name (e.g., `Production Server 1`)
   - **Bot Server URL**: The URL from Step 2 (e.g., `http://192.168.1.100:3001`)
   - **Update Interval**: Press Enter to use default (10 seconds)

4. The script will show you connected ADB devices and start monitoring!

---

### Step 4: Configure Device Lists via Telegram

1. Open Telegram and find your bot
2. Send `/start` to initialize
3. Upload your device list for each server:

```
/setdevices server1
192.168.1.101:5555
192.168.1.103:5555
192.168.1.105:5555
192.168.1.107:5555
```

```
/setdevices server2
192.168.1.102:5555
192.168.1.104:5555
192.168.1.106:5555
```

4. Check status anytime with `/status`

---

## That's It!

You now have a fully functional ADB monitoring system across all your servers!

### Telegram Commands Quick Reference

- `/status` - View all servers and device statuses
- `/servers` - List all registered servers
- `/setdevices [server_id]` - Upload device list
- `/help` - Show help

---

## Example Multi-Server Setup

### Server 1
```
Server ID: server1
Server Name: Production Server 1
Devices: 1, 3, 5, 7
```

### Server 2
```
Server ID: server2
Server Name: Production Server 2
Devices: 2, 4, 6
```

### Server 3
```
Server ID: testing
Server Name: Test Lab
Devices: test-device-1, test-device-2
```

Each server will independently monitor its devices and report to the central Telegram bot!

---

## Troubleshooting

**Can't connect to bot server?**
- Make sure the bot server is running
- Check firewall settings (allow port 3001)
- Verify the bot server URL is correct

**No devices showing?**
- Run `adb devices` manually to verify ADB is working
- Make sure USB debugging is enabled on devices
- For network ADB: `adb connect IP:5555`

**Bot not responding?**
- Verify bot token is correct
- Check internet connection
- Look at the bot server console for errors
