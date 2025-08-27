// normalReviews.js

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".normal-tab-btn");
  const contents = document.querySelectorAll(".normal-tab-content");

  // Track last timestamps for pagination (per tab)
  let lastTimestamps = { latest: null, oldest: null };

  // Handle tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const type = tab.dataset.tab;
      document.getElementById(`normal-reviews-${type}`).classList.add("active");

      // Reset + load fresh reviews
      loadNormalReviews(type, true);
    });
  });

  // Core function to fetch and render reviews
  async function loadNormalReviews(type = "latest", reset = false) {
    const container = document.querySelector(
      `#normal-reviews-${type} .normal-reviews-list`
    );

    if (reset) {
      container.innerHTML = "";
      lastTimestamps[type] = null; // reset timestamp
    }

    try {
      // Build query params
      const url = `/normal_review?type=${type}${
        lastTimestamps[type]
          ? `&timestamp=${encodeURIComponent(lastTimestamps[type])}`
          : ""
      }`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch reviews");

      if (!data.reviews || data.reviews.length === 0) {
        container.insertAdjacentHTML(
          "beforeend",
          `<div class="normal-no-more">No more reviews</div>`
        );
        return;
      }

      // Render each review
      data.reviews.forEach(r => {
        const stars = "★".repeat(r.ratingStar) + "☆".repeat(5 - r.ratingStar);
        const reviewHTML = `
          <div class="normal-review-item">
            <div class="normal-review-author">${r.name}</div>
            <div class="normal-review-rating">${stars}</div>
            <div class="normal-review-comment">${r.comment}</div>
            <div class="normal-review-date">${new Date(
              r.createdAt
            ).toLocaleDateString()}</div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", reviewHTML);
      });

      // Update last timestamp (from last review in response)
      const lastReview = data.reviews[data.reviews.length - 1];
      lastTimestamps[type] = new Date(lastReview.createdAt).toISOString();
    } catch (err) {
      console.error("❌ Error loading normal reviews:", err);
    }
  }

  // "Load More" handler
  document.querySelectorAll(".normal-btn-load-more").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      loadNormalReviews(type, false);
    });
  });

  // ✅ Initial load: latest reviews with timestamp = null
  loadNormalReviews("latest", true);
});
