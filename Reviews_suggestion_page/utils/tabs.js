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

// Make functions available globally
window.switchTab = switchTab;
window.switchSidebarTab = switchSidebarTab;