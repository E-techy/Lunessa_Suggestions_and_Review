// utils/format_review.js

const generateID = require("./generate_id");
const decideReviewPositivity = require("./decide_review_positivity");
const validateFiles = require("./validate_files");

/**
 * Formats a raw review object to fit Review model
 *
 * @param {Object} review - Raw review object from client
 * @param {string} apiKey - Gemini API key
 * @param {string} modelName - Gemini model (e.g., "gemini-2.5-flash")
 * @returns {Promise<{ formattedReview: Object | null, error: string | null }>}
 */
async function formatReview(review, apiKey, modelName) {
  try {
    if (typeof review !== "object" || !review) {
      return { formattedReview: null, error: "Invalid review object provided" };
    }

    // Extract fields
    let { name, username, comment, ratingStar, files } = review;

    // ✅ Handle username
    username = username && username.trim() ? username.trim() : "Anonymous";

    // ✅ Handle name
    name = name && name.trim() ? name.trim() : "Anonymous";

    // ✅ Handle comment (max 1000 chars)
    comment = typeof comment === "string" ? comment.trim() : "";
    if (comment.length > 1000) {
      comment = comment.substring(0, 1000);
    }

    // ✅ Handle rating (integer 0–5)
    ratingStar = parseInt(ratingStar, 10);
    if (isNaN(ratingStar)) ratingStar = 0;
    if (ratingStar < 0) ratingStar = 0;
    if (ratingStar > 5) ratingStar = 5;

    // ✅ Step 1: Validate files first
    const { validFiles, error: fileError } = await validateFiles(files);
    if (fileError) {
      return { formattedReview: null, error: fileError };
    }

    // ✅ Step 2: Generate reviewID
    const reviewID = generateID(username);

    // ✅ Step 3: Calculate positivity
    const { positivityLevel, error: positivityError } = await decideReviewPositivity(
      comment,
      apiKey,
      modelName
    );

    if (positivityError) {
      return { formattedReview: null, error: positivityError };
    }

    // ✅ Step 4: Build final formatted object (Prisma handles createdAt & lastModified)
    const formattedReview = {
      reviewID,
      name,
      username,
      comment,
      ratingStar,
      files: validFiles,
      reviewType: "simple", // 👈 Always set manually
      positivityLevel,
    };

    return { formattedReview, error: null };
  } catch (err) {
    console.error("Error formatting review:", err.message);
    return { formattedReview: null, error: "Unexpected error while formatting review" };
  }
}

module.exports = formatReview;
