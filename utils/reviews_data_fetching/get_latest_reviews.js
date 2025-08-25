const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch latest reviews before a given timestamp.
 * If no timestamp is provided, returns the most recent 4 reviews overall.
 *
 * @async
 * @function getLatestReviews
 * @param {Date|string|number|null} [timestamp] - The cutoff timestamp (reviews created before this time will be fetched).
 * @returns {Promise<{ success: boolean, reviews?: Array<Object> }>} 
 * - { success: true, reviews: [...] } if fetched successfully
 * - { success: false } if an error occurred
 */
async function getLatestReviews(timestamp = null) {
  try {
    let whereCondition = {};

    if (timestamp) {
      const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);
      whereCondition = { createdAt: { lt: cutoffDate } }; // before timestamp
    }

    let reviews = await prisma.Review.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" }, // most recent first
      take: 4,
    });

    // Remove username field
    reviews = reviews.map(({ username, ...rest }) => rest);

    return { success: true, reviews };
  } catch (error) {
    console.error("❌ Error fetching latest reviews:", error);
    return { success: false };
  }
}

module.exports = getLatestReviews;
