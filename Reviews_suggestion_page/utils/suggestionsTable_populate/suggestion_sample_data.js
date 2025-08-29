// Sample Suggestion Data based on Prisma Schema
// This data matches the Suggestion model structure

const suggestionSampleData = [
  {
    id: "507f1f77bcf86cd799439011",
    suggestionId: "SUG-2025-001",
    username: "tech_enthusiast_42",
    name: "Sarah Chen",
    createdAt: "2025-08-20T10:30:00Z",
    lastModified: "2025-08-22T14:15:00Z",
    suggestionCategory: "feature_request",
    suggestionDescription: "Add dark mode toggle to the main dashboard. Many users prefer dark themes for better eye comfort during extended usage periods.",
    files: [
      {
        id: "file_001",
        filename: "darkmode_mockup.png",
        url: "https://example.com/files/darkmode_mockup.png",
        uploadedAt: "2025-08-20T10:32:00Z"
      }
    ],
    suggestionStatus: "live",
    accepted: true,
    acceptedAt: "2025-08-22T14:15:00Z"
  },
  {
    id: "507f1f77bcf86cd799439012",
    suggestionId: "SUG-2025-002",
    username: "mobile_dev_ninja",
    name: "Alex Rodriguez",
    createdAt: "2025-08-19T16:45:00Z",
    lastModified: "2025-08-19T16:45:00Z",
    suggestionCategory: "bug_report",
    suggestionDescription: "Mobile app crashes when uploading files larger than 50MB. This happens consistently on both iOS and Android devices.",
    files: [
      {
        id: "file_002",
        filename: "crash_log_ios.txt",
        url: "https://example.com/files/crash_log_ios.txt",
        uploadedAt: "2025-08-19T16:47:00Z"
      },
      {
        id: "file_003",
        filename: "crash_log_android.txt",
        url: "https://example.com/files/crash_log_android.txt",
        uploadedAt: "2025-08-19T16:48:00Z"
      }
    ],
    suggestionStatus: "pending",
    accepted: false,
    acceptedAt: null
  },
  {
    id: "507f1f77bcf86cd799439013",
    suggestionId: "SUG-2025-003",
    username: "ux_designer_pro",
    name: "Maya Patel",
    createdAt: "2025-08-18T09:20:00Z",
    lastModified: "2025-08-25T11:30:00Z",
    suggestionCategory: "ui_improvement",
    suggestionDescription: "Redesign the navigation menu to be more intuitive. Current menu structure is confusing for new users and has poor accessibility.",
    files: [
      {
        id: "file_004",
        filename: "navigation_redesign.figma",
        url: "https://example.com/files/navigation_redesign.figma",
        uploadedAt: "2025-08-18T09:25:00Z"
      },
      {
        id: "file_005",
        filename: "user_flow_diagram.pdf",
        url: "https://example.com/files/user_flow_diagram.pdf",
        uploadedAt: "2025-08-18T09:26:00Z"
      }
    ],
    suggestionStatus: "completed",
    accepted: true,
    acceptedAt: "2025-08-25T11:30:00Z"
  },
  {
    id: "507f1f77bcf86cd799439014",
    suggestionId: "SUG-2025-004",
    username: "data_analyst_99",
    name: "Jordan Kim",
    createdAt: "2025-08-17T13:15:00Z",
    lastModified: "2025-08-17T13:15:00Z",
    suggestionCategory: "performance",
    suggestionDescription: "Database queries are running slow during peak hours. Need to optimize the suggestion search functionality.",
    files: [],
    suggestionStatus: "live",
    accepted: false,
    acceptedAt: null
  },
  {
    id: "507f1f77bcf86cd799439015",
    suggestionId: "SUG-2025-005",
    username: "security_expert",
    name: "Dr. Emily Watson",
    createdAt: "2025-08-16T08:45:00Z",
    lastModified: "2025-08-24T10:20:00Z",
    suggestionCategory: "security",
    suggestionDescription: "Implement two-factor authentication for user accounts to enhance security. Current authentication is vulnerable to brute force attacks.",
    files: [
      {
        id: "file_006",
        filename: "2fa_implementation_plan.docx",
        url: "https://example.com/files/2fa_implementation_plan.docx",
        uploadedAt: "2025-08-16T08:50:00Z"
      }
    ],
    suggestionStatus: "pending",
    accepted: true,
    acceptedAt: "2025-08-24T10:20:00Z"
  },
  {
    id: "507f1f77bcf86cd799439016",
    suggestionId: "SUG-2025-006",
    username: "frontend_wizard",
    name: "Lucas Thompson",
    createdAt: "2025-08-15T14:30:00Z",
    lastModified: "2025-08-15T14:30:00Z",
    suggestionCategory: "feature_request",
    suggestionDescription: "Add export functionality for user data in CSV and JSON formats. Users need to backup their suggestions locally.",
    files: [
      {
        id: "file_007",
        filename: "export_mockup.png",
        url: "https://example.com/files/export_mockup.png",
        uploadedAt: "2025-08-15T14:35:00Z"
      }
    ],
    suggestionStatus: "live",
    accepted: false,
    acceptedAt: null
  },
  {
    id: "507f1f77bcf86cd799439017",
    suggestionId: "SUG-2025-007",
    username: "accessibility_advocate",
    name: "Isabella Martinez",
    createdAt: "2025-08-14T11:00:00Z",
    lastModified: "2025-08-26T16:45:00Z",
    suggestionCategory: "accessibility",
    suggestionDescription: "Improve keyboard navigation and screen reader support. Current implementation doesn't meet WCAG 2.1 AA standards.",
    files: [
      {
        id: "file_008",
        filename: "accessibility_audit.pdf",
        url: "https://example.com/files/accessibility_audit.pdf",
        uploadedAt: "2025-08-14T11:05:00Z"
      },
      {
        id: "file_009",
        filename: "wcag_compliance_checklist.xlsx",
        url: "https://example.com/files/wcag_compliance_checklist.xlsx",
        uploadedAt: "2025-08-14T11:06:00Z"
      }
    ],
    suggestionStatus: "completed",
    accepted: true,
    acceptedAt: "2025-08-26T16:45:00Z"
  },
  {
    id: "507f1f77bcf86cd799439018",
    suggestionId: "SUG-2025-008",
    username: "backend_guru",
    name: "Raj Sharma",
    createdAt: "2025-08-13T07:30:00Z",
    lastModified: "2025-08-13T07:30:00Z",
    suggestionCategory: "infrastructure",
    suggestionDescription: "Migrate to microservices architecture to improve scalability and maintainability of the suggestion system.",
    files: [
      {
        id: "file_010",
        filename: "microservices_architecture.png",
        url: "https://example.com/files/microservices_architecture.png",
        uploadedAt: "2025-08-13T07:35:00Z"
      }
    ],
    suggestionStatus: "pending",
    accepted: false,
    acceptedAt: null
  },
  {
    id: "507f1f77bcf86cd799439019",
    suggestionId: "SUG-2025-009",
    username: "performance_expert",
    name: "Maria Gonzalez",
    createdAt: "2025-08-12T15:20:00Z",
    lastModified: "2025-08-15T10:45:00Z",
    suggestionCategory: "performance",
    suggestionDescription: "Implement caching layer for frequently accessed API endpoints to reduce response times by 60%.",
    files: [
      {
        id: "file_011",
        filename: "caching_strategy.pdf",
        url: "https://example.com/files/caching_strategy.pdf",
        uploadedAt: "2025-08-12T15:25:00Z"
      }
    ],
    suggestionStatus: "active",
    accepted: true,
    acceptedAt: "2025-08-15T10:45:00Z"
  },
  {
    id: "507f1f77bcf86cd799439020",
    suggestionId: "SUG-2025-010",
    username: "ui_architect",
    name: "Kevin Zhang",
    createdAt: "2025-08-11T09:15:00Z",
    lastModified: "2025-08-14T16:30:00Z",
    suggestionCategory: "ui_improvement",
    suggestionDescription: "Redesign the notification system with real-time updates and better visual hierarchy for improved user experience.",
    files: [],
    suggestionStatus: "active",
    accepted: true,
    acceptedAt: "2025-08-14T16:30:00Z"
  }
];

