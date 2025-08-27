const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch all suggestions associated with a given username.
 *
 * This function queries the Suggestion collection and returns
 * all suggestions where the `username` field matches the provided input.
 *
 * @async
 * @function findYourSuggestions
 * @param {string} username - The username whose suggestions need to be fetched.
 * @returns {Promise<Object>} - An object containing:
 *   - success {boolean} : Operation status
 *   - suggestions {Array<Object>} : List of matching suggestion documents
 *   - message {string} : Optional message if no suggestions found or error occurs
 *
 * @example
 * const { findYourSuggestions } = require("./utils/find_your_suggestions");
 * 
 * (async () => {
 *   const result = await findYourSuggestions("john_doe");
 *   console.log(result);
 * })();
 */
async function findYourSuggestions(username) {
  try {
    if (!username || typeof username !== "string") {
      return {
        success: false,
        message: "A valid username must be provided.",
        suggestions: [],
      };
    }

    const suggestions = await prisma.Suggestion.findMany({
      where: { username },
      orderBy: { createdAt: "desc" }, // latest first
    });

    if (suggestions.length === 0) {
      return {
        success: true,
        message: `No suggestions found for username: ${username}`,
        suggestions: [],
      };
    }

    return {
      success: true,
      suggestions,
    };
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return {
      success: false,
      message: "An error occurred while fetching suggestions.",
      suggestions: [],
    };
  }
}

module.exports = findYourSuggestions;
