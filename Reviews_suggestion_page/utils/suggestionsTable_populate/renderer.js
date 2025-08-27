/**
 * Renderer Module
 * Handles DOM rendering and table display for suggestions
 */

window.suggestionsRenderer = (function() {
    'use strict';

    // Get status display info
    function getStatusInfo(status) {
        return window.suggestionsConfig.statusInfo[status] || window.suggestionsConfig.statusInfo['pending'];
    }

    // Utility function to truncate text
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Render table
    function renderTable() {
        const tableBody = document.querySelector('.suggestions-table tbody');
        const table = document.querySelector('.suggestions-table');
        if (!tableBody) return;

        const filteredSuggestions = window.suggestionsData.getFilteredSuggestions();
        const allSuggestions = window.suggestionsData.getAllSuggestions();

        // Handle empty states
        if (filteredSuggestions.length === 0) {
            tableBody.innerHTML = '';
            // Add appropriate class based on whether we have any suggestions at all
            if (allSuggestions.length === 0) {
                table?.classList.add('no-data');
            } else {
                table?.classList.remove('no-data');
            }
            if (window.suggestionsFilter) {
                window.suggestionsFilter.updateFilterResults();
            }
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
                    <td class="actions-column">
                        ${suggestion.status === 'pending' ? `
                            <button class="btn btn-small btn-secondary" onclick="window.suggestionsEditManager.editSuggestion('${suggestion.id}')" title="Edit Suggestion">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-small btn-danger" onclick="window.suggestionsTableModule.deleteSuggestion('${suggestion.id}')" title="Delete Suggestion">
                                <i class="fas fa-trash"></i>
                            </button>` : `
                            <span class="no-actions" title="Actions only available for pending suggestions">
                                <i class="fas fa-lock" style="color: #9ca3af; font-size: 14px;"></i>
                            </span>`}
                    </td>
                </tr>
            `;
        }).join('');
        
        if (window.suggestionsFilter) {
            window.suggestionsFilter.updateFilterResults();
        }
    }

    // Public API
    return {
        renderTable
    };
})();
