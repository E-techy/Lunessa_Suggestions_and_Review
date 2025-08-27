// reviews.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reviewForm");
  const reviewIDField = document.getElementById("reviewIDField");
  const commentField = document.getElementById("reviewComment");
  const submitBtn = document.getElementById("submitReviewBtn");
  const updateBtn = document.getElementById("updateReviewBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const reviewsTableBody = document.querySelector("#reviewsTable tbody");

  let currentRating = 0;

  // ⭐ rating selector
  document.querySelectorAll("#reviewRating .star").forEach(star => {
    star.addEventListener("click", () => {
      currentRating = parseInt(star.dataset.rating);
      document.querySelectorAll("#reviewRating .star").forEach(s => {
        s.style.color = parseInt(s.dataset.rating) <= currentRating ? "#FFD700" : "#ccc";
      });
    });
  });

  // Fetch your reviews
  async function loadReviews() {
    try {
      const res = await fetch("/get_your_reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      reviewsTableBody.innerHTML = "";
      data.reviews.forEach(r => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${r.reviewID}</td>
          <td>${"★".repeat(r.ratingStar)}${"☆".repeat(5 - r.ratingStar)}</td>
          <td>${r.comment}</td>
          <td>${new Date(r.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${r.reviewID}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${r.reviewID}">Delete</button>
          </td>
        `;

        reviewsTableBody.appendChild(tr);
      });

      // Wire edit buttons
      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => loadIntoForm(btn.dataset.id, data.reviews));
      });

      // Wire delete buttons
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteReview(btn.dataset.id));
      });
    } catch (err) {
      console.error("❌ Error loading reviews:", err);
    }
  }

  // Load review into form for editing
  function loadIntoForm(reviewID, reviews) {
    const review = reviews.find(r => r.reviewID === reviewID);
    if (!review) return;

    reviewIDField.value = review.reviewID;
    commentField.value = review.comment;
    currentRating = review.ratingStar;
    document.querySelectorAll("#reviewRating .star").forEach(s => {
      s.style.color = parseInt(s.dataset.rating) <= currentRating ? "#FFD700" : "#ccc";
    });

    submitBtn.style.display = "none";
    updateBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
  }

  // Cancel editing
  cancelBtn.addEventListener("click", () => {
    form.reset();
    reviewIDField.value = "";
    currentRating = 0;
    document.querySelectorAll("#reviewRating .star").forEach(s => (s.style.color = "#ccc"));
    submitBtn.style.display = "inline-block";
    updateBtn.style.display = "none";
    cancelBtn.style.display = "none";
  });

  // Submit new review
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const comment = commentField.value;

    try {
      const res = await fetch("/review?action=create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, ratingStar: currentRating, files: [] }) // TODO: file upload handling
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      alert("✅ Review added!");
      form.reset();
      loadReviews();
    } catch (err) {
      alert("❌ " + err.message);
    }
  });

  // Update review
  updateBtn.addEventListener("click", async () => {
    const comment = commentField.value;
    const reviewID = reviewIDField.value;

    try {
      const res = await fetch("/review?action=modify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewID, comment, ratingStar: currentRating, files: [] })
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

  // Delete review
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

  // Init load
  loadReviews();
});
