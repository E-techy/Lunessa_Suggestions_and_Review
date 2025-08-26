// utils/admin/delete_review.js

const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("./verify_admin");
const calculateNewStatsAfterDelete = require("../calculate_new_stats_after_delete");

const prisma = new PrismaClient();

/**
 * Deletes a review (and its TopReview entry) if the admin has sufficient privileges.
 *
 * @async
 * @function deleteReview
 * @param {string} apiKey - API key for admin verification.
 * @param {string} authToken - JWT token for authentication.
 * @param {string} jwtSecret - Secret used for decoding JWT.
 * @param {string} reviewID - Unique identifier of the review to be deleted.
 * @returns {Promise<(
 *   "logged_out" |
 *   "not_an_admin" |
 *   "incorrect_api_key" |
 *   "unauthorized" |
 *   "review_not_found" |
 *   "review_deleted_successfully"
 * )>}
 *
 * @example
 * const result = await deleteReview(apiKey, authToken, process.env.JWT_SECRET, "rev123");
 * if (result === "review_deleted_successfully") {
 *   console.log("Review deleted and stats updated");
 * }
 */
async function deleteReview(apiKey, authToken, jwtSecret, reviewID) {
  try {
    // ✅ Verify admin
    const admin = await verifyAdmin(apiKey, authToken, jwtSecret);

    if (
      admin === "logged_out" ||
      admin === "not_an_admin" ||
      admin === "incorrect_api_key"
    ) {
      return admin;
    }

    // ✅ Role check
    if (admin.role !== "superAdmin" && admin.role !== "delete") {
      return "unauthorized";
    }

    // ✅ Find review
    const review = await prisma.Review.findUnique({
      where: { reviewID },
    });

    if (!review) {
      return "review_not_found";
    }

    // ✅ Delete from Review
    await prisma.Review.delete({
      where: { reviewID },
    });

    // ✅ Delete from TopReview (if exists)
    await prisma.TopReview.deleteMany({
      where: { reviewID },
    });

    // ✅ Update ReviewStats
    const stats = await prisma.ReviewStats.findFirst();

    if (stats) {
      const { newAvgRating, newPositivity, newTotal } =
        calculateNewStatsAfterDelete(
          stats.averageRating,
          stats.positivityLevel,
          stats.totalReviews,
          review.ratingStar,
          review.positivityLevel
        );

      await prisma.ReviewStats.update({
        where: { id: stats.id },
        data: {
          averageRating: newAvgRating,
          positivityLevel: newPositivity,
          totalReviews: newTotal,
        },
      });
    }

    return "review_deleted_successfully";
  } catch (error) {
    console.error("Error deleting review:", error);
    return "logged_out";
  }
}

module.exports = deleteReview;
