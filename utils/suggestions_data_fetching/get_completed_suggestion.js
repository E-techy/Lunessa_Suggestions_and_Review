const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch completed suggestions with linked details from Suggestion model.
 *
 * @async
 * @function getCompletedSuggestions
 * @param {Object} options
 * @param {Date|string|number|null} [options.timestamp] - Reference timestamp
 * @param {"latest"|"oldest"} [options.filterType="latest"] - Fetch order
 * @returns {Promise<{ success: boolean, suggestions?: Array<Object> }>}
 */
async function getCompletedSuggestions({ timestamp = null, filterType = "latest" }) {
  try {
    let whereCondition = {};

    if (timestamp) {
      const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

      if (filterType === "latest") {
        whereCondition.createdAt = { lt: cutoffDate }; // before timestamp
      } else if (filterType === "oldest") {
        whereCondition.createdAt = { gt: cutoffDate }; // after timestamp
      }
    }

    // Order logic
    let orderByCondition = {};
    if (filterType === "latest") {
      orderByCondition = { createdAt: "desc" };
    } else {
      orderByCondition = { createdAt: "asc" };
    }

    // Get 4 completed suggestion records
    const completedSuggestions = await prisma.CompletedSuggestion.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      take: 4,
    });

    // Fetch corresponding Suggestion details
    const suggestionIds = completedSuggestions.map(cs => cs.suggestionId);

    let suggestions = await prisma.Suggestion.findMany({
      where: { suggestionId: { in: suggestionIds } },
    });

    // Merge data and strip username
    const merged = completedSuggestions.map(cs => {
      const suggestion = suggestions.find(s => s.suggestionId === cs.suggestionId);

      if (!suggestion) return null;

      const { username, ...restSuggestion } = suggestion;

      return {
        ...restSuggestion,
        resolutionDate: cs.resolutionDate,
      };
    }).filter(Boolean);

    return { success: true, suggestions: merged };
  } catch (error) {
    console.error("❌ Error fetching completed suggestions:", error);
    return { success: false };
  }
}

module.exports = getCompletedSuggestions;

