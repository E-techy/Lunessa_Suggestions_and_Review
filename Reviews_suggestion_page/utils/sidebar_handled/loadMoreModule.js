// // Core Load More Module
// // This file contains the main logic for the Load More functionality

// const LoadMoreModule = (function() {
//     'use strict';

//     // Private variables
//     let config = {};
//     let data = {};

//     /**
//      * Initialize the module with configuration and data
//      */
//     function init() {
//         config = LoadMoreConfig.sections;
//         data = LoadMoreData;
//     }

//     /**
//      * Get items for a specific section and tab
//      * @param {string} sectionKey - Section configuration key
//      * @param {string} currentActiveTab - Active tab name
//      * @param {number} currentPage - Current page number
//      * @param {number} itemsPerPage - Items per page
//      * @returns {Array} Array of items to display
//      */
//     function getItemsForSection(sectionKey, currentActiveTab, currentPage, itemsPerPage) {
//         const sectionData = data[sectionKey][currentActiveTab];
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return sectionData.slice(startIndex, endIndex);
//     }

//     /**
//      * Replace items in the DOM based on section type (Load More replaces existing data)
//      * @param {string} sectionKey - Section configuration key
//      * @param {Array} items - Items to replace existing content with
//      * @param {HTMLElement} contentContainer - Container to replace items in
//      */
//     function replaceItemsInDOM(sectionKey, items, contentContainer) {
//         // Try to find the load-more-container within the content container
//         let loadMoreContainer = contentContainer.querySelector('.load-more-container');
        
//         // If not found, look for it in the parent or siblings
//         if (!loadMoreContainer) {
//             loadMoreContainer = contentContainer.parentElement?.querySelector('.load-more-container');
//         }
        
//         // If still not found, look for any load-more button and use its parent
//         if (!loadMoreContainer) {
//             const loadMoreButton = contentContainer.querySelector('.btn-load-more') || 
//                                  contentContainer.parentElement?.querySelector('.btn-load-more');
//             if (loadMoreButton) {
//                 loadMoreContainer = loadMoreButton.parentElement;
//             }
//         }
        
//         console.log('Replacing content in container:', {
//             container: contentContainer,
//             containerClass: contentContainer.className,
//             containerId: contentContainer.id,
//             loadMoreContainer: loadMoreContainer
//         });
        
//         // Clear existing review items (but keep load-more-container)
//         const existingItems = contentContainer.querySelectorAll('.review-item, .status-item');
//         existingItems.forEach(item => {
//             console.log('Removing existing item:', item.className);
//             item.remove();
//         });
        
//         console.log(`Cleared ${existingItems.length} existing items`);
        
//         // Generate HTML for new items
//         let newContentHtml = '';
//         items.forEach((item, index) => {
//             let itemHtml = '';
            
//             if (sectionKey === 'topRatedReviews' || sectionKey === 'recentFeedback') {
//                 itemHtml = TemplateUtils.createReviewItem(item);
//             } else if (sectionKey === 'activeIssues') {
//                 itemHtml = TemplateUtils.createActiveIssueItem(item);
//             } else if (sectionKey === 'resolvedImplemented') {
//                 itemHtml = TemplateUtils.createResolvedItem(item);
//             }
            
//             if (itemHtml) {
//                 newContentHtml += itemHtml;
//             } else {
//                 console.warn('Could not generate HTML for item', index, ':', item);
//             }
//         });
        
//         // Insert new content before the load-more-container
//         if (newContentHtml) {
//             try {
//                 if (loadMoreContainer) {
//                     // Insert before the load-more container
//                     loadMoreContainer.insertAdjacentHTML('beforebegin', newContentHtml);
//                 } else {
//                     // Insert at the end of the content container
//                     contentContainer.insertAdjacentHTML('beforeend', newContentHtml);
//                 }
                
//                 console.log(`Successfully replaced content with ${items.length} new items`);
//             } catch (error) {
//                 console.error('Error replacing HTML content:', error);
//                 console.log('New content HTML:', newContentHtml.substring(0, 200) + '...');
//             }
//         } else {
//             console.warn('No new content HTML generated for replacement');
//         }
//     }

//     /**
//      * Generic load more function
//      * @param {string} sectionKey - Section configuration key
//      * @param {string} subSection - Optional sub-section override
//      */
//     function loadMoreItems(sectionKey, subSection = null) {
//         const sectionConfig = config[sectionKey];
//         const button = event.target;
//         const container = button.closest('.sidebar-section');
        
//         if (!sectionConfig) {
//             console.warn('Section configuration not found for:', sectionKey);
//             return;
//         }
        
//         // Set loading state
//         AnimationUtils.setButtonLoading(button, true);
        
//         // Simulate API call delay
//         setTimeout(() => {
//             try {
//                 const currentActiveTab = subSection || container.querySelector('.sidebar-tab-content.active').id.split('-').pop();
                
