/**
 * Animations and UI Effects Module
 * Handles page animations, transitions, and interactive effects
 */

// Enhanced page interactions and animations
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.review-item, .status-item, .sidebar-section, .form-section');
    animatedElements.forEach(item => {
        observer.observe(item);
    });
}

function initializeButtonEffects() {
    // Add professional hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function addFadeInUpAnimation() {
    // Add fadeInUp animation styles if not already present
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes success {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .success-animation {
                animation: success 0.6s ease-out;
            }
            
            .loading {
                opacity: 0.7;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all animations and effects
function initializeAllAnimations() {
    addFadeInUpAnimation();
    initializeAnimations();
    initializeButtonEffects();
}

// Export functions for use in main initialization
window.animationModule = {
    initializeAllAnimations
};