// HTML Template utilities for Load More functionality
// This file contains functions to generate HTML for different item types

const TemplateUtils = {
    /**
     * Create star rating HTML
     * @param {number} rating - Rating value (1-5)
     * @returns {string} HTML string for star rating
     */
    createStarRating(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= rating ? 'active' : '';
            starsHtml += `<span class="star ${activeClass}">★</span>`;
        }
        return starsHtml;
    },

    /**
     * Create review item HTML
     * @param {Object} item - Review item data
     * @returns {string} HTML string for review item
     */
    createReviewItem(item) {
        return `
            <div class="review-item">
                <div class="review-author">${item.author}</div>
                <div class="review-rating-small">
                    ${this.createStarRating(item.rating)}
                </div>
                <div class="review-preview">${item.preview}</div>
                <div class="review-date">${item.date}</div>
            </div>
        `;
    },

    /**
     * Create active issue item HTML
     * @param {Object} item - Active issue item data
     * @returns {string} HTML string for active issue item
     */
    createActiveIssueItem(item) {
        const metaContent = item.progress ? 
            `<span class="status-progress">${item.progress}</span>` :
            `<span class="status-priority ${item.priorityClass}">${item.priority}</span>`;

        return `
            <div class="status-item">
                <div class="status-title">${item.title}</div>
                <div class="status-desc">${item.description}</div>
                <span class="status-badge badge-${item.badge.toLowerCase().replace(/\s+/g, '-')}">
                    <i class="${item.badgeIcon}"></i>
                    ${item.badge}
                </span>
                <div class="status-meta">
                    <span class="status-date">Submitted: ${item.date}</span>
                    ${metaContent}
                </div>
            </div>
        `;
    },

    /**
     * Create resolved/implemented item HTML
     * @param {Object} item - Resolved item data
     * @returns {string} HTML string for resolved item
     */
    createResolvedItem(item) {
        const metaContent = item.users ? 
            `<span class="status-users">${item.users}</span>` :
            `<span class="status-satisfaction">${item.satisfaction}</span>`;

        return `
            <div class="status-item">
                <div class="status-title">${item.title}</div>
                <div class="status-desc">${item.description}</div>
                <span class="status-badge badge-${item.badge.toLowerCase().replace(/[\s&]+/g, '-')}">
                    <i class="${item.badgeIcon}"></i>
                    ${item.badge}
                </span>
                <div class="status-meta">
                    <span class="status-date">Deployed: ${item.date}</span>
                    ${metaContent}
                </div>
            </div>
        `;
    },

    /**
     * Create "no more items" message element
     * @returns {HTMLElement} No more items message element
     */
    createNoMoreItemsMessage() {
        const noMoreMessage = document.createElement('div');
        noMoreMessage.className = 'no-more-items';
        noMoreMessage.style.cssText = 'text-align: center; color: #6b7280; font-size: 0.8rem; padding: 8px; font-style: italic;';
        noMoreMessage.textContent = 'All items loaded';
        return noMoreMessage;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateUtils;
} else if (typeof window !== 'undefined') {
    window.TemplateUtils = TemplateUtils;
}
