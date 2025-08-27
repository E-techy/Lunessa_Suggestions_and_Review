const { PrismaClient } = require("@prisma/client");
const calculateNewStatsAfterDelete = require("./calculate_new_stats_after_delete");

const prisma = new PrismaClient();

/**
 * Deletes a review from Review + TopReview,
 * and updates ReviewStats accordingly.
 *
 * Only deletes if the review belongs to the given username.
 *
 * @param {string} reviewID - ID of the review to delete.
 * @param {string} username - Owner of the review (must match).
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function deleteReview(reviewID, username) {
  try {
    // 1. Find the review first, but enforce username check
    const review = await prisma.Review.findUnique({
      where: { reviewID },
    });

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    // Ownership check
    if (review.username !== username) {
      return { success: false, error: "Not authorized to delete this review" };
    }

    // Extract values before deletion
    const { ratingStar, positivityLevel } = review;

    // 2. Delete review from Review
    await prisma.Review.delete({
      where: { reviewID },
    });

    // 3. Delete review from TopReview (if exists)
    await prisma.TopReview.deleteMany({
      where: { reviewID },
    });

    // 4. Get current stats
    const stats = await prisma.ReviewStats.findFirst();
    if (!stats) {
      return { success: false, error: "ReviewStats not found" };
    }

    // 5. Recalculate new stats
    const { newAvgRating, newPositivity, newTotal } =
      calculateNewStatsAfterDelete(
        stats.averageRating,
        stats.positivityLevel,
        stats.totalReviews,
        ratingStar,
        positivityLevel
      );

    // 6. Update ReviewStats
    await prisma.ReviewStats.update({
      where: { id: stats.id },
      data: {
        averageRating: newAvgRating,
        positivityLevel: newPositivity,
        totalReviews: newTotal,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return { success: false, error: error.message };
  }
}

module.exports = deleteReview;
