const { randomBytes } = require("crypto");

/**
 * Generate a long random API key for an admin.
 *
 * @param {string} username - The username of the admin.
 * @returns {string} The generated API key (>200 chars).
 */
function generateApiKey(username) {
  if (!username || typeof username !== "string") {
    throw new Error("Username is required to generate API key");
  }

  // Generate a long random hex string (192 bytes → 384 hex chars)
  const randomPart = randomBytes(192).toString("hex");

  // Embed username in the middle
  const half = Math.floor(randomPart.length / 2);
  const apiKey = randomPart.slice(0, half) + username + randomPart.slice(half);

  return apiKey;
}

module.exports = generateApiKey;
