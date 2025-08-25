/**
 * Calculate the updated moving average when a new value is added or
 * an existing value is modified.
 *
 * Formula:
 *   - For "new": newAverage = (oldAverage * n + x) / (n + 1)
 *   - For "modification": newAverage = (oldAverage * n - oldValue + x) / n
 *     (approximated by keeping count constant and replacing one value)
 *
 * @param {number} oldAverage - The previous average value.
 * @param {number} newValue - The new or modified value.
 * @param {number} count - The total count of existing elements before update.
 * @param {"new" | "modification"} [type="new"] - The type of operation:
 *   - `"new"`: Treats `newValue` as an additional element (increments count).
 *   - `"modification"`: Treats `newValue` as replacing an existing element (count unchanged).
 * @returns {number} - The updated moving average.
 *
 * @throws {Error} If count is less than 0.
 *
 * @example
 * // Adding a new review
 * calculateMovingAverage(4.0, 5, 2, "new"); // => 4.33
 *
 * @example
 * // Modifying an existing review
 * calculateMovingAverage(4.0, 3, 2, "modification"); // => 3.5 (approx)
 */
function calculateMovingAverage(oldAverage, newValue, count, type = "new") {
  if (count < 0) throw new Error("Count cannot be negative");

  if (type === "modification") {
    if (count === 0) return newValue; // no prior values, just return
    return ((oldAverage * count) + newValue) / count;
  }

  // Default: "new"
  return ((oldAverage * count) + newValue) / (count + 1);
}

module.exports = calculateMovingAverage;
