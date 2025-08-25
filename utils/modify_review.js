// utils/modify_review.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const decideReviewPositivity = require("./decide_review_positivity");
const updateReviewStats = require("./update_review_stats");
const validateFiles = require("./validate_files");

/**
 * Modify an existing review after verifying ownership and inputs.
 *
 * This function allows only `comment`, `ratingStar`, and `files` fields
 * to be updated. It will:
 *  - Verify that the `username` matches the owner of the review.
 *  - Validate `comment`, `ratingStar`, and attached `files`.
 *  - Recalculate positivity level using Gemini AI.
 *  - Update `Review` model with new data.
 *  - Update global `ReviewStats` accordingly.
 *  - Update `TopReview` entry (if exists) to reflect new `comment` and `ratingStar`.
 *
 * @param {string} reviewID - The unique identifier of the review to modify.
 * @param {string} username - The username of the requester (ownership check).
 * @param {{ comment?: string, ratingStar?: number, files?: Array<Object> }} modifiedReview - The new review data.
 * @param {string} modelName - Gemini AI model name (e.g. "gemini-2.5-flash").
 * @param {string} apiKey - Gemini API key.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function modifyReview(reviewID, username, modifiedReview, modelName, apiKey) {
  try {
    // 1. Find review
    const existingReview = await prisma.Review.findUnique({
      where: { reviewID },
    });

    if (!existingReview) {
      return { success: false, error: "Review not found." };
    }

    // 2. Ownership check
    if (existingReview.username !== username) {
      return { success: false, error: "You are not authorized to modify this review." };
    }

    // 3. Extract & validate fields
    let { comment, ratingStar, files } = modifiedReview;

    // ✅ Comment cleanup
    comment = typeof comment === "string" ? comment.trim() : "";
    if (comment.length > 1000) {
      comment = comment.substring(0, 1000);
    }

    // ✅ Rating clamp
    ratingStar = parseInt(ratingStar, 10);
    if (isNaN(ratingStar)) ratingStar = 0;
    if (ratingStar < 0) ratingStar = 0;
    if (ratingStar > 5) ratingStar = 5;

    // ✅ Files validation
    const { validFiles, error: fileError } = await validateFiles(files);
    if (fileError) {
      return { success: false, error: fileError };
    }

    // 4. AI positivity check
    const { positivityLevel, error: aiError } = await decideReviewPositivity(
      comment,
      apiKey,
      modelName
    );

    if (aiError) {
      return { success: false, error: aiError };
    }

    // 5. Update Review model
    const updatedReview = await prisma.Review.update({
      where: { reviewID },
      data: {
        comment,
        ratingStar,
        files: validFiles, // replace with fresh validated files
        positivityLevel,
      },
    });

    // 6. Update ReviewStats
    await updateReviewStats(ratingStar, positivityLevel, "modification");

    // 7. Update TopReview (if exists)
    await prisma.TopReview.updateMany({
      where: { reviewID },
      data: {
        comment,
        ratingStar,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error modifying review:", err);
    return { success: false, error: err.message };
  }
}

module.exports = modifyReview;
