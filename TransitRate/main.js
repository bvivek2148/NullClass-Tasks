// TransitRate - Professional Main JavaScript
// Enhanced enterprise-grade functionality

// Initialize professional TransitRate application
document.addEventListener('DOMContentLoaded', function() {
    // The main TransitRate class is now in transitrate.js
    // This file contains enhanced functionality and page-specific features
    
    initializeEnhancedFeatures();
});

/**
 * Initialize enhanced features for professional version
 */
function initializeEnhancedFeatures() {
    initializeAdvancedAnimations();
    initializeInteractiveElements();
    initializePerformanceOptimizations();
    initializeAccessibilityFeatures();
    initializeAnalyticsTracking();
}

/**
 * Advanced animation system
 */
function initializeAdvancedAnimations() {
    // Staggered entrance animations for cards
    if (typeof anime !== 'undefined') {
        // Animate statistics cards with delay
        anime({
            targets: '.hero-stats-card',
            translateY: [50, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 800,
            delay: anime.stagger(150, {start: 1000})
        });

        // Animate feature icons
        anime({
            targets: '.feature-icon',
            scale: [0, 1],
            rotate: [180, 0],
            easing: 'easeOutElastic(1, .8)',
            duration: 1000,
            delay: anime.stagger(200, {start: 1500})
        });

        // Animate testimonial cards with rotation
        anime({
            targets: '.testimonial-card',
            translateY: [30, 0],
            opacity: [0, 1],
            rotateX: [10, 0],
            easing: 'easeOutExpo',
            duration: 600,
            delay: anime.stagger(200, {start: 2000})
        });
    }
}

/**
 * Interactive elements enhancement
 */
function initializeInteractiveElements() {
    // Enhanced rating system with hover effects
    const ratingCards = document.querySelectorAll('.rating-card');
    ratingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        });
    });

    // Enhanced navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    translateY: -2,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    translateY: 0,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
    });

    // Enhanced button interactions
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            createRippleEffect(e, this);
        });
    });
}

/**
 * Create ripple effect for buttons
 */
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Performance optimizations
 */
function initializePerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize animations for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
    const criticalImages = [
        'resources/hero-transit.png',
        'resources/dashboard-mockup.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/**
 * Accessibility features
 */
function initializeAccessibilityFeatures() {
    // Keyboard navigation for rating system
    const starRatings = document.querySelectorAll('.star-rating');
    starRatings.forEach((star, index) => {
        star.setAttribute('tabindex', '0');
        star.setAttribute('role', 'button');
        star.setAttribute('aria-label', `Rate ${index + 1} star${index > 0 ? 's' : ''}`);
        
        star.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for modal dialogs
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const modals = document.querySelectorAll('.modal, .fixed.inset-0');
            modals.forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                }
            });
        }
    });
    
    // Screen reader announcements
    initializeScreenReaderSupport();
}

/**
 * Screen reader support
 */
function initializeScreenReaderSupport() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'sr-announcements';
    document.body.appendChild(liveRegion);
    
    // Announce important changes
    window.announceToScreenReader = function(message) {
        const announcement = document.createElement('div');
        announcement.textContent = message;
        liveRegion.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    };
}

/**
 * Analytics tracking
 */
function initializeAnalyticsTracking() {
    // Track user interactions
    const trackableElements = [
        'button', 'a[href]', 'input[type="submit"]',
        '.star-rating', '.rating-card', '.review-card'
    ];
    
    trackableElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', function() {
                trackUserInteraction(this, selector);
            });
        });
    });
    
    // Track page performance
    trackPagePerformance();
}

/**
 * Track user interactions
 */
function trackUserInteraction(element, selector) {
    const interactionData = {
        element: selector,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
    };
    
    // Add specific data based on element type
    if (element.classList.contains('star-rating')) {
        interactionData.rating = element.dataset.rating;
    } else if (element.href) {
        interactionData.destination = element.href;
    }
    
    // Store interaction (in real app, send to analytics service)
    console.log('User interaction:', interactionData);
}

/**
 * Track page performance
 */
function trackPagePerformance() {
    window.addEventListener('load', function() {
        const performanceData = {
            loadTime: performance.now(),
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
            firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
        };
        
        console.log('Page performance:', performanceData);
    });
}

