// Animation utilities for Load More functionality
// This file contains functions to handle animations and visual effects

const AnimationUtils = {
    /**
     * Apply fade-in animation to newly added items
     * @param {NodeList} elements - Elements to animate
     * @param {number} staggerDelay - Delay between each item animation
     */
    applyFadeInAnimation(elements, staggerDelay = 100) {
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `all ${LoadMoreConfig.animation.fadeInDuration} ease`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * staggerDelay);
        });
    },

    /**
     * Set loading state for a button
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     */
    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add(LoadMoreConfig.classes.loading);
            button.disabled = true;
        } else {
            button.classList.remove(LoadMoreConfig.classes.loading);
            button.disabled = false;
        }
    },

    /**
     * Hide button and show "no more items" message
     * @param {HTMLElement} button - Button element to hide
     */
    hideButtonWithMessage(button) {
        button.style.display = 'none';
        
        const noMoreMessage = TemplateUtils.createNoMoreItemsMessage();
        button.parentNode.appendChild(noMoreMessage);
    },

    /**
     * Show button and remove "no more items" messages
     * @param {HTMLElement} button - Button element to show
     */
    showButtonAndRemoveMessages(button) {
        button.style.display = 'inline-flex';
        button.disabled = false;
        button.classList.remove(LoadMoreConfig.classes.loading);
        
        // Remove any existing "no more items" messages
        const noMoreMessages = document.querySelectorAll(`.${LoadMoreConfig.classes.noMoreItems}`);
        noMoreMessages.forEach(msg => msg.remove());
    },

    /**
     * Get newly added items for animation
     * @param {HTMLElement} container - Container element
     * @param {number} itemCount - Number of new items added
     * @returns {NodeList} New item elements
     */
    getNewItemsForAnimation(container, itemCount) {
        const selector = `.review-item:nth-last-child(-n+${itemCount + 1}):not(:last-child), .status-item:nth-last-child(-n+${itemCount + 1}):not(:last-child)`;
        return container.querySelectorAll(selector);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationUtils;
} else if (typeof window !== 'undefined') {
    window.AnimationUtils = AnimationUtils;
}
