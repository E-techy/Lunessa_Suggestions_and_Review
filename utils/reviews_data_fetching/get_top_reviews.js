const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch top reviews (latest or oldest) based on timestamp,
 * then pull full details from Review model (without username).
 *
 * @async
 * @function getTopReviews
 * @param {Date|string|number|null} timestamp - Reference timestamp for filtering. Optional.
 * @param {"latest"|"oldest"} type - Fetch latest or oldest reviews relative to the timestamp.
 * @returns {Promise<{ success: boolean, reviews?: Array<Object> }>} 
 * - { success: true, reviews: [...] } if fetched successfully
 * - { success: false } if an error occurred
 */
async function getTopReviews(timestamp, type= "latest") {
  try {
    let whereCondition = {};
    let orderCondition = {};

    if (type === "latest") {
      if (timestamp) {
        const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);
        whereCondition = { createdAt: { lt: cutoffDate } }; // before timestamp
      }
      orderCondition = { createdAt: "desc" };
    } else if (type === "oldest") {
      if (timestamp) {
        const cutoffDate = timestamp instanceof Date ? timestamp : new Date(timestamp);
        whereCondition = { createdAt: { gt: cutoffDate } }; // after timestamp
      }
      orderCondition = { createdAt: "asc" };
    } else {
      throw new Error("Invalid type. Must be 'latest' or 'oldest'.");
    }

    // Step 1: Fetch TopReview IDs
    const topReviews = await prisma.TopReview.findMany({
      where: whereCondition,
      orderBy: orderCondition,
      take: 4,
    });

    if (!topReviews.length) {
      return { success: true, reviews: [] };
    }

    // Step 2: Fetch corresponding reviews from Review model
    const reviewIDs = topReviews.map(r => r.reviewID);
    let reviews = await prisma.Review.findMany({
      where: { reviewID: { in: reviewIDs } },
      orderBy: { createdAt: orderCondition.createdAt }, // maintain order
    });

    // Step 3: Remove username
    reviews = reviews.map(({ username, ...rest }) => rest);

    return { success: true, reviews };
  } catch (error) {
    console.error("❌ Error fetching top reviews:", error);
    return { success: false };
  }
}

module.exports = getTopReviews;
