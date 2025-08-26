const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch live suggestions with linked details from Suggestion model.
 *
 * @async
 * @function getLiveSuggestions
 * @param {Object} options
 * @param {Date|string|number|null} [options.timestamp] - Reference timestamp for pagination
 * @param {"latest"|"oldest"} [options.filterType="latest"] - Fetch order
 * @returns {Promise<{ success: boolean, suggestions?: Array<Object> }>}
 */
async function getLiveSuggestions({ timestamp = null, filterType = "latest" }) {
  try {
    let whereCondition = {};

    if (timestamp) {
      const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

      if (filterType === "latest") {
        whereCondition.createdAt = { lt: cutoffDate }; // get before timestamp
      } else if (filterType === "oldest") {
        whereCondition.createdAt = { gt: cutoffDate }; // get after timestamp
      }
    }

    // Sorting order
    let orderByCondition = {};
    if (filterType === "latest") {
      orderByCondition = { createdAt: "desc" };
    } else {
      orderByCondition = { createdAt: "asc" };
    }

    // Get 4 live suggestion trackers
    const liveSuggestions = await prisma.LiveSuggestion.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      take: 4,
    });

    // Fetch corresponding Suggestion details
    const suggestionIds = liveSuggestions.map(ls => ls.suggestionId);

    let suggestions = await prisma.Suggestion.findMany({
      where: { suggestionId: { in: suggestionIds } },
    });

    // Remove username field
    const cleaned = suggestions.map(s => {
      const { username, ...rest } = s;
      return rest;
    });

    return { success: true, suggestions: cleaned };
  } catch (error) {
    console.error("❌ Error fetching live suggestions:", error);
    return { success: false };
  }
}

module.exports = getLiveSuggestions;
