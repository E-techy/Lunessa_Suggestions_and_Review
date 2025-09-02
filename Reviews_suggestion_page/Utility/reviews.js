document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reviewForm");
  const commentField = form.querySelector("textarea");
  const reviewFileInput = document.getElementById("reviewFile");
  const submitBtn = document.getElementById("submitReviewBtn");
  const updateBtn = document.getElementById("updateReviewBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const reviewsTableBody = document.querySelector(".reviews-table tbody");
  updateBtn.addEventListener("click", async () => {
    if (!editingReviewID) return;
    const comment = commentField.value;

    // Show loading state
    const originalHTML = updateBtn.innerHTML;
    updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    updateBtn.disabled = true;
    updateBtn.classList.add('loading');

    try {
        const res = await fetch("/review?action=modify", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewID: editingReviewID, comment, ratingStar: currentRating, files: [] })
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        cancelBtn.click();
        loadReviews();
    } catch (err) {
    } finally {
        // Restore button
        updateBtn.innerHTML = originalHTML;
        updateBtn.disabled = false;
        updateBtn.classList.remove('loading');
    }
});

  let currentRating = 0;
  let editingReviewID = null;
  let allReviews = [];

  // ⭐ Rating selector
  document.querySelectorAll("#reviewRating .star").forEach(star => {
    star.addEventListener("click", () => {
      currentRating = parseInt(star.dataset.rating);
      document.querySelectorAll("#reviewRating .star").forEach(s => {
        s.style.color = parseInt(s.dataset.rating) <= currentRating ? "#FFD700" : "#ccc";
      });
    });
  });

  async function loadReviews() {
    try {
      const res = await fetch("/get_your_reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Unauthorized. Please login.");

      allReviews = data.reviews;
      renderReviews(allReviews);
    } catch (err) {
      console.error("❌ Error loading reviews:", err);
    }
  }

  function renderReviews(reviews) {
    reviewsTableBody.innerHTML = "";
    reviews.forEach(r => {
        const tr = document.createElement("tr");
        const formattedCreatedDate = new Date(r.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          });

        tr.innerHTML = `
            <td>
                <div class="suggestion-description"
                data-full-text="${r.comment.replace(/"/g, '&quot;')}">
                ${r.comment.length > 30 
                    ? r.comment.substring(0, 30) + "..." 
                    : r.comment}
            </div>
            </td>
            <td>
                <span class="review-date">${formattedCreatedDate}</span>
            </td>
            <td>
                <button class="btn btn-small btn-secondary edit-btn" data-id="${r.reviewID}" title="Edit Review">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-small btn-danger delete-btn" data-id="${r.reviewID}" title="Delete Review">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        reviewsTableBody.appendChild(tr);

    });

    // Wire edit/delete buttons
    document.querySelectorAll(".edit-btn").forEach(btn =>
        btn.addEventListener("click", () => loadIntoForm(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach(btn =>
        btn.addEventListener("click", () => deleteReview(btn.dataset.id))
    );
}


  function loadIntoForm(reviewID) {
    const review = allReviews.find(r => r.reviewID == reviewID);
    if (!review) return;

    editingReviewID = review.reviewID;
    commentField.value = review.comment;
    currentRating = review.ratingStar;
    document.querySelectorAll("#reviewRating .star").forEach(s => {
        s.style.color = parseInt(s.dataset.rating) <= currentRating ? "#FFD700" : "#ccc";
    });

    submitBtn.style.display = "none";
    updateBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";

    // Scroll form into view with offset (e.g., 100px from top)
    const rect = form.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = 100; // adjust this for your title/header height
    window.scrollTo({ top: rect.top + scrollTop - offset, behavior: "smooth" });
  }


  cancelBtn.addEventListener("click", () => {
    form.reset();
    reviewFileInput.value = "";
    editingReviewID = null;
    currentRating = 0;
    document.querySelectorAll("#reviewRating .star").forEach(s => (s.style.color = "#ccc"));
    submitBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
    cancelBtn.style.display = "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const comment = commentField.value;

    try {
      const res = await fetch("/review?action=create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, ratingStar: currentRating, files: [] })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      alert("✅ Review added!");
      cancelBtn.click();
      loadReviews();
    } catch (err) {
      alert("❌ " + err.message);
    }
  });

  updateBtn.addEventListener("click", async () => {
    if (!editingReviewID) return;
    const comment = commentField.value;

    try {
      const res = await fetch("/review?action=modify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewID: editingReviewID, comment, ratingStar: currentRating, files: [] })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      alert("✅ Review updated!");
      cancelBtn.click();
      loadReviews();
    } catch (err) {
      alert("❌ " + err.message);
    }
  });

  async function deleteReview(reviewID) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch("/delete_your_review", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewID })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      alert("🗑️ Review deleted!");
      loadReviews();
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

  window.reviewsTableModule = {
    filterReviews(query) {
      const q = query.toLowerCase();
      const filtered = allReviews.filter(r => r.comment.toLowerCase().includes(q));
      renderReviews(filtered);
    }
  };
  window.reviewTooltip.initializeTooltipsForReviews();
    if (window.reviewTooltip && typeof window.reviewTooltip.initializeTooltipsForReviews === "function") {
    window.reviewTooltip.initializeTooltipsForReviews();
}

  // Initial load
  loadReviews();
});
