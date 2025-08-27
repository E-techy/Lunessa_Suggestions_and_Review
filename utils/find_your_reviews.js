// utils/find_your_reviews.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch all reviews associated with a given username.
 *
 * This function queries the Review collection and returns
 * all reviews where the `username` field matches the provided input.
 *
 * @async
 * @function findYourReviews
 * @param {string} username - The username whose reviews need to be fetched.
 * @returns {Promise<Object>} - An object containing:
 *   - success {boolean} : Operation status
 *   - reviews {Array<Object>} : List of matching review documents
 *   - message {string} : Optional message if no reviews found or error occurs
 *
 * @example
 * const { findYourReviews } = require("./utils/find_your_reviews");
 * 
 * (async () => {
 *   const result = await findYourReviews("john_doe");
 *   console.log(result);
 * })();
 */
async function findYourReviews(username) {
  try {
    if (!username || typeof username !== "string") {
      return {
        success: false,
        message: "A valid username must be provided.",
        reviews: [],
      };
    }

    const reviews = await prisma.Review.findMany({
      where: { username },
      orderBy: { createdAt: "desc" }, // latest first
    });

    if (reviews.length === 0) {
      return {
        success: true,
        message: `No reviews found for username: ${username}`,
        reviews: [],
      };
    }

    return {
      success: true,
      reviews,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      message: "An error occurred while fetching reviews.",
      reviews: [],
    };
  }
}

module.exports = findYourReviews;