/**
 * Enhanced review submission with validation
 */
function submitQuickRating() {
    const routeSelect = document.getElementById('route-select');
    const feedback = document.getElementById('quick-feedback');
    
    // Validation
    if (!routeSelect || !routeSelect.value) {
        showNotification('Please select a route first', 'warning');
        return;
    }
    
    if (currentRating === 0) {
        showNotification('Please provide a rating', 'warning');
        return;
    }
    
    // Enhanced submission with loading states
    const submitBtn = event.target;
    const originalText = submitBtn.textContent;
    const originalDisabled = submitBtn.disabled;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call with realistic delay
    setTimeout(() => {
        // Success animation
        anime({
            targets: '.rating-card',
            scale: [1, 1.05, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)',
            complete: () => {
                showNotification('Thank you! Your rating has been submitted successfully.', 'success');
                
                // Reset form with animation
                anime({
                    targets: [routeSelect, feedback],
                    opacity: [1, 0.5, 1],
                    duration: 400,
                    complete: () => {
                        routeSelect.value = '';
                        if (feedback) feedback.value = '';
                    }
                });
                
                // Reset rating
                currentRating = 0;
                highlightStars(0);
                document.getElementById('rating-text').textContent = 'Click to rate';
                
                // Update statistics
                updateCounter('.animate-counter', 1);
                
                // Store submission in localStorage
                const submission = {
                    route: routeSelect.value,
                    rating: currentRating,
                    feedback: feedback ? feedback.value : '',
                    timestamp: new Date().toISOString()
                };
                
                const submissions = JSON.parse(localStorage.getItem('transitrate_submissions') || '[]');
                submissions.push(submission);
                localStorage.setItem('transitrate_submissions', JSON.stringify(submissions));
            }
        });
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = originalDisabled;
        submitBtn.classList.remove('loading');
        
    }, 1500);
}

/**
 * Enhanced notification system
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transform translate-x-full transition-transform duration-300`;
    
    const colors = {
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: '✓',
        warning: '⚠',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.classList.add(colors[type]);
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="text-lg">${icons[type]}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader(message);
        }
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * Enhanced counter update with animation
 */
function updateCounter(selector, increment) {
    const element = document.querySelector(selector);
    if (element) {
        const current = parseFloat(element.textContent.replace(/,/g, ''));
        const newValue = current + increment;
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: { value: current },
                value: newValue,
                duration: 1000,
                easing: 'easeOutExpo',
                update: function(anim) {
                    const val = anim.animatables[0].target.value;
                    element.textContent = Math.floor(val).toLocaleString();
                }
            });
        } else {
            element.textContent = Math.floor(newValue).toLocaleString();
        }
    }
}

/**
 * Enhanced scroll to section
 */
function scrollToRating() {
    const ratingSection = document.querySelector('.rating-card');
    if (ratingSection) {
        const offsetTop = ratingSection.offsetTop - 100;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Highlight the rating card with enhanced animation
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.rating-card',
                scale: [1, 1.02, 1],
                duration: 800,
                easing: 'easeOutElastic(1, .8)'
            });
        }
    }
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Export enhanced functions for global use
 */
window.TransitRate = {
    showNotification,
    debounce,
    throttle,
    updateCounter,
    scrollToRating,
    submitQuickRating
};

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh animations when page becomes visible
        setTimeout(() => {
            if (typeof anime !== 'undefined') {
                // Reinitialize key animations
                anime({
                    targets: '.hero-stats-card',
                    translateY: [0, -5, 0],
                    duration: 1000,
                    easing: 'easeInOutSine',
                    loop: 3
                });
            }
        }, 100);
    }
});

/**
 * Handle responsive behavior with throttling
 */
window.addEventListener('resize', throttle(() => {
    // Close mobile menu on large screens
    if (window.innerWidth > 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }
    
    // Recalculate layout-dependent elements
    const ratingSection = document.querySelector('.rating-card');
    if (ratingSection && typeof anime !== 'undefined') {
        anime({
            targets: ratingSection,
            scale: [1, 1.01, 1],
            duration: 200,
            easing: 'easeOutQuad'
        });
    }
}, 250));

/**
 * Add CSS for ripple effect
 */
const rippleCSS = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: loading-shimmer 1.5s infinite;
    }
    
    @keyframes loading-shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);