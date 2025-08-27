/**
 * UI Tooltips Module
 * Handles tooltip functionality for review descriptions and other elements
 */

let tooltip = null;

/**
 * Create tooltip element if it doesn't exist
 * @returns {HTMLElement} Tooltip element
 */
function createTooltip() {
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
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

/**
 * Show tooltip with specified text at element position
 * @param {HTMLElement} element - Element to show tooltip for
 * @param {string} text - Text to display in tooltip
 * @param {Event} event - Mouse event for positioning
 */
function showTooltip(element, text, event) {
    const tooltipEl = createTooltip();
    tooltipEl.textContent = text;
    
    // Make tooltip visible to calculate dimensions
    tooltipEl.style.opacity = '0';
    tooltipEl.style.display = 'block';
    
    // Calculate position
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Position tooltip above the element
    let left = rect.left + scrollLeft;
    let top = rect.top + scrollTop - tooltipEl.offsetHeight - 10;
    
    // Adjust if tooltip would go off screen
    if (left + tooltipEl.offsetWidth > window.innerWidth) {
        left = window.innerWidth - tooltipEl.offsetWidth - 10;
    }
    if (left < 10) {
        left = 10;
    }
    if (top < 10) {
        top = rect.bottom + scrollTop + 10; // Show below instead
    }
    
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
    
    // Show tooltip with animation
    setTimeout(() => {
        tooltipEl.style.opacity = '1';
    }, 10);
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }, 300);
    }
}

/**
 * Initialize tooltip event listeners
 */
function initializeTooltips() {
    // Delegate event listeners for tooltips
    document.addEventListener('mouseover', function(event) {
        const target = event.target;
        if (target.matches('.review-description, .suggestion-description')) {
            const fullText = target.getAttribute('data-full-text') || target.title;
            const currentText = target.textContent.trim();
            
            // Only show tooltip if text is truncated
            if (fullText && fullText !== currentText && fullText.length > currentText.length) {
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
    
    // Hide tooltip when scrolling
    document.addEventListener('scroll', hideTooltip);
    
    // Hide tooltip when window is resized
    window.addEventListener('resize', hideTooltip);
}

/**
 * Add tooltip to a specific element
 * @param {HTMLElement} element - Element to add tooltip to
 * @param {string} text - Tooltip text
 */
function addTooltip(element, text) {
    element.addEventListener('mouseenter', (event) => {
        showTooltip(element, text, event);
    });
    
    element.addEventListener('mouseleave', () => {
        hideTooltip();
    });
}

/**
 * Remove all tooltips
 */
function removeAllTooltips() {
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
}

// Export the tooltips module
window.tooltipsModule = {
    initializeTooltips,
    showTooltip,
    hideTooltip,
    addTooltip,
    removeAllTooltips
};
