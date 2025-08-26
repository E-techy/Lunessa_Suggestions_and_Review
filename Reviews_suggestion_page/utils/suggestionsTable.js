/**
 * Suggestions Table Module
 * Handles the display and management of submitted suggestions and issues
 */

window.suggestionsTableModule = (function() {
    'use strict';

    let suggestions = [];
    let filteredSuggestions = [];
    let currentlyEditing = null;

    // Function to transform suggestion sample data to table format
    function transformSuggestionData(suggestionData) {
        // Map suggestion categories to display names
        const categoryMap = {
            'feature_request': 'Feature Request',
            'bug_report': 'Critical Bug',
            'ui_improvement': 'UI/UX',
            'performance': 'Performance',
            'security': 'Security',
            'accessibility': 'Accessibility',
            'infrastructure': 'Infrastructure'
        };

        // Map suggestion status to display status
        const statusMap = {
            'live': 'progress',
            'pending': 'pending',
            'completed': 'resolved'
        };

        return suggestionData.map((item, index) => ({
            id: item.suggestionId || item.id || index + 1, // Ensure we always have an ID
            category: categoryMap[item.suggestionCategory] || item.suggestionCategory,
            description: item.suggestionDescription,
            status: statusMap[item.suggestionStatus] || item.suggestionStatus,
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
        renderTable();
        console.log('Suggestions Table Module initialized with', suggestions.length, 'suggestions');
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
        renderTable();
        
        // Show success notification
        if (window.notificationModule) {
            window.notificationModule.showNotification('Suggestion submitted successfully!', 'success');
        }
        
        return newSuggestion;
    }

    // Edit suggestion
    function editSuggestion(id) {
        // Handle both string and numeric IDs
        const suggestion = suggestions.find(s => s.id == id);
        if (!suggestion) {
            console.error('Suggestion not found with ID:', id);
            return;
        }

        // Check if status is pending - only allow editing if status is pending
        if (suggestion.status !== 'pending') {
            if (window.notificationModule) {
                window.notificationModule.showNotification(
                    'Only suggestions with "Pending" status can be modified. Current status: ' + 
                    getStatusInfo(suggestion.status).text, 
                    'error'
                );
            } else {
                // Fallback notification if notification module is not available
                alert('Only suggestions with "Pending" status can be modified. Current status: ' + 
                      getStatusInfo(suggestion.status).text);
            }
            return;
        }

        currentlyEditing = id;
        
        // Get form elements - more specific selectors to find the right form in suggestions tab
        const suggestionsTab = document.querySelector('#suggestions');
        const categorySelect = suggestionsTab.querySelector('.form-select');
        const descriptionTextarea = suggestionsTab.querySelector('.form-textarea');
        
        if (categorySelect && descriptionTextarea) {
            // Map category display names back to form values - must match HTML form options
            const categoryMap = {
                'Feature Request': 'feature-request',
                'Critical Bug': 'critical-bug', 
                'UI/UX': 'ui-ux',
                'Performance': 'performance',
                'API Integration': 'api-integration',
                'Security': 'security',
                'Documentation': 'documentation',
                'Accessibility': 'accessibility',
                'Infrastructure': 'infrastructure'
            };
            
            // Debug logging to see what values we have
            console.log('Editing suggestion:', suggestion);
            console.log('Category to map:', suggestion.category);
            console.log('Mapped value:', categoryMap[suggestion.category]);
            
            categorySelect.value = categoryMap[suggestion.category] || '';
            descriptionTextarea.value = suggestion.description;
            
            // Change form to editing mode
            const form = suggestionsTab.querySelector('form');
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

        const suggestionsTab = document.querySelector('#suggestions');
        const categorySelect = suggestionsTab.querySelector('.form-select');
        const descriptionTextarea = suggestionsTab.querySelector('.form-textarea');
        
        if (!categorySelect.value || !descriptionTextarea.value.trim()) {
            if (window.notificationModule) {
                window.notificationModule.showNotification('Please fill in all required fields', 'error');
            }
            return;
        }

        // Update the suggestion - handle both string and numeric IDs
        const suggestionIndex = suggestions.findIndex(s => s.id == currentlyEditing);
        if (suggestionIndex !== -1) {
            // Map form values to display names - must match transformSuggestionData
            const categoryDisplayMap = {
                'feature-request': 'Feature Request',
                'critical-bug': 'Critical Bug',
                'ui-ux': 'UI/UX',
                'performance': 'Performance',
                'api-integration': 'API Integration',
                'security': 'Security',
                'documentation': 'Documentation',
                'accessibility': 'Accessibility',
                'infrastructure': 'Infrastructure'
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
        
        const suggestionsTab = document.querySelector('#suggestions');
        const form = suggestionsTab.querySelector('form');
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
            suggestions = suggestions.filter(s => s.id != id);
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
                        <div class="suggestion-description" 
                             data-full-text="${suggestion.description.replace(/"/g, '&quot;')}">
                            ${truncateText(suggestion.description, 50)}
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
                        <button class="btn btn-small btn-secondary" onclick="window.suggestionsTableModule.editSuggestion('${suggestion.id}')" title="Edit Suggestion">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="window.suggestionsTableModule.deleteSuggestion('${suggestion.id}')" title="Delete Suggestion">
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
    
    // Utility function to truncate text
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
    document.addEventListener('DOMContentLoaded', function() {
        window.suggestionsTableModule.init();
        // Ensure tooltips are initialized for suggestion descriptions
        initializeTooltipsForSuggestions();
    });
} else {
    window.suggestionsTableModule.init();
    // Ensure tooltips are initialized for suggestion descriptions
    initializeTooltipsForSuggestions();
}

/**
 * Initialize tooltips specifically for suggestion descriptions
 * This ensures the same tooltip functionality as review descriptions
 */
function initializeTooltipsForSuggestions() {
    // If the tooltip system from reviewsTable is not yet available,
    // create a simple version here
    if (typeof initializeTooltips === 'function') {
        // Use the existing tooltip system from reviewsTable
        return;
    }
    
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
