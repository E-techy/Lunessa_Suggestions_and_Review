/**
 * File Upload Module
 * Handles file upload functionality and UI feedback
 */

// Initialize file upload handlers
function initializeFileUpload() {
    const reviewFileInput = document.getElementById('reviewFile');
    const suggestionImageInput = document.getElementById('suggestionImage');

    if (reviewFileInput) {
        reviewFileInput.addEventListener('change', handleReviewFileChange);
    }

    if (suggestionImageInput) {
        suggestionImageInput.addEventListener('change', handleSuggestionImageChange);
    }
}

function handleReviewFileChange(e) {
    if (e.target.files.length > 0) {
        const fileCount = e.target.files.length;
        const uploadBtn = document.querySelector('[onclick*="reviewFile"]');
        if (uploadBtn) {
            uploadBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${fileCount} file${fileCount > 1 ? 's' : ''} selected`;
            uploadBtn.classList.add('success-animation');
        }
    }
}

function handleSuggestionImageChange(e) {
    if (e.target.files.length > 0) {
        const fileCount = e.target.files.length;
        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-icon" style="color: var(--success);">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="upload-text" style="color: var(--success);">${fileCount} file${fileCount > 1 ? 's' : ''} uploaded successfully</div>
                <div class="upload-subtext">Click to change files</div>
            `;
            uploadArea.style.borderColor = 'var(--success)';
            uploadArea.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        }
    }
}

function resetUploadArea() {
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <div class="upload-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <div class="upload-text">Upload Screenshots, Logs, or Documentation</div>
            <div class="upload-subtext">Drag & drop files here or click to browse<br>PNG, JPG, PDF, TXT up to 25MB</div>
        `;
        uploadArea.style.borderColor = 'var(--accent)';
        uploadArea.style.backgroundColor = 'var(--accent-light)';
    }
}

// Export functions for use in other modules
window.fileUploadModule = {
    initializeFileUpload,
    resetUploadArea
};