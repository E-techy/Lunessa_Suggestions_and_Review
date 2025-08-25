// utils/delete_suggestion.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Deletes a suggestion if it belongs to the user and is not accepted.
 *
 * @param {string} suggestionId - Unique identifier of the suggestion to delete
 * @param {string} username - Username of the user attempting to delete
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
async function deleteSuggestion(suggestionId, username) {
  try {
    // 1️⃣ Fetch the suggestion first
    const suggestion = await prisma.suggestion.findUnique({
      where: { suggestionId },
    });

    if (!suggestion) {
      return {
        success: false,
        error: `Suggestion with ID ${suggestionId} not found`,
      };
    }

    // 2️⃣ Check if accepted is true
    if (suggestion.accepted) {
      return {
        success: false,
        error: `Suggestion with ID ${suggestionId} has already been accepted and cannot be deleted.`,
      };
    }

    // 3️⃣ Check ownership (username match)
    if (suggestion.username !== username) {
      return {
        success: false,
        error: `You are not the owner of suggestion ID ${suggestionId}.`,
      };
    }

    // 4️⃣ Passed all checks → delete suggestion
    await prisma.suggestion.delete({
      where: { suggestionId },
    });

    return { success: true, error: null };
  } catch (err) {
    console.error("Error deleting suggestion:", err);
    return {
      success: false,
      error: `Unexpected error while deleting suggestion ${suggestionId}: ${err.message}`,
    };
  }
}

module.exports = deleteSuggestion;
