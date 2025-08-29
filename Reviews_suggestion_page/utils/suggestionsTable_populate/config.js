/**
 * Configuration and Constants
 * Contains mapping configurations and constant values used across the suggestions module
 */

window.suggestionsConfig = {
    // Map suggestion categories to display names
    categoryDisplayMap: {
        'feature_request': 'Feature Request',
        'bug_report': 'Critical Bug',
        'ui_improvement': 'UI/UX',
        'performance': 'Performance',
        'security': 'Security',
        'accessibility': 'Accessibility',
        'infrastructure': 'Infrastructure'
    },

    // Map suggestion status to display status
    statusDisplayMap: {
        'live': 'progress',
        'pending': 'pending',
        'completed': 'resolved',
        'active': 'progress'
    },

    // Map category display names back to form values
    categoryFormMap: {
        'Feature Request': 'feature-request',
        'Critical Bug': 'critical-bug', 
        'UI/UX': 'ui-ux',
        'Performance': 'performance',
        'API Integration': 'api-integration',
        'Security': 'security',
        'Documentation': 'documentation',
        'Accessibility': 'accessibility',
        'Infrastructure': 'infrastructure'
    },

    // Map form values to display names
    formToCategoryDisplayMap: {
        'feature-request': 'Feature Request',
        'critical-bug': 'Critical Bug',
        'ui-ux': 'UI/UX',
        'performance': 'Performance',
        'api-integration': 'API Integration',
        'security': 'Security',
        'documentation': 'Documentation',
        'accessibility': 'Accessibility',
        'infrastructure': 'Infrastructure'
    },

    // Status display information
    statusInfo: {
        'pending': { class: 'status-pending', text: 'Pending', icon: 'fas fa-clock' },
        'progress': { class: 'status-progress', text: 'In Progress', icon: 'fas fa-cog fa-spin' },
        'resolved': { class: 'status-resolved', text: 'Resolved', icon: 'fas fa-check' },
        'rejected': { class: 'status-rejected', text: 'Rejected', icon: 'fas fa-times' }
    }
};
