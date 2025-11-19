# GitHub Setup Instructions

## Creating the GitHub Repository

### Using GitHub Desktop (Easiest Way)

1. **Open GitHub Desktop**

2. **Add this folder to GitHub Desktop:**
   - Click `File` → `Add Local Repository`
   - Browse to: `/Users/deon/Desktop/telegram bot`
   - Click `Add Repository`

   If it says "This directory does not appear to be a Git repository":
   - Click `Create a Repository` instead
   - Repository Name: `adb-monitor-telegram-bot`
   - Description: `Telegram bot to monitor ADB device statuses across multiple servers`
   - Keep "Initialize this repository with a README" **unchecked** (we already have one)
   - Click `Create Repository`

3. **Commit the files:**
   - You'll see all the files listed
   - In the "Summary" field, type: `Initial commit - ADB Monitor Bot`
   - Click `Commit to main`

4. **Publish to GitHub:**
   - Click `Publish repository` button
   - Uncheck "Keep this code private" if you want it public (or leave checked for private)
   - Click `Publish Repository`

5. **Done!** Your repository is now on GitHub at:
   `https://github.com/YOUR_USERNAME/adb-monitor-telegram-bot`

---

## Deploying to Other Servers from GitHub

Once your repository is on GitHub, deploying to any server is super easy:

### Method 1: Using GitHub Desktop (Windows servers with GUI)

1. Install GitHub Desktop on the target server
2. `File` → `Clone Repository`
3. Choose your repository: `YOUR_USERNAME/adb-monitor-telegram-bot`
4. Choose location to clone to
5. Click `Clone`
6. Done! Now run `deploy.bat`

### Method 2: Using Git Command Line

On any server with Git installed:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/adb-monitor-telegram-bot.git

# Navigate to the folder
cd adb-monitor-telegram-bot

# For Bot Server:
start-bot-server.bat

# For Agent:
deploy.bat
```

### Method 3: Download ZIP (No Git Required)

1. Go to your GitHub repository page
2. Click the green `Code` button
3. Click `Download ZIP`
4. Extract to your server
5. Run the appropriate .bat file

---

## Updating Servers When You Make Changes

### If you update the code and push to GitHub:

**Using GitHub Desktop:**
1. Open GitHub Desktop on the server
2. Click `Fetch origin`
3. Click `Pull origin` if updates are available
4. Restart the agent/server

**Using Git Command Line:**
```bash
cd adb-monitor-telegram-bot
git pull
# Restart your agent or server
```

---

## .gitignore Reminder

The `.gitignore` file is already configured to exclude:
- `node_modules/` (dependencies - will be installed locally)
- `.env` (your configuration - keep this private!)
- `data.json` (bot data)
- `*.log` (log files)

**IMPORTANT:** Never commit your `.env` file to GitHub! It contains sensitive tokens.

---

## Repository Structure

After pushing to GitHub, your repository will contain:

```
adb-monitor-telegram-bot/
├── bot-server.js              # Main bot server
├── server-agent.js            # Device monitoring agent
├── package.json               # Dependencies
├── deploy.bat                 # Agent deployment script
├── start-bot-server.bat       # Bot server setup script
├── setup.bat                  # Setup wizard
├── .env.example               # Example configuration
├── .gitignore                 # Git ignore rules
├── README.md                  # Full documentation
├── QUICK-START.md             # Quick start guide
└── GITHUB-SETUP.md            # This file
```

---

## Quick Deploy Workflow

1. **One-time setup:** Push to GitHub (follow steps above)

2. **Deploy to Server 1:**
   ```
   - Clone from GitHub
   - Run deploy.bat
   - Answer prompts (server1, Server 1, bot URL)
   ```

3. **Deploy to Server 2:**
   ```
   - Clone from GitHub
   - Run deploy.bat
   - Answer prompts (server2, Server 2, bot URL)
   ```

4. **Deploy to Server N:**
   ```
   - Clone from GitHub
   - Run deploy.bat
   - Answer prompts (serverN, Server N, bot URL)
   ```

Each server gets the same code, but different configuration via the interactive prompts!
