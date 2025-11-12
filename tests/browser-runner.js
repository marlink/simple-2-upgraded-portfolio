#!/usr/bin/env node

/**
 * Browser Test Runner
 * 
 * Runs browser-based tests using Puppeteer
 * Can be extended to work with MCP browser tools
 */

const puppeteer = require('puppeteer');
const config = require('./config');
const path = require('path');
const fs = require('fs');

// Import test files
const themeTests = require('./specs/theme.test');
const navigationTests = require('./specs/navigation.test');
const componentsTests = require('./specs/components.test');
const accessibilityTests = require('./specs/accessibility.test');

// Helper functions
const helpers = {
  async goto(page, url) {
    const fullUrl = url.startsWith('http') ? url : `${config.baseUrl}${url}`;
    await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: config.timeouts.navigation });
  },
  
  async $(page, selector) {
    try {
      return await page.$(selector);
    } catch (e) {
      return null;
    }
  },
  
  async $$(page, selector) {
    try {
      return await page.$$(selector);
    } catch (e) {
      return [];
    }
  },
  
  async click(page, selector) {
    await page.waitForSelector(selector, { timeout: config.timeouts.element });
    await page.click(selector);
  },
  
  async type(page, selector, text) {
    await page.waitForSelector(selector, { timeout: config.timeouts.element });
    await page.type(selector, text);
  },
  
  async getText(page, selector) {
    const element = await this.$(page, selector);
    if (!element) return null;
    return await page.evaluate(el => el.textContent, element);
  },
  
  async getAttribute(page, selector, attribute) {
    const element = await this.$(page, selector);
    if (!element) return null;
    return await page.evaluate((el, attr) => el.getAttribute(attr), element, attribute);
  },
  
  async isVisible(page, selector) {
    const element = await this.$(page, selector);
    if (!element) return false;
    return await page.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0' &&
             el.offsetWidth > 0 &&
             el.offsetHeight > 0;
    }, element);
  },
  
  async evaluate(page, fn) {
    return await page.evaluate(fn);
  },
  
  async setViewport(page, size) {
    const viewport = typeof size === 'string' ? config.viewports[size] : size;
    await page.setViewport(viewport);
  },
  
  expect(value) {
    return {
      toBe(expected) {
        if (value !== expected) {
          throw new Error(`Expected ${expected}, but got ${value}`);
        }
      },
      notToBe(expected) {
        if (value === expected) {
          throw new Error(`Expected value not to be ${expected}`);
        }
      },
      toBeNull() {
        if (value !== null) {
          throw new Error(`Expected null, but got ${value}`);
        }
      },
      notToBeNull() {
        if (value === null) {
          throw new Error('Expected value not to be null');
        }
      },
      toBeTruthy() {
        if (!value) {
          throw new Error(`Expected truthy value, but got ${value}`);
        }
      },
      toBeFalsy() {
        if (value) {
          throw new Error(`Expected falsy value, but got ${value}`);
        }
      },
      toContain(substring) {
        if (typeof value === 'string' && !value.includes(substring)) {
          throw new Error(`Expected "${value}" to contain "${substring}"`);
        }
      },
      toBeGreaterThanOrEqual(expected) {
        if (value < expected) {
          throw new Error(`Expected ${value} to be >= ${expected}`);
        }
      }
    };
  }
};

// Test suites
const testSuites = [
  themeTests,
  navigationTests,
  componentsTests,
  accessibilityTests
];

// Results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

// Run a single test
async function runTest(test, page, suiteName) {
  try {
    process.stdout.write(`  ✓ ${test.name}... `);
    await test.run(page, helpers);
    console.log('✅');
    passedTests++;
    return { name: test.name, passed: true };
  } catch (error) {
    console.log('❌');
    console.error(`    Error: ${error.message}`);
    failedTests++;
    failures.push({ suite: suiteName, test: test.name, error: error.message });
    
    // Take screenshot on failure
    if (config.screenshots.onFailure) {
      const dir = path.join(process.cwd(), config.screenshots.directory);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filename = `${suiteName}-${test.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({ 
        path: path.join(dir, filename), 
        fullPage: true 
      });
    }
    
    return { name: test.name, passed: false, error: error.message };
  }
}

// Run a test suite
async function runSuite(suite, page) {
  console.log(`\n📋 ${suite.name}`);
  console.log('─'.repeat(60));
  
  const results = [];
  for (const test of suite.tests) {
    totalTests++;
    const result = await runTest(test, page, suite.name);
    results.push(result);
  }
  
  return results;
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Browser Tests');
  console.log('═'.repeat(60));
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Headless: ${config.browser.headless === "new" ? "new (recommended)" : config.browser.headless}`);
  console.log('═'.repeat(60));
  
  let browser;
  let page;
  
  try {
    // Launch browser
    browser = await puppeteer.launch(config.browser);
    page = await browser.newPage();
    await page.setViewport(config.viewports.desktop);
    page.setDefaultTimeout(config.timeouts.element);
    
    // Run all test suites
    for (const suite of testSuites) {
      await runSuite(suite, page);
    }
    
    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 Test Summary');
    console.log('═'.repeat(60));
    console.log(`Total: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    
    if (failures.length > 0) {
      console.log('\n❌ Failures:');
      failures.forEach(f => {
        console.log(`  - ${f.suite}: ${f.test}`);
        console.log(`    ${f.error}`);
      });
    }
    
    console.log('═'.repeat(60));
    
    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if specific file requested
const args = process.argv.slice(2);
if (args.includes('--file')) {
  const fileIndex = args.indexOf('--file');
  const fileName = args[fileIndex + 1];
  // Filter test suites by file name
  // This is a simple implementation - can be enhanced
}

// Run tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

