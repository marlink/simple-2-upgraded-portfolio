#!/usr/bin/env node

/**
 * Git Management Script
 * - Commits locally every time a task is completed
 * - Pushes to GitHub every 5 commits (batched push system)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMMIT_COUNTER_FILE = path.join(__dirname, '..', '.git-commit-counter');
const PUSH_BATCH_SIZE = 5;

class GitManager {
    constructor() {
        this.counterFile = COMMIT_COUNTER_FILE;
        this.batchSize = PUSH_BATCH_SIZE;
    }

    /**
     * Get current commit count
     */
    getCommitCount() {
        try {
            if (fs.existsSync(this.counterFile)) {
                const count = parseInt(fs.readFileSync(this.counterFile, 'utf8').trim(), 10);
                return isNaN(count) ? 0 : count;
            }
        } catch (error) {
            console.warn('Warning: Could not read commit counter file:', error.message);
        }
        return 0;
    }

    /**
     * Set commit count
     */
    setCommitCount(count) {
        try {
            fs.writeFileSync(this.counterFile, count.toString(), 'utf8');
        } catch (error) {
            console.error('Error: Could not write commit counter file:', error.message);
            throw error;
        }
    }

    /**
     * Increment commit count after a commit
     */
    incrementCommitCount() {
        const currentCount = this.getCommitCount();
        const newCount = currentCount + 1;
        this.setCommitCount(newCount);
        console.log(`📊 Commit counter: ${newCount}/${this.batchSize}`);
        return newCount;
    }

    /**
     * Check if we should push to GitHub (every 5 commits)
     */
    shouldPush() {
        const count = this.getCommitCount();
        return count >= this.batchSize;
    }

    /**
     * Reset commit counter after pushing
     */
    resetCommitCount() {
        this.setCommitCount(0);
        console.log('🔄 Commit counter reset to 0');
    }

    /**
     * Perform a commit with automatic counter management
     */
    commit(message) {
        try {
            // Stage all changes
            execSync('git add .', { stdio: 'inherit' });

            // Commit with message
            execSync(`git commit -m "${message}"`, { stdio: 'inherit' });

            // Increment counter
            const newCount = this.incrementCommitCount();

            // Check if we should push
            if (this.shouldPush()) {
                console.log(`🚀 Pushing to GitHub (batch ${Math.floor(newCount / this.batchSize)})...`);
                this.push();
                this.resetCommitCount();
            } else {
                console.log(`⏳ Skipping push (${newCount}/${this.batchSize} commits until next push)`);
            }

        } catch (error) {
            console.error('❌ Git commit failed:', error.message);
            throw error;
        }
    }

    /**
     * Push to remote repository
     */
    push() {
        try {
            execSync('git push origin main', { stdio: 'inherit' });
            console.log('✅ Successfully pushed to GitHub');
        } catch (error) {
            console.error('❌ Git push failed:', error.message);
            throw error;
        }
    }

    /**
     * Force push (for immediate push if needed)
     */
    forcePush() {
        console.log('🚀 Force pushing to GitHub...');
        this.push();
        this.resetCommitCount();
    }

    /**
     * Get status information
     */
    getStatus() {
        const count = this.getCommitCount();
        const nextPush = this.batchSize - count;

        console.log('📊 Git Manager Status:');
        console.log(`   Current commits: ${count}/${this.batchSize}`);
        console.log(`   Commits until push: ${nextPush}`);
        console.log(`   Should push now: ${this.shouldPush() ? 'Yes' : 'No'}`);

        return {
            currentCount: count,
            batchSize: this.batchSize,
            shouldPush: this.shouldPush(),
            commitsUntilPush: nextPush
        };
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const gitManager = new GitManager();

    switch (command) {
        case 'commit':
            if (!args[1]) {
                console.error('❌ Error: Commit message required');
                console.log('Usage: node scripts/git-manager.js commit "your commit message"');
                process.exit(1);
            }
            gitManager.commit(args.slice(1).join(' '));
            break;

        case 'push':
            gitManager.forcePush();
            break;

        case 'status':
            gitManager.getStatus();
            break;

        case 'reset':
            gitManager.resetCommitCount();
            console.log('✅ Commit counter reset');
            break;

        default:
            console.log('Git Manager Commands:');
            console.log('  commit <message>  - Commit locally, push to GitHub every 5 commits');
            console.log('  push              - Force push immediately');
            console.log('  status            - Show current status');
            console.log('  reset             - Reset commit counter');
            break;
    }
}

// Export for use in other scripts
module.exports = GitManager;

// Run CLI if called directly
if (require.main === module) {
    main();
}
