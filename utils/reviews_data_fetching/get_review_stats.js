const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch the global review statistics (only one document exists).
 *
 * @async
 * @function getReviewStats
 * @returns {Promise<{ success: boolean, stats?: Object, error?: any }>} 
 * - { success: true, stats: {...} } if fetched successfully
 * - { success: false, error: ... } if an error occurred or no stats found
 */
async function getReviewStats() {
  try {
    const stats = await prisma.ReviewStats.findFirst(); // only one exists

    if (!stats) {
      return { success: false, error: "No ReviewStats entry found" };
    }

    return { success: true, stats };
  } catch (error) {
    console.error("❌ Error fetching review stats:", error);
    return { success: false, error: "Counld not get reviewStats, try again later" };
  }
}

module.exports = getReviewStats;
