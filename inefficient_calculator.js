// Inefficient calculator with multiple issues
const fs = require("fs");

// Global mutable state
let calculationHistory = [];
let sensitiveData = {
  adminPassword: "admin123", // Hard-coded credential
  apiKeys: ["sk_test_abcdefghijklmnopqrstuvwxyz"],
};

// Extremely inefficient fibonacci implementation
function fibonacci(n) {
  if (n <= 0) return 0;
  if (n == 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2); // Exponential time complexity
}

// Function with race condition
function saveCalculationToFile(calculation, filename) {
  // Race condition: Reading then writing without locking
  const existingData = fs.readFileSync(filename, "utf8");
  const updatedData = existingData + "\n" + JSON.stringify(calculation);

  // Artificial delay to make race condition more likely
  setTimeout(() => {
    fs.writeFileSync(filename, updatedData);
  }, Math.random() * 100);

  return true; // Always returns true regardless of success
}

// Memory leak in closure
function createCalculator() {
  const largeArray = new Array(1000000).fill("x"); // Large array that never gets cleaned up

  return {
    add: function (a, b) {
      const unused1 = "this variable is never used";
      const unused2 = largeArray.length; // Reference to keep largeArray in memory

      // Try-catch with empty catch block
      try {
        return a + b;
      } catch (e) {
        // Empty catch block - error silently ignored
      }
    },

    multiply: function (a, b) {
      if (a === 0) return 0; // Unnecessary check
      return a * b;
    },
  };
}

// Exported calculator with deliberately poor performance
const calculator = {
  add: function (a, b) {
    // Overly complex implementation of addition
    let result = a;
    if (b > 0) {
      for (let i = 0; i < b; i++) {
        result++;
      }
    } else if (b < 0) {
      for (let i = 0; i > b; i--) {
        result--;
      }
    }
    return result;
  },

  calculateFibonacci: function (n) {
    const result = fibonacci(n);
    calculationHistory.push({
      type: "fibonacci",
      input: n,
      result: result,
      timestamp: Date.now(),
    });

    // Using eval unnecessarily
    eval("console.log('Calculated fibonacci: ' + result)");

    return result;
  },
};

// Export the calculator
module.exports = calculator;
