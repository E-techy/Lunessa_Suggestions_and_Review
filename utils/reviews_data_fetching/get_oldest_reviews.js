const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch oldest reviews after a given timestamp.
 * If no timestamp is provided, returns the oldest 4 reviews overall.
 *
 * @async
 * @function getOldestReviews
 * @param {Date|string|number|null} [timestamp] - The cutoff timestamp (reviews created after this time will be fetched).
 * @returns {Promise<{ success: boolean, reviews?: Array<Object> }>} 
 * - { success: true, reviews: [...] } if fetched successfully
 * - { success: false } if an error occurred
 */
async function getOldestReviews(timestamp = null) {
  try {
    let whereCondition = {};

    if (timestamp) {
      const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);
      whereCondition = { createdAt: { gt: cutoffDate } }; // after timestamp
    }

    let reviews = await prisma.Review.findMany({
      where: whereCondition,
      orderBy: { createdAt: "asc" }, // oldest first
      take: 4,
    });

    // Remove username field
    reviews = reviews.map(({ username, ...rest }) => rest);

    return { success: true, reviews };
  } catch (error) {
    console.error("❌ Error fetching oldest reviews:", error);
    return { success: false };
  }
}

module.exports = getOldestReviews;
