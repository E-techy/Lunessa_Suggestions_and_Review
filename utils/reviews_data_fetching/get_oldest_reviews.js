const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch oldest reviews after a given timestamp.
 *
 * @async
 * @function getOldestReviews
 * @param {Date|string|number} timestamp - The cutoff timestamp 
 * (reviews created after this time will be fetched).
 * @returns {Promise<{ success: boolean, reviews?: Array<Object> }>} 
 * - { success: true, reviews: [...] } if fetched successfully
 * - { success: false } if an error occurred
 */
async function getOldestReviews(timestamp) {
  try {
    // Ensure timestamp is a Date
    const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

    const reviews = await prisma.Review.findMany({
      where: {
        createdAt: { gt: cutoffDate } // strictly after timestamp
      },
      orderBy: {
        createdAt: "asc" // oldest first
      },
      take: 4
    });

    return { success: true, reviews };
  } catch (error) {
    console.error("❌ Error fetching oldest reviews:", error);
    return { success: false };
  }
}

module.exports = getOldestReviews;
