/**
 * Sample Reviews Data
 * Contains the initial reviews data for the application
 */

// Sample review data adapted from sample_reviews_data.js
let reviewsData = [
    {
        id: 1,
        reviewID: "REV_001_2024",
        name: "Alice Johnson",
        username: "alice_j_2024",
        description: "Absolutely fantastic product! The quality exceeded my expectations and the delivery was lightning fast. I've been using it for a month now and couldn't be happier. Highly recommend to anyone looking for reliable quality.",
        ratingStar: 5,
        date: "2024-01-15",
        reviewType: "product",
        positivityLevel: 0.95,
        files: [
            {
                fileName: "product_unboxing.jpg",
                fileType: "photo",
                fileSize: 2048,
                fileExtension: "jpg"
            },
            {
                fileName: "review_video.mp4",
                fileType: "video",
                fileSize: 15360,
                fileExtension: "mp4"
            }
        ]
    },
    {
        id: 2,
        reviewID: "REV_002_2024",
        name: "Mark Thompson",
        username: "markT_tech",
        description: "Good product overall, but there are some minor issues with the build quality. The functionality works as advertised, though I wish the instructions were clearer. Still worth the price point.",
        ratingStar: 4,
        date: "2024-01-18",
        reviewType: "product",
        positivityLevel: 0.72,
        files: [
            {
                fileName: "issue_documentation.pdf",
                fileType: "pdf",
                fileSize: 512,
                fileExtension: "pdf"
            }
        ]
    },
    {
        id: 3,
        reviewID: "REV_003_2024",
        name: "Sarah Chen",
        username: "sarahc_design",
        description: "The service was okay, nothing extraordinary but met basic expectations. Response time could be improved and the interface feels a bit outdated. However, the core functionality works reliably.",
        ratingStar: 3,
        date: "2024-01-20",
        reviewType: "service",
        positivityLevel: 0.58,
        files: []
    },
    {
        id: 4,
        reviewID: "REV_004_2024",
        name: "David Rodriguez",
        username: "david_r_customer",
        description: "Unfortunately, this didn't meet my expectations. The product arrived damaged and customer service was slow to respond. After multiple attempts to resolve the issue, I'm quite disappointed.",
        ratingStar: 2,
        date: "2024-01-22",
        reviewType: "product",
        positivityLevel: 0.25,
        files: [
            {
                fileName: "damage_report.jpg",
                fileType: "photo",
                fileSize: 1024,
                fileExtension: "jpg"
            },
            {
                fileName: "email_correspondence.txt",
                fileType: "txt",
                fileSize: 256,
                fileExtension: "txt"
            }
        ]
    },
    {
        id: 5,
        reviewID: "REV_005_2024",
        name: "Emily Watson",
        username: "emily_w_2024",
        description: "Terrible experience from start to finish. Product quality is poor, shipping took forever, and when I tried to return it, the process was a nightmare. Would not recommend to anyone.",
        ratingStar: 1,
        date: "2024-01-25",
        reviewType: "product",
        positivityLevel: 0.05,
        files: [
            {
                fileName: "return_process_issues.doc",
                fileType: "doc",
                fileSize: 768,
                fileExtension: "doc"
            }
        ]
    },
    {
        id: 6,
        reviewID: "REV_006_2024",
        name: "James Wilson",
        username: "james_wilson_tech",
        description: "Amazing service! The team went above and beyond to help me with my setup. Technical support was knowledgeable and patient. This is how customer service should be done everywhere.",
        ratingStar: 5,
        date: "2024-01-28",
        reviewType: "service",
        positivityLevel: 0.98,
        files: [
            {
                fileName: "setup_completion.jpg",
                fileType: "photo",
                fileSize: 1536,
                fileExtension: "jpg"
            },
            {
                fileName: "thank_you_note.txt",
                fileType: "txt",
                fileSize: 128,
                fileExtension: "txt"
            }
        ]
    },
    {
        id: 7,
        reviewID: "REV_007_2024",
        name: "Lisa Garcia",
        username: "lisa_g_shopper",
        description: "Decent product for the price. It does what it's supposed to do, but don't expect any premium features. Good value for money if you're on a budget and need basic functionality.",
        ratingStar: 4,
        date: "2024-01-30",
        reviewType: "product",
        positivityLevel: 0.68,
        files: []
    }
];

// Export data
window.reviewsData = reviewsData;
