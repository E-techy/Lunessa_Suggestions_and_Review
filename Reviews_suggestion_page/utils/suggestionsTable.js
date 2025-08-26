/**
 * Suggestions Table Module
 * Handles the display and management of submitted suggestions and issues
 */

window.suggestionsTableModule = (function() {
    'use strict';

    let suggestions = [];
    let filteredSuggestions = [];
    let currentlyEditing = null;

    // Sample data for demonstration
    const sampleSuggestions = [
        {
            id: 1,
            category: 'Performance',
            description: 'Improve response time for complex API queries. Currently experiencing delays of 3-5 seconds for nested data requests.',
            status: 'progress',
            date: '2024-01-20',
            files: []
        },
        {
            id: 2,
            category: 'Feature Request',
            description: 'Add dark mode support for the user interface to reduce eye strain during extended usage periods.',
            status: 'pending',
            date: '2024-01-18',
            files: []
        },
        {
            id: 3,
            category: 'UI/UX',
            description: 'The mobile navigation menu is difficult to use on smaller screens. Consider implementing a hamburger menu.',
            status: 'resolved',
            date: '2024-01-15',
            files: []
        },
        {
            id: 4,
            category: 'Security',
            description: 'Implement two-factor authentication for enhanced account security, especially for enterprise users.',
            status: 'progress',
            date: '2024-01-12',
            files: []
        },
        {
            id: 5,
            category: 'Critical Bug',
            description: 'Data export functionality fails when selecting large datasets (>10,000 records). Browser crashes occur.',
            status: 'pending',
            date: '2024-01-10',
            files: []
        }
    ];

    // Initialize suggestions with sample data
    function init() {
        suggestions = [...sampleSuggestions];
        filteredSuggestions = [...suggestions];
        renderTable();
        console.log('Suggestions Table Module initialized');
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
        renderTable();
        
        // Show success notification
        if (window.notificationModule) {
            window.notificationModule.showNotification('Suggestion submitted successfully!', 'success');
        }
        
        return newSuggestion;
    }

    // Edit suggestion
    function editSuggestion(id) {
        const suggestion = suggestions.find(s => s.id === id);
        if (!suggestion) return;

        currentlyEditing = id;
        
        // Get form elements
        const categorySelect = document.querySelector('#suggestions select');
        const descriptionTextarea = document.querySelector('#suggestions textarea');
        
        if (categorySelect && descriptionTextarea) {
            // Map category display names back to form values
            const categoryMap = {
                'Critical Bug': 'critical-bug',
                'UI/UX': 'ui-ux',
                'Performance': 'performance',
                'API Integration': 'api-integration',
                'Security': 'security',
                'Feature Request': 'feature-request',
                'Documentation': 'documentation',
                'Accessibility': 'accessibility'
            };
            
            categorySelect.value = categoryMap[suggestion.category] || '';
            descriptionTextarea.value = suggestion.description;
            
            // Change form to editing mode
            const form = document.querySelector('#suggestions form');
            form.classList.add('editing-mode');
            
            // Show update and cancel buttons, hide submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.style.display = 'none';
                
                // Create or show update button
                let updateBtn = form.querySelector('#updateSuggestionBtn');
                if (!updateBtn) {
                    updateBtn = document.createElement('button');
                    updateBtn.id = 'updateSuggestionBtn';
                    updateBtn.type = 'button';
                    updateBtn.className = 'btn btn-warning';
                    updateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Update Suggestion';
                    updateBtn.onclick = updateSuggestion;
                    submitBtn.parentNode.appendChild(updateBtn);
                }
                updateBtn.style.display = 'inline-block';
                
                // Create or show cancel button
                let cancelBtn = form.querySelector('#cancelEditSuggestionBtn');
                if (!cancelBtn) {
                    cancelBtn = document.createElement('button');
                    cancelBtn.id = 'cancelEditSuggestionBtn';
                    cancelBtn.type = 'button';
                    cancelBtn.className = 'btn btn-secondary';
                    cancelBtn.style.marginLeft = '12px';
                    cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
                    cancelBtn.onclick = cancelEditSuggestion;
                    submitBtn.parentNode.appendChild(cancelBtn);
                }
                cancelBtn.style.display = 'inline-block';
            }
            
            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Update suggestion
    function updateSuggestion() {
        if (!currentlyEditing) return;

        const categorySelect = document.querySelector('#suggestions select');
        const descriptionTextarea = document.querySelector('#suggestions textarea');
        
        if (!categorySelect.value || !descriptionTextarea.value.trim()) {
            if (window.notificationModule) {
                window.notificationModule.showNotification('Please fill in all required fields', 'error');
            }
            return;
        }

        // Update the suggestion
        const suggestionIndex = suggestions.findIndex(s => s.id === currentlyEditing);
        if (suggestionIndex !== -1) {
            // Map form values to display names
            const categoryDisplayMap = {
                'critical-bug': 'Critical Bug',
                'ui-ux': 'UI/UX',
                'performance': 'Performance',
                'api-integration': 'API Integration',
                'security': 'Security',
                'feature-request': 'Feature Request',
                'documentation': 'Documentation',
                'accessibility': 'Accessibility'
            };
            
            suggestions[suggestionIndex].category = categoryDisplayMap[categorySelect.value] || categorySelect.value;
            suggestions[suggestionIndex].description = descriptionTextarea.value.trim();
            
            filteredSuggestions = [...suggestions];
            renderTable();
            cancelEditSuggestion();
            
            if (window.notificationModule) {
                window.notificationModule.showNotification('Suggestion updated successfully!', 'success');
            }
        }
    }

    // Cancel editing
    function cancelEditSuggestion() {
        currentlyEditing = null;
        
        const form = document.querySelector('#suggestions form');
        if (form) {
            form.classList.remove('editing-mode');
            form.reset();
            
            // Reset button visibility
            const submitBtn = form.querySelector('button[type="submit"]');
            const updateBtn = form.querySelector('#updateSuggestionBtn');
            const cancelBtn = form.querySelector('#cancelEditSuggestionBtn');
            
            if (submitBtn) submitBtn.style.display = 'inline-block';
            if (updateBtn) updateBtn.style.display = 'none';
            if (cancelBtn) cancelBtn.style.display = 'none';
        }
    }

    // Delete suggestion
    function deleteSuggestion(id) {
        if (confirm('Are you sure you want to delete this suggestion? This action cannot be undone.')) {
            suggestions = suggestions.filter(s => s.id !== id);
            filteredSuggestions = [...suggestions];
            renderTable();
            
            if (window.notificationModule) {
                window.notificationModule.showNotification('Suggestion deleted successfully', 'success');
            }
        }
    }

    // Apply all filters (category, status, and description search)
    function applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const descriptionSearch = document.getElementById('descriptionSearch')?.value || '';
        
        filteredSuggestions = suggestions.filter(suggestion => {
            // Category filter
            const categoryMatch = !categoryFilter || suggestion.category === categoryFilter;
            
            // Status filter
            const statusMatch = !statusFilter || suggestion.status === statusFilter;
            
            // Description search (only searches in description field)
            const descriptionMatch = !descriptionSearch.trim() || 
                suggestion.description.toLowerCase().includes(descriptionSearch.toLowerCase().trim());
            
            return categoryMatch && statusMatch && descriptionMatch;
        });
        
        renderTable();
    }
    
    // Clear all filters
    function clearFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const descriptionSearch = document.getElementById('descriptionSearch');
        
        if (categoryFilter) categoryFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        if (descriptionSearch) descriptionSearch.value = '';
        
        filteredSuggestions = [...suggestions];
        renderTable();
    }
    
    // Legacy filter function for backward compatibility
    function filterSuggestions(searchTerm) {
        // This function is kept for backward compatibility but now only searches descriptions
        const descriptionSearch = document.getElementById('descriptionSearch');
        if (descriptionSearch) {
            descriptionSearch.value = searchTerm;
        }
        applyFilters();
    }

    // Get status display info
    function getStatusInfo(status) {
        const statusMap = {
            'pending': { class: 'status-pending', text: 'Pending', icon: 'fas fa-clock' },
            'progress': { class: 'status-progress', text: 'In Progress', icon: 'fas fa-cog fa-spin' },
            'resolved': { class: 'status-resolved', text: 'Resolved', icon: 'fas fa-check' },
            'rejected': { class: 'status-rejected', text: 'Rejected', icon: 'fas fa-times' }
        };
        return statusMap[status] || statusMap['pending'];
    }

    // Update filter results counter
    function updateFilterResults() {
        // Remove existing filter results element
        const existingResults = document.querySelector('.filter-results');
        if (existingResults) {
            existingResults.remove();
        }
        
        // Only show results count if there are filters applied or we have suggestions
        const categoryFilter = document.getElementById('categoryFilter')?.value;
        const statusFilter = document.getElementById('statusFilter')?.value;
        const descriptionSearch = document.getElementById('descriptionSearch')?.value;
        
        const hasFilters = categoryFilter || statusFilter || (descriptionSearch && descriptionSearch.trim());
        
        if (suggestions.length > 0 && (hasFilters || filteredSuggestions.length !== suggestions.length)) {
            const filtersPanel = document.querySelector('.filters-panel');
            if (filtersPanel) {
                const resultsDiv = document.createElement('div');
                resultsDiv.className = 'filter-results';
                
                if (filteredSuggestions.length === 0) {
                    resultsDiv.textContent = `No suggestions match your current filters. Showing 0 of ${suggestions.length} suggestions.`;
                } else if (filteredSuggestions.length === suggestions.length) {
                    resultsDiv.textContent = `Showing all ${suggestions.length} suggestions.`;
                } else {
                    resultsDiv.textContent = `Showing ${filteredSuggestions.length} of ${suggestions.length} suggestions.`;
                }
                
                filtersPanel.appendChild(resultsDiv);
            }
        }
    }

    // Render table
    function renderTable() {
        const tableBody = document.querySelector('.suggestions-table tbody');
        const table = document.querySelector('.suggestions-table');
        if (!tableBody) return;

        // Handle empty states
        if (filteredSuggestions.length === 0) {
            tableBody.innerHTML = '';
            // Add appropriate class based on whether we have any suggestions at all
            if (suggestions.length === 0) {
                table?.classList.add('no-data');
            } else {
                table?.classList.remove('no-data');
            }
            updateFilterResults();
            return;
        }

        // Remove no-data class when we have results
        table?.classList.remove('no-data');

        tableBody.innerHTML = filteredSuggestions.map(suggestion => {
            const statusInfo = getStatusInfo(suggestion.status);
            const formattedDate = new Date(suggestion.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
                <tr>
                    <td>
                        <span class="suggestion-category">${suggestion.category}</span>
                    </td>
                    <td>
                        <div class="suggestion-description" title="${suggestion.description}">
                            ${suggestion.description}
                        </div>
                    </td>
                    <td>
                        <span class="suggestion-status ${statusInfo.class}">
                            <i class="${statusInfo.icon}"></i>
                            ${statusInfo.text}
                        </span>
                    </td>
                    <td>
                        <span class="suggestion-date">${formattedDate}</span>
                    </td>
                    <td>
                        <button class="btn btn-small btn-secondary" onclick="window.suggestionsTableModule.editSuggestion(${suggestion.id})" title="Edit Suggestion">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="window.suggestionsTableModule.deleteSuggestion(${suggestion.id})" title="Delete Suggestion">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        updateFilterResults();
    }

    // Get all suggestions
    function getAllSuggestions() {
        return [...suggestions];
    }

    // Get suggestions by status
    function getSuggestionsByStatus(status) {
        return suggestions.filter(s => s.status === status);
    }

    // Public API
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
    document.addEventListener('DOMContentLoaded', window.suggestionsTableModule.init);
} else {
    window.suggestionsTableModule.init();
}
