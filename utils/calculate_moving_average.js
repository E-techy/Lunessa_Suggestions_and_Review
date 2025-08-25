/**
 * Calculate the updated moving average when a new value is added.
 *
 * Formula:
 *   newAverage = (oldAverage * n + x) / (n + 1)
 *
 * @param {number} oldAverage - The previous average value.
 * @param {number} newValue - The new element being added.
 * @param {number} count - The total count of existing elements before adding the new one.
 * @returns {number} - The updated average including the new value.
 */
function calculateMovingAverage(oldAverage, newValue, count) {
  if (count < 0) throw new Error("Count cannot be negative");

  return ((oldAverage * count) + newValue) / (count + 1);
}

module.exports = calculateMovingAverage;
