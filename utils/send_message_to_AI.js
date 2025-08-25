const { GoogleGenAI } = require("@google/genai");

/**
 * Sends a message to the Gemini AI model and returns the AI's reply & total tokens used.
 *
 * @param {string} inputMessage - The message to send to the AI model.
 * @param {string} apiKey - The API key for authenticating with the Gemini API.
 * @param {string} modelName - The name of the Gemini AI model to use (e.g., "gemini-2.5-flash").
 * @returns {Promise<{ reply: string, totalTokens: number }>} - The AI-generated reply and token usage.
 */
async function sendMessageToAIAgent(inputMessage, apiKey, modelName) {
    if (typeof inputMessage !== "string" || !inputMessage.trim()) {
        throw new Error("Invalid input message provided");
    }
    if (typeof apiKey !== "string" || !apiKey.trim()) {
        throw new Error("Invalid API key provided");
    }
    if (typeof modelName !== "string" || !modelName.trim()) {
        throw new Error("Invalid model name provided");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: modelName,
            contents: inputMessage,
        });

        // Safely extract total tokens (fallback to null if missing)
        const totalTokens = response?.usageMetadata?.totalTokenCount ?? null;

        return {
            reply: response.text,
            totalTokens
        };
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        throw new Error("Failed to get a response from the AI");
    }
}

module.exports = sendMessageToAIAgent; 