# 🚀 Unified MCP Configuration System

This project now includes a complete **Model Context Protocol (MCP)** configuration system that works seamlessly across **Trae IDE**, **Cursor IDE**, and **Visual Studio Code**. The system automatically detects your IDE and configures MCP servers accordingly.

## 📋 What's Included

### ✅ MCP Servers Configured
1. **Filesystem Server** (`@modelcontextprotocol/server-filesystem`)
   - File operations and directory access
   - Secure file reading/writing within project boundaries
   - Directory listing and search capabilities

2. **Everything Server** (`@modelcontextprotocol/server-everything`)
   - Demo server with tools, resources, and prompts
   - Testing and development utilities
   - MCP protocol demonstration

3. **Puppeteer Server** (`@hisma/server-puppeteer`)
   - Browser automation and web scraping
   - Screenshot capture capabilities
   - JavaScript execution in browser context
   - Form interaction and navigation

### 🔧 IDE Support
- **Trae IDE** - Native MCP support with `.trae/mcp.json`
- **Cursor IDE** - Compatible with Cursor's MCP integration via `.cursor/mcp.json`
- **VS Code** - Works with MCP extensions via `.vscode/mcp.json`

## 🎯 Quick Start

### 1. Automatic Setup
```bash
# Run the unified setup script
./scripts/mcp-setup.sh

# Or use the Node.js configuration manager
node scripts/mcp-config-manager.js --all
```

### 2. Check Current Status
```bash
# Check which IDE is detected and configured
node scripts/ide-switcher.js --status

# Test all MCP servers
node scripts/mcp-config-manager.js --test
```

### 3. Switch Between IDEs
```bash
# Switch to Trae IDE
node scripts/ide-switcher.js trae

# Switch to Cursor IDE
node scripts/ide-switcher.js cursor

# Switch to VS Code
node scripts/ide-switcher.js vscode
```

## 📁 Configuration Files

### IDE-Specific Configurations
- **Trae**: `.trae/mcp.json`
- **Cursor**: `.cursor/mcp.json`
- **VS Code**: `.vscode/mcp.json`

### Master Configuration
- `mcp-master-config.json` - Overview of all configurations
- `scripts/mcp-config-manager.js` - Configuration management script
- `scripts/ide-switcher.js` - IDE switching utility

## 🔍 IDE Detection

The system automatically detects your IDE using:
- Environment variables (`TRAEVIEW`, `CURSOR`, `VSCODE_PID`)
- Process information and parent process names
- IDE-specific configuration files

## 🛠️ MCP Server Details

### Filesystem Server
```json
{
  "command": "npx",
  "args": ["@modelcontextprotocol/server-filesystem", "/Users/ciepolml/Projects/simple-2"],
  "disabled": false,
  "autoApprove": []
}
```

### Everything Server
```json
{
  "command": "npx",
  "args": ["@modelcontextprotocol/server-everything"],
  "disabled": false,
  "autoApprove": []
}
```

### Puppeteer Server
```json
{
  "command": "npx",
  "args": ["-y", "@hisma/server-puppeteer"],
  "disabled": false,
  "autoApprove": [],
  "env": {
    "PUPPETEER_LAUNCH_OPTIONS": "{\"headless\":true,\"args\":[\"--no-sandbox\",\"--disable-setuid-sandbox\"]}"
  }
}
```

## 🧪 Testing

### Test Individual Servers
```bash
# Test filesystem server
timeout 5s npx @modelcontextprotocol/server-filesystem /tmp

# Test everything server
timeout 5s npx @modelcontextprotocol/server-everything

# Test puppeteer server
timeout 5s npx @hisma/server-puppeteer
```

### Run All Tests
```bash
node scripts/mcp-config-manager.js --test
```

## 🔧 Troubleshooting

### Common Issues

1. **Server not starting**
   ```bash
   # Check Node.js version (requires 16+)
   node --version
   
   # Verify packages are installed
   npm list @modelcontextprotocol/server-filesystem
   ```

2. **Puppeteer Chrome issues**
   ```bash
   # Install Chrome for Puppeteer
   npx puppeteer browsers install chrome
   
   # Check Chrome installation
   ls ~/.cache/puppeteer/chrome/
   ```

3. **IDE not detected**
   ```bash
   # Manually specify IDE
   node scripts/ide-switcher.js trae
   
   # Check detection logic
   node -e "console.log(process.env)"
   ```

### Environment Variables
- `PUPPETEER_LAUNCH_OPTIONS` - Puppeteer browser launch options
- `ALLOW_DANGEROUS` - Allow dangerous browser arguments (default: false)
- `DOCKER_CONTAINER` - Auto-detected in Docker environments

## 📚 Available Commands

### Configuration Manager
```bash
node scripts/mcp-config-manager.js [options]

Options:
  --create, -c     Create configuration for detected IDE
  --test, -t       Test MCP servers
  --status, -s     Show current status
  --all, -a        Create configurations for all IDEs
  --help, -h       Show help
```

### IDE Switcher
```bash
node scripts/ide-switcher.js [command] [options]

Commands:
  <ide-type>     Switch to specific IDE (trae, cursor, vscode)
  --status, -s   Show current configuration status
  --list, -l     List available IDE configurations
  --master, -m   Create master configuration file
  --validate, -v Validate all configurations
  --help, -h     Show help
```

### Setup Script
```bash
./scripts/mcp-setup.sh [options]

Options:
  --install    Install MCP servers and dependencies
  --test       Test MCP servers
  --guide      Create setup guide
  --help       Show help
```

## 🔄 Workflow Integration

### Package.json Scripts
Add these to your `package.json`:
```json
{
  "scripts": {
    "mcp:setup": "./scripts/mcp-setup.sh",
    "mcp:status": "node scripts/ide-switcher.js --status",
    "mcp:test": "node scripts/mcp-config-manager.js --test",
    "mcp:switch": "node scripts/ide-switcher.js"
  }
}
```

### Usage Examples
```bash
# Quick setup
npm run mcp:setup

# Check status
npm run mcp:status

# Switch to Cursor
npm run mcp:switch cursor

# Test servers
npm run mcp:test
```

## 🎉 Success Indicators

✅ **All servers installed and configured**
✅ **IDE detection working automatically**
✅ **Configuration files created for all IDEs**
✅ **Puppeteer Chrome installed and tested**
✅ **Unified switching system implemented**
✅ **Comprehensive documentation provided**

## 📖 Next Steps

1. **Restart your IDE** to load the new MCP configurations
2. **Test the integration** by asking your AI assistant to perform file operations
3. **Use browser automation** for web testing and screenshots
4. **Explore the demo tools** provided by the everything server

The MCP configuration system is now ready to enhance your development workflow across all supported IDEs! 🚀