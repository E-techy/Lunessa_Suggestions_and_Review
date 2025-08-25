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
    
    const form = event.target;
    const categorySelect = form.querySelector('select');
    const descriptionTextarea = form.querySelector('textarea');
    const fileInput = form.querySelector('input[type="file"]');
    
    // Validation
    if (!categorySelect.value || !descriptionTextarea.value.trim()) {
        window.notificationModule.showNotification(
            'Please fill in all required fields.', 
            'warning'
        );
        return;
    }
    
    const submitBtn = form.querySelector('.btn-primary');
    const originalHTML = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Simulate API call
    setTimeout(() => {
        // Map form values to display names
        const categoryDisplayMap = {
            'critical-bug': 'Critical Bug',
            'ui-ux': 'UI/UX',
            'performance': 'Performance',
            'api-integration': 'API Integration',
            'security': 'Security',
            'feature-request': 'Feature Request',
            'documentation': 'Documentation',
            'accessibility': 'Accessibility'
        };
        
        // Prepare suggestion data
        const suggestionData = {
            category: categoryDisplayMap[categorySelect.value] || categorySelect.value,
            description: descriptionTextarea.value.trim(),
            files: fileInput.files ? Array.from(fileInput.files) : []
        };
        
        // Add to suggestions table
        if (window.suggestionsTableModule) {
            window.suggestionsTableModule.addSuggestion(suggestionData);
        }
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Report Submitted';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success-animation');
        
        window.notificationModule.showNotification(
            'Your issue report has been submitted to our engineering team. You can track its progress in the table below.', 
            'success'
        );
        
        // Reset form
        setTimeout(() => {
            form.reset();
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