const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const BOT_SERVER_URL = process.env.BOT_SERVER_URL || 'http://localhost:3001';
const SERVER_ID = process.env.SERVER_ID || 'server1';
const SERVER_NAME = process.env.SERVER_NAME || SERVER_ID;
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || '10000'); // 10 seconds default

console.log(`ADB Monitor Agent Starting...`);
console.log(`Server ID: ${SERVER_ID}`);
console.log(`Server Name: ${SERVER_NAME}`);
console.log(`Bot Server URL: ${BOT_SERVER_URL}`);
console.log(`Update Interval: ${UPDATE_INTERVAL}ms`);

// Function to execute ADB command and get device list
function getAdbDevices() {
    return new Promise((resolve, reject) => {
        exec('adb devices', (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing adb devices:', error);
                reject(error);
                return;
            }

            const lines = stdout.split('\n');
            const devices = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.length === 0) continue;

                const parts = line.split(/\s+/);
                if (parts.length >= 2) {
                    devices.push({
                        serial: parts[0],
                        status: parts[1]
                    });
                }
            }

            resolve(devices);
        });
    });
}

// Function to send status update to bot server
async function sendStatusUpdate(devices) {
    try {
        const response = await axios.post(`${BOT_SERVER_URL}/api/status`, {
            serverId: SERVER_ID,
            serverName: SERVER_NAME,
            devices: devices
        }, {
            timeout: 5000
        });

        console.log(`Status update sent: ${devices.length} devices`);
        return true;
    } catch (error) {
        console.error('Failed to send status update:', error.message);
        return false;
    }
}

// Function to get expected device list from bot server
async function getExpectedDevices() {
    try {
        const response = await axios.get(`${BOT_SERVER_URL}/api/devices/${SERVER_ID}`, {
            timeout: 5000
        });

        return response.data.devices || [];
    } catch (error) {
        console.error('Failed to get expected devices:', error.message);
        return [];
    }
}

// Main monitoring loop
async function monitorDevices() {
    try {
        // Get current ADB devices
        const devices = await getAdbDevices();

        // Log device status
        console.log('\n--- Device Status ---');
        console.log(`Time: ${new Date().toLocaleString()}`);
        console.log(`Devices found: ${devices.length}`);

        devices.forEach(device => {
            let statusIcon = '?';
            if (device.status === 'device') statusIcon = '✓';
            else if (device.status === 'offline') statusIcon = '✗';
            else if (device.status === 'unauthorized') statusIcon = '⚠';

            console.log(`  ${statusIcon} ${device.serial}: ${device.status}`);
        });

        // Send update to bot server
        await sendStatusUpdate(devices);

    } catch (error) {
        console.error('Error in monitoring loop:', error);
    }
}

// Start monitoring
console.log('\nStarting device monitoring...\n');

// Initial check
monitorDevices();

// Set up periodic monitoring
setInterval(monitorDevices, UPDATE_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down agent...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nShutting down agent...');
    process.exit(0);
});
