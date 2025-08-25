const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch latest reviews before a given timestamp.
 *
 * @async
 * @function getLatestReviews
 * @param {Date|string|number} timestamp - The cutoff timestamp (reviews created before this time will be fetched).
 * @returns {Promise<{ success: boolean, reviews?: Array<Object> }>} 
 * - { success: true, reviews: [...] } if fetched successfully
 * - { success: false } if an error occurred
 */
async function getLatestReviews(timestamp) {
  try {
    // Ensure timestamp is a Date
    const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

    const reviews = await prisma.Review.findMany({
      where: {
        createdAt: { lt: cutoffDate }
      },
      orderBy: {
        createdAt: "desc" // most recent first
      },
      take: 4
    });

    return { success: true, reviews };
  } catch (error) {
    console.error("❌ Error fetching latest reviews:", error);
    return { success: false };
  }
}



module.exports = getLatestReviews;



