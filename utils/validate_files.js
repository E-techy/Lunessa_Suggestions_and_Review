/**
 * Validate and format file inputs for review/suggestion models.
 *
 * @param {Array<Object>} files - Array of file objects.
 * @returns {Promise<{ validFiles: Array<Object>, error: string }>}
 */
async function validateFiles(files) {
  if (!files || !Array.isArray(files)) {
    return { validFiles: [], error: "" }; // No files = fine
  }

  const MAX_TOTAL_SIZE = 8 * 1024 * 1024; // 8 MB
  let totalSize = 0;

  // Allowed extensions mapped to file types
  const extensionToType = {
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    webp: "image",
    bmp: "image",
    svg: "image",
    tiff: "image",
    jfif: "image",
    pdf: "pdf",
    txt: "text",
    doc: "doc",
    docx: "doc",
  };

  const validFiles = [];

  for (const file of files) {
    const { fileName, fileData, fileSize } = file;

    // Basic structure validation
    if (!fileName || !fileData) {
      return {
        validFiles: [],
        error: `Invalid file structure detected for: ${fileName || "unknown"}`
      };
    }

    // Extract extension
    const ext = fileName.split(".").pop().toLowerCase();

    // Validate extension
    if (!extensionToType[ext]) {
      return { validFiles: [], error: `File extension .${ext} is not allowed.` };
    }

    // Verify fileData is Buffer/Uint8Array
    if (!(fileData instanceof Buffer) && !(fileData instanceof Uint8Array)) {
      return {
        validFiles: [],
        error: `File data for ${fileName} must be a Buffer or Uint8Array.`
      };
    }

    // Determine real size
    const realSize = fileData.length;

    // Check provided vs real size mismatch (optional safety)
    if (fileSize && fileSize !== realSize) {
      return {
        validFiles: [],
        error: `File size mismatch for ${fileName}: expected ${fileSize}, got ${realSize}.`
      };
    }

    // Add to total size
    totalSize += realSize;
    if (totalSize > MAX_TOTAL_SIZE) {
      return { validFiles: [], error: "Total file size exceeds 8 MB limit." };
    }

    // Construct valid file object
    validFiles.push({
      fileName,
      fileData,
      fileSize: realSize, // override with actual size
      fileType: extensionToType[ext], // derived type
      fileExtension: ext,
    });
  }

  return { validFiles, error: "" };
}

module.exports = validateFiles;
