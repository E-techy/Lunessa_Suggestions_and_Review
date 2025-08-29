/**
 * Tab Management Module
 * Handles tab switching functionality
 */

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.closest('.tab-button').classList.add('active');
}

// Sidebar tab switching functionality
function switchSidebarTab(sectionName, tabType) {
    // Find the parent section
    const section = document.querySelector(`[data-section="${sectionName}"]`) || 
                   document.querySelector(`#${sectionName}`) ||
                   event.target.closest('.sidebar-section');
    
    if (!section) {
        console.error(`Section ${sectionName} not found`);
        return;
    }
    
    // Remove active class from all tab buttons in this section
    const tabButtons = section.querySelectorAll('.sidebar-tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Remove active class from all tab contents in this section
    const tabContents = section.querySelectorAll('.sidebar-tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked button
    const clickedButton = event.target.closest('.sidebar-tab-btn');
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Show selected tab content
    const targetContent = section.querySelector(`#${sectionName}-${tabType}`);
    if (targetContent) {
        targetContent.classList.add('active');
    } else {
        console.error(`Tab content ${sectionName}-${tabType} not found`);
    }
}

// Filter functionality for Active Issues section
// function filterActiveIssues(filterValue) {
//     const pendingItems = document.querySelectorAll('#active-issues-pending .status-item');
//     const activeItems = document.querySelectorAll('#active-issues-active .status-item');
    
//     // Sort pending items
//     sortStatusItems(pendingItems, filterValue);
//     // Sort active items
//     sortStatusItems(activeItems, filterValue);
// }

// // Filter functionality for Resolved & Implemented section
// function filterResolvedImplemented(filterValue) {
//     const liveItems = document.querySelectorAll('#resolved-implemented-live .status-item');
//     const completedItems = document.querySelectorAll('#resolved-implemented-completed .status-item');
    
//     // Sort live items
//     sortStatusItems(liveItems, filterValue);
//     // Sort completed items
//     sortStatusItems(completedItems, filterValue);
// }

// Helper function to sort status items by date
// x

// Extract date from status item
function extractDateFromStatusItem(item) {
    const dateElement = item.querySelector('.status-date');
    if (!dateElement) return new Date(0);
    
    const dateText = dateElement.textContent;
    // Extract date from text like "Submitted: Aug 18, 2025" or "Started: Aug 15, 2025"
    const dateMatch = dateText.match(/(\w{3} \d{1,2}, \d{4})/);
    if (dateMatch) {
        return new Date(dateMatch[1]);
    }
    
    // Fallback: extract from "Deployed:" or "Completed:" format
    const deployedMatch = dateText.match(/(Deployed|Completed): (\w{3} \d{1,2}, \d{4})/);
    if (deployedMatch) {
        return new Date(deployedMatch[2]);
    }
    
    return new Date(0);
}

// Initialize filters on page load
// document.addEventListener('DOMContentLoaded', function() {
//     // Set initial filter values
//     const activeIssuesFilter = document.getElementById('activeIssuesFilter');
//     const resolvedImplementedFilter = document.getElementById('resolvedImplementedFilter');
    
//     if (activeIssuesFilter) {
//         activeIssuesFilter.value = 'latest';
//         filterActiveIssues('latest');
//     }
    
//     if (resolvedImplementedFilter) {
//         resolvedImplementedFilter.value = 'latest';
//         filterResolvedImplemented('latest');
//     }
// });

// Make functions available globally
window.switchTab = switchTab;
window.switchSidebarTab = switchSidebarTab;
// window.filterActiveIssues = filterActiveIssues;
// window.filterResolvedImplemented = filterResolvedImplemented;