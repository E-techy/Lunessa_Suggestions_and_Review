// // Configuration for Load More functionality
// // This file contains all configuration settings for pagination and sections

// const LoadMoreConfig = {
//     sections: {
//         topRatedReviews: {
//             currentPage: 1,
//             itemsPerPage: 3,
//             maxPages: 5,
//             sectionId: 'top-rated'
//         },
//         recentFeedback: {
//             currentPage: 1,
//             itemsPerPage: 3,
//             maxPages: 5,
//             sectionId: 'recent-feedback'
//         },
//         activeIssues: {
//             currentPage: 1,
//             itemsPerPage: 3,
//             maxPages: 4,
//             sectionId: 'active-issues'
//         },
//         resolvedImplemented: {
//             currentPage: 1,
//             itemsPerPage: 3,
//             maxPages: 4,
//             sectionId: 'resolved-implemented'
//         }
//     },

//     // Mapping between section IDs and configuration keys
//     sectionMap: {
//         'top-rated': 'topRatedReviews',
//         'recent-feedback': 'recentFeedback',
//         'active-issues': 'activeIssues',
//         'resolved-implemented': 'resolvedImplemented'
//     },

//     // Animation settings
//     animation: {
//         loadingDelay: 800,
//         fadeInDelay: 100,
//         fadeInDuration: '0.3s'
//     },

//     // CSS classes
//     classes: {
//         loading: 'loading',
//         noMoreItems: 'no-more-items',
//         fadeIn: 'fade-in-item'
//     }
// };

// // Export for use in other modules
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = LoadMoreConfig;
// } else if (typeof window !== 'undefined') {
//     window.LoadMoreConfig = LoadMoreConfig;
// }
