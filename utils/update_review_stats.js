const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const calculateMovingAverage = require("./calculate_moving_average");

/**
 * Updates the global ReviewStats with new review information.
 *
 * @param {number} ratingStar - The rating star value from the new review (e.g. 1–5).
 * @param {boolean} reviewPositivity - Whether the review is positive.
 * @returns {Promise<boolean>} - Returns true if update successful, false otherwise.
 */
async function updateReviewStats(ratingStar, reviewPositivity) {
  try {
    // Fetch existing stats (only one object should exist)
    let stats = await prisma.reviewStats.findFirst();

    if (!stats) {
      // Initialize stats if none exist
      await prisma.reviewStats.create({
        data: {
          averageRating: ratingStar,
          totalReviews: 1,
          positivityLevel: reviewPositivity, // 👈 percentage, not optional
        },
      });
      return true;
    }

    // Update average rating using moving average
    const newAverageRating = calculateMovingAverage(
      stats.averageRating,
      ratingStar,
      stats.totalReviews
    );

    // Convert positivity to percentage (100 for positive, 0 for negative)
    const positivityValue = reviewPositivity;

    // Update positivity level using moving average
    const newPositivityLevel = calculateMovingAverage(
      stats.positivityLevel,
      positivityValue,
      stats.totalReviews
    );

    // Update stats in DB
    await prisma.reviewStats.update({
      where: { id: stats.id },
      data: {
        averageRating: newAverageRating,
        totalReviews: stats.totalReviews + 1,
        positivityLevel: newPositivityLevel, // stays between 0–100
      },
    });

    return true;
  } catch (error) {
    console.error("Error updating ReviewStats:", error);
    return false;
  }
}

module.exports = updateReviewStats;
