/**
 * Tooltip Module
 * Handles tooltip functionality for suggestions descriptions
 */

window.suggestionsTooltip = (function() {
    'use strict';

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
    function showTooltip(element, text) {
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

    // Initialize tooltips for suggestion descriptions
    function initializeTooltipsForSuggestions() {
        // If the tooltip system from reviewsTable is available, use that instead
        if (typeof initializeTooltips === 'function') {
            return;
        }
        
        // Delegate event listeners for suggestion descriptions
        document.addEventListener('mouseover', function(event) {
            const target = event.target;
            if (target.matches('.suggestion-description')) {
                const fullText = target.getAttribute('data-full-text') || target.title;
                const currentText = target.textContent.trim();
                
                // Only show tooltip if text is truncated
                if (fullText && fullText !== currentText && fullText.length > currentText.length) {
                    showTooltip(target, fullText);
                }
            }
        });
        
        document.addEventListener('mouseout', function(event) {
            const target = event.target;
            if (target.matches('.suggestion-description')) {
                hideTooltip();
            }
        });
    }

    // Public API
    return {
        initializeTooltipsForSuggestions,
        showTooltip,
        hideTooltip
    };
})();
