// Sample data for Load More functionality
// This file contains all the mock data used for pagination

const LoadMoreData = {
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadMoreData;
} else if (typeof window !== 'undefined') {
    window.LoadMoreData = LoadMoreData;
}
