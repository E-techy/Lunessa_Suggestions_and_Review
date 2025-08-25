/**
 * Main Initialization Module
 * Coordinates all other modules and initializes the application
 */

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeApplication();
});

function initializeApplication() {
    console.log('Initializing Lunessa Reviews & Feedback System...');
    
    // Initialize rating system
    if (window.ratingModule) {
        window.ratingModule.initializeRating();
    }
    
    // Initialize file upload handlers
    if (window.fileUploadModule) {
        window.fileUploadModule.initializeFileUpload();
    }
    
    // Initialize animations and UI effects
    if (window.animationModule) {
        window.animationModule.initializeAllAnimations();
    }
    
    console.log('Application initialized successfully!');
}

// Global utility functions
window.app = {
    version: '2.0.0',
    initialized: true,
    modules: {
        rating: 'ratingModule',
        fileUpload: 'fileUploadModule',
        notifications: 'notificationModule',
        animations: 'animationModule'
    }
};