#!/usr/bin/env node

/**
 * Build CSS
 * Minifies CSS files for production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CSS_DIR = path.join(__dirname, '../assets/css');
const CSS_FILES = [
    'framework-unified.css',
    'typography-system.css'
];

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function buildCSS() {
    try {
        console.log('🔨 Building CSS files...\n');

        let totalOriginalSize = 0;
        let totalMinifiedSize = 0;

        CSS_FILES.forEach((filename) => {
            const inputPath = path.join(CSS_DIR, filename);
            const outputPath = path.join(CSS_DIR, filename.replace('.css', '.min.css'));

            if (!fs.existsSync(inputPath)) {
                console.error(`❌ Error: CSS file not found: ${inputPath}`);
                process.exit(1);
            }

            // Get original file size
            const originalStats = fs.statSync(inputPath);
            const originalSize = originalStats.size;
            totalOriginalSize += originalSize;

            // Minify using postcss-cli
            try {
                execSync(
                    `npx postcss "${inputPath}" -o "${outputPath}"`,
                    { cwd: path.join(__dirname, '..'), stdio: 'pipe' }
                );

                // Get minified file size
                const minifiedStats = fs.statSync(outputPath);
                const minifiedSize = minifiedStats.size;
                totalMinifiedSize += minifiedSize;

                const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

                console.log(`  ✅ ${filename}`);
                console.log(`     Original: ${formatBytes(originalSize)}`);
                console.log(`     Minified: ${formatBytes(minifiedSize)}`);
                console.log(`     Reduction: ${reduction}%\n`);

            } catch (error) {
                console.error(`❌ Error minifying ${filename}:`, error.message);
                process.exit(1);
            }
        });

        const totalReduction = ((1 - totalMinifiedSize / totalOriginalSize) * 100).toFixed(1);

        console.log('📊 Summary:');
        console.log(`   Total original: ${formatBytes(totalOriginalSize)}`);
        console.log(`   Total minified: ${formatBytes(totalMinifiedSize)}`);
        console.log(`   Total reduction: ${totalReduction}%\n`);

        console.log('✅ CSS build complete!\n');

    } catch (error) {
        console.error('❌ Error building CSS:', error.message);
        process.exit(1);
    }
}

// Run build
buildCSS();

