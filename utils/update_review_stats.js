const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const calculateMovingAverage = require("./calculate_moving_average");

/**
 * Updates the global ReviewStats with new or modified review information.
 *
 * @param {number} ratingStar - The rating star value from the review (1–5).
 * @param {number} reviewPositivity - The positivity level of the review (0–100).
 * @param {"new" | "modification"} [type="new"] - The type of update:
 *   - `"new"`: Adds a completely new review (increments total reviews).
 *   - `"modification"`: Updates an existing review (does not increment total reviews).
 * @returns {Promise<boolean>} - Resolves to `true` if update successful, `false` otherwise.
 *
 * @example
 * // Adding a new review
 * await updateReviewStats(5, 90, "new");
 *
 * @example
 * // Modifying an existing review (no total count increase)
 * await updateReviewStats(4, 75, "modification");
 */
async function updateReviewStats(ratingStar, reviewPositivity, type = "new") {
  try {
    // Fetch existing stats (only one object should exist)
    let stats = await prisma.reviewStats.findFirst();

    if (!stats) {
      // Initialize stats if none exist
      await prisma.reviewStats.create({
        data: {
          averageRating: ratingStar,
          totalReviews: 1,
          positivityLevel: reviewPositivity, // percentage
        },
      });
      return true;
    }

    // Update average rating using moving average
    const newAverageRating = calculateMovingAverage(
      stats.averageRating,
      ratingStar,
      stats.totalReviews,
      type
    );

    // Update positivity level using moving average
    const newPositivityLevel = calculateMovingAverage(
      stats.positivityLevel,
      reviewPositivity,
      stats.totalReviews,
      type
    );

    // Update stats in DB
    await prisma.reviewStats.update({
      where: { id: stats.id },
      data: {
        averageRating: newAverageRating,
        totalReviews: type === "new" ? stats.totalReviews + 1 : stats.totalReviews,
        positivityLevel: newPositivityLevel,
      },
    });

    return true;
  } catch (error) {
    console.error("Error updating ReviewStats:", error);
    return false;
  }
}

module.exports = updateReviewStats;