// Helper functions for working with suggestion data
const suggestionHelpers = {
  // Get suggestions by status
  getByStatus: (status) => {
    return suggestionSampleData.filter(suggestion => suggestion.suggestionStatus === status);
  },

  // Get suggestions by category
  getByCategory: (category) => {
    return suggestionSampleData.filter(suggestion => suggestion.suggestionCategory === category);
  },

  // Get suggestions by username
  getByUsername: (username) => {
    return suggestionSampleData.filter(suggestion => suggestion.username === username);
  },

  // Get accepted suggestions
  getAccepted: () => {
    return suggestionSampleData.filter(suggestion => suggestion.accepted === true);
  },

  // Get recent suggestions (last 7 days from Aug 26, 2025)
  getRecent: () => {
    const sevenDaysAgo = new Date('2025-08-19T00:00:00Z');
    return suggestionSampleData.filter(suggestion => 
      new Date(suggestion.createdAt) >= sevenDaysAgo
    );
  },

  // Get suggestions with files
  getWithFiles: () => {
    return suggestionSampleData.filter(suggestion => suggestion.files.length > 0);
  },

  // Search suggestions by description
  searchByDescription: (searchTerm) => {
    return suggestionSampleData.filter(suggestion => 
      suggestion.suggestionDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};

// Summary statistics
const suggestionStats = {
  total: suggestionSampleData.length,
  byStatus: {
    live: suggestionSampleData.filter(s => s.suggestionStatus === 'live').length,
    pending: suggestionSampleData.filter(s => s.suggestionStatus === 'pending').length,
    completed: suggestionSampleData.filter(s => s.suggestionStatus === 'completed').length,
    active: suggestionSampleData.filter(s => s.suggestionStatus === 'active').length
  },
  byCategory: {
    feature_request: suggestionSampleData.filter(s => s.suggestionCategory === 'feature_request').length,
    bug_report: suggestionSampleData.filter(s => s.suggestionCategory === 'bug_report').length,
    ui_improvement: suggestionSampleData.filter(s => s.suggestionCategory === 'ui_improvement').length,
    performance: suggestionSampleData.filter(s => s.suggestionCategory === 'performance').length,
    security: suggestionSampleData.filter(s => s.suggestionCategory === 'security').length,
    accessibility: suggestionSampleData.filter(s => s.suggestionCategory === 'accessibility').length,
    infrastructure: suggestionSampleData.filter(s => s.suggestionCategory === 'infrastructure').length
  },
  accepted: suggestionSampleData.filter(s => s.accepted === true).length,
  withFiles: suggestionSampleData.filter(s => s.files.length > 0).length
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {  
    suggestionSampleData,
    suggestionHelpers,
    suggestionStats
  };
}

// Console log for browser environments
console.log('📋 Suggestion Sample Data Loaded');
console.log('📊 Statistics:', suggestionStats);
console.log('🔍 Helper functions available:', Object.keys(suggestionHelpers));
