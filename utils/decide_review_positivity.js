const sendMessageToAIAgent = require("./send_message_to_AI");

/**
 * Decides positivity level (0-100) of a review by calling Gemini AI.
 *
 * @param {string} reviewComment - The review text.
 * @param {string} apiKey - Gemini API key.
 * @param {string} modelName - Gemini model (e.g., "gemini-2.5-flash").
 * @returns {Promise<{ positivityLevel: number, error: string }>}
 */
async function decideReviewPositivity(reviewComment, apiKey, modelName) {
    if (typeof reviewComment !== "string" || !reviewComment.trim()) {
        return { positivityLevel: -1, error: "Invalid review comment provided" };
    }

    const formattedPrompt = `
You have to find the level of positivity in this review between 0 to 100
Review
${reviewComment}

only give the positivity level
    `.trim();

    try {
        // Call AI
        const { reply } = await sendMessageToAIAgent(formattedPrompt, apiKey, modelName);

        // Extract number between 0–100
        const match = reply.match(/\b([0-9]{1,3})\b/);
        if (!match) {
            return { positivityLevel: -1, error: "Could not find a valid positivity number in AI output" };
        }

        let positivity = parseInt(match[1], 10);

        // Clamp to 0–100 in case AI gives >100 or <0
        if (positivity < 0) positivity = 0;
        if (positivity > 100) positivity = 100;

        return { positivityLevel: positivity, error: "" };
    } catch (error) {
        console.error("Error deciding review positivity:", error.message);
        return { positivityLevel: -1, error: "Failed to decide positivity level" };
    }
}

module.exports = decideReviewPositivity;
