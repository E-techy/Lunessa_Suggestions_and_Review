const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch suggestions based on filter type, timestamp, and suggestion type.
 * The logic is updated to filter based on the 'accepted' status.
 *
 * @async
 * @function getActiveSuggestions
 * @param {Object} options
 * @param {Date|string|number|null} [options.timestamp] - Reference timestamp for pagination.
 * @param {"latest"|"oldest"} options.filterType - Determines the sorting order and time-based filtering. Fetches suggestions before ("latest") or after ("oldest") the timestamp.
 * @param {"active"|"pending"} options.suggestionType - Determines the core filtering criteria for suggestions.
 * - "pending": Fetches suggestions where 'accepted' is false and status is 'pending'.
 * - "active": Fetches suggestions where 'accepted' is true and status is not 'completed' or 'live'.
 * @returns {Promise<{ success: boolean, suggestions?: Array<Object> }>} A promise that resolves to an object indicating success and containing the suggestions array.
 */
async function getActiveSuggestions({ timestamp = null, filterType = "latest", suggestionType = "active" }) {
  try {
    // Build the base 'where' condition based on the suggestionType
    let whereCondition = {};

    if (suggestionType === "pending") {
      // For "pending", we need suggestions that are not yet accepted.
      whereCondition = {
        suggestionStatus: "pending",
        accepted: false,
      };
    } else { // This handles the "active" case
      // For "active", we need suggestions that are accepted but not yet completed or live.
      whereCondition = {
        suggestionStatus: { notIn: ["completed", "live"] },
        accepted: true,
      };
    }

    // Add timestamp-based filtering for pagination
    if (timestamp) {
      const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

      if (filterType === "latest") {
        // Fetch records created *before* the provided timestamp
        whereCondition.createdAt = { lt: cutoffDate };
      } else if (filterType === "oldest") {
        // Fetch records created *after* the provided timestamp
        whereCondition.createdAt = { gt: cutoffDate };
      }
    }

    // Define the ordering logic based on the filterType
    let orderByCondition = {};
    if (filterType === "latest") {
      orderByCondition = { createdAt: "desc" }; // Most recent first
    } else {
      orderByCondition = { createdAt: "asc" }; // Oldest first
    }

    // Fetch the suggestions from the database
    let suggestions = await prisma.Suggestion.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      take: 4, // Limit the results to 4
    });

    // Remove the 'username' field from each suggestion before returning
    suggestions = suggestions.map(({ username, ...rest }) => rest);

    return { success: true, suggestions };
  } catch (error) {
    console.error("❌ Error fetching active suggestions:", error);
    return { success: false };
  }
}

module.exports = getActiveSuggestions;
