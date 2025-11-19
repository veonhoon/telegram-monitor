# 🚀 START HERE - ADB Monitor Setup

Welcome! This guide will help you get started quickly.

## 📚 Documentation Index

Choose the guide that fits your needs:

### For First-Time Setup
- **[QUICK-START.md](QUICK-START.md)** ⭐ **START HERE!** - Simple step-by-step guide for complete beginners

### For Understanding the System
- **[BOT-SERVER-URL-EXPLAINED.md](BOT-SERVER-URL-EXPLAINED.md)** - What is the bot server URL? How do I find it?
- **[SETUP-DIAGRAM.md](SETUP-DIAGRAM.md)** - Visual diagrams showing how everything connects

### For GitHub and Deployment
- **[GITHUB-SETUP.md](GITHUB-SETUP.md)** - How to push to GitHub and deploy to multiple servers
- **[GITHUB-INSTRUCTIONS.txt](GITHUB-INSTRUCTIONS.txt)** - Quick copy-paste instructions for GitHub

### For Detailed Information
- **[README.md](README.md)** - Complete documentation with all features and options

---

## ⚡ Super Quick Start (30 seconds)

### 1. Get Bot Token
1. Open Telegram
2. Message [@BotFather](https://t.me/botfather)
3. Type `/newbot` and follow prompts
4. Copy the token

### 2. Setup Bot Server (Main Computer - Do Once)
```
Double-click: start-bot-server.bat
Paste your token
Press Enter
```

### 3. Setup Agents (Each Device Server)
```
Double-click: deploy.bat
Enter server ID (e.g., server1)
Enter server name (e.g., Production Server 1)
Enter bot server URL (e.g., http://192.168.1.100:3001)
Press Enter
```

### 4. Configure via Telegram
```
/setdevices server1
device1
device2
device3
```

### 5. Check Status
```
/status
```

**Done!** 🎉

---

## 🤔 Common Questions

### Q: What is the Bot Server URL?
**A:** It's the address of your main server.

To find it:
1. On bot server, open Command Prompt
2. Type: `ipconfig`
3. Find IPv4 Address (e.g., `192.168.1.100`)
4. Your URL is: `http://192.168.1.100:3001`

**Read more:** [BOT-SERVER-URL-EXPLAINED.md](BOT-SERVER-URL-EXPLAINED.md)

---

### Q: How do I deploy to multiple servers?
**A:** Use GitHub!

1. Push this folder to GitHub (use GitHub Desktop)
2. On each server: `git clone` your repository
3. Run `deploy.bat` on each server

**Read more:** [GITHUB-SETUP.md](GITHUB-SETUP.md)

---

### Q: Do I need to manually edit .env files?
**A:** **NO!** Just run the `.bat` files and answer the prompts. Everything is created automatically.

---

### Q: What files do I need on each server?

**Bot Server (setup once):**
- `bot-server.js`
- `package.json`
- `start-bot-server.bat`

**Agent (setup on each device server):**
- `server-agent.js`
- `package.json`
- `deploy.bat`

**Easiest way:** Clone the whole GitHub repo on each server!

---

## 📋 Setup Checklist

```
☐ 1. Get Telegram bot token from @BotFather
☐ 2. Run start-bot-server.bat on main server
☐ 3. Note the bot server URL (e.g., http://192.168.1.100:3001)
☐ 4. Run deploy.bat on device server 1
☐ 5. Run deploy.bat on device server 2
☐ 6. Run deploy.bat on device server 3 (repeat as needed)
☐ 7. Upload device lists via Telegram (/setdevices)
☐ 8. Test with /status
☐ 9. Celebrate! 🎉
```

---

## 🆘 Need Help?

1. **Can't find bot server URL?** → [BOT-SERVER-URL-EXPLAINED.md](BOT-SERVER-URL-EXPLAINED.md)
2. **Don't know how to use GitHub?** → [GITHUB-SETUP.md](GITHUB-SETUP.md)
3. **Want visual diagrams?** → [SETUP-DIAGRAM.md](SETUP-DIAGRAM.md)
4. **Need step-by-step guide?** → [QUICK-START.md](QUICK-START.md)
5. **Want all the details?** → [README.md](README.md)

---

## 🎯 What This System Does

```
┌─────────────┐
│  Telegram   │ ← You send commands from your phone
│   (You)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Bot Server  │ ← Main server (setup once)
│  (Main PC)  │
└──────┬──────┘
       │
       ├───────────┬───────────┐
       ▼           ▼           ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │Agent 1 │ │Agent 2 │ │Agent 3 │ ← Device servers
   └───┬────┘ └───┬────┘ └───┬────┘
       │          │          │
       ▼          ▼          ▼
   [Devices]  [Devices]  [Devices] ← Your ADB devices
```

**Result:** Monitor all your ADB devices across all servers from Telegram!

---

## 💡 Pro Tips

1. **Use GitHub** to easily deploy to multiple servers
2. **Write down your bot server URL** - you'll need it for each agent
3. **Use descriptive Server IDs** - e.g., "prod-1", "test-lab", "office-main"
4. **Set up port forwarding** if bot server is behind a router (for remote agents)
5. **Run as a service** for automatic startup (see README.md)

---

## 🚀 Ready to Start?

**Read Next:** [QUICK-START.md](QUICK-START.md)

Or just double-click `setup.bat` and follow the wizard!

---

**Questions? Check the other guides above!**
