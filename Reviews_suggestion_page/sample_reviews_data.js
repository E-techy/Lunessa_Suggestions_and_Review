// Sample review data for Prisma Review model
// This data matches the schema structure you provided

const sampleReviews = [
  {
    reviewID: "REV_001_2024",
    name: "Alice Johnson",
    username: "alice_j_2024",
    comment: "Absolutely fantastic product! The quality exceeded my expectations and the delivery was lightning fast. I've been using it for a month now and couldn't be happier. Highly recommend to anyone looking for reliable quality.",
    ratingStar: 5,
    files: [
      {
        fileName: "product_unboxing.jpg",
        fileType: "photo",
        fileData: Buffer.from("fake_image_data_for_unboxing"), // In real scenario, this would be actual image bytes
        fileSize: 2048, // 2KB
        fileExtension: "jpg"
      },
      {
        fileName: "review_video.mp4",
        fileType: "video",
        fileData: Buffer.from("fake_video_data"), // In real scenario, this would be actual video bytes
        fileSize: 15360, // 15MB
        fileExtension: "mp4"
      }
    ],
    reviewType: "product",
    positivityLevel: 0.95
  },
  
  {
    reviewID: "REV_002_2024",
    name: "Mark Thompson",
    username: "markT_tech",
    comment: "Good product overall, but there are some minor issues with the build quality. The functionality works as advertised, though I wish the instructions were clearer. Still worth the price point.",
    ratingStar: 4,
    files: [
      {
        fileName: "issue_documentation.pdf",
        fileType: "pdf",
        fileData: Buffer.from("fake_pdf_content_about_issues"),
        fileSize: 512, // 512 bytes
        fileExtension: "pdf"
      }
    ],
    reviewType: "product",
    positivityLevel: 0.72
  },
  
  {
    reviewID: "REV_003_2024",
    name: "Sarah Chen",
    username: "sarahc_design",
    comment: "The service was okay, nothing extraordinary but met basic expectations. Response time could be improved and the interface feels a bit outdated. However, the core functionality works reliably.",
    ratingStar: 3,
    files: [],
    reviewType: "service",
    positivityLevel: 0.58
  },
  
  {
    reviewID: "REV_004_2024",
    name: "David Rodriguez",
    username: "david_r_customer",
    comment: "Unfortunately, this didn't meet my expectations. The product arrived damaged and customer service was slow to respond. After multiple attempts to resolve the issue, I'm quite disappointed.",
    ratingStar: 2,
    files: [
      {
        fileName: "damage_report.jpg",
        fileType: "photo",
        fileData: Buffer.from("fake_damage_photo_data"),
        fileSize: 1024, // 1KB
        fileExtension: "jpg"
      },
      {
        fileName: "email_correspondence.txt",
        fileType: "txt",
        fileData: Buffer.from("Email thread showing slow customer service response..."),
        fileSize: 256,
        fileExtension: "txt"
      }
    ],
    reviewType: "product",
    positivityLevel: 0.25
  },
  
  {
    reviewID: "REV_005_2024",
    name: "Emily Watson",
    username: "emily_w_2024",
    comment: "Terrible experience from start to finish. Product quality is poor, shipping took forever, and when I tried to return it, the process was a nightmare. Would not recommend to anyone.",
    ratingStar: 1,
    files: [
      {
        fileName: "return_process_issues.doc",
        fileType: "doc",
        fileData: Buffer.from("fake_document_data_about_return_issues"),
        fileSize: 768,
        fileExtension: "doc"
      }
    ],
    reviewType: "product",
    positivityLevel: 0.05
  },
  
  {
    reviewID: "REV_006_2024",
    name: "James Wilson",
    username: "james_wilson_tech",
    comment: "Amazing service! The team went above and beyond to help me with my setup. Technical support was knowledgeable and patient. This is how customer service should be done everywhere.",
    ratingStar: 5,
    files: [
      {
        fileName: "setup_completion.jpg",
        fileType: "photo",
        fileData: Buffer.from("fake_setup_photo_data"),
        fileSize: 1536,
        fileExtension: "jpg"
      },
      {
        fileName: "thank_you_note.txt",
        fileType: "txt",
        fileData: Buffer.from("Thank you note to the support team for their excellent service..."),
        fileSize: 128,
        fileExtension: "txt"
      }
    ],
    reviewType: "service",
    positivityLevel: 0.98
  },
  
  {
    reviewID: "REV_007_2024",
    name: "Lisa Garcia",
    username: "lisa_g_shopper",
    comment: "Decent product for the price. It does what it's supposed to do, but don't expect any premium features. Good value for money if you're on a budget and need basic functionality.",
    ratingStar: 4,
    files: [],
    reviewType: "product",
    positivityLevel: 0.68
  }
];

// Prisma create operations for inserting this data
const createReviewsOperations = sampleReviews.map(review => ({
  reviewID: review.reviewID,
  name: review.name,
  username: review.username,
  comment: review.comment,
  ratingStar: review.ratingStar,
  files: review.files,
  reviewType: review.reviewType,
  positivityLevel: review.positivityLevel,
  // createdAt and lastModified will be auto-generated by Prisma
}));

// Export for use in your application
module.exports = {
  sampleReviews,
  createReviewsOperations
};

// Example usage with Prisma Client:
/*
const prisma = new PrismaClient();

async function seedReviews() {
  try {
    for (const reviewData of createReviewsOperations) {
      await prisma.review.create({
        data: reviewData
      });
    }
    console.log('Successfully created sample reviews');
  } catch (error) {
    console.error('Error creating reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Uncomment to run the seed function
// seedReviews();
*/