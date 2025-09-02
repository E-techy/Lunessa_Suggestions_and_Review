// topRatedReviews.js
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".sidebar-tab-btn");
  const contents = document.querySelectorAll(".sidebar-tab-content");

  let lastTimestamps = { latest: null, oldest: null };
  const PAGE_SIZE = 3;

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const type = tab.dataset.tab; // "latest" or "oldest"
      document.getElementById(`top-rated-${type}`).classList.add("active");

      loadReviews(type, true);
    });
  });

  async function loadReviews(type = "latest", reset = false) {
    const tabContainer = document.getElementById(`top-rated-${type}`);
    const container = tabContainer.querySelector(".reviews-list"); // <- use reviews-list
    const btn = tabContainer.querySelector(".btn-load-more"); // <- use button inside tab

    if (reset) {
        container.innerHTML = "";
        lastTimestamps[type] = null;
        container.style.height = "auto";
        container.style.maxHeight = "none";
        container.style.overflowY = "hidden";
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Load More";
        }
    }

    const loader = document.createElement("div");
    loader.className = "loading";
    loader.textContent = "Loading...";
    container.appendChild(loader);

    try {
      const res = await fetch(
        `/top_rated?type=${type}${lastTimestamps[type] ? `&timestamp=${encodeURIComponent(lastTimestamps[type])}` : ""}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      loader.remove();

      if (!data.success) throw new Error(data.error || "Failed to fetch reviews");
      if (!data.data || data.data.length === 0) {
        if (!container.querySelector(".no-more")) {
          container.insertAdjacentHTML("beforeend", `<div class="no-more"></div>`);
        }
        if (btn) {
          btn.disabled = true;
          btn.textContent = "No more reviews";
        }
        return;
      }

      // Determine how many reviews to render
      let reviewsToRender = data.data;
      if (reset) reviewsToRender = data.data.slice(0, PAGE_SIZE);

      // Render reviews
      reviewsToRender.forEach(r => {
        const stars = "★".repeat(r.ratingStar) + "☆".repeat(5 - r.ratingStar);
        const formattedDate = new Date(r.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
        const html = `
          <div class="review-item">
            <div class="review-author">${r.name}</div>
            <div class="review-rating-small">${stars}</div>
            <div class="review-preview">${r.comment}</div>
            <div class="review-date">${formattedDate}</div>
          </div>
        `;
        container.insertAdjacentHTML("afterbegin", html);
      });

      // First fetch: set height to fit 3 reviews, no scroll
      if (reset) {
        const firstThree = container.querySelectorAll(".review-item");
        let height = 0;

        firstThree.forEach(item => {
          const style = window.getComputedStyle(item);
          const marginTop = parseFloat(style.marginTop);
          const marginBottom = parseFloat(style.marginBottom);
          height += item.offsetHeight + marginTop + marginBottom;
        });

        requestAnimationFrame(() => {
          container.style.height = `${height}px`;
          container.style.maxHeight = `${height}px`;
          container.style.overflowY = "hidden";
        });
      } else {
        // On Load More: enable scroll
        container.style.overflowY = "auto";
      }

      // Update last timestamp
      const lastReview = reviewsToRender[reviewsToRender.length - 1];
      if (lastReview) {
        lastTimestamps[type] = new Date(lastReview.createdAt).toISOString();
      }
    } catch (err) {
      console.error("❌ Error loading top reviews:", err);
      loader.remove();
      if (!container.querySelector(".error")) {
        container.insertAdjacentHTML(
          "beforeend",
          `<div class="error">⚠️ Failed to load reviews. Please try again.</div>`
        );
      }
    }
  }

  // Load More button with stable scroll
  document.querySelectorAll(".btn-load-more").forEach(btn => {
    btn.addEventListener("click", async () => {
      const type = btn.dataset.type;
      // bas direct load call karo, scrollTop adjust mat karo
      await loadReviews(type, false);
    });
  });

  // Initial load
  loadReviews("latest", true);
});
