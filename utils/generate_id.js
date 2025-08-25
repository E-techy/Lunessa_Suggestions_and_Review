// utils/generate_id.js

const { v4: uuidv4 } = require("uuid");

/**
 * Generates a unique ID for a review or suggestion.
 * Combines username with UUID for traceability.
 *
 * @param {string} username
 * @returns {string} unique ID
 */
function generateID(username) {
  const safeUsername = username && typeof username === "string" && username.trim()
    ? username.trim()
    : "Anonymous";

  return `${safeUsername}-${uuidv4()}`;
}

module.exports = generateID;
