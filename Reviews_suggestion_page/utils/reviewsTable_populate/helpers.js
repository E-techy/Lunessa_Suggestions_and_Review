/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Truncate text to specified length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Format date string to DD/MM/YYYY format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (1-5)
 * @returns {string} HTML string for star rating
 */
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? 'active' : ''}">★</span>`;
    }
    return stars;
}

/**
 * Calculate positivity level based on rating
 * @param {number} rating - Rating value (1-5)
 * @returns {number} Positivity level (0.0-1.0)
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
 * Generate unique ID based on timestamp
 * @returns {number} Unique timestamp ID
 */
function generateId() {
    return Date.now();
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date string
 */
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Export utilities to global scope
window.utils = {
    truncateText,
    formatDate,
    generateStarRating,
    calculatePositivityLevel,
    generateId,
    getCurrentDate
};
