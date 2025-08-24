/**
 * Form Handling Module
 * Manages form submissions for reviews and suggestions
 */

// Enhanced form submissions with professional feedback
function submitReview(event) {
    event.preventDefault();
    
    const currentRating = window.ratingModule ? window.ratingModule.currentReviewRating() : 0;
    
    if (currentRating === 0) {
        window.notificationModule.showNotification(
            'Please provide a service rating before submitting your review.', 
            'warning'
        );
        return;
    }

    const submitBtn = event.target.querySelector('.btn-primary');
    const originalHTML = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simulate API call
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success-animation');
        
        window.notificationModule.showNotification(
            'Your professional review has been submitted successfully. Thank you for your valuable feedback!', 
            'success'
        );
        
        // Reset form
        setTimeout(() => {
            event.target.reset();
            if (window.ratingModule) {
                window.ratingModule.resetRating();
            }
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success-animation');
        }, 2000);
    }, 2500);
}

function submitSuggestion(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.btn-primary');
    const originalHTML = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simulate API call
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Report Submitted';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success-animation');
        
        window.notificationModule.showNotification(
            'Your issue report has been submitted to our engineering team. You will receive a tracking ID via email shortly.', 
            'success'
        );
        
        // Reset form
        setTimeout(() => {
            event.target.reset();
            if (window.fileUploadModule) {
                window.fileUploadModule.resetUploadArea();
            }
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success-animation');
        }, 2000);
    }, 2500);
}

// Make functions available globally
window.submitReview = submitReview;
window.submitSuggestion = submitSuggestion;