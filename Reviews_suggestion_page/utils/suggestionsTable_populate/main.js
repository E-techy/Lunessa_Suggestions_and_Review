/**
 * Main Suggestions Table Module
 * Coordinates all suggestion-related functionality and provides the main API
 */

window.suggestionsTableModule = (function() {
    'use strict';

    // Initialize all modules
    function init() {
        // Initialize data first
        window.suggestionsData.init();
        
        // Initialize tooltip functionality
        window.suggestionsTooltip.initializeTooltipsForSuggestions();
        
        // Render initial table
        window.suggestionsRenderer.renderTable();
        
        console.log('Suggestions Table Module initialized');
    }

    // Add new suggestion (delegates to data manager and re-renders)
    function addSuggestion(suggestionData) {
        const newSuggestion = window.suggestionsData.addSuggestion(suggestionData);
        window.suggestionsRenderer.renderTable();
        return newSuggestion;
    }

    // Delete suggestion with confirmation
    function deleteSuggestion(id) {
        if (confirm('Are you sure you want to delete this suggestion? This action cannot be undone.')) {
            window.suggestionsData.deleteSuggestion(id);
            window.suggestionsRenderer.renderTable();
            
            if (window.notificationModule) {
                window.notificationModule.showNotification('Suggestion deleted successfully', 'success');
            }
        }
    }

    // Legacy methods for backward compatibility - delegate to appropriate modules
    function editSuggestion(id) {
        return window.suggestionsEditManager.editSuggestion(id);
    }

    function updateSuggestion() {
        return window.suggestionsEditManager.updateSuggestion();
    }

    function cancelEditSuggestion() {
        return window.suggestionsEditManager.cancelEditSuggestion();
    }

    function filterSuggestions(searchTerm) {
        return window.suggestionsFilter.filterSuggestions(searchTerm);
    }

    function applyFilters() {
        return window.suggestionsFilter.applyFilters();
    }

    function clearFilters() {
        return window.suggestionsFilter.clearFilters();
    }

    function getAllSuggestions() {
        return window.suggestionsData.getAllSuggestions();
    }

    function getSuggestionsByStatus(status) {
        return window.suggestionsData.getSuggestionsByStatus(status);
    }

    // Public API - maintains backward compatibility
    return {
        init,
        addSuggestion,
        editSuggestion,
        updateSuggestion,
        deleteSuggestion,
        filterSuggestions,
        applyFilters,
        clearFilters,
        getAllSuggestions,
        getSuggestionsByStatus,
        cancelEditSuggestion
    };
})();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.suggestionsTableModule.init();
    });
} else {
    window.suggestionsTableModule.init();
}
