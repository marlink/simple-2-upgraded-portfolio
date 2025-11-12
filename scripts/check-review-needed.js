#!/usr/bin/env node

/**
 * Checks if a comprehensive project review is needed
 * Reviews are required every 5 versions (0.0.5, 0.1.0, 0.1.5, etc.)
 */

const fs = require("fs");
const path = require("path");

const versionFile = path.join(__dirname, "..", "version.json");
const reviewTrackerFile = path.join(__dirname, "..", ".review-tracker.json");

// Review interval (every 5 versions)
const REVIEW_INTERVAL = 5;

/**
 * Get current version
 */
function getCurrentVersion() {
    try {
        const versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
        return versionData.version;
    } catch (error) {
        console.error("Error reading version.json:", error.message);
        process.exit(1);
    }
}

/**
 * Get or create review tracker
 */
function getReviewTracker() {
    let tracker = {
        lastReviewVersion: null,
        reviewCount: 0,
    };

    if (fs.existsSync(reviewTrackerFile)) {
        try {
            tracker = JSON.parse(fs.readFileSync(reviewTrackerFile, "utf8"));
        } catch (error) {
            console.warn("Error reading review tracker, creating new one");
        }
    }

    return tracker;
}

/**
 * Save review tracker
 */
function saveReviewTracker(tracker) {
    fs.writeFileSync(reviewTrackerFile, JSON.stringify(tracker, null, 2) + "\n", "utf8");
}

/**
 * Parse version string to number for comparison
 * Converts "0.0.4" to 4, "0.1.0" to 10, etc.
 */
function versionToNumber(version) {
    const [major, minor, patch] = version.split(".").map(Number);
    return major * 100 + minor * 10 + patch;
}

/**
 * Check if review is needed
 */
function checkReviewNeeded() {
    const currentVersion = getCurrentVersion();
    const tracker = getReviewTracker();
    const currentVersionNum = versionToNumber(currentVersion);

    // If no previous review, check if we're at a review milestone
    if (tracker.lastReviewVersion === null) {
        // Check if current version is a multiple of REVIEW_INTERVAL
        if (currentVersionNum % REVIEW_INTERVAL === 0) {
            return {
                needed: true,
                reason: `Version ${currentVersion} is a review milestone (every ${REVIEW_INTERVAL} versions)`,
                currentVersion,
                tracker,
            };
        }
        return { needed: false, currentVersion, tracker };
    }

    const lastReviewVersionNum = versionToNumber(tracker.lastReviewVersion);
    const versionsSinceReview = currentVersionNum - lastReviewVersionNum;

    if (versionsSinceReview >= REVIEW_INTERVAL) {
        return {
            needed: true,
            reason: `${versionsSinceReview} versions since last review (${tracker.lastReviewVersion} → ${currentVersion})`,
            currentVersion,
            tracker,
        };
    }

    return {
        needed: false,
        versionsSinceReview,
        currentVersion,
        tracker,
    };
}

/**
 * Mark review as completed
 */
function markReviewCompleted() {
    const currentVersion = getCurrentVersion();
    const tracker = getReviewTracker();

    tracker.lastReviewVersion = currentVersion;
    tracker.reviewCount = (tracker.reviewCount || 0) + 1;
    tracker.lastReviewDate = new Date().toISOString();

    saveReviewTracker(tracker);

    console.log(`✅ Review marked as completed for version ${currentVersion}`);
    console.log(`   Total reviews completed: ${tracker.reviewCount}`);
}

// Main execution
if (require.main === module) {
    const result = checkReviewNeeded();

    if (result.needed) {
        console.log("\n⚠️  COMPREHENSIVE PROJECT REVIEW REQUIRED ⚠️");
        console.log("=".repeat(60));
        console.log(`Reason: ${result.reason}`);
        console.log(`Current Version: ${result.currentVersion}`);
        if (result.tracker.lastReviewVersion) {
            console.log(`Last Review: ${result.tracker.lastReviewVersion}`);
        }
        console.log("\n📋 Review Checklist:");
        console.log("   1. Review project structure and hierarchy");
        console.log("   2. Remove inconsistencies and unnecessary code");
        console.log("   3. Fix errors and address bugs");
        console.log("   4. Optimize code for lightweight and faster development");
        console.log("   5. Update sitemap");
        console.log("   6. Run: npm run check:consistency");
        console.log("   7. Run: npm run lint:all");
        console.log("   8. Run: npm test");
        console.log("\n📄 See OPTIMIZATION-REPORT.md for reference");
        console.log("📄 See docs/REVIEW-AND-OPTIMIZATION.md for detailed checklist");
        console.log("\nAfter completing review, run:");
        console.log("   node scripts/check-review-needed.js --mark-complete");
        console.log("=".repeat(60) + "\n");
        process.exit(1);
    } else {
        const remaining = REVIEW_INTERVAL - (result.versionsSinceReview || 0);
        console.log(`✅ No review needed. ${remaining} version(s) until next review.`);
        if (result.tracker.lastReviewVersion) {
            console.log(`   Last review: ${result.tracker.lastReviewVersion}`);
        }
    }
}

// Handle --mark-complete flag
if (process.argv.includes("--mark-complete")) {
    markReviewCompleted();
    process.exit(0);
}

module.exports = { checkReviewNeeded, markReviewCompleted };
