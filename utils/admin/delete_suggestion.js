// utils/admin/delete_suggestion.js

const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("./verify_admin");

const prisma = new PrismaClient();

/**
 * Deletes a suggestion (and its related entries in LiveSuggestion and CompletedSuggestion)
 * if the admin has sufficient privileges.
 *
 * @async
 * @function deleteSuggestion
 * @param {string} apiKey - API key for admin verification.
 * @param {string} authToken - JWT token for authentication.
 * @param {string} jwtSecret - Secret used for decoding JWT.
 * @param {string} suggestionId - Unique identifier of the suggestion to delete.
 * @returns {Promise<(
 *   "logged_out" |
 *   "not_an_admin" |
 *   "incorrect_api_key" |
 *   "unauthorized" |
 *   "suggestion_not_found" |
 *   "suggestion_deleted_successfully"
 * )>}
 *
 * @example
 * const result = await deleteSuggestion(apiKey, authToken, process.env.JWT_SECRET, "sug123");
 * if (result === "suggestion_deleted_successfully") {
 *   console.log("Suggestion and related entries deleted");
 * }
 */
async function deleteSuggestion(apiKey, authToken, jwtSecret, suggestionId) {
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
    if (admin.role !== "superAdmin" && admin.role !== "delete") {
      return "unauthorized";
    }

    // ✅ Find suggestion
    const suggestion = await prisma.Suggestion.findUnique({
      where: { suggestionId },
    });

    if (!suggestion) {
      return "suggestion_not_found";
    }

    // ✅ Delete from Suggestion
    await prisma.Suggestion.delete({
      where: { suggestionId },
    });

    // ✅ Delete from LiveSuggestion
    await prisma.LiveSuggestion.deleteMany({
      where: { suggestionId },
    });

    // ✅ Delete from CompletedSuggestion
    await prisma.CompletedSuggestion.deleteMany({
      where: { suggestionId },
    });

    return "suggestion_deleted_successfully";
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return "logged_out";
  }
}

module.exports = deleteSuggestion;
