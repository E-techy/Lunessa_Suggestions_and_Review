// utils/modify_suggestion.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validateFiles = require("./validate_files");

/**
 * Modify an existing suggestion if it is not accepted yet and belongs to the correct user.
 *
 * Steps:
 *  1. Validate files first using utils/validate_files.js
 *  2. Find the suggestion by suggestionId
 *  3. Check if it's already accepted → if yes, block modification
 *  4. Verify if the suggestion belongs to the provided username
 *  5. Replace old data with new (category, description, and overwrite files)
 *
 * @param {Object} params
 * @param {string} params.suggestionId - Unique suggestion identifier
 * @param {string} params.username - The username trying to modify the suggestion
 * @param {Object} params.modifiedSuggestion - New suggestion details
 * @param {string} params.modifiedSuggestion.suggestionCategory - Updated category
 * @param {string} params.modifiedSuggestion.suggestionDescription - Updated description
 * @param {Array<Object>} params.modifiedSuggestion.files - Updated files array
 *
 * @returns {Promise<{ success: boolean, message: string, suggestion?: Object }>}
 */
async function modifySuggestion({ suggestionId, username, modifiedSuggestion }) {
  // Step 1: Validate files
  const { validFiles, error } = await validateFiles(modifiedSuggestion.files);
  if (error) {
    return { success: false, message: error };
  }

  // Step 2: Find the suggestion
  const suggestion = await prisma.Suggestion.findUnique({
    where: { suggestionId },
  });

  if (!suggestion) {
    return { success: false, message: "Suggestion not found." };
  }

  // Step 3: Check if already accepted
  if (suggestion.accepted) {
    return {
      success: false,
      message: "This suggestion has already been accepted and cannot be modified.",
    };
  }

  // Step 4: Verify ownership
  if (suggestion.username !== username) {
    return { success: false, message: "You do not have permission to modify this suggestion." };
  }

  // Step 5: Update suggestion (replace files completely)
  const updatedSuggestion = await prisma.Suggestion.update({
    where: { suggestionId },
    data: {
      suggestionCategory: modifiedSuggestion.suggestionCategory,
      suggestionDescription: modifiedSuggestion.suggestionDescription,
      files: { set: validFiles }, // overwrite old files
    },
  });

  return {
    success: true,
    message: "Suggestion modified successfully.",
    suggestion: updatedSuggestion,
  };
}

module.exports = modifySuggestion;
