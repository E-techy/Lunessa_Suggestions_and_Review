
async function updateReviewStats() {
    try {
        console.log("Updating review stats");
        
        // Call your server endpoint
        const response = await fetch("/review_stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (!data.success) {
            console.error("❌ Failed to fetch review stats:", data.error);
            return;
        }

        const stats = data.stats;

        // Update DOM values
        document.querySelector(".metric-card:nth-child(1) .metric-value").textContent = stats.averageRating.toFixed(1);
        document.querySelector(".metric-card:nth-child(2) .metric-value").textContent = stats.totalReviews;
        document.querySelector(".metric-card:nth-child(3) .metric-value").textContent = stats.positivityLevel.toString() + "%";

        console.log("Review stats updated", stats);
        

    } catch (err) {
        console.error("❌ Error fetching review stats:", err);
    }
}

// Run once on page load
document.addEventListener("DOMContentLoaded", updateReviewStats);
