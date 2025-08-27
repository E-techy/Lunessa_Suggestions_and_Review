// utils/admin/mark_top_reviews.js

const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("./verify_admin");

const prisma = new PrismaClient();

/**
 * Marks a review as a top review and moves its data into the TopReview model.
 *
 * @async
 * @function markTopReview
 * @param {string} apiKey - API key for admin verification.
 * @param {string} authToken - JWT token for authentication.
 * @param {string} jwtSecret - Secret used for decoding JWT.
 * @param {string} reviewID - Unique identifier of the review to mark as top.
 * @returns {Promise<(
 *   "logged_out" |
 *   "not_an_admin" |
 *   "incorrect_api_key" |
 *   "unauthorized" |
 *   "review_not_found" |
 *   "already_top_review" |
 *   "top_review_marked_successfully"
 * )>}
 *
 * @example
 * const result = await markTopReview(apiKey, authToken, process.env.JWT_SECRET, "rev123");
 * if (result === "top_review_marked_successfully") {
 *   console.log("Review marked as top review!");
 * }
 */
async function markTopReview(apiKey, authToken, jwtSecret, reviewID) {
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
    if (admin.role !== "superAdmin" && admin.role !== "edit") {
      return "unauthorized";
    }

    // ✅ Find review
    const review = await prisma.Review.findUnique({
      where: { reviewID },
    });

    if (!review) {
      return "review_not_found";
    }

    // ✅ Check if already top review
    if (review.reviewType === "topReview") {
      return "already_top_review";
    }

    // ✅ Update review type
    await prisma.Review.update({
      where: { reviewID },
      data: { reviewType: "topReview" },
    });

    // ✅ Insert into TopReview (ignore if already exists due to unique constraint)
    await prisma.TopReview.upsert({
      where: { reviewID },
      update: {}, // nothing to update if exists
      create: {
        reviewID: review.reviewID,
        createdAt: review.createdAt,
        ratingStar: review.ratingStar,
        name: review.name,
        comment: review.comment,
      },
    });

    return "top_review_marked_successfully";
  } catch (error) {
    console.error("Error marking top review:", error);
    return "logged_out";
  }
}



module.exports = markTopReview;
