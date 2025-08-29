/**
 * Rating System Module
 * Handles star rating functionality and visual feedback
 */

let currentReviewRating = 0;

// Rating labels for different star ratings
const ratingLabels = [
    'Select your rating',
    'Poor - Needs significant improvement',
    'Fair - Below expectations', 
    'Good - Meets expectations',
    'Very Good - Exceeds expectations',
    'Excellent - Outstanding service'
];

// Initialize rating system
function initializeRating() {
    const reviewStars = document.querySelectorAll('#reviewRating .star');
    const ratingLabel = document.querySelector('.rating-label');

    if (!reviewStars.length || !ratingLabel) return;

    reviewStars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentReviewRating = index + 1;
            updateReviewStars();
            ratingLabel.textContent = ratingLabels[currentReviewRating];
            
            // Add success animation
            star.style.animation = 'success 0.6s ease-out';
            setTimeout(() => {
                star.style.animation = '';
            }, 600);
        });

        star.addEventListener('mouseover', () => {
            highlightReviewStars(index + 1);
            ratingLabel.textContent = ratingLabels[index + 1];
        });
    });

    document.getElementById('reviewRating').addEventListener('mouseleave', () => {
        updateReviewStars();
        ratingLabel.textContent = ratingLabels[currentReviewRating];
    });
}

function highlightReviewStars(rating) {
    const reviewStars = document.querySelectorAll('#reviewRating .star');
    reviewStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateReviewStars() {
    highlightReviewStars(currentReviewRating);
}

function resetRating() {
    currentReviewRating = 0;
    updateReviewStars();
    const ratingLabel = document.querySelector('.rating-label');
    if (ratingLabel) {
        ratingLabel.textContent = ratingLabels[0];
    }
}

function setRating(rating) {
    if (rating >= 1 && rating <= 5) {
        currentReviewRating = rating;
        updateReviewStars();
        const ratingLabel = document.querySelector('.rating-label');
        if (ratingLabel) {
            ratingLabel.textContent = ratingLabels[rating];
        }
    }
}

// Export functions for use in other modules
window.ratingModule = {
    currentReviewRating: () => currentReviewRating,
    resetRating,
    setRating,
    initializeRating
};