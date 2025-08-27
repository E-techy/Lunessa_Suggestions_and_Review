// Global functions and initialization for Load More functionality
// This file contains the global functions and initialization logic

// Global functions for onclick handlers (for backward compatibility)
function loadMoreTopRatedReviews() {
    LoadMoreModule.loadMoreTopRatedReviews();
}

function loadMoreRecentFeedback() {
    LoadMoreModule.loadMoreRecentFeedback();
}

function loadMoreActiveIssues() {
    LoadMoreModule.loadMoreActiveIssues();
}

function loadMoreResolvedImplemented() {
    LoadMoreModule.loadMoreResolvedImplemented();
}

// Tab switching integration
function integrateWithTabSwitching() {
    const originalSwitchSidebarTab = window.switchSidebarTab;
    
    if (originalSwitchSidebarTab) {
        window.switchSidebarTab = function(sectionId, tabType) {
            // Call original function
            originalSwitchSidebarTab(sectionId, tabType);
            
            // Reset the appropriate section
            const sectionKey = LoadMoreConfig.sectionMap[sectionId];
            if (sectionKey) {
                LoadMoreModule.resetSection(sectionKey);
            }
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Load More module initialized');
    
    // Initialize the main module
    LoadMoreModule.init();
    
    // Integrate with existing tab switching functionality
    integrateWithTabSwitching();
    
    // Add debug helpers to console
    if (typeof DebugUtils !== 'undefined') {
        console.log('🔧 Debug utilities available:');
        console.log('- DebugUtils.analyzeDOMStructure("topRatedReviews")');
        console.log('- DebugUtils.testIdPatterns("topRatedReviews")');
        console.log('- DebugUtils.getHTMLStructure()');
        
        // Auto-analyze if in debug mode
        if (window.location.href.includes('debug') || localStorage.getItem('loadMoreDebug')) {
            setTimeout(() => {
                DebugUtils.analyzeDOMStructure('topRatedReviews');
            }, 1000);
        }
    }
});

// Make global functions available
if (typeof window !== 'undefined') {
    window.loadMoreTopRatedReviews = loadMoreTopRatedReviews;
    window.loadMoreRecentFeedback = loadMoreRecentFeedback;
    window.loadMoreActiveIssues = loadMoreActiveIssues;
    window.loadMoreResolvedImplemented = loadMoreResolvedImplemented;
    
    // Debug helper functions
    window.debugLoadMore = function(sectionKey = 'topRatedReviews') {
        if (typeof DebugUtils !== 'undefined') {
            DebugUtils.analyzeDOMStructure(sectionKey);
            DebugUtils.testIdPatterns(sectionKey);
            DebugUtils.testLoadMoreInsertion(sectionKey);
        }
    };
    
    window.enableLoadMoreDebug = function() {
        localStorage.setItem('loadMoreDebug', 'true');
        console.log('Load More debug mode enabled. Refresh to see analysis.');
    };
}
