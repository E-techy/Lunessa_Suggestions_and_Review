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
function addNewReview(reviewData) {
    const newReview = dataManager.addReview(reviewData);
    tableRenderer.populateReviewsTable();
    
    // Show success notification
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            'Review added successfully!', 
            'success'
        );
    }
    
    return newReview;
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
function submitReview(event) {
    event.preventDefault();
    
    const elements = formManager.getFormElements();
    const description = elements.textarea.value.trim();
    const currentRating = formManager.getCurrentRating();
    
    // Validate form
    const validation = formManager.validateForm(description, currentRating);
    if (!validation.isValid) {
        if (window.notificationModule) {
            window.notificationModule.showNotification(
                validation.errors[0], 
                'warning'
            );
        }
        return;
    }
    
    // Show loading state
    const originalHTML = formManager.showButtonLoading(elements.submitBtn, 'Processing...');

    setTimeout(() => {
        const reviewData = {
            description: description,
            rating: currentRating
        };

        // Add new review
        addNewReview(reviewData);

        // Reset form
        formManager.resetForm();
        formManager.resetButtonLoading(elements.submitBtn, originalHTML);
        
    }, 1500);
}

/**
 * Update an existing review
 */
function updateReview() {
    const elements = formManager.getFormElements();
    const description = elements.textarea.value.trim();
    const currentRating = formManager.getCurrentRating();
    const editingId = dataManager.getCurrentEditingId();
    
    // Validate form
    const validation = formManager.validateForm(description, currentRating);
    if (!validation.isValid) {
        if (window.notificationModule) {
            window.notificationModule.showNotification(
                validation.errors[0], 
                'warning'
            );
        }
        return;
    }
    
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
