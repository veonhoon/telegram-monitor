# Understanding the Bot Server URL

## What is the Bot Server URL?

The **Bot Server URL** is the web address where your main Telegram bot server is running and listening for status updates from your device servers.

Think of it as the "home base" where all your device servers report to.

---

## How to Get Your Bot Server URL

### The URL Format:
```
http://YOUR_SERVER_IP:PORT
```

### Example URLs:
- `http://192.168.1.100:3001` (local network)
- `http://10.0.0.50:3001` (local network)
- `http://your-domain.com:3001` (if you have a domain)
- `http://123.45.67.89:3001` (public IP)

---

## Step-by-Step: Finding Your Bot Server URL

### Step 1: Find the IP Address of Your Bot Server

**On Windows (where you run start-bot-server.bat):**

1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
4. Example output:
   ```
   Ethernet adapter Ethernet:
      IPv4 Address. . . . . . . . . . . : 192.168.1.100
   ```
5. Your IP is: `192.168.1.100`

**On Linux/Mac:**
```bash
hostname -I
# or
ip addr show
# or
ifconfig
```

### Step 2: Determine the Port

- By default, the bot server uses port **3001**
- If you changed it during setup, use that port instead

### Step 3: Build Your URL

Combine them:
```
http://192.168.1.100:3001
```

This is your **Bot Server URL**!

---

## Network Scenarios

### Scenario 1: All Servers on Same Local Network (Most Common)

**Setup:**
- Bot Server IP: `192.168.1.100`
- Device Server 1 IP: `192.168.1.101`
- Device Server 2 IP: `192.168.1.102`

**Bot Server URL for all agents:**
```
http://192.168.1.100:3001
```

All device servers can reach the bot server directly on the local network.

---

### Scenario 2: Servers on Different Networks (VPN/Cloud)

**Setup:**
- Bot Server: Cloud server with public IP `123.45.67.89`
- Device Servers: Various locations

**Bot Server URL:**
```
http://123.45.67.89:3001
```

⚠️ **Important:** Make sure port 3001 is open in your firewall!

---

### Scenario 3: Using a Domain Name

If you have a domain pointing to your bot server:

**Bot Server URL:**
```
http://mycompany.com:3001
```

---

## Testing Your Bot Server URL

### From the Device Server, test if you can reach the bot server:

**Windows:**
```batch
curl http://192.168.1.100:3001
```

**Linux/Mac:**
```bash
curl http://192.168.1.100:3001
```

You should get a response (even if it's an error, it means the server is reachable).

---

## Common Issues and Solutions

### ❌ Problem: Agent can't connect to bot server

**Solution 1: Check Firewall**
- On the bot server, allow incoming connections on port 3001
- Windows Firewall: Add inbound rule for port 3001
- Linux: `sudo ufw allow 3001`

**Solution 2: Verify Bot Server is Running**
- Make sure `start-bot-server.bat` is running
- Check for errors in the console

**Solution 3: Verify IP Address**
- Make sure you're using the correct IP
- Try `ping 192.168.1.100` from device server

**Solution 4: Check Port**
- Make sure the port matches what the bot server is using
- Default is 3001

---

## Example Setup Walkthrough

### You have 3 machines:

1. **Main Server (Bot Server)**
   - IP: `192.168.1.100`
   - Runs: `start-bot-server.bat`
   - Port: `3001`

2. **Device Server 1**
   - IP: `192.168.1.101`
   - Runs: `deploy.bat`
   - Needs to know: `http://192.168.1.100:3001`

3. **Device Server 2**
   - IP: `192.168.1.102`
   - Runs: `deploy.bat`
   - Needs to know: `http://192.168.1.100:3001`

### Setup Process:

**On Main Server (192.168.1.100):**
```
> start-bot-server.bat
1. Telegram Bot Token: <paste your token>
2. Server Port: 3001

Server is now running at http://192.168.1.100:3001
```

**On Device Server 1 (192.168.1.101):**
```
> deploy.bat
1. Server ID: server1
2. Server Name: Device Server 1
3. Bot Server URL: http://192.168.1.100:3001
4. Update Interval: 10

Agent connected to bot server!
```

**On Device Server 2 (192.168.1.102):**
```
> deploy.bat
1. Server ID: server2
2. Server Name: Device Server 2
3. Bot Server URL: http://192.168.1.100:3001
4. Update Interval: 10

Agent connected to bot server!
```

---

## Quick Reference Card

Print this and keep it handy:

```
┌─────────────────────────────────────────────┐
│  BOT SERVER URL QUICK REFERENCE             │
├─────────────────────────────────────────────┤
│                                             │
│  1. Find bot server IP:                     │
│     > ipconfig                              │
│     Look for IPv4 Address                   │
│                                             │
│  2. Check bot server port:                  │
│     Default: 3001                           │
│                                             │
│  3. Build URL:                              │
│     http://YOUR_IP:PORT                     │
│                                             │
│  Example:                                   │
│     http://192.168.1.100:3001               │
│                                             │
│  4. Test from device server:                │
│     > curl http://192.168.1.100:3001        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Pro Tips

1. **Use Static IP:** Set your bot server to use a static IP so it doesn't change
2. **Document It:** Write down your bot server URL somewhere safe
3. **Firewall Rules:** Configure firewall once, works for all agents
4. **VPN Option:** If servers are in different locations, consider VPN
5. **Port Forwarding:** If bot server is behind a router, set up port forwarding for port 3001

---

## Need Help?

If you're still confused about the URL:

1. Run `ipconfig` on your bot server
2. Look for the IPv4 Address (e.g., `192.168.1.100`)
3. The port is `3001` (unless you changed it)
4. Your URL is: `http://192.168.1.100:3001`

That's it! Use this URL when deploying agents.
