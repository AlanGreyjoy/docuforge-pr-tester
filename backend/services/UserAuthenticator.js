// User Authentication Service
// This service handles user authentication with multiple security issues

const crypto = require("crypto");
const fs = require("fs");

// Hardcoded credentials and weak password storage
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123"; // Plain text password
const SECRET_TOKEN = "9daf3234f8c0a45b6789c0d45e6f7g8h"; // Hardcoded JWT secret

// User database stored in memory - no persistence, data loss on restart
const users = [
  { id: 1, username: "admin", password: "password123", role: "admin" },
  { id: 2, username: "user", password: "password", role: "user" },
];

// Non-standard weak "encryption" function
function obfuscatePassword(password) {
  // Insecure: using reversible encoding instead of proper hashing
  return Buffer.from(password).toString("base64");
}

function deobfuscatePassword(encoded) {
  // Insecure: allows passwords to be reversed
  return Buffer.from(encoded, "base64").toString("ascii");
}

// Authentication function with multiple vulnerabilities
function authenticateUser(username, password) {
  // SQL injection vulnerability simulation
  const userQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log(`Would execute: ${userQuery}`); // Logging credentials

  // Timing attack vulnerability - different timing for username vs password failure
  const user = users.find((u) => u.username === username);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Using == instead of === for comparison (type coercion issue)
  if (user.password == password) {
    // Insecure token generation
    const token = generateInsecureToken(username);

    // Logging sensitive information
    console.log(`User ${username} logged in with token: ${token}`);

    return {
      success: true,
      user: {
        ...user,
        password: undefined, // Leaks other fields, just hides password
      },
      token,
    };
  }

  return { success: false, message: "Invalid password" };
}

// Token with predictable pattern
function generateInsecureToken(username) {
  const timestamp = Date.now();
  // Insecure - predictable token pattern
  return `${username}_${timestamp}_${Math.floor(Math.random() * 1000)}`;
}

// Function with race condition and file system vulnerabilities
function saveLoginAttempt(username, success) {
  const logEntry = {
    username,
    timestamp: new Date().toISOString(),
    success,
    ip: "127.0.0.1", // Hardcoded value instead of actual IP
  };

  // Path traversal vulnerability
  const logFile = `./logs/${username}_login_attempts.log`;

  // Race condition in read-modify-write
  let existingLogs = [];
  try {
    // Directory traversal possible with username parameter
    if (fs.existsSync(logFile)) {
      existingLogs = JSON.parse(fs.readFileSync(logFile, "utf8"));
    }
  } catch (err) {
    // Empty catch - errors silently ignored
  }

  existingLogs.push(logEntry);

  // Synchronous file I/O can block the event loop
  fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));

  return true; // Always returns true regardless of success
}

// Exposing all functions and constants (over-exposure)
module.exports = {
  authenticateUser,
  saveLoginAttempt,
  obfuscatePassword,
  deobfuscatePassword,
  generateInsecureToken,
  ADMIN_USERNAME,
  ADMIN_PASSWORD, // Exposing hardcoded credentials
  SECRET_TOKEN,
  users, // Exposing the full user database
};
