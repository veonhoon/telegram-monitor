# System Architecture Diagram

## How Everything Connects

```
┌─────────────────────────────────────────────────────────────────┐
│                         TELEGRAM                                │
│                     (Your Phone/Desktop)                        │
│                                                                 │
│  Commands: /status, /servers, /setdevices                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Internet
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BOT SERVER                                   │
│                 (Main Server - Run Once)                        │
│                                                                 │
│  File: bot-server.js                                            │
│  Setup: start-bot-server.bat                                    │
│  URL: http://192.168.1.100:3001                                 │
│                                                                 │
│  • Receives Telegram commands from you                          │
│  • Receives status updates from agents                          │
│  • Manages device lists                                         │
│  • Sends alerts                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Local Network
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  AGENT 1    │  │  AGENT 2    │  │  AGENT 3    │
│  (Server 1) │  │  (Server 2) │  │  (Server 3) │
│             │  │             │  │             │
│ server-     │  │ server-     │  │ server-     │
│ agent.js    │  │ agent.js    │  │ agent.js    │
│             │  │             │  │             │
│ deploy.bat  │  │ deploy.bat  │  │ deploy.bat  │
│             │  │             │  │             │
│ ID: server1 │  │ ID: server2 │  │ ID: server3 │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       │ ADB            │ ADB            │ ADB
       │                │                │
       ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   DEVICES   │  │   DEVICES   │  │   DEVICES   │
│             │  │             │  │             │
│ • Device 1  │  │ • Device 2  │  │ • Device 5  │
│ • Device 3  │  │ • Device 4  │  │ • Device 6  │
│ • Device 7  │  │ • Device 8  │  │ • Device 9  │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## Setup Flow

```
Step 1: Get Bot Token
┌─────────────────────┐
│   @BotFather        │
│   (Telegram)        │
│                     │
│   /newbot           │
│   → Get Token       │
└─────────────────────┘
          │
          ▼
Step 2: Setup Bot Server (ONCE)
┌─────────────────────┐
│  Main Server        │
│                     │
│  start-bot-         │
│  server.bat         │
│                     │
│  Enter Token        │─┐
│  Enter Port (3001)  │ │ Creates .env
└─────────────────────┘ │ Installs deps
          │             │ Starts server
          │◄────────────┘
          ▼
     Bot Running!
     (Get URL: http://YOUR_IP:3001)
          │
          ▼
Step 3: Deploy Agents (EACH SERVER)
┌─────────────────────┐
│  Device Server 1    │
│                     │
│  deploy.bat         │
│                     │
│  Enter Server ID    │─┐
│  Enter Name         │ │ Creates .env
│  Enter Bot URL      │ │ Installs deps
│  Enter Interval     │ │ Starts agent
└─────────────────────┘ │
          │◄────────────┘
          ▼
     Agent Running!
     (Monitoring devices)
          │
          ▼
Step 4: Upload Device Lists (TELEGRAM)
┌─────────────────────┐
│  Telegram App       │
│                     │
│  /setdevices        │
│  server1            │
│  device1            │
│  device2            │
│  device3            │
└─────────────────────┘
          │
          ▼
     System Complete!
     /status to view all
```

---

## Data Flow

### When Agent Sends Update

```
AGENT (Server 1)
   │
   │ 1. Runs: adb devices
   │
   ├─► Gets device list:
   │   • 192.168.1.101:5555 → device
   │   • 192.168.1.103:5555 → offline
   │   • 192.168.1.105:5555 → device
   │
   │ 2. Sends HTTP POST to bot server
   │
   ▼
BOT SERVER
   │
   │ 3. Receives update
   │    {
   │      serverId: "server1",
   │      devices: [...],
   │      timestamp: ...
   │    }
   │
   │ 4. Stores in memory
   │
   └─► Ready for /status command
```

### When You Check Status

```
YOU (Telegram)
   │
   │ Send: /status
   │
   ▼
BOT SERVER
   │
   │ 1. Checks all stored server data
   │ 2. Compares with expected device lists
   │ 3. Generates status report
   │
   ▼
TELEGRAM
   │
   └─► Shows you:
       📊 ADB Device Status Report

       🖥️ Server 1
       ✅ 192.168.1.101:5555: ONLINE
       🔴 192.168.1.103:5555: OFFLINE
       ✅ 192.168.1.105:5555: ONLINE
```

---

## Network Example

### Example Setup:

```
Network: 192.168.1.0/24

Main Server (Bot):     192.168.1.100
Device Server 1:       192.168.1.101
Device Server 2:       192.168.1.102
Device Server 3:       192.168.1.103
```

### Bot Server Configuration:
```
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
PORT=3000
```

### Agent 1 Configuration:
```
SERVER_ID=server1
SERVER_NAME=Production Server 1
BOT_SERVER_URL=http://192.168.1.100:3001
UPDATE_INTERVAL=10000
```

### Agent 2 Configuration:
```
SERVER_ID=server2
SERVER_NAME=Production Server 2
BOT_SERVER_URL=http://192.168.1.100:3001
UPDATE_INTERVAL=10000
```

### Agent 3 Configuration:
```
SERVER_ID=server3
SERVER_NAME=Test Lab
BOT_SERVER_URL=http://192.168.1.100:3001
UPDATE_INTERVAL=10000
```

**Notice:** All agents point to the same Bot Server URL!

---

## File Distribution

### What Goes Where?

#### Bot Server (Main Server) - Setup ONCE
```
📁 /path/to/telegram-bot/
├── bot-server.js ✓
├── package.json ✓
├── start-bot-server.bat ✓
├── .env (auto-created)
├── data.json (auto-created)
└── node_modules/ (auto-installed)
```

#### Agent (Each Device Server) - Deploy MULTIPLE TIMES
```
📁 /path/to/telegram-bot/
├── server-agent.js ✓
├── package.json ✓
├── deploy.bat ✓
├── .env (auto-created)
└── node_modules/ (auto-installed)
```

**Pro Tip:** Clone from GitHub on each server so you get all files!

---

## Common Setups

### Setup A: All servers in same office (Local Network)

```
Office Network: 192.168.1.0/24

Bot Server: 192.168.1.100:3001
  └── All agents connect to: http://192.168.1.100:3001
```

### Setup B: Servers in different locations (VPN/Cloud)

```
Bot Server: Cloud VM with public IP 123.45.67.89:3001
  └── All agents connect to: http://123.45.67.89:3001

⚠️ Remember to open port 3001 in firewall!
```

### Setup C: Mixed (Some local, some remote)

```
Bot Server: 192.168.1.100:3001 (behind router)
  │
  ├── Local agents: http://192.168.1.100:3001
  │
  └── Remote agents: http://PUBLIC_IP:3001
      (requires port forwarding)
```

---

## Visual Checklist

```
Setup Progress:

☐ 1. Get Telegram bot token from @BotFather
    └─► Token: __________________

☐ 2. Setup bot server
    └─► URL: http://_______:3001

☐ 3. Deploy agent to server 1
    └─► ID: __________

☐ 4. Deploy agent to server 2
    └─► ID: __________

☐ 5. Deploy agent to server 3
    └─► ID: __________

☐ 6. Upload device lists via Telegram
    /setdevices server1
    device1
    device2

☐ 7. Test with /status

☐ 8. Done! 🎉
```
