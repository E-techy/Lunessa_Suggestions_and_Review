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
        // Only those created strictly before the timestamp
        whereCondition.createdAt = { lt: cutoffDate };
      } else if (filterType === "oldest") {
        // Only those created strictly after the timestamp
        whereCondition.createdAt = { gt: cutoffDate };
      }
    }

    // Sorting order
    let orderByCondition = {};
    if (filterType === "latest") {
      orderByCondition = { createdAt: "desc" }; // newest → oldest
    } else {
      orderByCondition = { createdAt: "asc" }; // oldest → newest
    }

    // Fetch 4 live suggestions
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

    // Map by id
    const suggestionMap = new Map(suggestions.map(s => [s.suggestionId, s]));

    // Rebuild preserving order of liveSuggestions
    const orderedSuggestions = liveSuggestions.map(ls => {
      const { username, ...rest } = suggestionMap.get(ls.suggestionId) || {};
      return rest;
    }).filter(Boolean);

    return { success: true, suggestions: orderedSuggestions };
  } catch (error) {
    console.error("❌ Error fetching live suggestions:", error);
    return { success: false };
  }
}

module.exports = getLiveSuggestions;
