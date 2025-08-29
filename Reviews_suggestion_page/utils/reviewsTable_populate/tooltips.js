/**
 * Review Tooltip Module
 * Handles tooltip for review descriptions
 */
window.reviewTooltip = (function () {
    'use strict';

    let tooltip = null;

    // Create tooltip element if not exists
    function createTooltip() {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.9);
                color: black;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                max-width: 300px;
                word-wrap: break-word;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                line-height: 1.4;
            `;
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }

    // Show tooltip near element
    function showTooltip(element, text) {
        const tooltipEl = createTooltip();
        tooltipEl.textContent = text;

        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        tooltipEl.style.left = (rect.left + scrollLeft) + 'px';
        tooltipEl.style.top = (rect.top + scrollTop - tooltipEl.offsetHeight - 10) + 'px';
        tooltipEl.style.opacity = 1;
    }

    // Hide tooltip
    function hideTooltip() {
        if (tooltip) tooltip.style.opacity = 0;
    }

    // Initialize tooltip for review descriptions
    function initializeTooltipsForReviews() {
        document.addEventListener('mouseover', function (event) {
            const target = event.target.closest('.review-description');
            if (!target) return;

            const fullText = target.getAttribute('data-full-text') || '';
            const currentText = target.textContent.trim();

            // Show only if text exceeds 25 characters (or is truncated)
            if (fullText.length > 25 && fullText !== currentText) {
                showTooltip(target, fullText);
            }
        });

        document.addEventListener('mouseout', function (event) {
            const target = event.target.closest('.review-description');
            if (target) hideTooltip();
        });
    }

    return {
        initializeTooltipsForReviews,
        showTooltip,
        hideTooltip
    };
})();



// /**
//  * Populate the reviews table with current data
//  */
// function populateReviewsTable() {
//     const tableBody = document.querySelector('.reviews-table tbody');
//     if (!tableBody) return;

//     tableBody.innerHTML = '';

//     const reviews = dataManager.getAllReviews();
//     reviews.forEach(review => {
//         const row = createTableRow(review);
//         tableBody.appendChild(row);
//     });

//     updateReviewMetrics();
// }

// /**
//  * Update review metrics
//  */
// function updateReviewMetrics() {
//     const metrics = dataManager.calculateMetrics();
//     const metricCards = document.querySelectorAll('.metric-card');

//     if (metricCards.length >= 3) {
//         const avgElement = metricCards[0].querySelector('.metric-value');
//         const totalElement = metricCards[1].querySelector('.metric-value');
//         const positiveElement = metricCards[2].querySelector('.metric-value');

//         if (avgElement) avgElement.textContent = metrics.averageRating;
//         if (totalElement) totalElement.textContent = metrics.totalReviews;
//         if (positiveElement) positiveElement.textContent = metrics.positivePercentage + '%';
//     }
// }

// /**
//  * Filter table rows based on search term
//  */
// function filterTableRows(searchTerm) {
//     const rows = document.querySelectorAll('.reviews-table tbody tr');
//     rows.forEach(row => {
//         const description = row.querySelector('.review-description').textContent.toLowerCase();
//         const meta = row.querySelector('.review-meta').textContent.toLowerCase();

//         row.style.display = (description.includes(searchTerm.toLowerCase()) || meta.includes(searchTerm.toLowerCase()))
//             ? ''
//             : 'none';
//     });
// }

// /**
//  * Remove a table row with animation
//  */
// function removeTableRowWithAnimation(reviewId) {
//     const row = document.querySelector(`tr[data-review-id="${reviewId}"]`);
//     if (row) {
//         row.style.transition = 'all 0.3s ease';
//         row.style.transform = 'translateX(-100%)';
//         row.style.opacity = '0';

//         setTimeout(() => populateReviewsTable(), 300);
//     }
// }

// /**
//  * Highlight a table row temporarily
//  */
// function highlightTableRow(reviewId) {
//     const row = document.querySelector(`tr[data-review-id="${reviewId}"]`);
//     if (row) {
//         row.classList.add('highlighted');
//         setTimeout(() => row.classList.remove('highlighted'), 2000);
//     }
// }

// // Export table renderer
// window.tableRenderer = {
//     createTableRow,
//     populateReviewsTable,
//     updateReviewMetrics,
//     filterTableRows,
//     removeTableRowWithAnimation,
//     highlightTableRow
// };
