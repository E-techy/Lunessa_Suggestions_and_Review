/**
 * Reviews Table Management Module
 * Handles dynamic table population, CRUD operations for reviews
 */

// Reviews data storage (in real app, this would come from a database)
let reviewsData = [
    {
        id: 1,
        description: "Outstanding AI service with excellent response times and accuracy",
        date: "2025-01-15",
        rating: 5
    },
    {
        id: 2,
        description: "Good integration capabilities but needs improvement in multilingual support",
        date: "2025-01-18",
        rating: 4
    },
    {
        id: 3,
        description: "Exceptional customer support and robust documentation",
        date: "2025-01-20",
        rating: 5
    },
    {
        id: 4,
        description: "Perfect solution for our enterprise needs",
        date: "2025-01-22",
        rating: 5
    }
];

let currentEditingId = null;

/**
 * Initialize the reviews table module
 */
function initializeReviewsTable() {
    console.log('Initializing Reviews Table Module...');
    populateReviewsTable();
}

/**
 * Populate the reviews table with current data
 */
function populateReviewsTable() {
    const tableBody = document.querySelector('.reviews-table tbody');
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add reviews data
    reviewsData.forEach(review => {
        const row = createTableRow(review);
        tableBody.appendChild(row);
    });

    // Update metrics
    updateReviewMetrics();
}

/**
 * Create a table row element for a review
 */
function createTableRow(review) {
    const row = document.createElement('tr');
    row.setAttribute('data-review-id', review.id);
    
    const formattedDate = formatDate(review.date);
    const truncatedDescription = truncateText(review.description, 20);
    
    row.innerHTML = `
        <td>
            <div class="review-description" title="${review.description}">
                ${truncatedDescription}
            </div>
        </td>
        <td>
            <span class="review-date">${formattedDate}</span>
        </td>
        <td>
            <button class="btn btn-small btn-secondary" onclick="editReview(${review.id})" title="Edit Review">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-small btn-danger" onclick="deleteReview(${review.id})" title="Delete Review">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Add a new review to the data and table
 */
function addNewReview(reviewData) {
    const newReview = {
        id: Date.now(), // Simple ID generation
        description: reviewData.description,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        rating: reviewData.rating
    };
    
    reviewsData.unshift(newReview); // Add to beginning of array
    populateReviewsTable();
    
    // Show success notification
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            'Review added successfully!', 
            'success'
        );
    }
}

/**
 * Edit a review
 */
function editReview(reviewId) {
    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) return;

    currentEditingId = reviewId;
    
    // Populate form with existing data
    const form = document.querySelector('.form-grid');
    const textarea = form.querySelector('.form-textarea');
    const ratingElement = form.querySelector('#reviewRating');
    
    textarea.value = review.description;
    
    // Set rating - Multiple approaches to ensure it works
    if (ratingElement) {
        // Method 1: Use the rating module if available
        if (window.ratingModule && window.ratingModule.setRating) {
            window.ratingModule.setRating(review.rating);
        } else {
            // Method 2: Direct DOM manipulation
            const stars = ratingElement.querySelectorAll('.star');
            stars.forEach((star, index) => {
                if (index < review.rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
                star.setAttribute('data-rating', index + 1);
            });
            
            // Set the current rating in the element
            ratingElement.setAttribute('data-current-rating', review.rating);
        }
    }
    
    // Switch buttons for edit mode
    switchToEditMode();
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Highlight the form
    form.classList.add('editing-mode');
    setTimeout(() => form.classList.remove('editing-mode'), 2000);
    
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            'Review loaded for editing. Make your changes and click "Update Review".', 
            'info'
        );
    }
}

/**
 * Delete a review with confirmation
 */
function deleteReview(reviewId) {
    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) return;

    // Create custom confirmation modal
    const confirmDelete = confirm(
        `Are you sure you want to delete this review?\n\n"${truncateText(review.description, 100)}"\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
        // Remove from data array
        reviewsData = reviewsData.filter(r => r.id !== reviewId);
        
        // Remove from table with animation
        const row = document.querySelector(`tr[data-review-id="${reviewId}"]`);
        if (row) {
            row.style.transition = 'all 0.3s ease';
            row.style.transform = 'translateX(-100%)';
            row.style.opacity = '0';
            
            setTimeout(() => {
                populateReviewsTable();
            }, 300);
        }
        
        if (window.notificationModule) {
            window.notificationModule.showNotification(
                'Review deleted successfully.', 
                'success'
            );
        }
    }
}

/**
 * Update the review metrics display
 */
function updateReviewMetrics() {
    if (reviewsData.length === 0) return;

    // Calculate average rating
    const avgRating = (reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length).toFixed(1);
    
    // Calculate positive percentage (4+ stars)
    const positiveReviews = reviewsData.filter(review => review.rating >= 4).length;
    const positivePercentage = Math.round((positiveReviews / reviewsData.length) * 100);
    
    // Update DOM elements
    const metricCards = document.querySelectorAll('.metric-card');
    if (metricCards.length >= 3) {
        metricCards[0].querySelector('.metric-value').textContent = avgRating;
        metricCards[1].querySelector('.metric-value').textContent = reviewsData.length;
        metricCards[2].querySelector('.metric-value').textContent = positivePercentage + '%';
    }
}

