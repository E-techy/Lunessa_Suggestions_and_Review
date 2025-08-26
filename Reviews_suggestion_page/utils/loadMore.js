// Load More Functionality for Sidebar Sections
// This module handles loading additional content for the sidebar sections

const LoadMoreModule = (function() {
    'use strict';

    // Configuration for each section
    const config = {
        topRatedReviews: {
            currentPage: 1,
            itemsPerPage: 3,
            maxPages: 5,
            sectionId: 'top-rated'
        },
        recentFeedback: {
            currentPage: 1,
            itemsPerPage: 3,
            maxPages: 5,
            sectionId: 'recent-feedback'
        },
        activeIssues: {
            currentPage: 1,
            itemsPerPage: 3,
            maxPages: 4,
            sectionId: 'active-issues'
        },
        resolvedImplemented: {
            currentPage: 1,
            itemsPerPage: 3,
            maxPages: 4,
            sectionId: 'resolved-implemented'
        }
    };

    // Sample data for additional items
    const additionalData = {
        topRatedReviews: {
            latest: [
                {
                    author: "David Miller",
                    rating: 5,
                    preview: "Outstanding customer service and quick resolution to technical issues. The AI platform exceeded our expectations...",
                    date: "2024-01-08"
                },
                {
                    author: "Jennifer Lee",
                    rating: 5,
                    preview: "Seamless integration with our existing systems. The documentation was comprehensive and support team was helpful...",
                    date: "2024-01-05"
                },
                {
                    author: "Robert Davis",
                    rating: 4,
                    preview: "Good service overall with room for improvement in response time. The features are robust and well-designed...",
                    date: "2024-01-02"
                }
            ],
            oldest: [
                {
                    author: "Emma Thompson",
                    rating: 5,
                    preview: "Early adopter here - the platform has consistently delivered excellent results over the past year...",
                    date: "2023-10-20"
                },
                {
                    author: "Kevin Wong",
                    rating: 4,
                    preview: "Solid performance from day one. The AI capabilities have improved significantly over time...",
                    date: "2023-10-15"
                },
                {
                    author: "Sandra Martinez",
                    rating: 5,
                    preview: "Exceptional service quality and reliable uptime. The team has been responsive to feedback...",
                    date: "2023-09-28"
                }
            ]
        },
        recentFeedback: {
            latest: [
                {
                    author: "Alex Chen",
                    rating: 4,
                    preview: "Recent updates have improved performance significantly. Looking forward to the upcoming features...",
                    date: "2024-01-14"
                },
                {
                    author: "Maria Rodriguez",
                    rating: 3,
                    preview: "The service is decent but could use better mobile optimization. Desktop experience is much better...",
                    date: "2024-01-11"
                },
                {
                    author: "James Wilson",
                    rating: 5,
                    preview: "Latest release is fantastic! The new dashboard layout is intuitive and feature-rich...",
                    date: "2024-01-09"
                }
            ],
            oldest: [
                {
                    author: "Laura Kim",
                    rating: 3,
                    preview: "Mixed experience - some features work well while others need improvement. Customer support is helpful...",
                    date: "2023-12-28"
                },
                {
                    author: "Peter Jackson",
                    rating: 2,
                    preview: "Encountered several bugs during initial setup. Hope these issues are addressed in future updates...",
                    date: "2023-12-25"
                },
                {
                    author: "Anna Foster",
                    rating: 4,
                    preview: "Good value for money with reliable performance. Would recommend for small to medium businesses...",
                    date: "2023-12-22"
                }
            ]
        },
        activeIssues: {
            pending: [
                {
                    title: "Enhanced Search Filters",
                    description: "Advanced filtering options for complex search queries with Boolean operators and field-specific filters",
                    badge: "Feature Request",
                    badgeIcon: "fas fa-plus-circle",
                    date: "Aug 14, 2025",
                    priority: "Medium Priority",
                    priorityClass: "priority-medium"
                },
                {
                    title: "Real-time Collaboration Tools",
                    description: "Live document editing and commenting system for team collaboration on customer service cases",
                    badge: "Enhancement",
                    badgeIcon: "fas fa-users",
                    date: "Aug 12, 2025",
                    priority: "Low Priority",
                    priorityClass: "priority-low"
                },
                {
                    title: "API Rate Limiting Issue",
                    description: "Intermittent API timeouts during peak hours affecting enterprise customers",
                    badge: "Critical Bug",
                    badgeIcon: "fas fa-exclamation-triangle",
                    date: "Aug 20, 2025",
                    priority: "Critical",
                    priorityClass: "priority-critical"
                }
            ],
            active: [
                {
                    title: "Performance Monitoring Dashboard",
                    description: "Real-time system performance metrics with alerting and historical analytics",
                    badge: "Development",
                    badgeIcon: "fas fa-chart-line",
                    date: "Aug 08, 2025",
                    progress: "Progress: 45%"
                },
                {
                    title: "Advanced Reporting Module",
                    description: "Comprehensive reporting suite with custom metrics and automated scheduling",
                    badge: "Design Review",
                    badgeIcon: "fas fa-file-chart-line",
                    date: "Aug 05, 2025",
                    progress: "Progress: 20%"
                }
            ]
        },
        resolvedImplemented: {
            live: [
                {
                    title: "Enhanced Security Headers",
                    description: "Implementation of additional security headers for improved application security posture",
                    badge: "Live & Secured",
                    badgeIcon: "fas fa-shield-check",
                    date: "Aug 15, 2025",
                    users: "All users protected"
                },
                {
                    title: "Improved Error Messages",
                    description: "User-friendly error messages with actionable guidance for common issues",
                    badge: "Live Production",
                    badgeIcon: "fas fa-check-circle",
                    date: "Aug 13, 2025",
                    users: "2,156 interactions improved"
                }
            ],
            completed: [
                {
                    title: "Database Performance Optimization",
                    description: "Query optimization and indexing improvements for faster data retrieval",
                    badge: "Performance Optimized",
                    badgeIcon: "fas fa-rocket",
                    date: "Aug 11, 2025",
                    satisfaction: "99% performance improvement"
                },
                {
                    title: "Mobile UI Enhancements",
                    description: "Responsive design improvements for better mobile and tablet user experience",
                    badge: "UI/UX Completed",
                    badgeIcon: "fas fa-mobile-alt",
                    date: "Aug 09, 2025",
                    satisfaction: "96% mobile user satisfaction"
                }
            ]
        }
    };

    // Utility function to create star rating HTML
    function createStarRating(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= rating ? 'active' : '';
            starsHtml += `<span class="star ${activeClass}">★</span>`;
        }
        return starsHtml;
    }

    // Utility function to create review item HTML
    function createReviewItem(item) {
        return `
            <div class="review-item">
                <div class="review-author">${item.author}</div>
                <div class="review-rating-small">
                    ${createStarRating(item.rating)}
                </div>
                <div class="review-preview">${item.preview}</div>
                <div class="review-date">${item.date}</div>
            </div>
        `;
    }

    // Utility function to create status item HTML for Active Issues
    function createActiveIssueItem(item) {
        const metaContent = item.progress ? 
            `<span class="status-progress">${item.progress}</span>` :
            `<span class="status-priority ${item.priorityClass}">${item.priority}</span>`;

        return `
            <div class="status-item">
                <div class="status-title">${item.title}</div>
                <div class="status-desc">${item.description}</div>
                <span class="status-badge badge-${item.badge.toLowerCase().replace(/\s+/g, '-')}">
                    <i class="${item.badgeIcon}"></i>
                    ${item.badge}
                </span>
                <div class="status-meta">
                    <span class="status-date">Submitted: ${item.date}</span>
                    ${metaContent}
                </div>
            </div>
        `;
    }

    // Utility function to create status item HTML for Resolved & Implemented
    function createResolvedItem(item) {
        const metaContent = item.users ? 
            `<span class="status-users">${item.users}</span>` :
            `<span class="status-satisfaction">${item.satisfaction}</span>`;

        return `
            <div class="status-item">
                <div class="status-title">${item.title}</div>
                <div class="status-desc">${item.description}</div>
                <span class="status-badge badge-${item.badge.toLowerCase().replace(/[\s&]+/g, '-')}">
                    <i class="${item.badgeIcon}"></i>
                    ${item.badge}
                </span>
                <div class="status-meta">
                    <span class="status-date">Deployed: ${item.date}</span>
                    ${metaContent}
                </div>
            </div>
        `;
    }

    // Generic load more function
    function loadMoreItems(sectionKey, subSection = null) {
        const sectionConfig = config[sectionKey];
        const button = event.target;
        const container = button.closest('.sidebar-section');
        
        // Add loading state
        button.classList.add('loading');
        button.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            const currentActiveTab = subSection || container.querySelector('.sidebar-tab-content.active').id.split('-').pop();
            const dataKey = sectionConfig.sectionId.replace('-', '') + '-' + currentActiveTab;
            const contentContainer = container.querySelector(`#${dataKey}`);
            
            if (!contentContainer) {
                console.warn('Content container not found for:', dataKey);
                button.classList.remove('loading');
                button.disabled = false;
                return;
            }

            let newItems = [];
            const currentPage = sectionConfig.currentPage;

            // Get appropriate data based on section
            if (sectionKey === 'topRatedReviews' || sectionKey === 'recentFeedback') {
                const sectionData = additionalData[sectionKey][currentActiveTab];
                const startIndex = (currentPage - 1) * sectionConfig.itemsPerPage;
                const endIndex = startIndex + sectionConfig.itemsPerPage;
                newItems = sectionData.slice(startIndex, endIndex);
                
                // Add new review items
                newItems.forEach(item => {
                    const reviewHtml = createReviewItem(item);
                    const loadMoreContainer = contentContainer.querySelector('.load-more-container');
                    loadMoreContainer.insertAdjacentHTML('beforebegin', reviewHtml);
                });
            } else if (sectionKey === 'activeIssues') {
                const sectionData = additionalData[sectionKey][currentActiveTab];
                const startIndex = (currentPage - 1) * sectionConfig.itemsPerPage;
                const endIndex = startIndex + sectionConfig.itemsPerPage;
                newItems = sectionData.slice(startIndex, endIndex);
                
                // Add new status items
                newItems.forEach(item => {
                    const statusHtml = createActiveIssueItem(item);
                    const loadMoreContainer = contentContainer.querySelector('.load-more-container');
                    loadMoreContainer.insertAdjacentHTML('beforebegin', statusHtml);
                });
            } else if (sectionKey === 'resolvedImplemented') {
                const sectionData = additionalData[sectionKey][currentActiveTab];
                const startIndex = (currentPage - 1) * sectionConfig.itemsPerPage;
                const endIndex = startIndex + sectionConfig.itemsPerPage;
                newItems = sectionData.slice(startIndex, endIndex);
                
                // Add new resolved items
                newItems.forEach(item => {
                    const resolvedHtml = createResolvedItem(item);
                    const loadMoreContainer = contentContainer.querySelector('.load-more-container');
                    loadMoreContainer.insertAdjacentHTML('beforebegin', resolvedHtml);
                });
            }

            // Update page counter
            sectionConfig.currentPage++;
            
            // Remove loading state
            button.classList.remove('loading');
            button.disabled = false;
            
            // Hide button if no more items
            if (sectionConfig.currentPage > sectionConfig.maxPages || newItems.length === 0) {
                button.style.display = 'none';
                
                // Add "No more items" message
                const noMoreMessage = document.createElement('div');
                noMoreMessage.className = 'no-more-items';
                noMoreMessage.style.cssText = 'text-align: center; color: #6b7280; font-size: 0.8rem; padding: 8px; font-style: italic;';
                noMoreMessage.textContent = 'All items loaded';
                button.parentNode.appendChild(noMoreMessage);
            }
            
            // Add fade-in animation to new items
            const newItemElements = contentContainer.querySelectorAll('.review-item:nth-last-child(-n+' + (newItems.length + 1) + '):not(:last-child), .status-item:nth-last-child(-n+' + (newItems.length + 1) + '):not(:last-child)');
            newItemElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
        }, 800); // Simulate loading delay
    }

    // Public API
    return {
        loadMoreTopRatedReviews: () => loadMoreItems('topRatedReviews'),
        loadMoreRecentFeedback: () => loadMoreItems('recentFeedback'),
        loadMoreActiveIssues: () => loadMoreItems('activeIssues'),
        loadMoreResolvedImplemented: () => loadMoreItems('resolvedImplemented'),
        
        // Reset function for when tabs are switched
        resetSection: function(sectionKey) {
            if (config[sectionKey]) {
                config[sectionKey].currentPage = 1;
                
                // Show the load more button again
                const buttons = document.querySelectorAll('.btn-load-more');
                buttons.forEach(button => {
                    if (button.onclick && button.onclick.toString().includes(sectionKey)) {
                        button.style.display = 'inline-flex';
                        button.disabled = false;
                        button.classList.remove('loading');
                    }
                });
                
                // Remove "no more items" messages
                const noMoreMessages = document.querySelectorAll('.no-more-items');
                noMoreMessages.forEach(msg => msg.remove());
            }
        }
    };
})();

// Global functions for onclick handlers
function loadMoreTopRatedReviews() {
    LoadMoreModule.loadMoreTopRatedReviews();
}

function loadMoreRecentFeedback() {
    LoadMoreModule.loadMoreRecentFeedback();
}

function loadMoreActiveIssues() {
    LoadMoreModule.loadMoreActiveIssues();
}

function loadMoreResolvedImplemented() {
    LoadMoreModule.loadMoreResolvedImplemented();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Load More module initialized');
    
    // Reset section counters when tabs are switched
    const originalSwitchSidebarTab = window.switchSidebarTab;
    if (originalSwitchSidebarTab) {
        window.switchSidebarTab = function(sectionId, tabType) {
            originalSwitchSidebarTab(sectionId, tabType);
            
            // Reset the appropriate section
            const sectionMap = {
                'top-rated': 'topRatedReviews',
                'recent-feedback': 'recentFeedback',
                'active-issues': 'activeIssues',
                'resolved-implemented': 'resolvedImplemented'
            };
            
            const sectionKey = sectionMap[sectionId];
            if (sectionKey) {
                LoadMoreModule.resetSection(sectionKey);
            }
        };
    }
});
