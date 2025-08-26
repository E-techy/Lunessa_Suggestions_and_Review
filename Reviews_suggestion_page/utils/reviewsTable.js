/**
 * Reviews Table Management Module
 * Handles dynamic table population, CRUD operations for reviews
 */

// Sample review data adapted from sample_reviews_data.js
let reviewsData = [
    {
        id: 1,
        reviewID: "REV_001_2024",
        name: "Alice Johnson",
        username: "alice_j_2024",
        description: "Absolutely fantastic product! The quality exceeded my expectations and the delivery was lightning fast. I've been using it for a month now and couldn't be happier. Highly recommend to anyone looking for reliable quality.",
        ratingStar: 5,
        date: "2024-01-15",
        reviewType: "product",
        positivityLevel: 0.95,
        files: [
            {
                fileName: "product_unboxing.jpg",
                fileType: "photo",
                fileSize: 2048,
                fileExtension: "jpg"
            },
            {
                fileName: "review_video.mp4",
                fileType: "video",
                fileSize: 15360,
                fileExtension: "mp4"
            }
        ]
    },
    {
        id: 2,
        reviewID: "REV_002_2024",
        name: "Mark Thompson",
        username: "markT_tech",
        description: "Good product overall, but there are some minor issues with the build quality. The functionality works as advertised, though I wish the instructions were clearer. Still worth the price point.",
        ratingStar: 4,
        date: "2024-01-18",
        reviewType: "product",
        positivityLevel: 0.72,
        files: [
            {
                fileName: "issue_documentation.pdf",
                fileType: "pdf",
                fileSize: 512,
                fileExtension: "pdf"
            }
        ]
    },
    {
        id: 3,
        reviewID: "REV_003_2024",
        name: "Sarah Chen",
        username: "sarahc_design",
        description: "The service was okay, nothing extraordinary but met basic expectations. Response time could be improved and the interface feels a bit outdated. However, the core functionality works reliably.",
        ratingStar: 3,
        date: "2024-01-20",
        reviewType: "service",
        positivityLevel: 0.58,
        files: []
    },
    {
        id: 4,
        reviewID: "REV_004_2024",
        name: "David Rodriguez",
        username: "david_r_customer",
        description: "Unfortunately, this didn't meet my expectations. The product arrived damaged and customer service was slow to respond. After multiple attempts to resolve the issue, I'm quite disappointed.",
        ratingStar: 2,
        date: "2024-01-22",
        reviewType: "product",
        positivityLevel: 0.25,
        files: [
            {
                fileName: "damage_report.jpg",
                fileType: "photo",
                fileSize: 1024,
                fileExtension: "jpg"
            },
            {
                fileName: "email_correspondence.txt",
                fileType: "txt",
                fileSize: 256,
                fileExtension: "txt"
            }
        ]
    },
    {
        id: 5,
        reviewID: "REV_005_2024",
        name: "Emily Watson",
        username: "emily_w_2024",
        description: "Terrible experience from start to finish. Product quality is poor, shipping took forever, and when I tried to return it, the process was a nightmare. Would not recommend to anyone.",
        ratingStar: 1,
        date: "2024-01-25",
        reviewType: "product",
        positivityLevel: 0.05,
        files: [
            {
                fileName: "return_process_issues.doc",
                fileType: "doc",
                fileSize: 768,
                fileExtension: "doc"
            }
        ]
    },
    {
        id: 6,
        reviewID: "REV_006_2024",
        name: "James Wilson",
        username: "james_wilson_tech",
        description: "Amazing service! The team went above and beyond to help me with my setup. Technical support was knowledgeable and patient. This is how customer service should be done everywhere.",
        ratingStar: 5,
        date: "2024-01-28",
        reviewType: "service",
        positivityLevel: 0.98,
        files: [
            {
                fileName: "setup_completion.jpg",
                fileType: "photo",
                fileSize: 1536,
                fileExtension: "jpg"
            },
            {
                fileName: "thank_you_note.txt",
                fileType: "txt",
                fileSize: 128,
                fileExtension: "txt"
            }
        ]
    },
    {
        id: 7,
        reviewID: "REV_007_2024",
        name: "Lisa Garcia",
        username: "lisa_g_shopper",
        description: "Decent product for the price. It does what it's supposed to do, but don't expect any premium features. Good value for money if you're on a budget and need basic functionality.",
        ratingStar: 4,
        date: "2024-01-30",
        reviewType: "product",
        positivityLevel: 0.68,
        files: []
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
    row.style.cursor = 'pointer';
    
    const formattedDate = formatDate(review.date);
    const truncatedDescription = truncateText(review.description, 40);
    
    row.innerHTML = `
        <td>
            <div class="review-description" 
                 data-full-text="${review.description.replace(/"/g, '&quot;')}" 
                 onclick="loadReviewToForm(${review.id})">
                ${truncatedDescription}
            </div>
            <div class="review-meta" style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                By ${review.name} (${review.username}) • ${review.reviewType} • ${review.ratingStar} stars
            </div>
        </td>
        <td>
            <span class="review-date">${formattedDate}</span>
        </td>
        <td>
            <button class="btn btn-small btn-secondary" onclick="event.stopPropagation(); editReview(${review.id})" title="Edit Review">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-small btn-danger" onclick="event.stopPropagation(); deleteReview(${review.id})" title="Delete Review">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    // Add row click event for better UX
    row.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            loadReviewToForm(review.id);
        }
    });
    
    return row;
}

/**
 * Load review data into the form (new functionality)
 */
function loadReviewToForm(reviewId) {
    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) return;

    const form = document.querySelector('.form-grid');
    const textarea = form.querySelector('.form-textarea');
    const ratingElement = form.querySelector('#reviewRating');
    
    // Load the review content
    textarea.value = review.description;
    
    // Set rating stars
    if (ratingElement) {
        const stars = ratingElement.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < review.ratingStar) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // Set the current rating in the element for the rating module
        ratingElement.setAttribute('data-current-rating', review.ratingStar);
        
        // Update rating module if available
        if (window.ratingModule && window.ratingModule.setRating) {
            window.ratingModule.setRating(review.ratingStar);
        }
    }
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Highlight the form briefly
    form.classList.add('editing-mode');
    setTimeout(() => form.classList.remove('editing-mode'), 1500);
    
    // Show notification
    if (window.notificationModule) {
        window.notificationModule.showNotification(
            `Loaded review by ${review.name}. You can now view or modify the content.`, 
            'info'
        );
    }
    
    // Focus on textarea
    setTimeout(() => {
        textarea.focus();
        textarea.scrollTop = 0;
    }, 500);
}

/**
 * Add a new review to the data and table
 */
function addNewReview(reviewData) {
    const newReview = {
        id: Date.now(), // Simple ID generation
        reviewID: `REV_${Date.now()}_2024`,
        name: reviewData.name || "Anonymous User",
        username: reviewData.username || "user_" + Date.now(),
        description: reviewData.description,
        ratingStar: reviewData.rating,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        reviewType: reviewData.reviewType || "general",
        positivityLevel: calculatePositivityLevel(reviewData.rating),
        files: reviewData.files || []
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
 * Calculate positivity level based on rating
 */
function calculatePositivityLevel(rating) {
    const levels = {
        1: 0.1,
        2: 0.3,
        3: 0.5,
        4: 0.75,
        5: 0.95
    };
    return levels[rating] || 0.5;
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
    window.ratingModule.setRating(review.ratingStar);
    } else {
    // Method 2: Direct DOM manipulation
    const stars = ratingElement.querySelectorAll('.star');
    stars.forEach((star, index) => {
    if (index < review.ratingStar) {
    star.classList.add('active');
    } else {
    star.classList.remove('active');
    }
    star.setAttribute('data-rating', index + 1);
    });
    
    // Set the current rating in the element
    ratingElement.setAttribute('data-current-rating', review.ratingStar);
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
    const avgRating = (reviewsData.reduce((sum, review) => sum + review.ratingStar, 0) / reviewsData.length).toFixed(1);
    
    // Calculate positive percentage (4+ stars)
    const positiveReviews = reviewsData.filter(review => review.ratingStar >= 4).length;
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
                    ratingStar: reviewData.rating
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
window.loadReviewToForm = loadReviewToForm;
window.editReview = editReview;
window.deleteReview = deleteReview;
window.submitReview = submitReviewEnhanced;
window.updateReview = updateReview;
window.cancelEdit = cancelEdit;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeReviewsTable();
    initializeTooltips();
});

/**
 * Initialize tooltips for review descriptions
 */
function initializeTooltips() {
    let tooltip = null;
    
    // Create tooltip element
    function createTooltip() {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }
    
    // Show tooltip
    function showTooltip(element, text, event) {
        const tooltipEl = createTooltip();
        tooltipEl.textContent = text;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        tooltipEl.style.left = (rect.left + scrollLeft) + 'px';
        tooltipEl.style.top = (rect.top + scrollTop - tooltipEl.offsetHeight - 10) + 'px';
        
        // Show tooltip with animation
        setTimeout(() => {
            tooltipEl.classList.add('show');
        }, 10);
    }
    
    // Hide tooltip
    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }
    
    // Delegate event listeners
    document.addEventListener('mouseover', function(event) {
        const target = event.target;
        if (target.matches('.review-description, .suggestion-description')) {
            const fullText = target.getAttribute('data-full-text') || target.title;
            if (fullText && fullText !== target.textContent.trim()) {
                showTooltip(target, fullText, event);
            }
        }
    });
    
    document.addEventListener('mouseout', function(event) {
        const target = event.target;
        if (target.matches('.review-description, .suggestion-description')) {
            hideTooltip();
        }
    });
}
