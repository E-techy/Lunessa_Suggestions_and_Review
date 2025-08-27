/**
 * Form Management Module
 * Handles form interactions, validation, and state management
 */

/**
 * Get form elements
 * @returns {Object} Object containing form elements
 */
function getFormElements() {
    const form = document.querySelector('.form-grid');
    const textarea = form ? form.querySelector('.form-textarea') : null;
    const ratingElement = document.querySelector('#reviewRating');
    const submitBtn = document.getElementById('submitReviewBtn');
    const updateBtn = document.getElementById('updateReviewBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    return {
        form,
        textarea,
        ratingElement,
        submitBtn,
        updateBtn,
        cancelBtn
    };
}

/**
 * Load review data into the form
 * @param {number} reviewId - Review ID to load
 */
function loadReviewToForm(reviewId) {
    const review = dataManager.getReviewById(reviewId);
    if (!review) return;

    const elements = getFormElements();
    if (!elements.form || !elements.textarea) return;
    
    // Load the review content
    elements.textarea.value = review.description;
    
    // Set rating stars
    setFormRating(review.ratingStar, elements.ratingElement);
    
    // Scroll to form and highlight
    elements.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    elements.form.classList.add('editing-mode');
    setTimeout(() => elements.form.classList.remove('editing-mode'), 1500);
    
    // Show notification
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            `Loaded review by ${review.name}. You can now view or modify the content.`, 
            'info'
        );
    }
    
    // Focus on textarea
    setTimeout(() => {
        elements.textarea.focus();
        elements.textarea.scrollTop = 0;
    }, 500);
}

/**
 * Set rating in the form
 * @param {number} rating - Rating value (1-5)
 * @param {HTMLElement} ratingElement - Rating element
 */
function setFormRating(rating, ratingElement) {
    if (!ratingElement) return;
    
    // Use the rating module if available
    if (window.ratingModule && window.ratingModule.setRating) {
        window.ratingModule.setRating(rating);
    } else {
        // Direct DOM manipulation fallback
        const stars = ratingElement.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
            star.setAttribute('data-rating', index + 1);
        });
        
        ratingElement.setAttribute('data-current-rating', rating);
    }
}

/**
 * Get current rating from form
 * @returns {number} Current rating value
 */
function getCurrentRating() {
    return window.ratingModule ? window.ratingModule.currentReviewRating() : 0;
}

/**
 * Validate form data
 * @param {string} description - Review description
 * @param {number} rating - Review rating
 * @returns {Object} Validation result
 */
// function validateForm(description, rating) {
//     const errors = [];
    
//     if (rating === 0) {
//         errors.push('Please provide a service rating before submitting your review.');
//     }
    
//     if (!description.trim()) {
//         errors.push('Please provide a detailed review before submitting.');
//     }
    
//     return {
//         isValid: errors.length === 0,
//         errors: errors
//     };
// }

/**
 * Reset form to initial state
 */
function resetForm() {
    const elements = getFormElements();
    
    if (elements.form) {
        elements.form.reset();
    }
    
    if (window.ratingModule) {
        window.ratingModule.resetRating();
    }
}

/**
 * Switch to edit mode - show update/cancel buttons, hide submit button
 */
function switchToEditMode() {
    const elements = getFormElements();
    
    if (elements.submitBtn) elements.submitBtn.style.display = 'none';
    if (elements.updateBtn) elements.updateBtn.style.display = 'inline-flex';
    if (elements.cancelBtn) elements.cancelBtn.style.display = 'inline-flex';
}

/**
 * Switch to normal mode - show submit button, hide update/cancel buttons
 */
function switchToNormalMode() {
    const elements = getFormElements();
    
    if (elements.submitBtn) elements.submitBtn.style.display = 'inline-flex';
    if (elements.updateBtn) elements.updateBtn.style.display = 'none';
    if (elements.cancelBtn) elements.cancelBtn.style.display = 'none';
    
    // Reset editing state
    dataManager.clearCurrentEditingId();
    
    // Remove editing mode styling
    if (elements.form) {
        elements.form.classList.remove('editing-mode');
    }
}

/**
 * Show button loading state
 * @param {HTMLElement} button - Button element
 * @param {string} loadingText - Loading text to display
 * @returns {string} Original button HTML
 */
function showButtonLoading(button, loadingText) {
    const originalHTML = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
    button.disabled = true;
    return originalHTML;
}

/**
 * Reset button from loading state
 * @param {HTMLElement} button - Button element
 * @param {string} originalHTML - Original button HTML
 */
function resetButtonLoading(button, originalHTML) {
    button.innerHTML = originalHTML;
    button.disabled = false;
}

/**
 * Highlight form temporarily
 */
function highlightForm() {
    const elements = getFormElements();
    if (elements.form) {
        elements.form.classList.add('editing-mode');
        setTimeout(() => elements.form.classList.remove('editing-mode'), 2000);
    }
}

// Export the form manager module
window.formManager = {
    getFormElements,
    loadReviewToForm,
    setFormRating,
    getCurrentRating,
    resetForm,
    switchToEditMode,
    switchToNormalMode,
    showButtonLoading,
    resetButtonLoading,
    highlightForm
};
