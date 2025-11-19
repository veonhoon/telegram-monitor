# Group Chat Support

## ✅ Yes! The Bot Supports Group Chats!

You can add the ADB Monitor Bot to **any Telegram group** and everyone in the group will be able to:
- ✅ See device status updates
- ✅ Receive automatic alerts for offline devices
- ✅ Run commands like `/status`, `/servers`, etc.
- ✅ Upload device lists

---

## How to Use in a Group

### 1. Add Bot to Your Group

1. Open your Telegram group
2. Click the group name → **Add Members**
3. Search for your bot by username
4. Add the bot to the group

### 2. Subscribe the Group

In the group chat, send:
```
/start
```

The bot will respond:
```
✅ This group is now subscribed to ADB Monitor notifications!
```

### 3. Use Commands

Anyone in the group can now use bot commands:

```
/status         - Check device statuses
/servers        - List all servers
/setdevices     - Upload device lists
/help           - Show help
/stop           - Unsubscribe group from alerts
```

---

## Multiple Groups & Users

The bot supports **unlimited** groups and individual users simultaneously!

### Example Setup:

- **User 1** (individual chat) → Subscribed
- **User 2** (individual chat) → Subscribed
- **Tech Team Group** → Subscribed
- **Management Group** → Subscribed
- **Operations Group** → Subscribed

All of them will receive:
- Responses to commands they run
- Automatic alerts every 5 minutes for offline devices

---

## Commands

### `/start`
Subscribe this chat (individual or group) to notifications

### `/status`
Check current status of all servers and devices
```
📊 ADB Device Status Report

🖥️ Production Server 1
Last update: 5s ago
✅ 192.168.1.101:5555: ONLINE
🔴 192.168.1.103:5555: OFFLINE
✅ 192.168.1.105:5555: ONLINE
```

### `/servers`
List all registered servers and their last update time

### `/setdevices [SERVER_ID]`
Upload device list for a server
```
/setdevices server1
192.168.1.101:5555
192.168.1.103:5555
192.168.1.105:5555
```

### `/stop`
Unsubscribe this chat from automatic notifications

**Note:** Commands still work, but you won't receive the 5-minute automatic alerts

### `/help`
Show help message with all commands

---

## Automatic Alerts

Every **5 minutes**, the bot checks all devices and sends alerts to **ALL subscribed chats** if any devices are:
- ❌ Missing
- 🔴 Offline
- 🔒 Unauthorized

### Example Alert:
```
⚠️ Alert: Devices Need Attention

• Production Server 1: 192.168.1.103:5555 is offline
• Production Server 2: 192.168.1.106:5555 is MISSING
```

This alert goes to:
- All individual users who sent `/start`
- All groups where `/start` was sent

---

## Privacy & Permissions

### What the Bot Needs:
- **Read Messages**: To respond to commands
- **Send Messages**: To send status updates and alerts

### What the Bot Does NOT Do:
- ❌ Does not read non-command messages
- ❌ Does not store chat history
- ❌ Does not share data between groups

Each group/user is independent!

---

## Use Cases

### Use Case 1: Team Monitoring
**Setup:**
- Add bot to "Tech Team" group
- All team members can check status with `/status`
- All team members get alerts when devices go offline

**Benefit:** Everyone stays informed without individual setup

---

### Use Case 2: Multiple Teams
**Setup:**
- Tech Team Group → Gets all alerts
- Management Group → Gets all alerts
- NOC Group → Gets all alerts

**Benefit:** Different teams can monitor the same infrastructure

---

### Use Case 3: Personal + Team
**Setup:**
- Your personal chat → Subscribed (get alerts on phone)
- Work group → Subscribed (team sees status)

**Benefit:** You get personal notifications + team collaboration

---

## Managing Subscriptions

### See Who's Subscribed?
The bot stores subscriptions in `data.json`:
```json
{
  "subscribedChats": [
    123456789,    // Individual user
    -987654321,   // Group chat (negative ID)
    -876543210    // Another group
  ]
}
```

### Unsubscribe a Chat
In the chat (individual or group):
```
/stop
```

### Clear All Subscriptions
Stop the bot server and delete `data.json`

---

## FAQ

### Q: Can I use the bot in multiple groups?
**A:** Yes! Add it to as many groups as you want. Each group sends `/start` to subscribe.

---

### Q: Will all group members get notifications?
**A:** Yes! When the group is subscribed, all members see the bot's messages (alerts and command responses).

---

### Q: Can I have some groups subscribed and others not?
**A:** Yes! Only groups where someone sent `/start` will receive alerts.

---

### Q: What if I remove the bot from a group?
**A:** The subscription remains in `data.json` but the bot won't be able to send messages. It will auto-clean itself when it detects the chat is gone.

---

### Q: Can different groups have different device lists?
**A:** No - device lists are global. All subscribed chats see the same servers and devices. However, you can run multiple bot instances with different tokens for completely separate monitoring.

---

### Q: Can I limit who can run commands in a group?
**A:** Telegram groups have admin controls. You can:
1. Set the group so only admins can send messages
2. Use Telegram's "Restrict Members" feature
3. Make the bot an admin and use group permissions

The bot itself doesn't restrict who can run commands.

---

## Example Workflow

### Initial Setup:
1. Create bot with @BotFather
2. Setup bot server with `start-bot-server.bat`
3. Deploy agents to device servers with `deploy.bat`

### Add to Group:
1. Create Telegram group: "Device Monitoring"
2. Add team members
3. Add the bot
4. Someone sends `/start` in the group
5. Upload device lists with `/setdevices`

### Daily Use:
- Anyone checks status: `/status`
- Bot sends alerts every 5 minutes to the group
- Team discusses issues in the group
- New member joins? They automatically see updates

---

## Tips

1. **Pin the welcome message** - Pin the bot's `/start` response so new members know it's there
2. **Use group topics** - In supergroups, create a "Monitoring" topic for bot messages
3. **Mute if needed** - Telegram lets you mute specific chats while still showing notifications
4. **Multiple bots** - Run separate bot instances for prod/staging/dev environments

---

## Technical Details

- **Subscription Storage**: `data.json` file
- **Alert Interval**: 5 minutes (configurable in code)
- **Group Detection**: Automatic via `msg.chat.type`
- **Error Handling**: Auto-removes chats that are no longer accessible
- **Migration**: Old single-user setups automatically migrate to multi-chat

---

## Ready to Use!

Just add the bot to your group and send `/start` - it's that simple! 🎉
