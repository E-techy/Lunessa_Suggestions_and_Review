/**
 * Tooltip Module
 * Handles tooltip functionality for suggestions descriptions
 */
window.suggestionsTooltip = (function () {
    'use strict';

    let tooltip = null;

    // Create tooltip element if not exists
    function createTooltip() {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
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

        requestAnimationFrame(() => tooltipEl.classList.add('show'));
    }

    // Hide tooltip
    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }

    // Initialize tooltip listeners
    function initializeTooltipsForSuggestions() {
        // avoid conflict if another tooltip system exists
        if (typeof initializeTooltips === 'function') return;

        document.addEventListener('mouseover', function (event) {
            const target = event.target.closest('.suggestion-description');
            if (target) {
                const fullText = target.getAttribute('data-full-text') || target.title;
                const currentText = target.textContent.trim();

                // show only if truncated
                if (fullText && fullText !== currentText && fullText.length > currentText.length) {
                    showTooltip(target, fullText);
                }
            }
        });

        document.addEventListener('mouseout', function (event) {
            const target = event.target.closest('.suggestion-description');
            if (target) hideTooltip();
        });
    }

    return {
        initializeTooltipsForSuggestions,
        showTooltip,
        hideTooltip
    };
})();
