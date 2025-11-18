#!/usr/bin/env node

/**
 * IDE Switcher for MCP Configurations
 * Allows seamless switching between different IDE configurations
 */

const fs = require('fs');
const path = require('path');

class IDESwitcher {
  constructor() {
    this.projectRoot = process.cwd();
    this.configs = {
      trae: {
        name: 'Trae IDE',
        configFile: '.trae/mcp.json',
        backupFile: '.trae/mcp.json.backup',
        activeIndicator: '.trae/.active'
      },
      cursor: {
        name: 'Cursor IDE',
        configFile: '.cursor/mcp.json',
        backupFile: '.cursor/mcp.json.backup',
        activeIndicator: '.cursor/.active'
      },
      vscode: {
        name: 'VS Code',
        configFile: '.vscode/mcp.json',
        backupFile: '.vscode/mcp.json.backup',
        activeIndicator: '.vscode/.active'
      }
    };
  }

  /**
   * Switch to a specific IDE configuration
   */
  switchTo(ideType) {
    if (!this.configs[ideType]) {
      console.error(`❌ Unknown IDE type: ${ideType}`);
      console.log('Available IDEs: trae, cursor, vscode');
      return false;
    }

    console.log(`🔄 Switching to ${this.configs[ideType].name} configuration...`);

    // Deactivate all other configurations
    this.deactivateAll();

    // Activate the selected configuration
    this.activateIDE(ideType);

    console.log(`✅ Successfully switched to ${this.configs[ideType].name}`);
    return true;
  }

  /**
   * Activate a specific IDE configuration
   */
  activateIDE(ideType) {
    const config = this.configs[ideType];
    
    // Create active indicator
    const configDir = path.dirname(config.activeIndicator);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(config.activeIndicator, ideType);
    
    // Create IDE-specific project configuration
    this.createProjectConfig(ideType);
  }

  /**
   * Deactivate all IDE configurations
   */
  deactivateAll() {
    Object.keys(this.configs).forEach(ideType => {
      const config = this.configs[ideType];
      
      // Remove active indicator
      if (fs.existsSync(config.activeIndicator)) {
        fs.unlinkSync(config.activeIndicator);
      }
    });
  }

  /**
   * Create project-specific configuration for IDE
   */
  createProjectConfig(ideType) {
    const config = {
      name: 'simple-2',
      version: '1.0.0',
      ide: ideType,
      description: `Configuration for ${this.configs[ideType].name}`,
      mcp: {
        enabled: true,
        servers: ['filesystem', 'everything', 'puppeteer']
      },
      features: {
        browserAutomation: true,
        fileOperations: true,
        demoTools: true
      }
    };

    const configFile = `.ide-${ideType}.json`;
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log(`📄 Created ${configFile}`);
  }

  /**
   * Show current active configuration
   */
  showStatus() {
    console.log('\n📊 Current IDE Configuration Status');
    console.log('====================================');
    
    let activeIDE = null;
    
    Object.keys(this.configs).forEach(ideType => {
      const config = this.configs[ideType];
      const isActive = fs.existsSync(config.activeIndicator);
      
      if (isActive) {
        activeIDE = ideType;
        console.log(`✅ Active: ${config.name}`);
      } else {
        console.log(`   Inactive: ${config.name}`);
      }
    });
    
    if (!activeIDE) {
      console.log('⚠️  No active IDE configuration detected');
      console.log('Run: node scripts/ide-switcher.js <ide-type>');
    }
    
    return activeIDE;
  }

  /**
   * List available IDEs
   */
  listIDEs() {
    console.log('\n🎯 Available IDE Configurations');
    console.log('===============================');
    
    Object.keys(this.configs).forEach(ideType => {
      const config = this.configs[ideType];
      console.log(`• ${ideType.padEnd(8)} - ${config.name}`);
    });
    
    console.log('\nUsage: node scripts/ide-switcher.js <ide-type>');
    console.log('Example: node scripts/ide-switcher.js trae');
  }

  /**
   * Create a master configuration file
   */
  createMasterConfig() {
    const masterConfig = {
      project: 'simple-2',
      version: '1.0.0',
      description: 'Unified MCP configuration for multiple IDEs',
      ides: {
        trae: {
          name: 'Trae IDE',
          mcpFile: '.trae/mcp.json',
          projectFile: '.ide-trae.json'
        },
        cursor: {
          name: 'Cursor IDE',
          mcpFile: '.cursor/mcp.json',
          projectFile: '.ide-cursor.json'
        },
        vscode: {
          name: 'VS Code',
          mcpFile: '.vscode/mcp.json',
          projectFile: '.ide-vscode.json'
        }
      },
      mcpServers: {
        filesystem: {
          description: 'File system operations and directory access',
          package: '@modelcontextprotocol/server-filesystem'
        },
        everything: {
          description: 'Demo server with tools, resources, and prompts',
          package: '@modelcontextprotocol/server-everything'
        },
        puppeteer: {
          description: 'Browser automation and web scraping',
          package: '@hisma/server-puppeteer'
        }
      }
    };

    fs.writeFileSync('mcp-master-config.json', JSON.stringify(masterConfig, null, 2));
    console.log('📄 Created mcp-master-config.json');
  }

  /**
   * Validate configurations
   */
  validate() {
    console.log('\n🔍 Validating MCP Configurations');
    console.log('=================================');
    
    let isValid = true;
    
    Object.keys(this.configs).forEach(ideType => {
      const config = this.configs[ideType];
      console.log(`\nChecking ${config.name}...`);
      
      // Check if config file exists
      if (fs.existsSync(config.configFile)) {
        console.log(`✅ ${config.configFile} exists`);
        
        // Validate JSON syntax
        try {
          const content = fs.readFileSync(config.configFile, 'utf8');
          JSON.parse(content);
          console.log(`✅ ${config.configFile} is valid JSON`);
        } catch (error) {
          console.log(`❌ ${config.configFile} has invalid JSON: ${error.message}`);
          isValid = false;
        }
      } else {
        console.log(`⚠️  ${config.configFile} not found`);
      }
    });
    
    return isValid;
  }
}

// Main execution
if (require.main === module) {
  const switcher = new IDESwitcher();
  
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('IDE Switcher for MCP Configurations');
    console.log('====================================');
    console.log('Usage: node ide-switcher.js [command] [options]');
    console.log();
    console.log('Commands:');
    console.log('  <ide-type>     Switch to specific IDE (trae, cursor, vscode)');
    console.log('  --status, -s   Show current configuration status');
    console.log('  --list, -l     List available IDE configurations');
    console.log('  --master, -m   Create master configuration file');
    console.log('  --validate, -v Validate all configurations');
    console.log('  --help, -h     Show this help message');
    console.log();
    console.log('Examples:');
    console.log('  node ide-switcher.js trae');
    console.log('  node ide-switcher.js --status');
    console.log('  node ide-switcher.js --validate');
    process.exit(0);
  }
  
  const command = args[0];
  
  switch (command) {
    case '--status':
    case '-s':
      switcher.showStatus();
      break;
    case '--list':
    case '-l':
      switcher.listIDEs();
      break;
    case '--master':
    case '-m':
      switcher.createMasterConfig();
      break;
    case '--validate':
    case '-v':
      switcher.validate();
      break;
    default:
      // Assume it's an IDE type
      if (['trae', 'cursor', 'vscode'].includes(command)) {
        switcher.switchTo(command);
      } else {
        console.error(`❌ Unknown command or IDE type: ${command}`);
        console.log('Run "node ide-switcher.js --help" for usage information.');
        process.exit(1);
      }
  }
}

module.exports = IDESwitcher;