/**
 * Switch to edit mode - show update/cancel buttons, hide submit button
 */
function switchToEditMode() {
    const submitBtn = document.getElementById('submitReviewBtn');
    const updateBtn = document.getElementById('updateReviewBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    if (submitBtn) submitBtn.style.display = 'none';
    if (updateBtn) updateBtn.style.display = 'inline-flex';
    if (cancelBtn) cancelBtn.style.display = 'inline-flex';
}

/**
 * Switch to normal mode - show submit button, hide update/cancel buttons
 */
function switchToNormalMode() {
    const submitBtn = document.getElementById('submitReviewBtn');
    const updateBtn = document.getElementById('updateReviewBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    if (submitBtn) submitBtn.style.display = 'inline-flex';
    if (updateBtn) updateBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
    
    // Reset editing state
    currentEditingId = null;
    
    // Remove editing mode styling
    const form = document.querySelector('.form-grid');
    if (form) form.classList.remove('editing-mode');
}

/**
 * Update review function - called by Update Review button
 */
function updateReview() {
    const form = document.querySelector('.form-grid');
    const textarea = form.querySelector('.form-textarea');
    const currentRating = window.ratingModule ? window.ratingModule.currentReviewRating() : 0;
    
    if (currentRating === 0) {
        window.notificationModule.showNotification(
            'Please provide a service rating before updating your review.', 
            'warning'
        );
        return;
    }

    if (!textarea.value.trim()) {
        window.notificationModule.showNotification(
            'Please provide a detailed review before updating.', 
            'warning'
        );
        return;
    }

    const updateBtn = document.getElementById('updateReviewBtn');
    const originalHTML = updateBtn.innerHTML;
    
    // Show loading state
    updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    updateBtn.disabled = true;

    setTimeout(() => {
        const reviewData = {
            description: textarea.value.trim(),
            rating: currentRating
        };

        if (currentEditingId) {
            // Update existing review
            const reviewIndex = reviewsData.findIndex(r => r.id === currentEditingId);
            if (reviewIndex !== -1) {
                reviewsData[reviewIndex] = {
                    ...reviewsData[reviewIndex],
                    description: reviewData.description,
                    rating: reviewData.rating
                };
                populateReviewsTable();
                
                window.notificationModule.showNotification(
                    'Review updated successfully!', 
                    'success'
                );
            }
        }

        // Reset form and switch back to normal mode
        form.reset();
        if (window.ratingModule) {
            window.ratingModule.resetRating();
        }
        
        updateBtn.innerHTML = originalHTML;
        updateBtn.disabled = false;
        
        // Switch back to normal mode
        switchToNormalMode();
        
    }, 1500);
}

/**
 * Cancel edit function - called by Cancel button
 */
function cancelEdit() {
    const form = document.querySelector('.form-grid');
    
    // Reset form
    form.reset();
    if (window.ratingModule) {
        window.ratingModule.resetRating();
    }
    
    // Switch back to normal mode
    switchToNormalMode();
    
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            'Edit cancelled.', 
            'info'
        );
    }
}

/**
 * Enhanced form submission that integrates with table (for new reviews only)
 */
function submitReviewEnhanced(event) {
    event.preventDefault();
    
    const form = event.target;
    const textarea = form.querySelector('.form-textarea');
    const currentRating = window.ratingModule ? window.ratingModule.currentReviewRating() : 0;
    
    if (currentRating === 0) {
        window.notificationModule.showNotification(
            'Please provide a service rating before submitting your review.', 
            'warning'
        );
        return;
    }

    if (!textarea.value.trim()) {
        window.notificationModule.showNotification(
            'Please provide a detailed review before submitting.', 
            'warning'
        );
        return;
    }

    const submitBtn = document.getElementById('submitReviewBtn');
    const originalHTML = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
        const reviewData = {
            description: textarea.value.trim(),
            rating: currentRating
        };

        // Add new review (this function now only handles new reviews)
        addNewReview(reviewData);

        // Reset form
        form.reset();
        if (window.ratingModule) {
            window.ratingModule.resetRating();
        }
        
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        
    }, 1500);
}

/**
 * Utility Functions
 */
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? 'active' : ''}">★</span>`;
    }
    return stars;
}

/**
 * Search and filter functionality
 */
function filterReviews(searchTerm) {
    const rows = document.querySelectorAll('.reviews-table tbody tr');
    rows.forEach(row => {
        const description = row.querySelector('.review-description').textContent.toLowerCase();
        if (description.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export functions globally
window.reviewsTableModule = {
    initialize: initializeReviewsTable,
    addReview: addNewReview,
    editReview: editReview,
    deleteReview: deleteReview,
    filterReviews: filterReviews,
    data: reviewsData
};

// Make individual functions global for HTML onclick handlers
window.editReview = editReview;
window.deleteReview = deleteReview;
window.submitReview = submitReviewEnhanced;
window.updateReview = updateReview;
window.cancelEdit = cancelEdit;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeReviewsTable();
});
