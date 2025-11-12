#!/usr/bin/env node

/**
 * Start Local Server for Testing
 *
 * Starts a local HTTP server for running browser tests
 * Uses python3 by default (macOS/Linux compatible)
 */

const { spawn } = require("child_process");
const path = require("path");
const { execSync } = require("child_process");

const PORT = process.env.PORT || 8000;
const PROJECT_ROOT = path.join(__dirname, "..");

// Check if port is in use
function isPortInUse(port) {
    try {
        const result = execSync(`lsof -ti:${port}`, { encoding: "utf8", stdio: "pipe" });
        return result.trim();
    } catch (e) {
        return null;
    }
}

// Kill process on port
function killProcessOnPort(port) {
    try {
        const pid = isPortInUse(port);
        if (pid) {
            console.log(`⚠️  Port ${port} is already in use (PID: ${pid})`);
            console.log(`   Attempting to free the port...`);
            execSync(`kill -9 ${pid}`, { stdio: "ignore" });
            // Wait a moment for the port to be released
            execSync("sleep 0.5", { stdio: "ignore" });
            console.log(`   ✅ Port ${port} is now available\n`);
            return true;
        }
    } catch (e) {
        console.error(`   ❌ Could not free port ${port}: ${e.message}`);
        return false;
    }
    return false;
}

// Find available port starting from the desired port
function findAvailablePort(startPort) {
    for (let port = startPort; port < startPort + 10; port++) {
        if (!isPortInUse(port)) {
            return port;
        }
    }
    return null;
}

// Find available server
function findServer(port) {
    try {
        // Try Python 3 first (most common on macOS/Linux)
        execSync("which python3", { stdio: "ignore" });
        return { command: "python3", args: ["-m", "http.server", port.toString()] };
    } catch (e) {
        // Try Node http-server
        try {
            execSync("which npx", { stdio: "ignore" });
            return { command: "npx", args: ["http-server", "-p", port.toString(), "-c-1"] };
        } catch (e2) {
            // Try PHP
            try {
                execSync("which php", { stdio: "ignore" });
                return { command: "php", args: ["-S", `localhost:${port}`] };
            } catch (e3) {
                // Default to python3 (will show error if not available)
                return { command: "python3", args: ["-m", "http.server", port.toString()] };
            }
        }
    }
}

// Start server
function startServer() {
    // Check if port is in use and try to free it
    let actualPort = PORT;
    if (isPortInUse(PORT)) {
        if (!killProcessOnPort(PORT)) {
            // If we couldn't kill the process, try to find an available port
            const availablePort = findAvailablePort(PORT);
            if (availablePort) {
                console.log(`   Using alternative port: ${availablePort}\n`);
                actualPort = availablePort;
            } else {
                console.error(
                    `\n❌ Could not find an available port. Please free port ${PORT} manually:\n`
                );
                console.error(`   lsof -ti:${PORT} | xargs kill -9\n`);
                process.exit(1);
            }
        }
    }

    const server = findServer(actualPort);

    console.log(`🚀 Starting local server on port ${actualPort}...`);
    console.log(`   Using: ${server.command} ${server.args.join(" ")}`);
    console.log(`   URL: http://localhost:${actualPort}`);
    console.log(`\n   Press Ctrl+C to stop the server\n`);

    const serverProcess = spawn(server.command, server.args, {
        cwd: PROJECT_ROOT,
        stdio: "inherit",
        shell: false,
    });

    serverProcess.on("error", (error) => {
        console.error(`❌ Failed to start server: ${error.message}`);
        console.error(`\n   Try one of these alternatives manually:\n`);
        console.error(`   python3 -m http.server ${actualPort}`);
        console.error(`   npx http-server -p ${actualPort}`);
        console.error(`   php -S localhost:${actualPort}\n`);
        process.exit(1);
    });

    process.on("SIGINT", () => {
        console.log("\n\n🛑 Stopping server...");
        serverProcess.kill();
        process.exit(0);
    });

    process.on("SIGTERM", () => {
        serverProcess.kill();
        process.exit(0);
    });
}

startServer();
