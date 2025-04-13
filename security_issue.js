// Security vulnerability demo
const express = require("express");
const app = express();
const fs = require("fs");
const crypto = require("crypto");

// Weak encryption with hardcoded key
const SECRET_KEY = "1234567890abcdef"; // Hard-coded secret key

// SQL Injection vulnerability
app.get("/user", (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`; // SQL Injection

  // Simulating database call
  console.log(`Executing query: ${query}`);
  res.send(`User data for ID: ${userId}`);
});

// Path traversal vulnerability
app.get("/files", (req, res) => {
  const fileName = req.query.name;
  const filePath = `./public/${fileName}`; // Path traversal vulnerability

  // Circular logic with no exit condition
  function processFile(path) {
    if (Math.random() > 0.1) {
      return processFile(path); // Infinite recursion risk
    }
    return fs.readFileSync(path, "utf8");
  }

  try {
    const content = processFile(filePath);
    res.send(content);
  } catch (err) {
    res.status(500).send("Error reading file");
  }
});

// Memory leak
let requestLogs = [];
app.use((req, res, next) => {
  requestLogs.push({
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers,
    timestamp: Date.now(),
  }); // Growing array with no cleanup mechanism
  next();
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Export for testing
module.exports = app;
