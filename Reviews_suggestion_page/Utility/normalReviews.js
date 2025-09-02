// normalReviews.js
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".normal-tab-btn");
  const contents = document.querySelectorAll(".normal-tab-content");

  let lastTimestamps = { latest: null, oldest: null };
  const PAGE_SIZE = 3;

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const type = tab.dataset.tab;
      document.getElementById(`normal-reviews-${type}`).classList.add("active");

      loadNormalReviews(type, true);
    });
  });

  async function loadNormalReviews(type = "latest", reset = false) {
    const container = document.querySelector(
      `#normal-reviews-${type} .normal-reviews-list`
    );
    const btn = document.querySelector(
      `#normal-reviews-${type} .normal-btn-load-more`
    );

    if (reset) {
      container.innerHTML = "";
      lastTimestamps[type] = null;
      container.style.height = "auto";
      container.style.maxHeight = "none";
      container.style.overflowY = "hidden"; // initially no scroll
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Load More";
      }
    }

    const loader = document.createElement("div");
    loader.className = "normal-loading";
    loader.textContent = "Loading...";
    container.appendChild(loader);

    try {
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
      loader.remove();

      if (!data.success) throw new Error(data.message || "Failed to fetch reviews");
      if (!data.reviews || data.reviews.length === 0) {
        if (!container.querySelector(".normal-no-more")) {
          container.insertAdjacentHTML(
            "beforeend",
            `<div class="normal-no-more"></div>`
          );
        }
        if (btn) {
          btn.disabled = true;
          btn.textContent = "No more reviews";
        }
        return;
      }

      // Determine how many reviews to render
      let reviewsToRender = data.reviews;
      if (reset) reviewsToRender = data.reviews.slice(0, PAGE_SIZE);

      // Render reviews
      reviewsToRender.forEach(r => {
        const stars = "★".repeat(r.ratingStar) + "☆".repeat(5 - r.ratingStar);
        const formattedDate = new Date(r.createdAt).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "short", day: "numeric" }
        );
        const html = `
          <div class="normal-review-item">
            <div class="normal-review-author">${r.name}</div>
            <div class="normal-review-rating">${stars}</div>
            <div class="normal-review-comment">${r.comment}</div>
            <div class="normal-review-date">${formattedDate}</div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
      });

      // First fetch: set height to fit 3 reviews, no scroll
      if (reset) {
  const firstThree = container.querySelectorAll(".normal-review-item");
  let height = 0;

  firstThree.forEach(item => {
    const style = window.getComputedStyle(item);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    height += item.offsetHeight + marginTop + marginBottom;
  });

  // Wait until next frame to ensure rendering is complete
  requestAnimationFrame(() => {
    container.style.height = `${height}px`;
    container.style.maxHeight = `${height}px`;
    container.style.overflowY = "hidden"; // still no scroll initially
  });
}
 else {
        // On Load More: enable scroll
        container.style.overflowY = "auto";
      }

      // Update last timestamp
      const lastReview = reviewsToRender[reviewsToRender.length - 1];
      if (lastReview) {
        lastTimestamps[type] = new Date(lastReview.createdAt).toISOString();
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      loader.remove();
      if (!container.querySelector(".normal-error")) {
        container.insertAdjacentHTML(
          "beforeend",
          `<div class="normal-error">⚠️ Failed to load reviews. Please try again.</div>`
        );
      }
    }
  }

  // Load More button with stable scroll
  document.querySelectorAll(".normal-btn-load-more").forEach(btn => {
    btn.addEventListener("click", async () => {
      const type = btn.dataset.type;
      // bas direct load call karo, scrollTop adjust mat karo
      await loadNormalReviews(type, false);
    });
  });

  // Initial load
  loadNormalReviews("latest", true);
});
