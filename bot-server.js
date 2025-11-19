const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const app = express();
app.use(express.json());

// Store server data and device lists
const servers = new Map();
const deviceLists = new Map();
let adminChatId = null;

// Load persisted data on startup
function loadData() {
    try {
        if (fs.existsSync('data.json')) {
            const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
            if (data.adminChatId) adminChatId = data.adminChatId;
            if (data.deviceLists) {
                Object.entries(data.deviceLists).forEach(([key, value]) => {
                    deviceLists.set(key, value);
                });
            }
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function saveData() {
    try {
        const data = {
            adminChatId,
            deviceLists: Object.fromEntries(deviceLists)
        };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// API endpoint for servers to register and send status updates
app.post('/api/status', (req, res) => {
    const { serverId, serverName, devices } = req.body;

    if (!serverId || !devices) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    servers.set(serverId, {
        name: serverName || serverId,
        devices: devices,
        lastUpdate: new Date()
    });

    console.log(`Received status update from ${serverName || serverId}`);
    res.json({ status: 'ok' });
});

// API endpoint to get expected device list for a server
app.get('/api/devices/:serverId', (req, res) => {
    const { serverId } = req.params;
    const devices = deviceLists.get(serverId) || [];
    res.json({ devices });
});

// Telegram bot commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    adminChatId = chatId;
    saveData();

    bot.sendMessage(chatId,
        'Welcome to ADB Monitor Bot!\n\n' +
        'Available commands:\n' +
        '/status - Check all servers and device statuses\n' +
        '/servers - List all registered servers\n' +
        '/upload - Upload device list for a server\n' +
        '/help - Show this help message'
    );
});

bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;

    if (servers.size === 0) {
        bot.sendMessage(chatId, 'No servers registered yet.');
        return;
    }

    let message = '📊 *ADB Device Status Report*\n\n';

    for (const [serverId, serverData] of servers.entries()) {
        const expectedDevices = deviceLists.get(serverId) || [];
        const timeSinceUpdate = Math.floor((new Date() - serverData.lastUpdate) / 1000);

        message += `🖥️ *${serverData.name}*\n`;
        message += `Last update: ${timeSinceUpdate}s ago\n`;

        if (expectedDevices.length === 0) {
            message += '⚠️ No device list configured\n';
        } else {
            const deviceMap = new Map(serverData.devices.map(d => [d.serial, d.status]));

            for (const serial of expectedDevices) {
                const status = deviceMap.get(serial);
                if (!status) {
                    message += `❌ ${serial}: MISSING\n`;
                } else if (status === 'device') {
                    message += `✅ ${serial}: ONLINE\n`;
                } else if (status === 'offline') {
                    message += `🔴 ${serial}: OFFLINE\n`;
                } else if (status === 'unauthorized') {
                    message += `🔒 ${serial}: UNAUTHORIZED\n`;
                } else {
                    message += `⚠️ ${serial}: ${status.toUpperCase()}\n`;
                }
            }

            // Show any unexpected devices
            for (const device of serverData.devices) {
                if (!expectedDevices.includes(device.serial)) {
                    message += `⚡ ${device.serial}: UNEXPECTED (${device.status})\n`;
                }
            }
        }

        message += '\n';
    }

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

bot.onText(/\/servers/, (msg) => {
    const chatId = msg.chat.id;

    if (servers.size === 0) {
        bot.sendMessage(chatId, 'No servers registered yet.');
        return;
    }

    let message = '🖥️ *Registered Servers*\n\n';

    for (const [serverId, serverData] of servers.entries()) {
        const timeSinceUpdate = Math.floor((new Date() - serverData.lastUpdate) / 1000);
        message += `• ${serverData.name} (${serverId})\n`;
        message += `  Devices: ${serverData.devices.length}\n`;
        message += `  Last seen: ${timeSinceUpdate}s ago\n\n`;
    }

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

bot.onText(/\/upload/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
        'To upload a device list, send a message in this format:\n\n' +
        '```\n' +
        '/setdevices SERVER_ID\n' +
        'SERIAL1\n' +
        'SERIAL2\n' +
        'SERIAL3\n' +
        '```\n\n' +
        'Example:\n' +
        '```\n' +
        '/setdevices server1\n' +
        '192.168.1.100:5555\n' +
        '192.168.1.101:5555\n' +
        'ABC123DEF456\n' +
        '```',
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/\/setdevices (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const lines = text.split('\n');
    const serverId = match[1].trim();
    const devices = lines.slice(1).map(line => line.trim()).filter(line => line.length > 0);

    if (devices.length === 0) {
        bot.sendMessage(chatId, '❌ No devices provided. Please list device serials, one per line.');
        return;
    }

    deviceLists.set(serverId, devices);
    saveData();

    bot.sendMessage(chatId,
        `✅ Device list updated for *${serverId}*\n\n` +
        `Devices (${devices.length}):\n` +
        devices.map(d => `• ${d}`).join('\n'),
        { parse_mode: 'Markdown' }
    );
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
        '*ADB Monitor Bot Help*\n\n' +
        '*Commands:*\n' +
        '/status - Check all servers and device statuses\n' +
        '/servers - List all registered servers\n' +
        '/upload - Get instructions for uploading device lists\n' +
        '/setdevices [SERVER_ID] - Set device list for a server\n' +
        '/help - Show this help message\n\n' +
        '*Setup:*\n' +
        '1. Run bot-server.js on a main server\n' +
        '2. Deploy server-agent.js to each device server\n' +
        '3. Configure each agent with server ID and bot URL\n' +
        '4. Upload device lists using /setdevices',
        { parse_mode: 'Markdown' }
    );
});

// Start Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Bot server listening on port ${PORT}`);
    loadData();
    console.log('Telegram bot is running...');
});

// Periodic alert for offline devices (every 5 minutes)
setInterval(() => {
    if (!adminChatId) return;

    let alerts = [];

    for (const [serverId, serverData] of servers.entries()) {
        const expectedDevices = deviceLists.get(serverId) || [];
        const deviceMap = new Map(serverData.devices.map(d => [d.serial, d.status]));

        for (const serial of expectedDevices) {
            const status = deviceMap.get(serial);
            if (!status || status === 'offline' || status === 'unauthorized') {
                alerts.push(`${serverData.name}: ${serial} is ${status || 'MISSING'}`);
            }
        }
    }

    if (alerts.length > 0) {
        bot.sendMessage(adminChatId,
            '⚠️ *Alert: Devices Need Attention*\n\n' +
            alerts.map(a => `• ${a}`).join('\n'),
            { parse_mode: 'Markdown' }
        );
    }
}, 5 * 60 * 1000);
