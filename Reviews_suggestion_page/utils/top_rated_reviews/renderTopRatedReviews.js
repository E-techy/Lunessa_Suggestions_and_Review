// utils/top_rated_reviews/renderTopRatedReviews.js
import { getReviewsFromDB } from "./topRatedDB.js";

/**
 * Render top-rated reviews from IndexedDB into the sidebar
 */
export async function renderTopRatedReviews() {
  const activeTab = document.querySelector(".sidebar-tab-btn.active");
  if (!activeTab) return;

  const type = activeTab.textContent.toLowerCase().includes("latest")
    ? "latest"
    : "oldest";

  let reviews = await getReviewsFromDB(type);

  // Sort for safety
  reviews.sort((a, b) => {
    if (type === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const container =
    type === "latest"
      ? document.getElementById("top-rated-latest")
      : document.getElementById("top-rated-oldest");

  container.innerHTML = "";

  reviews.forEach((review) => {
    const reviewEl = document.createElement("div");
    reviewEl.className = "review-item";
    reviewEl.innerHTML = `
      <div class="review-author">${review.name}</div>
      <div class="review-rating-small">
        ${[1, 2, 3, 4, 5]
          .map(
            (i) =>
              `<span class="star ${i <= review.ratingStar ? "active" : ""}">★</span>`
          )
          .join("")}
      </div>
      <div class="review-preview">${review.comment}</div>
      <div class="review-date">${new Date(
        review.createdAt
      ).toISOString().split("T")[0]}</div>
    `;
    container.appendChild(reviewEl);
  });
}
