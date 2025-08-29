/**
 * Main Application File
 * Initializes all modules and sets up the reviews table application
 */

/**
 * Initialize the reviews table module
 */
function initializeReviewsTable() {
    console.log('Initializing Reviews Table Module...');
    
    // Check if all required modules are loaded
    if (!window.tableRenderer || !window.tooltipsModule) {
        console.warn('Required modules not yet loaded, retrying...');
        setTimeout(initializeReviewsTable, 100);
        return;
    }
    
    // Populate the table with initial data
    tableRenderer.populateReviewsTable();
    
    // Initialize tooltips
    tooltipsModule.initializeTooltips();
    
    console.log('Reviews Table Module initialized successfully!');
}

/**
 * Initialize the application when DOM is ready
 */
function initializeApp() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a bit for all modules to load
            setTimeout(initializeReviewsTable, 50);
        });
    } else {
        // DOM is already loaded, wait for modules
        setTimeout(initializeReviewsTable, 50);
    }
}

/**
 * Set up global module exports for backward compatibility
 */
function setupGlobalExports() {
    // Wait for reviewActions to be available
    if (!window.reviewActions) {
        setTimeout(setupGlobalExports, 50);
        return;
    }
    
    // Export main module functions globally
    window.reviewsTableModule = {
        initialize: initializeReviewsTable,
        addReview: reviewActions.addNewReview,
        editReview: reviewActions.editReview,
        deleteReview: reviewActions.deleteReview,
        filterReviews: reviewActions.filterReviews,
        data: window.reviewsData
    };
    
    // Export individual functions for HTML onclick handlers
    window.initializeReviewsTable = initializeReviewsTable;
    if (window.reviewActions && window.reviewActions.filterReviews) {
        window.filterReviews = reviewActions.filterReviews;
    }
    
    console.log('Global exports configured successfully!');
}

/**
 * Wait for all modules to load before initializing
 */
function waitForModules() {
    const requiredModules = [
        'reviewsData', 
        'utils', 
        'dataManager', 
        'formManager', 
        'tableRenderer', 
        'reviewActions', 
        'tooltipsModule'
    ];
    
    const allLoaded = requiredModules.every(module => window[module]);
    
    if (allLoaded) {
        setupGlobalExports();
        initializeApp();
    } else {
        setTimeout(waitForModules, 50);
    }
}

// Use a more robust initialization approach
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(waitForModules, 100);
    });
} else {
    setTimeout(waitForModules, 100);
}
