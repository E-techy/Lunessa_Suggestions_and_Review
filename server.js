const express = require("express"); 
const cookieParser = require('cookie-parser');
const reviewStats = require("./utils/reviews_data_fetching/get_review_stats");
// add or modify review
const jwt = require("jsonwebtoken");
const formatReview = require("./utils/format_review");
const addReview = require("./utils/add_review");
const getTopReviews = require("./utils/reviews_data_fetching/get_top_reviews");

const addSuggestion = require("./utils/add_suggestion");
const formatSuggestion = require("./utils/format_suggestion");
const modifySuggestion = require("./utils/modify_suggestion");



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
      const { reviewID, comment, ratingStar, files } = req.body || {};

      if (!reviewID) {
        return res.status(400).json({
          success: false,
          error: "Missing 'reviewID' for modification",
        });
      }

      // Attempt modification
      const result = await modifyReview(reviewID, username, { comment, ratingStar, files }, modelName, apiKey);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error || "Failed to modify review",
        });
      }

      return res.json({ success: true, message: "Review modified successfully" });
    }

    return res.status(400).json({ success: false, error: "Invalid 'action' value" });
  } catch (err) {
    console.error("❌ Error in /review:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
});



// add or modify suggestion 
app.post("/suggestion", async (req, res) => {
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

    // --- Handle different actions ---
    if (action === "create") {
      const { suggestionCategory, suggestionDescription, files } = req.body || {};

      // Step 1: Build raw suggestion
      const rawSuggestion = { username, name, suggestionCategory, suggestionDescription, files };

      // Step 2: Format suggestion
      const { formattedSuggestion, error: formatError } = await formatSuggestion(rawSuggestion);
      if (formatError || !formattedSuggestion) {
        return res.status(400).json({
          success: false,
          error: formatError || "Failed to format suggestion",
        });
      }

      // Step 3: Persist suggestion
      const added = await addSuggestion(formattedSuggestion);
      if (!added) {
        return res.status(500).json({
          success: false,
          error: "Failed to add suggestion. Please try again later.",
        });
      }

      return res.json({ success: true, message: "Suggestion added successfully" });
    }

    if (action === "modify") {
      const { suggestionId, suggestionCategory, suggestionDescription, files } = req.body || {};

      if (!suggestionId) {
        return res.status(400).json({ success: false, error: "Missing suggestionId for modification" });
      }

      // Step 1: Build modified suggestion
      const modifiedSuggestion = { suggestionCategory, suggestionDescription, files };

      // Step 2: Attempt modification
      const result = await modifySuggestion({ suggestionId, username, modifiedSuggestion });

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.message });
      }

      return res.json({
        success: true,
        message: result.message,
        suggestion: result.suggestion,
      });
    }

    return res.status(400).json({ success: false, error: "Invalid 'action' value" });
  } catch (err) {
    console.error("❌ Error in /suggestion:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
});


// Sending the top rated reviews 
app.post("/top_rated", async (req, res) => {
  try {
    let { timestamp, type } = req.query;

    // ✅ Handle timestamp validation
    let parsedTimestamp = null;
    if (timestamp) {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        parsedTimestamp = date; // valid date
      } else {
        console.warn("⚠️ Invalid timestamp provided. Falling back to default.");
        parsedTimestamp = null; // or new Date(0) if you want "from beginning"
      }
    }

    // ✅ Call utility function with sanitized inputs
    const result = await getTopReviews(parsedTimestamp, type);

    if (result.success) {
      return res.json({
        success: true,
        data: result.reviews,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch top reviews",
      });
    }
  } catch (error) {
    console.error("❌ Error in /top_rated route:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

// Start server
app.listen(PORT, () => {

  // Agent Review and Suggestion url
  console.log(`✅ Agent creation server is running on http://localhost:${PORT}/lunessa_review_suggestions`);
});