// topRatedReviews.js

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".sidebar-tab-btn");
  const contents = document.querySelectorAll(".sidebar-tab-content");

  // Track last timestamps for pagination
  let lastTimestamps = { latest: null, oldest: null };

  // Switch tabs
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const type = tab.dataset.tab;
      document.getElementById(`top-rated-${type}`).classList.add("active");

      // Load fresh reviews when switching
      loadReviews(type, true);
    });
  });

  // Fetch and render reviews
  async function loadReviews(type = "latest", reset = false) {
    const container = document.querySelector(`#top-rated-${type} .reviews-list`);

    if (reset) {
      container.innerHTML = "";
      lastTimestamps[type] = null;
    }

    try {
      const res = await fetch(`/top_rated?type=${type}${lastTimestamps[type] ? `&timestamp=${encodeURIComponent(lastTimestamps[type])}` : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch reviews");

      if (!data.data || data.data.length === 0) {
        container.insertAdjacentHTML("beforeend", `<div class="no-more">No more reviews</div>`);
        return;
      }

      data.data.forEach(r => {
        const stars = "★".repeat(r.ratingStar) + "☆".repeat(5 - r.ratingStar);
        const reviewHTML = `
          <div class="review-item">
            <div class="review-author">${r.name}</div>
            <div class="review-rating-small">${stars}</div>
            <div class="review-preview">${r.comment}</div>
            <div class="review-date">${new Date(r.createdAt).toLocaleDateString()}</div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", reviewHTML);
      });

      // Update last timestamp (based on last review)
      const lastReview = data.data[data.data.length - 1];
      lastTimestamps[type] = new Date(lastReview.createdAt).toISOString();
    } catch (err) {
      console.error("❌ Error loading top reviews:", err);
    }
  }

  // Handle Load More buttons
  document.querySelectorAll(".btn-load-more").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      loadReviews(type, false);
    });
  });

  // Load latest reviews on first page load
  loadReviews("latest", true);
});
