/**
 * Review Data Management Module
 * Handles CRUD operations for review data
 */

// Current editing state
let currentEditingId = null;

/**
 * Get all reviews data
 * @returns {Array} Array of review objects
 */
function getAllReviews() {
    return window.reviewsData || [];
}

/**
 * Get a specific review by ID
 * @param {number} reviewId - Review ID
 * @returns {Object|null} Review object or null if not found
 */
function getReviewById(reviewId) {
    return window.reviewsData.find(r => r.id === reviewId) || null;
}

/**
 * Add a new review to the data
 * @param {Object} reviewData - Review data object
 * @returns {Object} The newly created review
 */
function addReview(reviewData) {
    const newReview = {
        id: utils.generateId(),
        reviewID: `REV_${utils.generateId()}_2024`,
        name: reviewData.name || "Anonymous User",
        username: reviewData.username || "user_" + utils.generateId(),
        description: reviewData.description,
        ratingStar: reviewData.rating,
        date: utils.getCurrentDate(),
        reviewType: reviewData.reviewType || "general",
        positivityLevel: utils.calculatePositivityLevel(reviewData.rating),
        files: reviewData.files || []
    };
    
    window.reviewsData.unshift(newReview); // Add to beginning of array
    return newReview;
}

/**
 * Update an existing review
 * @param {number} reviewId - Review ID to update
 * @param {Object} updateData - Data to update
 * @returns {boolean} Success status
 */
function updateReview(reviewId, updateData) {
    const reviewIndex = window.reviewsData.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return false;
    
    window.reviewsData[reviewIndex] = {
        ...window.reviewsData[reviewIndex],
        ...updateData,
        positivityLevel: updateData.rating ? 
            utils.calculatePositivityLevel(updateData.rating) : 
            window.reviewsData[reviewIndex].positivityLevel
    };
    
    return true;
}

/**
 * Delete a review
 * @param {number} reviewId - Review ID to delete
 * @returns {boolean} Success status
 */
function deleteReview(reviewId) {
    const initialLength = window.reviewsData.length;
    window.reviewsData = window.reviewsData.filter(r => r.id !== reviewId);
    return window.reviewsData.length < initialLength;
}

/**
 * Calculate review metrics
 * @returns {Object} Metrics object with averages and counts
 */
function calculateMetrics() {
    const reviews = getAllReviews();
    if (reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            positivePercentage: 0
        };
    }
    
    const avgRating = (reviews.reduce((sum, review) => sum + review.ratingStar, 0) / reviews.length).toFixed(1);
    const positiveReviews = reviews.filter(review => review.ratingStar >= 4).length;
    const positivePercentage = Math.round((positiveReviews / reviews.length) * 100);
    
    return {
        averageRating: avgRating,
        totalReviews: reviews.length,
        positivePercentage: positivePercentage
    };
}

/**
 * Filter reviews by search term
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered reviews array
 */
function filterReviewsByText(searchTerm) {
    if (!searchTerm) return getAllReviews();
    
    return getAllReviews().filter(review => 
        review.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * Get current editing ID
 * @returns {number|null} Current editing ID
 */
function getCurrentEditingId() {
    return currentEditingId;
}

/**
 * Set current editing ID
 * @param {number|null} id - ID to set as current editing
 */
function setCurrentEditingId(id) {
    currentEditingId = id;
}

/**
 * Clear current editing state
 */
function clearCurrentEditingId() {
    currentEditingId = null;
}

// Export the data management module
window.dataManager = {
    getAllReviews,
    getReviewById,
    addReview,
    updateReview,
    deleteReview,
    calculateMetrics,
    filterReviewsByText,
    getCurrentEditingId,
    setCurrentEditingId,
    clearCurrentEditingId
};
