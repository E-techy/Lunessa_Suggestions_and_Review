// utils/admin/lock_suggestions.js

const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("./verify_admin");

const prisma = new PrismaClient();

/**
 * Locks a suggestion by marking it as accepted and setting status to "underReview".
 *
 * @async
 * @function lockSuggestion
 * @param {string} apiKey - API key for admin verification.
 * @param {string} authToken - JWT token for authentication.
 * @param {string} jwtSecret - Secret used for decoding JWT.
 * @param {string} suggestionId - Unique identifier of the suggestion to lock.
 * @returns {Promise<(
 *   "logged_out" |
 *   "not_an_admin" |
 *   "incorrect_api_key" |
 *   "unauthorized" |
 *   "suggestion_not_found" |
 *   "suggestion_locked_successfully"
 * )>}
 *
 * @example
 * const result = await lockSuggestion(apiKey, authToken, process.env.JWT_SECRET, "sug123");
 * if (result === "suggestion_locked_successfully") {
 *   console.log("Suggestion locked for review");
 * }
 */
async function lockSuggestion(apiKey, authToken, jwtSecret, suggestionId) {
  try {
    // ✅ Verify admin
    const admin = await verifyAdmin(apiKey, authToken, jwtSecret);

    if (
      admin === "logged_out" ||
      admin === "not_an_admin" ||
      admin === "incorrect_api_key"
    ) {
      return admin;
    }

    // ✅ Role check
    if (admin.role !== "superAdmin" && admin.role !== "edit") {
      return "unauthorized";
    }

    // ✅ Find suggestion
    const suggestion = await prisma.Suggestion.findUnique({
      where: { suggestionId },
    });

    if (!suggestion) {
      return "suggestion_not_found";
    }

    // ✅ Update suggestion
    await prisma.Suggestion.update({
      where: { suggestionId },
      data: {
        accepted: true,
        acceptedAt: new Date(),
        suggestionStatus: "underReview",
      },
    });

    return "suggestion_locked_successfully";
  } catch (error) {
    console.error("Error locking suggestion:", error);
    return "logged_out";
  }
}

module.exports = lockSuggestion;
