const express = require("express"); 
const cookieParser = require('cookie-parser');
const reviewStats = require("./utils/reviews_data_fetching/get_review_stats");
// add or modify review
const jwt = require("jsonwebtoken");
const formatReview = require("./utils/format_review");
const addReview = require("./utils/add_review");


const app = express();
require('dotenv').config();
const modelName = process.env.AI_MODEL;
const apiKey = process.env.GEMINI_API_KEY;
const jwtSecret = process.env.JWT_SECRET_KEY;
app.use(cookieParser()); 


const PORT = process.env.LUNESSA_REVIEW_SUGGESTION_PORT || 3003 ;

// Middleware to parse JSON
app.use(express.json());

app.use(express.static(__dirname+"/Reviews_suggestion_page"));


app.get("/lunessa_review_suggestions", (req, res)=>{
    // Sending the review and suggestion page
    res.sendFile(__dirname+"/Reviews_suggestion_page/Lunessa_reviews_feedback.html");
    
})


// Sending the review statistics to the user, without any password or username
app.post("/review_stats", async(req, res)=>{
    const reviewStatsData = await reviewStats();
    
    res.send(reviewStatsData);
})



// add or modify review

app.post("/review", async (req, res) => {
  const { action } = req.query;

  if (!action) {
    return res.status(400).json({ success: false, error: "Missing 'action' query parameter" });
  }

  try {
    // --- Extract & verify authToken from cookies (credentials: 'include') ---
    const token = req.cookies?.authToken;
    let username = null;
    let name = null;

    if (token && jwtSecret) {
      try {
        const decoded = jwt.verify(token, jwtSecret); // ✅ verify signature
        username = decoded?.username ?? null;
        name = decoded?.name ?? null;
      } catch (e) {
        // Invalid token → proceed as anonymous
        console.warn("Invalid authToken supplied. Proceeding as anonymous. Reason:", e.message);
      }
    } else if (token && !jwtSecret) {
      console.warn("JWT_SECRET_KEY not set; cannot verify token. Proceeding as anonymous.");
    }

    // --- Route by action ---
    if (action === "create") {
      const { comment, ratingStar, files } = req.body || {};

      // Build raw review object (name/username omitted if not available)
      const rawReview = { username, name, comment, ratingStar, files };

      // 1) Normalize/validate via formatter
      const { formattedReview, error: formatError } = await formatReview(rawReview, apiKey, modelName);
      if (formatError || !formattedReview) {
        return res.status(400).json({
          success: false,
          error: formatError || "Failed to format review",
        });
      }

      // 2) Persist
      const added = await addReview(formattedReview);
      if (!added) {
        return res.status(500).json({
          success: false,
          error: "Failed to add review. Please try again later.",
        });
      }

      return res.json({ success: true, message: "Review added successfully" });
    }

    if (action === "modify") {
      // TODO: implement modify flow here (intentionally left blank for now)
      return res.status(501).json({
        success: false,
        error: "Modify action not implemented yet",
      });
    }

    return res.status(400).json({ success: false, error: "Invalid 'action' value" });
  } catch (err) {
    console.error("❌ Error in /review:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
});


// Start server
app.listen(PORT, () => {

  // Agent Review and Suggestion url
  console.log(`✅ Agent creation server is running on http://localhost:${PORT}/lunessa_review_suggestions`);
});