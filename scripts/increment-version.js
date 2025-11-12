#!/usr/bin/env node

/**
 * Increments version number by 0.0.1
 * Updates version.json and then updates all HTML files
 */

const fs = require("fs");
const path = require("path");

const versionFile = path.join(__dirname, "..", "version.json");

// Read current version
const versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
const oldVersion = versionData.version;
const [major, minor, patch] = oldVersion.split(".").map(Number);

// Increment patch version by 1 (0.0.1 increment)
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update version.json
versionData.version = newVersion;
fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2) + "\n", "utf8");

console.log(`Version incremented: ${oldVersion} → ${newVersion}`);

// Update HTML files
const { execSync } = require("child_process");
try {
    execSync("node scripts/update-version.js", {
        cwd: path.join(__dirname, ".."),
        stdio: "inherit",
    });
} catch (error) {
    console.error("Error updating HTML files:", error.message);
    process.exit(1);
}

// Check if comprehensive review is needed (every 5 versions)
console.log("\n🔍 Checking if comprehensive review is needed...");
try {
    execSync("node scripts/check-review-needed.js", {
        cwd: path.join(__dirname, ".."),
        stdio: "inherit",
    });
} catch (error) {
    // Exit code 1 means review is needed (this is expected)
    if (error.status === 1) {
        console.log("\n⚠️  Please complete the comprehensive review before continuing.");
        console.log("   Run: npm run review:check to see details again");
    } else {
        console.error("Error checking review status:", error.message);
    }
}
