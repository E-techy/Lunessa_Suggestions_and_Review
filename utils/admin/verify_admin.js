// utils/admin/verify_admin.js

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Verify admin authentication using JWT auth token and API key.
 *
 * @async
 * @function verifyAdmin
 * @param {string} apiKey - The API key provided for authentication.
 * @param {string} authToken - The JWT authentication token.
 * @param {string} jwtSecret - The secret key used to verify and decode the JWT.
 * @returns {Promise<(
 *   "logged_out" |
 *   "not_an_admin" |
 *   "incorrect_api_key" |
 *   { username: string, role: string }
 * )>}
 *
 * @example
 * const result = await verifyAdmin(apiKey, authToken, process.env.JWT_SECRET);
 * if (result === "logged_out") {
 *   console.log("Invalid or expired token");
 * } else if (result === "not_an_admin") {
 *   console.log("User not found as admin");
 * } else if (result === "incorrect_api_key") {
 *   console.log("API key mismatch");
 * } else {
 *   console.log(`Welcome ${result.username}, role: ${result.role}`);
 * }
 */
async function verifyAdmin(apiKey, authToken, jwtSecret) {
  try {
    if (!authToken) {
      return "logged_out";
    }

    // Decode JWT
    const decoded = jwt.verify(authToken, jwtSecret);
    const username = decoded?.username;

    if (!username) {
      return "logged_out";
    }

    // Find admin in database
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return "not_an_admin";
    }

    // Verify API key
    if (admin.apiKey !== apiKey) {
      return "incorrect_api_key";
    }

    // Return admin object
    return {
      username: admin.username,
      role: admin.role,
    };
  } catch (error) {
    // Invalid token or other error
    return "logged_out";
  }
}

module.exports = verifyAdmin;
