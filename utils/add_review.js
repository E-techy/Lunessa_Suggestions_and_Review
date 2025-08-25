const { PrismaClient } = require("@prisma/client");
const updateReviewStats = require("./update_review_stats");

const prisma = new PrismaClient();

/**
 * Adds a new review to the database.
 *
 * @async
 * @function addReview
 * @param {Object} reviewObj - The review data to insert.
 * @param {string} reviewObj.reviewID - Unique review identifier.
 * @param {string} reviewObj.name - Reviewer's name.
 * @param {string} reviewObj.username - Reviewer's username.
 * @param {string} reviewObj.comment - The actual review text.
 * @param {number} reviewObj.ratingStar - Rating given (e.g. 1–5).
 * @param {Array<Object>} [reviewObj.files] - Optional files attached.
 * @param {string} reviewObj.reviewType - Type of review (e.g. "positive", "negative", etc.).
 * @param {boolean} reviewObj.reviewPositivity - Whether the review is positive or not.
 *
 * @returns {Promise<boolean>} - `true` if review is added successfully, otherwise `false`.
 */
async function addReview(reviewObj) {
  try {
    // Insert review into database
    const newReview = await prisma.Review.create({
      data: {
        reviewID: reviewObj.reviewID,
        name: reviewObj.name,
        username: reviewObj.username,
        comment: reviewObj.comment,
        ratingStar: reviewObj.ratingStar,
        files: reviewObj.files || [],
        reviewType: reviewObj.reviewType,
      },
    });

    // Call updateReviewStats only if review was successfully created
    if (newReview) {
      // Convert reviewPositivity → percentage (0 to 100)
      const positivityValue = reviewObj.reviewPositivity;

      await updateReviewStats(reviewObj.ratingStar, positivityValue);
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Error adding review:", error);
    return false;
  }
}

module.exports = addReview;
