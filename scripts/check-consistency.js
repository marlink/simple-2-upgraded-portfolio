#!/usr/bin/env node

/**
 * Consistency Checker Script
 * 
 * Checks for common consistency issues across the project:
 * - Inline styles
 * - Hardcoded colors
 * - Missing navigation links
 * - Inconsistent class names
 * - Duplicate IDs
 * - Missing ARIA labels
 * - Missing alt text
 * - Direct DOM manipulation
 * 
 * Run: npm run check:consistency
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const HTML_FILES = [
    'index.html',
    'about.html',
    'solutions.html',
    'contact.html',
    'blog.html',
    'blog-details.html',
    'showcase.html',
    'typography-demo.html',
    '404.html'
].map(file => path.join(PROJECT_ROOT, file));

const CSS_FILES = [
    'assets/css/framework-unified.css',
    'assets/css/typography-system.css'
].map(file => path.join(PROJECT_ROOT, file));

const JS_FILES = [
    'assets/js/main.js',
    'assets/js/components.js',
    'assets/js/utils.js'
].map(file => path.join(PROJECT_ROOT, file));

const REQUIRED_NAV_LINKS = ['Home', 'About', 'Solutions', 'Contact', 'Blog'];
const REQUIRED_NAV_HREFS = ['index.html', 'about.html', 'solutions.html', 'contact.html', 'blog.html'];

let errors = [];
let warnings = [];
let passed = [];

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, type = 'info') {
    const colorMap = {
        error: colors.red,
        warning: colors.yellow,
        success: colors.green,
        info: colors.cyan
    };
    const color = colorMap[type] || colors.reset;
    console.log(`${color}${message}${colors.reset}`);
}

function checkInlineStyles() {
    log('\n📋 Checking for inline styles...', 'info');
    let found = false;
    let showcaseCount = 0;
    
    HTML_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.basename(file);
        const inlineStyleRegex = /style\s*=\s*["'][^"']*["']/gi;
        const matches = content.match(inlineStyleRegex);
        
        if (matches) {
            // showcase.html is a demo page - inline styles are expected for demonstrations
            if (filename === 'showcase.html') {
                showcaseCount = matches.length;
                warnings.push({
                    file: filename,
                    issue: 'Inline styles in demo page',
                    detail: `${matches.length} inline style(s) found (expected in showcase/demo pages)`,
                    fix: 'Consider moving demo-specific styles to <style> block or separate CSS file'
                });
            } else {
                matches.forEach(match => {
                    // Allow style attributes in specific contexts (e.g., demo code, examples)
                    if (!match.includes('demo') && !match.includes('example') && !match.includes('display: none')) {
                        errors.push({
                            file: filename,
                            issue: 'Inline style found',
                            detail: match.substring(0, 50) + '...',
                            fix: 'Use utility classes (e.g., .mt-4, .py-6) instead'
                        });
                        found = true;
                    }
                });
            }
        }
    });
    
    if (!found && showcaseCount === 0) {
        passed.push('No inline styles found');
        log('✅ No inline styles found', 'success');
    } else if (showcaseCount > 0 && !found) {
        log(`⚠️  Found ${showcaseCount} inline style(s) in showcase.html (demo page - expected)`, 'warning');
    } else {
        log(`❌ Found ${errors.filter(e => e.issue === 'Inline style found').length} inline style(s)`, 'error');
    }
}

function checkHardcodedColors() {
    log('\n🎨 Checking for hardcoded colors in CSS...', 'info');
    let found = false;
    
    CSS_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.basename(file);
        // Match hex colors (#rrggbb or #rgb) that aren't in comments or CSS variables
        const hexColorRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/g;
        const matches = content.match(hexColorRegex);
        
        if (matches) {
            // Filter out colors in comments, CSS variable definitions, or :root selectors
            const actualMatches = matches.filter((match, index) => {
                const matchIndex = index > 0 ? content.indexOf(match, content.indexOf(matches[index - 1]) + 1) : content.indexOf(match);
                const before = content.substring(Math.max(0, matchIndex - 100), matchIndex);
                const after = content.substring(matchIndex, matchIndex + 100);
                
                // Allow in :root (CSS variable definitions), comments, or as fallbacks
                return !before.includes('/*') && 
                       !before.includes('*/') &&
                       !before.match(/:root\s*\{/) &&
                       !before.match(/--[a-z-]+:\s*$/) &&
                       !after.match(/^\s*;/) && // Not immediately followed by semicolon (likely in variable)
                       !before.includes('--color-');
            });
            
            if (actualMatches.length > 0) {
                warnings.push({
                    file: filename,
                    issue: 'Hardcoded color found',
                    detail: `${actualMatches.length} hardcoded color(s) found (may be in CSS variable definitions)`,
                    fix: 'Review if colors should use CSS custom properties (--color-*) instead'
                });
                found = true;
            }
        }
    });
    
    if (!found) {
        passed.push('No hardcoded colors found (outside CSS variable definitions)');
        log('✅ No hardcoded colors found', 'success');
    } else {
        log(`⚠️  Found hardcoded colors (review if in CSS variable definitions)`, 'warning');
    }
}

