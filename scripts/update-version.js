#!/usr/bin/env node

/**
 * Updates version number in all HTML files
 * Reads version from version.json and updates footer copyright sections
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read version from version.json
const versionFile = path.join(__dirname, '..', 'version.json');
const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
const version = versionData.version;

// Get git commit hash
let gitCommit = '';
try {
  gitCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.warn('Warning: Could not get git commit hash, using version only');
}

// Create version string with git info
const versionWithGit = gitCommit ? `${version} (${gitCommit})` : version;

// HTML files to update
const htmlFiles = [
  'index.html',
  'about.html',
  'solutions.html',
  'contact.html',
  'blog.html',
  'blog-details.html',
  'showcase.html',
  '404.html',
  'typography-demo.html'
];

const rootDir = path.join(__dirname, '..');

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${file} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern to match the copyright line and add/update version
  // Matches: <p>@ <span id="year">2025</span> Design System LTD | Designed with love MC designss.</p>
  // Or similar patterns
const patterns = [
  // Standard pattern with copyright symbol
  /(<p>&copy; <span id="year">\d+<\/span> Design System LTD \| Designed with love MC designs\..*?<\/p>)/g,
  // Standard pattern with @ symbol
  /(<p>@ <span id="year">\d+<\/span> Design System LTD \| Designed with love MC designs\..*?<\/p>)/g,
  // Typography demo pattern
  /(<p>@ <span id="year">\d+<\/span> Design System LTD \| Fluid Typography System.*?<\/p>)/g
];
  
  let updated = false;
  
  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, (match) => {
        // Check if version already exists
        if (match.includes('ver.')) {
          // Update existing version
          return match.replace(/ver\. [\d\.\w\(\)\-\s]+/, `ver. ${versionWithGit}`);
        } else {
          // Add version
          return match.replace('</p>', ` | ver. ${versionWithGit}</p>`);
        }
      });
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${file} with version ${version}`);
  } else {
    console.warn(`⚠ Could not find copyright pattern in ${file}`);
  }
});

console.log(`\nVersion ${versionWithGit} has been updated in all HTML files.`);

