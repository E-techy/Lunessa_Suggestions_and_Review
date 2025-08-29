// /**
//  * Filter Module
//  * Handles filtering functionality for suggestions table
//  */

// window.suggestionsFilter = (function() {
//     'use strict';

//     // Apply all filters (category, status, and description search)
//     function applyFilters() {
//         const categoryFilter = document.getElementById('categoryFilter')?.value || '';
//         const statusFilter = document.getElementById('statusFilter')?.value || '';
//         const descriptionSearch = document.getElementById('descriptionSearch')?.value || '';
        
//         const allSuggestions = window.suggestionsData.getAllSuggestions();
        
//         const filtered = allSuggestions.filter(suggestion => {
//             // Category filter
//             const categoryMatch = !categoryFilter || suggestion.category === categoryFilter;
            
//             // Status filter
//             const statusMatch = !statusFilter || suggestion.status === statusFilter;
            
//             // Description search (only searches in description field)
//             const descriptionMatch = !descriptionSearch.trim() || 
//                 suggestion.description.toLowerCase().includes(descriptionSearch.toLowerCase().trim());
            
//             return categoryMatch && statusMatch && descriptionMatch;
//         });
        
//         window.suggestionsData.setFilteredSuggestions(filtered);
        
//         // Notify that filters have been applied
//         if (window.suggestionsRenderer) {
//             window.suggestionsRenderer.renderTable();
//         }
//     }
    
//     // Clear all filters
//     function clearFilters() {
//         const categoryFilter = document.getElementById('categoryFilter');
//         const statusFilter = document.getElementById('statusFilter');
//         const descriptionSearch = document.getElementById('descriptionSearch');
        
//         if (categoryFilter) categoryFilter.value = '';
//         if (statusFilter) statusFilter.value = '';
//         if (descriptionSearch) descriptionSearch.value = '';
        
//         const allSuggestions = window.suggestionsData.getAllSuggestions();
//         window.suggestionsData.setFilteredSuggestions([...allSuggestions]);
        
//         if (window.suggestionsRenderer) {
//             window.suggestionsRenderer.renderTable();
//         }
//     }
    
//     // Legacy filter function for backward compatibility
//     function filterSuggestions(searchTerm) {
//         // This function is kept for backward compatibility but now only searches descriptions
//         const descriptionSearch = document.getElementById('descriptionSearch');
//         if (descriptionSearch) {
//             descriptionSearch.value = searchTerm;
//         }
//         applyFilters();
//     }

//     // Update filter results counter
//     function updateFilterResults() {
//         // Remove existing filter results element
//         const existingResults = document.querySelector('.filter-results');
//         if (existingResults) {
//             existingResults.remove();
//         }
        
//         const allSuggestions = window.suggestionsData.getAllSuggestions();
//         const filteredSuggestions = window.suggestionsData.getFilteredSuggestions();
        
//         // Only show results count if there are filters applied or we have suggestions
//         const categoryFilter = document.getElementById('categoryFilter')?.value;
//         const statusFilter = document.getElementById('statusFilter')?.value;
//         const descriptionSearch = document.getElementById('descriptionSearch')?.value;
        
//         const hasFilters = categoryFilter || statusFilter || (descriptionSearch && descriptionSearch.trim());
        
//         if (allSuggestions.length > 0 && (hasFilters || filteredSuggestions.length !== allSuggestions.length)) {
//             const filtersPanel = document.querySelector('.filters-panel');
//             if (filtersPanel) {
//                 const resultsDiv = document.createElement('div');
//                 resultsDiv.className = 'filter-results';
                
//                 if (filteredSuggestions.length === 0) {
//                     resultsDiv.textContent = `No suggestions match your current filters. Showing 0 of ${allSuggestions.length} suggestions.`;
//                 } else if (filteredSuggestions.length === allSuggestions.length) {
//                     resultsDiv.textContent = `Showing all ${allSuggestions.length} suggestions.`;
//                 } else {
//                     resultsDiv.textContent = `Showing ${filteredSuggestions.length} of ${allSuggestions.length} suggestions.`;
//                 }
                
//                 filtersPanel.appendChild(resultsDiv);
//             }
//         }
//     }

//     // Public API
//     return {
//         applyFilters,
//         clearFilters,
//         filterSuggestions,
//         updateFilterResults
//     };
// })();
