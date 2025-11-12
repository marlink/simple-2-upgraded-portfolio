#!/usr/bin/env node

/**
 * Test Runner
 * 
 * Main entry point for running all tests
 * Currently delegates to browser-runner.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running all tests...\n');

try {
  // Run browser tests
  execSync('node tests/browser-runner.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} catch (error) {
  console.error('Tests failed');
  process.exit(1);
}

