const addReview = require("./utils/add_review");

async function testAddReview() {
  const fakeReview = {
    reviewID: "rev_001",
    name: "John Doe",
    username: "johndoe123",
    comment: "Great product! Really loved it 🚀",
    ratingStar: 2,
    files: [], // no files for now
    reviewType: "positive",
    reviewPositivity: 20, // will be converted to positivityLevel = 100
  };

  const result = await addReview(fakeReview);

  if (result) {
    console.log("✅ Review added successfully!");
  } else {
    console.log("❌ Failed to add review.");
  }
}

testAddReview()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test error:", err);
    process.exit(1);
  });
