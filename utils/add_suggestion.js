const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Adds a new suggestion to the database.
 *
 * @async
 * @function addSuggestion
 * @param {Object} suggestionObj - The suggestion data to insert.
 * @param {string} suggestionObj.suggestionId - Unique suggestion identifier.
 * @param {string} suggestionObj.username - Username of the suggester.
 * @param {string} suggestionObj.name - Name of the suggester.
 * @param {string} suggestionObj.suggestionCategory - Category of the suggestion.
 * @param {string} suggestionObj.suggestionDescription - The actual suggestion text.
 * @param {Array<Object>} [suggestionObj.files] - Optional attached files.
 * @param {string} suggestionObj.suggestionStatus - Suggestion status ("live", "completed", "pending").
 * @param {boolean} [suggestionObj.accepted=false] - Whether the suggestion is accepted.
 *
 * @returns {Promise<boolean>} - `true` if suggestion is added successfully, otherwise `false`.
 */
async function addSuggestion(suggestionObj) {
  try {
    const newSuggestion = await prisma.Suggestion.create({
      data: {
        suggestionId: suggestionObj.suggestionId,
        username: suggestionObj.username,
        name: suggestionObj.name,
        suggestionCategory: suggestionObj.suggestionCategory,
        suggestionDescription: suggestionObj.suggestionDescription,
        files: suggestionObj.files || [],
        suggestionStatus: suggestionObj.suggestionStatus,
        accepted: suggestionObj.accepted || false,
      },
    });

    return !!newSuggestion; // return true if created, false otherwise
  } catch (error) {
    console.error("❌ Error adding suggestion:", error);
    return false;
  }
}

module.exports = addSuggestion;
