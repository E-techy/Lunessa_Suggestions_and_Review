/**
 * Edit Manager Module
 * Handles editing functionality for suggestions
 */

window.suggestionsEditManager = (function() {
    'use strict';

    let currentlyEditing = null;

    // Get status display info
    function getStatusInfo(status) {
        return window.suggestionsConfig.statusInfo[status] || window.suggestionsConfig.statusInfo['pending'];
    }

    // Edit suggestion
    function editSuggestion(id) {
        // Handle both string and numeric IDs
        const suggestion = window.suggestionsData.findSuggestion(id);
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
            const { categoryFormMap } = window.suggestionsConfig;
            
            // Debug logging to see what values we have
            console.log('Editing suggestion:', suggestion);
            console.log('Category to map:', suggestion.category);
            console.log('Mapped value:', categoryFormMap[suggestion.category]);
            
            categorySelect.value = categoryFormMap[suggestion.category] || '';
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

        const { formToCategoryDisplayMap } = window.suggestionsConfig;
        
        const updatedData = {
            category: formToCategoryDisplayMap[categorySelect.value] || categorySelect.value,
            description: descriptionTextarea.value.trim()
        };

        // Update the suggestion
        const updatedSuggestion = window.suggestionsData.updateSuggestion(currentlyEditing, updatedData);
        
        if (updatedSuggestion) {
            if (window.suggestionsRenderer) {
                window.suggestionsRenderer.renderTable();
            }
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

    // Get currently editing ID
    function getCurrentlyEditing() {
        return currentlyEditing;
    }

    // Public API
    return {
        editSuggestion,
        updateSuggestion,
        cancelEditSuggestion,
        getCurrentlyEditing
    };
})();
