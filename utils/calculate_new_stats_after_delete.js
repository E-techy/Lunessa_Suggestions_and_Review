/**
 * Calculates new average rating and positivity level
 * after deleting a review.
 *
 * @param {number} oldAvgRating - Current average rating.
 * @param {number} oldPositivity - Current average positivity level.
 * @param {number} totalReviews - Current total reviews (before deletion).
 * @param {number} deletedRating - RatingStar of the deleted review.
 * @param {number} deletedPositivity - PositivityLevel of the deleted review.
 * @returns {{ newAvgRating: number, newPositivity: number, newTotal: number }}
 */
function calculateNewStatsAfterDelete(
  oldAvgRating,
  oldPositivity,
  totalReviews,
  deletedRating,
  deletedPositivity
) {
  if (totalReviews <= 1) {
    // After deleting last review → reset stats
    return {
      newAvgRating: 0,
      newPositivity: 0,
      newTotal: 0,
    };
  }

  const newTotal = totalReviews - 1;

  const newAvgRating =
    (oldAvgRating * totalReviews - deletedRating) / newTotal;

  const newPositivity =
    (oldPositivity * totalReviews - deletedPositivity) / newTotal;

  return {
    newAvgRating,
    newPositivity,
    newTotal,
  };
}

module.exports = calculateNewStatsAfterDelete;
