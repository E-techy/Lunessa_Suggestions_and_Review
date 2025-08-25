// utils/format_suggestion.js

const generateID = require("./generate_id");
const validateFiles = require("./validate_files");

// Allowed suggestion categories
const ALLOWED_CATEGORIES = [
  "system bug",
  "Ui bug",
  "documentatoin",
  "feature enhancement",
  "Ui enhancement",
  "help wanted",
  "question",
  "API related",
  "performance optimization",
  "security concern",
  "Accessibility",
  "AI Agent",
];

/**
 * Formats a raw suggestion object to fit the Suggestion model.
 *
 * Ensures the object is complete and sanitized for database insertion:
 * - Generates a unique `suggestionId` using the username.
 * - Handles anonymous username/name if not provided.
 * - Validates and formats attached files using `validateFiles`.
 * - Limits `suggestionDescription` to 2500 characters.
 * - Ensures `suggestionCategory` is valid; defaults to "others" if not.
 * - Sets `suggestionStatus` to "pending" and `accepted` to `false`.
 *
 * @param {Object} suggestion - Raw suggestion object from client.
 * @param {string} [suggestion.username] - Username of the person submitting the suggestion. Defaults to "Anonymous".
 * @param {string} [suggestion.name] - Name of the person submitting the suggestion. Defaults to "Anonymous".
 * @param {string} [suggestion.suggestionCategory] - Category of suggestion; must be one of allowed types. Defaults to "others".
 * @param {string} [suggestion.suggestionDescription] - Description of the suggestion; max length 2500 chars.
 * @param {Array<Object>} [suggestion.files] - Array of file objects to attach; validated by `validateFiles`.
 * @returns {Promise<{ formattedSuggestion: Object | null, error: string | null }>}  
 *          Returns the formatted suggestion object ready for database insertion, or an error message.
 *
 * @example
 * const suggestionInput = {
 *   username: "john_doe",
 *   name: "John Doe",
 *   suggestionCategory: "feature enhancement",
 *   suggestionDescription: "Add dark mode to the application.",
 *   files: [{ fileName: "screenshot.png", fileData: Buffer.from([0x89,0x50]), fileSize: 2 }]
 * };
 *
 * const { formattedSuggestion, error } = await formatSuggestion(suggestionInput);
 * if (!error) {
 *   console.log(formattedSuggestion);
 * }
 */
async function formatSuggestion(suggestion) {
  try {
    if (typeof suggestion !== "object" || !suggestion) {
      return { formattedSuggestion: null, error: "Invalid suggestion object provided" };
    }

    let { name, username, suggestionCategory, suggestionDescription, files } = suggestion;

    // ✅ Handle anonymous username/name
    username = username && username.trim() ? username.trim() : "Anonymous";
    name = name && name.trim() ? name.trim() : "Anonymous";

    // ✅ Handle suggestion description length (max 2500 chars)
    suggestionDescription = typeof suggestionDescription === "string"
      ? suggestionDescription.trim()
      : "";
    if (suggestionDescription.length > 2500) {
      suggestionDescription = suggestionDescription.substring(0, 2500);
    }

    // ✅ Handle suggestion category
    suggestionCategory = typeof suggestionCategory === "string"
      && ALLOWED_CATEGORIES.includes(suggestionCategory)
      ? suggestionCategory
      : "others";

    // ✅ Validate attached files
    const { validFiles, error: fileError } = await validateFiles(files);
    if (fileError) {
      return { formattedSuggestion: null, error: fileError };
    }

    // ✅ Generate unique suggestionId
    const suggestionId = generateID(username);

    // ✅ Build final formatted suggestion object
    const formattedSuggestion = {
      suggestionId,
      username,
      name,
      suggestionCategory,
      suggestionDescription,
      files: validFiles,
      suggestionStatus: "pending", // always pending
      accepted: false,             // always false
    };

    return { formattedSuggestion, error: null };
  } catch (err) {
    console.error("Error formatting suggestion:", err.message);
    return { formattedSuggestion: null, error: "Unexpected error while formatting suggestion" };
  }
}

module.exports = formatSuggestion;
