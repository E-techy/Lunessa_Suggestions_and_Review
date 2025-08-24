const express = require("express");

const app = express();
require('dotenv').config();
app.use(cookieParser()); 


const PORT = process.env.LUNESSA_REVIEW_SUGGESTION_PORT || 3003 ;

// Middleware to parse JSON
app.use(express.json());


app.get("/lunessa_review_suggestions", (req, res)=>{
    // Sending the review and suggestion page
    
})

// Start server
app.listen(PORT, () => {

  // Agent Review and Suggestion url
  console.log(`✅ Agent creation server is running on http://localhost:${PORT}/create_new_agent`);
});