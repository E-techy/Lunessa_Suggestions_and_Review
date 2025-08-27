const express = require("express"); 
const cookieParser = require('cookie-parser');
const reviewStats = require("./utils/reviews_data_fetching/get_review_stats");

const app = express();
require('dotenv').config();
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

// Start server
app.listen(PORT, () => {

  // Agent Review and Suggestion url
  console.log(`✅ Agent creation server is running on http://localhost:${PORT}/lunessa_review_suggestions`);
});