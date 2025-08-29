/**
 * Data Management Module
 * Handles data loading, transformation, and basic CRUD operations for suggestions
 */

window.suggestionsData = (function() {
    'use strict';

    let suggestions = [];
    let filteredSuggestions = [];

    // Function to transform suggestion sample data to table format
    function transformSuggestionData(suggestionData) {
        const { categoryDisplayMap, statusDisplayMap } = window.suggestionsConfig;

        return suggestionData.map((item, index) => ({
            id: item.suggestionId || item.id || index + 1, // Ensure we always have an ID
            category: categoryDisplayMap[item.suggestionCategory] || item.suggestionCategory,
            description: item.suggestionDescription,
            status: statusDisplayMap[item.suggestionStatus] || item.suggestionStatus,
            date: new Date(item.createdAt).toISOString().split('T')[0],
            files: item.files || [],
            originalData: item // Keep reference to original data
        }));
    }

    // Load suggestion data from external file
    function loadSuggestionData() {
        // Check if suggestion sample data is available
        if (typeof suggestionSampleData !== 'undefined') {
            return transformSuggestionData(suggestionSampleData);
        }
        
        // Return empty array if external data not available
        console.warn('suggestionSampleData not found. Make sure suggestion_sample_data.js is loaded.');
        return [];
    }

    // Initialize suggestions with sample data
    function init() {
        suggestions = loadSuggestionData();
        filteredSuggestions = [...suggestions];
        console.log('Suggestions Data Module initialized with', suggestions.length, 'suggestions');
        console.log('Sample data loaded:', suggestions);
    }

    // Add new suggestion
    function addSuggestion(suggestionData) {
        const newSuggestion = {
            id: Date.now(),
            category: suggestionData.category,
            description: suggestionData.description,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            files: suggestionData.files || []
        };

        suggestions.unshift(newSuggestion);
        filteredSuggestions = [...suggestions];
        
        // Show success notification
        if (window.notificationModule) {
            window.notificationModule.showNotification('Suggestion submitted successfully!', 'success');
        }
        
        return newSuggestion;
    }

    // Update suggestion
    function updateSuggestion(id, updatedData) {
        const suggestionIndex = suggestions.findIndex(s => s.id == id);
        if (suggestionIndex !== -1) {
            suggestions[suggestionIndex] = { ...suggestions[suggestionIndex], ...updatedData };
            filteredSuggestions = [...suggestions];
            return suggestions[suggestionIndex];
        }
        return null;
    }

    // Delete suggestion
    function deleteSuggestion(id) {
        suggestions = suggestions.filter(s => s.id != id);
        filteredSuggestions = [...suggestions];
    }

    // Find suggestion by ID
    function findSuggestion(id) {
        return suggestions.find(s => s.id == id);
    }

    // Get all suggestions
    function getAllSuggestions() {
        return [...suggestions];
    }

    // Get filtered suggestions
    function getFilteredSuggestions() {
        return [...filteredSuggestions];
    }

    // Get suggestions by status
    function getSuggestionsByStatus(status) {
        return suggestions.filter(s => s.status === status);
    }

    // Set filtered suggestions
    function setFilteredSuggestions(filtered) {
        filteredSuggestions = filtered;
    }

    // Public API
    return {
        init,
        addSuggestion,
        updateSuggestion,
        deleteSuggestion,
        findSuggestion,
        getAllSuggestions,
        getFilteredSuggestions,
        getSuggestionsByStatus,
        setFilteredSuggestions
    };
})();