function checkNavigationConsistency() {
    log('\n🧭 Checking navigation consistency...', 'info');
    let issues = 0;
    
    HTML_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.basename(file);
        const missingLinks = [];
        
        REQUIRED_NAV_HREFS.forEach(href => {
            if (!content.includes(`href="${href}"`) && !content.includes(`href='${href}'`)) {
                missingLinks.push(href);
            }
        });
        
        if (missingLinks.length > 0) {
            errors.push({
                file: filename,
                issue: 'Missing navigation links',
                detail: `Missing: ${missingLinks.join(', ')}`,
                fix: 'Add all required navigation links (Home, About, Solutions, Contact, Blog)'
            });
            issues++;
        }
    });
    
    if (issues === 0) {
        passed.push('Navigation consistent across all pages');
        log('✅ Navigation consistent across all pages', 'success');
    } else {
        log(`❌ Found navigation issues in ${issues} file(s)`, 'error');
    }
}

function checkDuplicateIDs() {
    log('\n🆔 Checking for duplicate IDs...', 'info');
    const idMap = new Map();
    let found = false;
    
    // IDs that are intentionally shared across pages (skip these)
    const allowedSharedIDs = ['main-content', 'year'];
    
    HTML_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const idRegex = /id\s*=\s*["']([^"']+)["']/gi;
        let match;
        
        while ((match = idRegex.exec(content)) !== null) {
            const id = match[1];
            const filename = path.basename(file);
            
            // Skip intentionally shared IDs
            if (allowedSharedIDs.includes(id)) {
                continue;
            }
            
            if (idMap.has(id)) {
                const existing = idMap.get(id);
                if (existing.file !== filename) {
                    errors.push({
                        file: filename,
                        issue: 'Duplicate ID found',
                        detail: `ID "${id}" also used in ${existing.file}`,
                        fix: 'Make IDs unique per page or use classes instead'
                    });
                    found = true;
                }
            } else {
                idMap.set(id, { file: filename });
            }
        }
    });
    
    if (!found) {
        passed.push('No duplicate IDs found (excluding intentionally shared IDs)');
        log('✅ No duplicate IDs found', 'success');
    } else {
        log(`❌ Found duplicate IDs`, 'error');
    }
}

function checkMissingAltText() {
    log('\n🖼️  Checking for missing alt text...', 'info');
    let found = false;
    
    HTML_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.basename(file);
        
        // Find all img tags
        const imgRegex = /<img[^>]*>/gi;
        const matches = content.match(imgRegex);
        
        if (matches) {
            matches.forEach(imgTag => {
                // Check if alt attribute exists
                if (!imgTag.includes('alt=')) {
                    errors.push({
                        file: filename,
                        issue: 'Missing alt text',
                        detail: `Image tag: ${imgTag.substring(0, 50)}...`,
                        fix: 'Add alt="description" to all images'
                    });
                    found = true;
                } else if (imgTag.includes('alt=""') || imgTag.includes("alt=''")) {
                    // Empty alt is OK for decorative images, but warn
                    warnings.push({
                        file: filename,
                        issue: 'Empty alt text',
                        detail: 'Consider if image is decorative or needs description',
                        fix: 'Use alt="" only for decorative images'
                    });
                }
            });
        }
    });
    
    if (!found) {
        passed.push('All images have alt text');
        log('✅ All images have alt text', 'success');
    } else {
        log(`❌ Found images without alt text`, 'error');
    }
}

function checkMissingAriaLabels() {
    log('\n♿ Checking for missing ARIA labels...', 'info');
    let found = false;
    
    HTML_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.basename(file);
        
        // Check buttons without aria-label or text content
        const buttonRegex = /<button[^>]*>([^<]*)<\/button>/gi;
        let match;
        
        while ((match = buttonRegex.exec(content)) !== null) {
            const buttonTag = match[0];
            const buttonText = match[1].trim();
            
            // Skip if button has aria-label or aria-labelledby
            if (buttonTag.includes('aria-label') || buttonTag.includes('aria-labelledby')) {
                continue;
            }
            
            // Skip if button has visible text
            if (buttonText.length > 0 && !buttonText.match(/^[\s×&times;]*$/)) {
                continue;
            }
            
            // Icon-only buttons or buttons without text need aria-label
            if (buttonTag.includes('class="') && (
                buttonTag.includes('theme-toggle') ||
                buttonTag.includes('nav__burger') ||
                buttonTag.includes('alert__close') ||
                buttonTag.includes('carousel__nav-button')
            )) {
                // These should have aria-label, check if missing
                if (!buttonTag.includes('aria-label')) {
                    errors.push({
                        file: filename,
                        issue: 'Missing ARIA label on button',
                        detail: `Button: ${buttonTag.substring(0, 80)}...`,
                        fix: 'Add aria-label="description" to icon-only buttons'
                    });
                    found = true;
                }
            }
        }
    });
    
    if (!found) {
        passed.push('ARIA labels present on interactive elements');
        log('✅ ARIA labels present on interactive elements', 'success');
    } else {
        log(`❌ Found buttons missing ARIA labels`, 'error');
    }
}

