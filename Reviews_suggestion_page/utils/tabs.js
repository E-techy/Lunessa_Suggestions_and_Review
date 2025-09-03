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

    // Show selected tab content
    const tabContent = document.getElementById(tabName);
    if (tabContent) tabContent.classList.add('active');

    // Add active class to clicked button
    if (event) {
        const btn = event.currentTarget.closest('.tab-button');
        if (btn) btn.classList.add('active');
    }

    // Add active class to clicked button
    if (event) {
        event.target.closest('.tab-button').classList.add('active');
    }

    // ✅ Auto-click sub-tabs when Suggestions is opened
    if (tabName === "suggestions") {
        const pendingBtn = document.querySelector(".sidebar-active-issue-btn[data-tab='pending-active-issue']");
        const liveBtn = document.querySelector(".resolved-tab-button[data-tab='resolved-live']");

        if (pendingBtn) pendingBtn.click();
        if (liveBtn) liveBtn.click();
    }
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


// Make functions available globally
window.switchTab = switchTab;
window.switchSidebarTab = switchSidebarTab;
