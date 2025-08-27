/**
 * Review Actions Module
 * Handles user actions for reviews (CRUD operations)
 */

/**
 * Load review data into the form (delegated to formManager)
 * @param {number} reviewId - Review ID to load
 */
function loadReviewToForm(reviewId) {
    formManager.loadReviewToForm(reviewId);
}

/**
 * Add a new review
 * @param {Object} reviewData - Review data object
 */
async function addNewReview(reviewData) {
  try {
    let { comment, ratingStar, files } = reviewData;

    // ✅ Validate comment
    if (typeof comment !== "string") {
      const errorMsg = "Comment must be a string";
      if (window.notificationModule) {
        window.notificationModule.showNotification(errorMsg, "error");
      }
      return { success: false, error: errorMsg };
    }
    if (comment.length > 1000) {
      const errorMsg = "Comment cannot exceed 1000 characters";
      if (window.notificationModule) {
        window.notificationModule.showNotification(errorMsg, "error");
      }
      return { success: false, error: errorMsg };
    }

    // ✅ Validate ratingStar
    ratingStar = parseInt(ratingStar, 10);
    if (isNaN(ratingStar) || ratingStar < 0 || ratingStar > 5) {
      const errorMsg = "Rating must be an integer between 0 and 5";
      if (window.notificationModule) {
        window.notificationModule.showNotification(errorMsg, "error");
      }
      return { success: false, error: errorMsg };
    }

    // ✅ Prepare payload
    const payload = { comment, ratingStar, files };

    // ✅ Send POST request
    const response = await fetch("/review?action=create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 👈 ensures authToken cookie is sent
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.success) {
      const errorMsg = result.error || "Failed to add review";
      if (window.notificationModule) {
        window.notificationModule.showNotification(errorMsg, "error");
      }
      return { success: false, error: errorMsg };
    }

    // ✅ Success notification
    if (window.notificationModule) {
      window.notificationModule.showNotification("Review added successfully!", "success");
    }

    return { success: true, message: result.message };
  } catch (err) {
    console.error("❌ Error in addNewReview:", err);
    const errorMsg = "Unexpected error while adding review";
    if (window.notificationModule) {
      window.notificationModule.showNotification(errorMsg, "error");
    }
    return { success: false, error: errorMsg };
  }
}



/**
 * Edit a review - load data into form and switch to edit mode
 * @param {number} reviewId - Review ID to edit
 */
function editReview(reviewId) {
    const review = dataManager.getReviewById(reviewId);
    if (!review) return;

    dataManager.setCurrentEditingId(reviewId);
    
    // Populate form with existing data
    const elements = formManager.getFormElements();
    if (!elements.form || !elements.textarea) return;
    
    elements.textarea.value = review.description;
    formManager.setFormRating(review.ratingStar, elements.ratingElement);
    
    // Switch buttons for edit mode
    formManager.switchToEditMode();
    
    // Scroll to form and highlight
    elements.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    formManager.highlightForm();
    
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            'Review loaded for editing. Make your changes and click "Update Review".', 
            'info'
        );
    }
}

/**
 * Delete a review with confirmation
 * @param {number} reviewId - Review ID to delete
 */
function deleteReview(reviewId) {
    const review = dataManager.getReviewById(reviewId);
    if (!review) return;

    // Create custom confirmation modal
    const confirmDelete = confirm(
        `Are you sure you want to delete this review?\n\n"${utils.truncateText(review.description, 100)}"\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
        // Remove from data
        const success = dataManager.deleteReview(reviewId);
        
        if (success) {
            // Remove from table with animation
            tableRenderer.removeTableRowWithAnimation(reviewId);
            
            if (window.notificationModule) {
                window.notificationModule.showNotification(
                    'Review deleted successfully.', 
                    'success'
                );
            }
        }
    }
}

/**
 * Submit a new review (form submission handler)
 * @param {Event} event - Form submission event
 */
async function submitReview(event) {
  event.preventDefault();
  console.log("submit clicked");
  

  const elements = formManager.getFormElements();
  const comment = elements.textarea.value.trim();
  const ratingStar = formManager.getCurrentRating();
  const files =  [];
//  formManager.getCurrentFiles() ||
  // Show loading state
  const originalHTML = formManager.showButtonLoading(elements.submitBtn, "Processing...");

  // Prepare review data
  const reviewData = { comment, ratingStar, files };
  console.log(reviewData);
  

  try {
    // Send review
    const result = await addNewReview(reviewData);
    console.log(result);
    

    if (result.success) {
      // ✅ Success → reset form
      formManager.resetForm();
    }
    // In both cases reset button (but not form if error)
    formManager.resetButtonLoading(elements.submitBtn, originalHTML);
  } catch (err) {
    console.error("❌ Unexpected error in submitReview:", err);
    // Reset only button (form stays for correction)
    formManager.resetButtonLoading(elements.submitBtn, originalHTML);
  }
}

/**
 * Update an existing review
 */
function updateReview() {
    const elements = formManager.getFormElements();
    const description = elements.textarea.value.trim();
    const currentRating = formManager.getCurrentRating();
    const editingId = dataManager.getCurrentEditingId();
    
    
    // Show loading state
    const originalHTML = formManager.showButtonLoading(elements.updateBtn, 'Updating...');

    setTimeout(() => {
        const updateData = {
            description: description,
            ratingStar: currentRating,
            rating: currentRating
        };

        if (editingId) {
            // Update existing review
            const success = dataManager.updateReview(editingId, updateData);
            if (success) {
                tableRenderer.populateReviewsTable();
                
                if (window.notificationModule) {
                    window.notificationModule.showNotification(
                        'Review updated successfully!', 
                        'success'
                    );
                }
            }
        }

        // Reset form and switch back to normal mode
        formManager.resetForm();
        formManager.resetButtonLoading(elements.updateBtn, originalHTML);
        formManager.switchToNormalMode();
        
    }, 1500);
}

/**
 * Cancel edit operation
 */
function cancelEdit() {
    // Reset form
    formManager.resetForm();
    
    // Switch back to normal mode
    formManager.switchToNormalMode();
    
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            'Edit cancelled.', 
            'info'
        );
    }
}

/**
 * Filter reviews in the table
 * @param {string} searchTerm - Search term to filter by
 */
function filterReviews(searchTerm) {
    tableRenderer.filterTableRows(searchTerm);
}

// Export the review actions module
window.reviewActions = {
    loadReviewToForm,
    addNewReview,
    editReview,
    deleteReview,
    submitReview,
    updateReview,
    cancelEdit,
    filterReviews
};

// Make individual functions global for HTML onclick handlers
window.loadReviewToForm = loadReviewToForm;
window.editReview = editReview;
window.deleteReview = deleteReview;
window.submitReview = submitReview;
window.updateReview = updateReview;
window.cancelEdit = cancelEdit;