function checkDirectDOMManipulation() {
    log('\n🔍 Checking for direct DOM manipulation...', 'info');
    let found = false;
    
    JS_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.basename(file);
        
        // Check for direct querySelector/querySelectorAll (should use safeQuery/safeQueryAll)
        const directDOMRegex = /(?:document|element)\.(querySelector|querySelectorAll|getElementById|getElementsByClassName)\(/g;
        const matches = content.match(directDOMRegex);
        
        if (matches) {
            // Filter out safeQuery/safeQueryAll definitions and comments
            const actualMatches = matches.filter((match, index) => {
                const matchIndex = content.indexOf(match, index > 0 ? content.indexOf(matches[index - 1]) + 1 : 0);
                const before = content.substring(Math.max(0, matchIndex - 100), matchIndex);
                return !before.includes('safeQuery') && !before.includes('//') && !before.includes('/*');
            });
            
            if (actualMatches.length > 0) {
                warnings.push({
                    file: filename,
                    issue: 'Direct DOM manipulation found',
                    detail: `${actualMatches.length} instance(s) of direct DOM access`,
                    fix: 'Use safeQuery() or safeQueryAll() from utils.js instead'
                });
                found = true;
            }
        }
    });
    
    if (!found) {
        passed.push('Using safe DOM query methods');
        log('✅ Using safe DOM query methods', 'success');
    } else {
        log(`⚠️  Found direct DOM manipulation (review if safeQuery unavailable)`, 'warning');
    }
}

function checkRequiredStructure() {
    log('\n📐 Checking required page structure...', 'info');
    let issues = 0;
    
    HTML_FILES.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.basename(file);
        const missing = [];
        
        // Check for required elements
        if (!content.includes('<!DOCTYPE html>')) missing.push('DOCTYPE');
        if (!content.includes('<html lang="en">')) missing.push('lang="en"');
        if (!content.includes('class="skip-link"')) missing.push('skip-link');
        if (!content.includes('id="main-content"')) missing.push('main-content');
        if (!content.includes('class="site-header"')) missing.push('site-header');
        if (!content.includes('class="nav"')) missing.push('navigation');
        
        if (missing.length > 0) {
            errors.push({
                file: filename,
                issue: 'Missing required structure',
                detail: `Missing: ${missing.join(', ')}`,
                fix: 'Add required page structure elements (see .cursorrules)'
            });
            issues++;
        }
    });
    
    if (issues === 0) {
        passed.push('Required page structure present');
        log('✅ Required page structure present', 'success');
    } else {
        log(`❌ Found structure issues in ${issues} file(s)`, 'error');
    }
}

function printSummary() {
    console.log('\n' + '='.repeat(60));
    log('\n📊 CONSISTENCY CHECK SUMMARY', 'info');
    console.log('='.repeat(60));
    
    if (passed.length > 0) {
        log(`\n✅ Passed (${passed.length}):`, 'success');
        passed.forEach(item => {
            log(`   ✓ ${item}`, 'success');
        });
    }
    
    if (warnings.length > 0) {
        log(`\n⚠️  Warnings (${warnings.length}):`, 'warning');
        warnings.forEach(warning => {
            log(`\n   File: ${warning.file}`, 'warning');
            log(`   Issue: ${warning.issue}`, 'warning');
            log(`   Detail: ${warning.detail}`, 'warning');
            log(`   Fix: ${warning.fix}`, 'warning');
        });
    }
    
    if (errors.length > 0) {
        log(`\n❌ Errors (${errors.length}):`, 'error');
        errors.forEach(error => {
            log(`\n   File: ${error.file}`, 'error');
            log(`   Issue: ${error.issue}`, 'error');
            log(`   Detail: ${error.detail}`, 'error');
            log(`   Fix: ${error.fix}`, 'error');
        });
    }
    
    console.log('\n' + '='.repeat(60));
    
    const totalIssues = errors.length + warnings.length;
    if (totalIssues === 0) {
        log('\n🎉 All consistency checks passed!', 'success');
        return 0;
    } else {
        log(`\n⚠️  Found ${totalIssues} issue(s) (${errors.length} errors, ${warnings.length} warnings)`, 'warning');
        log('   Review the issues above and fix before committing.', 'warning');
        return errors.length > 0 ? 1 : 0;
    }
}

function main() {
    log('🔍 Running consistency checks...', 'info');
    log('   This may take a moment...\n', 'info');
    
    checkInlineStyles();
    checkHardcodedColors();
    checkNavigationConsistency();
    checkDuplicateIDs();
    checkMissingAltText();
    checkMissingAriaLabels();
    checkDirectDOMManipulation();
    checkRequiredStructure();
    
    const exitCode = printSummary();
    process.exit(exitCode);
}

main();

