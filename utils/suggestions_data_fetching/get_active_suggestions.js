const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch suggestions based on filter type, timestamp, and suggestion type.
 *
 * @async
 * @function getActiveSuggestions
 * @param {Object} options
 * @param {Date|string|number|null} [options.timestamp] - Reference timestamp
 * @param {"latest"|"oldest"} options.filterType - Whether to fetch latest or oldest
 * @param {"active"|"pending"} options.suggestionType - Whether to fetch pending only or active ones
 * @returns {Promise<{ success: boolean, suggestions?: Array<Object> }>}
 */
async function getActiveSuggestions({ timestamp = null, filterType = "latest", suggestionType = "active" }) {
  try {
    // Filtering condition for suggestionStatus
    let statusCondition;
    if (suggestionType === "pending") {
      statusCondition = { suggestionStatus: "pending" };
    } else {
      statusCondition = { suggestionStatus: { notIn: ["completed", "live"] } };
    }

    // Build base condition
    let whereCondition = { ...statusCondition };

    if (timestamp) {
      const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

      if (filterType === "latest") {
        whereCondition.createdAt = { lt: cutoffDate }; // before timestamp
      } else if (filterType === "oldest") {
        whereCondition.createdAt = { gt: cutoffDate }; // after timestamp
      }
    }

    // Ordering logic
    let orderByCondition = {};
    if (filterType === "latest") {
      orderByCondition = { createdAt: "desc" }; // most recent first
    } else {
      orderByCondition = { createdAt: "asc" }; // oldest first
    }

    // Fetch data
    let suggestions = await prisma.Suggestion.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      take: 4,
    });

    // Remove username before returning
    suggestions = suggestions.map(({ username, ...rest }) => rest);

    return { success: true, suggestions };
  } catch (error) {
    console.error("❌ Error fetching active suggestions:", error);
    return { success: false };
  }
}

module.exports = getActiveSuggestions;
