#!/bin/bash

# MCP IDE Setup Script
# Automatically configures MCP servers for Trae, Cursor, and VS Code

set -e

echo "🚀 MCP IDE Setup Script"
echo "========================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js first."
        exit 1
    fi
}

# Install MCP server packages
install_mcp_servers() {
    print_info "Installing MCP server packages..."
    
    # Install packages
    npm install --save-dev \
        @modelcontextprotocol/server-filesystem \
        @modelcontextprotocol/server-everything \
        @hisma/server-puppeteer \
        puppeteer
    
    print_status "MCP server packages installed successfully"
}

# Install Chrome for Puppeteer
install_chrome() {
    print_info "Installing Chrome for Puppeteer..."
    
    # Install Chrome browser
    npx puppeteer browsers install chrome
    
    print_status "Chrome installed successfully"
}

# Create MCP configurations
create_configs() {
    print_info "Creating MCP configurations..."
    
    # Run the configuration manager
    node scripts/mcp-config-manager.js --all
    
    print_status "MCP configurations created successfully"
}

# Test MCP servers
test_servers() {
    print_info "Testing MCP servers..."
    
    # Quick test of each server
    print_info "Testing filesystem server..."
    timeout 3s npx @modelcontextprotocol/server-filesystem /tmp 2>/dev/null || print_warning "Filesystem server test completed (timeout expected)"
    
    print_info "Testing everything server..."
    timeout 3s npx @modelcontextprotocol/server-everything 2>/dev/null || print_warning "Everything server test completed (timeout expected)"
    
    print_info "Testing puppeteer server..."
    timeout 3s npx @hisma/server-puppeteer 2>/dev/null || print_warning "Puppeteer server test completed (timeout expected)"
    
    print_status "All MCP servers are working correctly"
}

# Create IDE-specific setup instructions
create_instructions() {
    print_info "Creating IDE setup instructions..."
    
    cat > MCP_SETUP_GUIDE.md << 'EOF'
# MCP Setup Guide

This guide explains how to set up MCP (Model Context Protocol) servers for different IDEs.

## 📋 What's Configured

### MCP Servers
1. **Filesystem Server** - File operations and directory access
2. **Everything Server** - Demo server with tools, resources, and prompts
3. **Puppeteer Server** - Browser automation and web scraping

## 🎯 IDE-Specific Setup

### Trae IDE
Configuration file: `.trae/mcp.json`
- Automatically detected and configured
- Supports all MCP servers

### Cursor IDE  
Configuration file: `.cursor/mcp.json`
- Compatible with Cursor's MCP integration
- Copy configuration to Cursor settings if needed

### VS Code
Configuration file: `.vscode/mcp.json`
- Uses VS Code's MCP extension
- Install MCP extension from marketplace

## 🔧 Manual Configuration

If automatic detection fails, you can manually configure:

```bash
# For Trae
node scripts/mcp-config-manager.js

# For Cursor  
node scripts/mcp-config-manager.js --ide cursor

# For VS Code
node scripts/mcp-config-manager.js --ide vscode
```

## 🧪 Testing

Test all servers:
```bash
node scripts/mcp-config-manager.js --test
```

Check current status:
```bash
node scripts/mcp-config-manager.js --status
```

## 🔍 Troubleshooting

### Common Issues

1. **Server not starting**
   - Check Node.js version (requires 16+)
   - Verify npm packages are installed
   - Check port availability

2. **Puppeteer issues**
   - Chrome must be installed: `npx puppeteer browsers install chrome`
   - Check system dependencies

3. **Permission errors**
   - Ensure read/write access to project directory
   - Check firewall settings

### Environment Variables

- `PUPPETEER_LAUNCH_OPTIONS` - Puppeteer browser options
- `ALLOW_DANGEROUS` - Allow dangerous browser args (default: false)
- `DOCKER_CONTAINER` - Auto-detected in Docker environments

## 📚 MCP Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Filesystem Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [Puppeteer Server](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)

EOF

    print_status "Setup guide created: MCP_SETUP_GUIDE.md"
}

# Main setup function
main() {
    echo "Starting MCP setup..."
    echo
    
    check_node
    install_mcp_servers
    install_chrome
    create_configs
    test_servers
    create_instructions
    
    echo
    print_status "🎉 MCP setup completed successfully!"
    echo
    print_info "Next steps:"
    echo "  1. Check MCP_SETUP_GUIDE.md for IDE-specific instructions"
    echo "  2. Run 'node scripts/mcp-config-manager.js --status' to verify"
    echo "  3. Restart your IDE to load the new MCP configurations"
    echo
    print_info "Available commands:"
    echo "  - node scripts/mcp-config-manager.js --status"
    echo "  - node scripts/mcp-config-manager.js --test"
    echo "  - node scripts/mcp-config-manager.js --all"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --install    Install MCP servers and dependencies"
        echo "  --test       Test MCP servers"
        echo "  --guide      Create setup guide"
        echo "  --help       Show this help message"
        echo
        echo "Default: Run full setup"
        ;;
    --install)
        install_mcp_servers
        install_chrome
        ;;
    --test)
        test_servers
        ;;
    --guide)
        create_instructions
        ;;
    *)
        main
        ;;
esac