// utils/top_rated_reviews/fetchMoreTopRatedReviews.js
import { saveReviewsToDB, getReviewsFromDB } from "./topRatedDB.js";
import { renderTopRatedReviews } from "./renderTopRatedReviews.js";

export async function loadMoreTopRatedReviews() {
  const activeTab = document.querySelector(".sidebar-tab-btn.active");
  if (!activeTab) return;

  const type = activeTab.textContent.toLowerCase().includes("latest")
    ? "latest"
    : "oldest";

  // Last timestamp from DB
  const reviews = await getReviewsFromDB(type);
  let lastTimestamp = null;
  if (reviews.length > 0) {
    lastTimestamp = reviews[reviews.length - 1].createdAt;
  }

  try {
    const res = await fetch(`/top_rated?timestamp=${lastTimestamp || ""}&type=${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      await saveReviewsToDB(data.data, type);
      renderTopRatedReviews();
    }
  } catch (error) {
    console.error("❌ Error fetching more reviews:", error);
  }
}
