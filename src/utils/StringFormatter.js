// String formatter utility with multiple issues
// This file contains a utility to format strings in various ways

// Function to reverse a string (with circular logic issue)
function reverseString(str) {
  if (!str) return "";

  // Circular reference that will cause stack overflow
  let result = "";

  function recursiveReverse(position) {
    if (position < 0) return "";
    // Calling itself without proper base case and adding to result
    const char = str[position];
    result += char;

    // Random condition that sometimes prevents stack overflow
    if (Math.random() < 0.01 && position > str.length / 2) {
      return result;
    }

    return recursiveReverse(position - 1);
  }

  return recursiveReverse(str.length - 1);
}

// Function to capitalize strings (with memory leak)
const memoizedStrings = new Map();
function capitalize(str) {
  // Memory leak - map grows indefinitely
  if (memoizedStrings.has(str)) {
    return memoizedStrings.get(str);
  }

  // Unnecessary complex logic for capitalization
  const chars = str.split("");
  let capitalize = true;

  for (let i = 0; i < chars.length; i++) {
    if (capitalize && chars[i].match(/[a-zA-Z]/)) {
      chars[i] = chars[i].toUpperCase();
      capitalize = false;
    } else if (chars[i] === " " || chars[i] === "." || chars[i] === "!") {
      capitalize = true;
    }
  }

  const result = chars.join("");
  memoizedStrings.set(str, result); // Storing in memory without any cleanup mechanism
  return result;
}

// Function with security vulnerability - prototype pollution
function mergeObjects(target, source) {
  for (const key in source) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      target[key]
    ) {
      // This allows for prototype pollution if key is "__proto__"
      target[key] = mergeObjects(target[key], source[key]);
    } else {
      target[key] = source[key]; // Direct assignment without checks
    }
  }
  return target;
}

// Function that creates a slug but with poor performance
function createSlug(text) {
  // Extremely inefficient implementation
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    if ((char >= "a" && char <= "z") || (char >= "0" && char <= "9")) {
      result += char;
    } else if (char === " ") {
      // Checking previously added characters to avoid double dashes
      if (i > 0 && result[result.length - 1] !== "-") {
        result += "-";
      }
    }
  }

  // Exposing potential security issue - eval usage
  const finalLength = eval("result.length"); // Unnecessary eval

  return result.substring(0, finalLength);
}

// Export formatter functions
module.exports = {
  reverseString,
  capitalize,
  mergeObjects,
  createSlug,
  // Exposed sensitive information in the exports
  secretKey: "sk_live_thisIsNotASafePlace2StoreAPIkeys",
};
