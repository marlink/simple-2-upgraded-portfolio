#!/usr/bin/env node

/**
 * IDE Detection and MCP Configuration Manager
 * Automatically detects the current IDE and configures MCP servers accordingly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class IDEConfigManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.ideType = this.detectIDE();
    this.configs = this.loadConfigurations();
  }

  /**
   * Detect the current IDE based on environment variables and process information
   */
  detectIDE() {
    const env = process.env;
    
    // Check for Trae IDE
    if (env.TRAEVIEW === '1' || env.TRAEVIEW === 'true') {
      return 'trae';
    }
    
    // Check for Cursor IDE
    if (env.CURSOR === '1' || process.argv.some(arg => arg.includes('cursor'))) {
      return 'cursor';
    }
    
    // Check for VS Code
    if (env.VSCODE_PID || env.TERM_PROGRAM === 'vscode') {
      return 'vscode';
    }
    
    // Check for Cursor by process name
    try {
      const parentProcess = execSync('ps -p $PPID -o comm=', { encoding: 'utf8' }).trim();
      if (parentProcess.toLowerCase().includes('cursor')) {
        return 'cursor';
      }
      if (parentProcess.toLowerCase().includes('code')) {
        return 'vscode';
      }
    } catch (e) {
      // Ignore process detection errors
    }
    
    // Default to Trae if we can't detect
    return 'trae';
  }

  /**
   * Load MCP configurations for different IDEs
   */
  loadConfigurations() {
    return {
      trae: {
        name: 'Trae IDE',
        configFile: '.trae/mcp.json',
        format: 'trae',
        servers: {
          filesystem: {
            command: 'npx',
            args: ['@modelcontextprotocol/server-filesystem', this.projectRoot],
            disabled: false,
            autoApprove: []
          },
          everything: {
            command: 'npx',
            args: ['@modelcontextprotocol/server-everything'],
            disabled: false,
            autoApprove: []
          },
          puppeteer: {
            command: 'npx',
            args: ['@hisma/server-puppeteer'],
            disabled: false,
            autoApprove: [],
            env: {
              'PUPPETEER_LAUNCH_OPTIONS': JSON.stringify({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
              })
            }
          }
        }
      },
      cursor: {
        name: 'Cursor IDE',
        configFile: '.cursor/mcp.json',
        format: 'cursor',
        servers: {
          filesystem: {
            command: 'npx',
            args: ['@modelcontextprotocol/server-filesystem', this.projectRoot],
            disabled: false,
            autoApprove: []
          },
          everything: {
            command: 'npx',
            args: ['@modelcontextprotocol/server-everything'],
            disabled: false,
            autoApprove: []
          },
          puppeteer: {
            command: 'npx',
            args: ['-y', '@hisma/server-puppeteer'],
            disabled: false,
            autoApprove: [],
            env: {
              'PUPPETEER_LAUNCH_OPTIONS': JSON.stringify({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
              })
            }
          }
        }
      },
      vscode: {
        name: 'VS Code',
        configFile: '.vscode/mcp.json',
        format: 'vscode',
        servers: {
          filesystem: {
            command: 'npx',
            args: ['@modelcontextprotocol/server-filesystem', this.projectRoot],
            disabled: false,
            autoApprove: []
          },
          everything: {
            command: 'npx',
            args: ['@modelcontextprotocol/server-everything'],
            disabled: false,
            autoApprove: []
          },
          puppeteer: {
            command: 'npx',
            args: ['-y', '@hisma/server-puppeteer'],
            disabled: false,
            autoApprove: [],
            env: {
              'PUPPETEER_LAUNCH_OPTIONS': JSON.stringify({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
              })
            }
          }
        }
      }
    };
  }

  /**
   * Generate configuration for the detected IDE
   */
  generateConfig() {
    const ideConfig = this.configs[this.ideType];
    
    if (this.ideType === 'trae') {
      return {
        mcpServers: ideConfig.servers
      };
    } else if (this.ideType === 'cursor') {
      return {
        mcpServers: ideConfig.servers
      };
    } else if (this.ideType === 'vscode') {
      return {
        mcp: {
          servers: ideConfig.servers
        }
      };
    }
    
    return { mcpServers: ideConfig.servers };
  }

  /**
   * Create IDE-specific configuration files
   */
  createConfigFiles() {
    console.log(`🎯 Detected IDE: ${this.configs[this.ideType].name}`);
    
    // Create configuration for detected IDE
    const config = this.generateConfig();
    const configFile = this.configs[this.ideType].configFile;
    const configDir = path.dirname(configFile);
    
    // Ensure directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Write configuration file
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log(`✅ Created ${configFile}`);
    
    // Create all possible IDE configurations for easy switching
    this.createAllIDEConfigs();
    
    return config;
  }

  /**
   * Create configuration files for all supported IDEs
   */
  createAllIDEConfigs() {
    Object.keys(this.configs).forEach(ideType => {
      const ideConfig = this.configs[ideType];
      const configFile = ideConfig.configFile;
      const configDir = path.dirname(configFile);
      
      // Ensure directory exists
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      // Generate config for this IDE
      const config = this.generateConfigForIDE(ideType);
      
      // Write configuration file
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
      console.log(`✅ Created ${configFile} for ${ideConfig.name}`);
    });
  }

  /**
   * Generate configuration for a specific IDE
   */
  generateConfigForIDE(ideType) {
    const ideConfig = this.configs[ideType];
    
    if (ideType === 'trae') {
      return {
        mcpServers: ideConfig.servers
      };
    } else if (ideType === 'cursor') {
      return {
        mcpServers: ideConfig.servers
      };
    } else if (ideType === 'vscode') {
      return {
        mcp: {
          servers: ideConfig.servers
        }
      };
    }
    
    return { mcpServers: ideConfig.servers };
  }

  /**
   * Test MCP servers
   */
  async testServers() {
    console.log('🧪 Testing MCP servers...');
    
    const servers = ['filesystem', 'everything', 'puppeteer'];
    
    for (const server of servers) {
      try {
        console.log(`Testing ${server} server...`);
        
        if (server === 'filesystem') {
          execSync('timeout 5s npx @modelcontextprotocol/server-filesystem /tmp', { stdio: 'ignore' });
        } else if (server === 'everything') {
          execSync('timeout 5s npx @modelcontextprotocol/server-everything', { stdio: 'ignore' });
        } else if (server === 'puppeteer') {
          execSync('timeout 5s npx @hisma/server-puppeteer', { stdio: 'ignore' });
        }
        
        console.log(`✅ ${server} server is working`);
      } catch (error) {
        console.log(`⚠️  ${server} server test failed (timeout expected)`);
      }
    }
  }

  /**
   * Display current status
   */
  displayStatus() {
    console.log('\n📊 MCP Configuration Status');
    console.log('==========================');
    console.log(`Current IDE: ${this.configs[this.ideType].name}`);
    console.log(`Config File: ${this.configs[this.ideType].configFile}`);
    console.log('\nConfigured Servers:');
    
    const servers = this.configs[this.ideType].servers;
    Object.keys(servers).forEach(serverName => {
      const server = servers[serverName];
      console.log(`  ✅ ${serverName}: ${server.command} ${server.args.join(' ')}`);
    });
    
    console.log('\n🔄 To switch IDE configurations, run:');
    console.log('   node scripts/mcp-config-manager.js --switch <ide-type>');
    console.log('\nAvailable IDE types: trae, cursor, vscode');
  }
}

// Main execution
if (require.main === module) {
  const manager = new IDEConfigManager();
  
  // Handle command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node mcp-config-manager.js [options]');
    console.log('Options:');
    console.log('  --create, -c     Create configuration files for detected IDE');
    console.log('  --test, -t       Test MCP servers');
    console.log('  --status, -s     Show current configuration status');
    console.log('  --all, -a        Create configurations for all IDEs');
    console.log('  --help, -h       Show this help message');
    process.exit(0);
  }
  
  if (args.includes('--test') || args.includes('-t')) {
    manager.testServers().then(() => {
      console.log('Testing complete');
    });
  } else if (args.includes('--status') || args.includes('-s')) {
    manager.displayStatus();
  } else if (args.includes('--all') || args.includes('-a')) {
    manager.createAllIDEConfigs();
    console.log('\n✅ Created configurations for all IDEs');
  } else {
    // Default: create configuration for detected IDE
    manager.createConfigFiles();
    manager.displayStatus();
  }
}

module.exports = IDEConfigManager;