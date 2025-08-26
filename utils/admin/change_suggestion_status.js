// utils/admin/change_suggestion_status.js

const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("./verify_admin");

const prisma = new PrismaClient();

/**
 * Change suggestion status, syncs with Live/Completed models if required.
 *
 * @async
 * @function changeSuggestionStatus
 * @param {string} apiKey - API key for admin verification.
 * @param {string} authToken - JWT token for authentication.
 * @param {string} jwtSecret - Secret used for decoding JWT.
 * @param {string} suggestionId - Unique identifier of the suggestion.
 * @param {string} suggestionStatus - New status of the suggestion.
 * @returns {Promise<(
 *   "logged_out" |
 *   "not_an_admin" |
 *   "incorrect_api_key" |
 *   "unauthorized" |
 *   "suggestion_not_found" |
 *   "status_changed_successfully"
 * )>}
 */
async function changeSuggestionStatus(apiKey, authToken, jwtSecret, suggestionId, suggestionStatus) {
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

    // ✅ Handle live/completed separately
    if (suggestionStatus === "live") {
      // ➡️ Add to LiveSuggestion
      await prisma.LiveSuggestion.upsert({
        where: { suggestionId },
        update: {},
        create: {
          suggestionId,
          createdAt: suggestion.createdAt,
          acceptedAt: suggestion.acceptedAt,
        },
      });

      // ➡️ Remove from CompletedSuggestion if exists
      await prisma.CompletedSuggestion.deleteMany({
        where: { suggestionId },
      });

    } else if (suggestionStatus === "completed") {
      // ➡️ Add to CompletedSuggestion
      await prisma.CompletedSuggestion.upsert({
        where: { suggestionId },
        update: {},
        create: {
          suggestionId,
          createdAt: suggestion.createdAt,
          acceptedAt: suggestion.acceptedAt,
          // resolutionDate will auto default to now()
        },
      });

      // ➡️ Remove from LiveSuggestion if exists
      await prisma.LiveSuggestion.deleteMany({
        where: { suggestionId },
      });
    }

    // ✅ Always update main Suggestion model
    await prisma.Suggestion.update({
      where: { suggestionId },
      data: { suggestionStatus },
    });

    return "status_changed_successfully";
  } catch (error) {
    console.error("Error changing suggestion status:", error);
    return "logged_out";
  }
}

module.exports = changeSuggestionStatus;
