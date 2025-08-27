// loadReviewStats.js

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Call the backend route
    const response = await fetch("/review_stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    if (!response.ok || !data || data.success === false) {
      throw new Error(data?.error || "Failed to load review stats");
    }

    const stats = data.stats || data; 
    // server might send { success:true, stats:{...} } or just stats object

    // Update DOM elements (in the order: avg rating, total reviews, positive reviews)
    const metricValues = document.querySelectorAll(".metric-value");

    if (metricValues.length >= 3) {
      metricValues[0].textContent = stats.averageRating?.toFixed(2) || "0.00";
      metricValues[1].textContent = stats.totalReviews || "0";
      metricValues[2].textContent = stats.positivityLevel
        ? `${stats.positivityLevel.toFixed(2)}%`
        : "0%";
    }
  } catch (error) {
    console.error("❌ Error loading review stats:", error);
    // Optional: show error in UI
    document.querySelectorAll(".metric-value").forEach(el => {
      el.textContent = "Error";
    });
  }
});
