/**
 * Table Rendering Module
 * Handles the rendering and updating of the reviews table
 */

/**
 * Create a table row element for a review
 * @param {Object} review - Review object
 * @returns {HTMLElement} Table row element
 */
function createTableRow(review) {
    const row = document.createElement('tr');
    row.setAttribute('data-review-id', review.id);
    row.style.cursor = 'pointer';
    
    const formattedDate = utils.formatDate(review.date);
    const truncatedDescription = utils.truncateText(review.description, 40);
    
    row.innerHTML = `
        <td>
            <div class="review-description" 
                 data-full-text="${review.description.replace(/"/g, '&quot;')}" 
                 onclick="reviewActions.loadReviewToForm(${review.id})">
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
            <button class="btn btn-small btn-secondary" onclick="event.stopPropagation(); reviewActions.editReview(${review.id})" title="Edit Review">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-small btn-danger" onclick="event.stopPropagation(); reviewActions.deleteReview(${review.id})" title="Delete Review">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    // Add row click event for better UX
    row.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            reviewActions.loadReviewToForm(review.id);
        }
    });
    
    return row;
}

/**
 * Populate the reviews table with current data
 */
function populateReviewsTable() {
    const tableBody = document.querySelector('.reviews-table tbody');
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = '';

    // Get all reviews and create rows
    const reviews = dataManager.getAllReviews();
    reviews.forEach(review => {
        const row = createTableRow(review);
        tableBody.appendChild(row);
    });

    // Update metrics after table population
    updateReviewMetrics();
}

/**
 * Update the review metrics display
 */
function updateReviewMetrics() {
    const metrics = dataManager.calculateMetrics();
    
    // Update DOM elements
    const metricCards = document.querySelectorAll('.metric-card');
    if (metricCards.length >= 3) {
        const avgElement = metricCards[0].querySelector('.metric-value');
        const totalElement = metricCards[1].querySelector('.metric-value');
        const positiveElement = metricCards[2].querySelector('.metric-value');
        
        if (avgElement) avgElement.textContent = metrics.averageRating;
        if (totalElement) totalElement.textContent = metrics.totalReviews;
        if (positiveElement) positiveElement.textContent = metrics.positivePercentage + '%';
    }
}

/**
 * Filter table rows based on search term
 * @param {string} searchTerm - Search term to filter by
 */
function filterTableRows(searchTerm) {
    const rows = document.querySelectorAll('.reviews-table tbody tr');
    rows.forEach(row => {
        const description = row.querySelector('.review-description').textContent.toLowerCase();
        const meta = row.querySelector('.review-meta').textContent.toLowerCase();
        
        if (description.includes(searchTerm.toLowerCase()) || 
            meta.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Remove a table row with animation
 * @param {number} reviewId - Review ID to remove
 */
function removeTableRowWithAnimation(reviewId) {
    const row = document.querySelector(`tr[data-review-id="${reviewId}"]`);
    if (row) {
        row.style.transition = 'all 0.3s ease';
        row.style.transform = 'translateX(-100%)';
        row.style.opacity = '0';
        
        setTimeout(() => {
            populateReviewsTable();
        }, 300);
    }
}

/**
 * Highlight a table row temporarily
 * @param {number} reviewId - Review ID to highlight
 */
function highlightTableRow(reviewId) {
    const row = document.querySelector(`tr[data-review-id="${reviewId}"]`);
    if (row) {
        row.classList.add('highlighted');
        setTimeout(() => {
            row.classList.remove('highlighted');
        }, 2000);
    }
}

// Export the table renderer module
window.tableRenderer = {
    createTableRow,
    populateReviewsTable,
    updateReviewMetrics,
    filterTableRows,
    removeTableRowWithAnimation,
    highlightTableRow
};
