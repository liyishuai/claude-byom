# Deployment Guide

This guide explains how to deploy and run the claude-byom proxy server.

## Local Deployment (Recommended)

The proxy is designed to run locally on your machine for security.

### Step 1: Install and Build

```bash
git clone https://github.com/liyishuai/claude-byom.git
cd claude-byom
npm install
npm run build
```

### Step 2: Configure Environment

Create a `.env` file:

```bash
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
PORT=3000
HOST=127.0.0.1
```

### Step 3: Start the Proxy

```bash
npm start
```

Or with environment variables:

```bash
OPENAI_API_KEY=sk-... OPENAI_MODEL=gpt-4 npm start
```

### Step 4: Configure Claude Desktop

Edit your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add:

```json
{
  "environmentVariables": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:3000",
    "ANTHROPIC_API_KEY": "any-value"
  }
}
```

### Step 5: Restart Claude Desktop

Completely quit and restart Claude Desktop.

## Running as a System Service

### macOS (using launchd)

Create `~/Library/LaunchAgents/com.claude-byom.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.claude-byom</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/claude-byom/build/index.js</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OPENAI_API_KEY</key>
        <string>your-api-key-here</string>
        <key>OPENAI_MODEL</key>
        <string>gpt-4</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/claude-byom.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/claude-byom.error.log</string>
</dict>
</plist>
```

Load the service:

```bash
launchctl load ~/Library/LaunchAgents/com.claude-byom.plist
```

### Linux (using systemd)

Create `/etc/systemd/system/claude-byom.service`:

```ini
[Unit]
Description=Claude BYOM Proxy Server
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/claude-byom
Environment="OPENAI_API_KEY=your-api-key-here"
Environment="OPENAI_MODEL=gpt-4"
Environment="PORT=3000"
Environment="HOST=127.0.0.1"
ExecStart=/usr/bin/node /path/to/claude-byom/build/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable claude-byom
sudo systemctl start claude-byom
sudo systemctl status claude-byom
```

### Windows (using NSSM)

1. Download NSSM from https://nssm.cc/download
2. Run PowerShell as Administrator:

```powershell
nssm install claude-byom "C:\Program Files\nodejs\node.exe" "C:\path\to\claude-byom\build\index.js"
nssm set claude-byom AppEnvironmentExtra OPENAI_API_KEY=your-key OPENAI_MODEL=gpt-4
nssm start claude-byom
```

## Docker Deployment (Advanced)

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "build/index.js"]
```

Build and run:

```bash
docker build -t claude-byom .
docker run -d \
  -p 127.0.0.1:3000:3000 \
  -e OPENAI_API_KEY=your-key \
  -e OPENAI_MODEL=gpt-4 \
  --name claude-byom \
  --restart unless-stopped \
  claude-byom
```

## Security Considerations

1. **Never expose to the internet**: Always bind to localhost (127.0.0.1)
2. **Protect API keys**: Use environment variables, never commit to git
3. **Use firewall**: Ensure port 3000 is not accessible externally
4. **Monitor logs**: Check for unusual activity
5. **Keep updated**: Regularly update dependencies

## Monitoring

Check if the proxy is running:

```bash
curl http://127.0.0.1:3000/health
```

View logs:

- **macOS launchd**: `tail -f /tmp/claude-byom.log`
- **Linux systemd**: `journalctl -u claude-byom -f`
- **Docker**: `docker logs -f claude-byom`

## Troubleshooting

### Proxy won't start
- Check Node.js is installed: `node --version`
- Verify build completed: `ls build/index.js`
- Check environment variables are set
- Review error logs

### High memory usage
- Restart the proxy periodically
- Check for memory leaks in logs
- Consider using PM2 for process management

### Slow responses
- Check your LLM provider's status
- Monitor network latency
- Consider using a faster model

## Production Best Practices

1. Use process manager (PM2, systemd, etc.)
2. Enable automatic restarts
3. Set up log rotation
4. Monitor resource usage
5. Have a backup API key ready
6. Document your configuration
7. Test after system updates

## Using with PM2 (Recommended)

```bash
npm install -g pm2

# Start
pm2 start build/index.js --name claude-byom \
  --env OPENAI_API_KEY=your-key \
  --env OPENAI_MODEL=gpt-4

# Save configuration
pm2 save

# Start on boot
pm2 startup
```

Manage:

```bash
pm2 status
pm2 logs claude-byom
pm2 restart claude-byom
pm2 stop claude-byom
```