//                 // Try multiple possible ID formats based on common patterns
//                 let contentContainer = null;
//                 const possibleIds = [
//                     `${sectionConfig.sectionId.replace('-', '')}-${currentActiveTab}`, // toprated-latest
//                     `${sectionConfig.sectionId}-${currentActiveTab}`, // top-rated-latest
//                     `${sectionConfig.sectionId.replace('-', '')}${currentActiveTab}`, // topratedlatest
//                     `${sectionConfig.sectionId}-content-${currentActiveTab}`, // top-rated-content-latest
//                     `${sectionConfig.sectionId.replace('-', '')}_${currentActiveTab}`, // toprated_latest
//                     `${sectionConfig.sectionId.replace('-', '')}-${currentActiveTab}-content`, // toprated-latest-content
//                     `${currentActiveTab}`, // just the tab name
//                     `content-${currentActiveTab}`, // content-latest
//                     `${sectionConfig.sectionId}-${currentActiveTab}-tab`, // top-rated-latest-tab
//                     `tab-${sectionConfig.sectionId}-${currentActiveTab}` // tab-top-rated-latest
//                 ];
                
//                 for (const id of possibleIds) {
//                     contentContainer = container.querySelector(`#${id}`);
//                     if (contentContainer) {
//                         console.log('Found content container with ID:', id);
//                         break;
//                     }
//                 }
                
//                 // If still not found, try looking for any active tab content
//                 if (!contentContainer) {
//                     contentContainer = container.querySelector('.sidebar-tab-content.active');
//                     if (contentContainer) {
//                         console.log('Using active tab content container:', contentContainer.id);
//                     }
//                 }
                
//                 // Last resort: look for any element that might contain load-more-container
//                 if (!contentContainer) {
//                     const loadMoreContainers = container.querySelectorAll('.load-more-container');
//                     if (loadMoreContainers.length > 0) {
//                         contentContainer = loadMoreContainers[0].parentElement;
//                         console.log('Found container via load-more-container parent:', contentContainer.id || contentContainer.className);
//                     }
//                 }
                
//                 if (!contentContainer) {
//                     console.warn('Content container not found. Tried IDs:', possibleIds);
//                     console.warn('Available containers:', Array.from(container.querySelectorAll('[id]')).map(el => el.id));
//                     AnimationUtils.setButtonLoading(button, false);
//                     return;
//                 }

//                 const currentPage = sectionConfig.currentPage;
//                 const newItems = getItemsForSection(sectionKey, currentActiveTab, currentPage, sectionConfig.itemsPerPage);
                
//                 // Replace existing items with new items
//                 replaceItemsInDOM(sectionKey, newItems, contentContainer);

//                 // Update page counter
//                 sectionConfig.currentPage++;
                
//                 // Remove loading state
//                 AnimationUtils.setButtonLoading(button, false);
                
//                 // Hide button if no more items
//                 if (sectionConfig.currentPage > sectionConfig.maxPages || newItems.length === 0) {
//                     AnimationUtils.hideButtonWithMessage(button);
//                 }
                
//                 // Add fade-in animation to new items
//                 const newItemElements = AnimationUtils.getNewItemsForAnimation(contentContainer, newItems.length);
//                 AnimationUtils.applyFadeInAnimation(newItemElements, LoadMoreConfig.animation.fadeInDelay);
                
//             } catch (error) {
//                 console.error('Error loading more items:', error);
//                 AnimationUtils.setButtonLoading(button, false);
//             }
            
//         }, LoadMoreConfig.animation.loadingDelay);
//     }

//     /**
//      * Reset section pagination
//      * @param {string} sectionKey - Section configuration key
//      */
//     function resetSection(sectionKey) {
//         if (config[sectionKey]) {
//             config[sectionKey].currentPage = 1;
            
//             // Show load more buttons again
//             const buttons = document.querySelectorAll('.btn-load-more');
//             buttons.forEach(button => {
//                 if (button.onclick && button.onclick.toString().includes(sectionKey)) {
//                     AnimationUtils.showButtonAndRemoveMessages(button);
//                 }
//             });
//         }
//     }

//     // Public API
//     return {
//         init: init,
//         loadMoreTopRatedReviews: () => loadMoreItems('topRatedReviews'),
//         loadMoreRecentFeedback: () => loadMoreItems('recentFeedback'),
//         loadMoreActiveIssues: () => loadMoreItems('activeIssues'),
//         loadMoreResolvedImplemented: () => loadMoreItems('resolvedImplemented'),
//         resetSection: resetSection
//     };
// })();

// // Export for use in other modules
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = LoadMoreModule;
// } else if (typeof window !== 'undefined') {
//     window.LoadMoreModule = LoadMoreModule;
// }
