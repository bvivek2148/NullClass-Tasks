/**
 * TransitRate Professional JavaScript Framework
 * Enterprise-grade transit rating and analytics system
 * 
 * @version 2.0.0
 * @author TransitRate Development Team
 * @license MIT
 */

class TransitRate {
    constructor() {
        this.version = '2.0.0';
        this.initialized = false;
        this.config = {
            animationDuration: 800,
            easing: 'easeOutExpo',
            apiEndpoint: '/api',
            maxFileSize: 5 * 1024 * 1024, // 5MB
            maxFiles: 3,
            minReviewLength: 50
        };
        
        this.state = {
            currentUser: null,
            selectedRoute: null,
            ratings: {
                overall: 0,
                punctuality: 0,
                cleanliness: 0,
                driver: 0,
                comfort: 0
            },
            filters: {
                search: '',
                route: '',
                rating: 0,
                sort: 'newest',
                dateRange: null
            },
            analytics: {
                timeRange: '6months',
                comparisonRoutes: []
            }
        };
        
        this.modules = {};
        this.init();
    }

    /**
     * Initialize the TransitRate application
     */
    init() {
        if (this.initialized) return;
        
        this.initializeModules();
        this.initializeEventListeners();
        this.initializeAnimations();
        
        // Initialize page-specific functionality
        this.initializePageSpecific();
        
        this.initialized = true;
        console.log(`TransitRate v${this.version} initialized successfully`);
    }

    /**
     * Initialize core modules
     */
    initializeModules() {
        this.modules = {
            animations: new AnimationModule(this),
            ratings: new RatingModule(this),
            analytics: new AnalyticsModule(this),
            forms: new FormModule(this),
            notifications: new NotificationModule(this),
            storage: new StorageModule(this),
            utils: new UtilsModule(this)
        };
    }

    /**
     * Initialize global event listeners
     */
    initializeEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Scroll effects
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Resize handler
        window.addEventListener('resize', this.modules.utils.debounce(this.handleResize.bind(this), 250));
        
        // Page visibility changes
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    /**
     * Initialize page-specific functionality
     */
    initializePageSpecific() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                this.initializeHomePage();
                break;
            case 'dashboard':
                this.initializeDashboardPage();
                break;
            case 'reviews':
                this.initializeReviewsPage();
                break;
            case 'submit-review':
                this.initializeSubmitReviewPage();
                break;
            case 'india-transit':
                this.initializeIndiaTransitPage();
                break;
        }
    }

    /**
     * Get current page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('reviews')) return 'reviews';
        if (path.includes('submit-review')) return 'submit-review';
        if (path.includes('india-transit')) return 'india-transit';
        return 'index';
    }

    /**
     * Initialize home page functionality
     */
    initializeHomePage() {
        this.modules.animations.initializeHeroAnimations();
        this.modules.ratings.initializeQuickRating();
        this.modules.animations.initializeCounters();
        this.initializeRecentReviews();
    }

    /**
     * Initialize dashboard page functionality
     */
    initializeDashboardPage() {
        this.modules.analytics.initializeCharts();
        this.modules.animations.initializeCounters();
        this.initializeRouteTable();
        this.initializeDashboardFilters();
    }

    /**
     * Initialize reviews page functionality
     */
    initializeReviewsPage() {
        this.generateMockReviews();
        this.initializeReviewFilters();
        this.initializeReviewSearch();
        this.filterAndDisplayReviews();
    }

    /**
     * Initialize submit review page functionality
     */
    initializeSubmitReviewPage() {
        this.modules.forms.initializeMultiStepForm();
        this.modules.ratings.initializeDetailedRating();
        this.modules.forms.initializeFileUpload();
        this.modules.forms.initializeFormValidation();
    }

    /**
     * Initialize India transit page functionality
     */
    initializeIndiaTransitPage() {
        this.initializeTabSystem();
        this.initializeLocationFeatures();
        this.initializeIndiaSpecificFeatures();
    }

    /**
     * Initialize tab system for India transit page
     */
    initializeTabSystem() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const city = button.dataset.city;
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => {
                    content.classList.remove('active', 'hidden');
                    content.classList.add('hidden');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show selected tab content
                const selectedContent = document.getElementById(city + '-content');
                if (selectedContent) {
                    selectedContent.classList.remove('hidden');
                    selectedContent.classList.add('active');
                    
                    // Animate content entrance
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: selectedContent,
                            translateY: [30, 0],
                            opacity: [0, 1],
                            duration: 500,
                            easing: 'easeOutExpo'
                        });
                    }
                }
            });
        });
    }

    /**
     * Initialize location features
     */
    initializeLocationFeatures() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // Determine closest city based on coordinates
                    const closestCity = this.findClosestCity(lat, lon);
                    if (closestCity) {
                        this.highlightNearestCity(closestCity);
                    }
                },
                (error) => {
                    console.log('Location access denied or unavailable');
                }
            );
        }
    }

    /**
     * Find closest city based on coordinates
     */
    findClosestCity(lat, lon) {
        // Simplified city coordinates for demo
        const cities = {
            delhi: { lat: 28.6139, lon: 77.2090 },
            mumbai: { lat: 19.0760, lon: 72.8777 },
            bangalore: { lat: 12.9716, lon: 77.5946 },
            chennai: { lat: 13.0827, lon: 80.2707 },
            kolkata: { lat: 22.5726, lon: 88.3639 },
            hyderabad: { lat: 17.3850, lon: 78.4867 }
        };

        let closestCity = null;
        let minDistance = Infinity;

        Object.entries(cities).forEach(([city, coords]) => {
            const distance = Math.sqrt(
                Math.pow(lat - coords.lat, 2) + Math.pow(lon - coords.lon, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestCity = city;
            }
        });

        return closestCity;
    }

    /**
     * Highlight nearest city in the interface
     */
    highlightNearestCity(city) {
        const cityButton = document.querySelector(`[data-city="${city}"]`);
        if (cityButton) {
            cityButton.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            cityButton.style.color = 'white';
            cityButton.style.transform = 'scale(1.05)';
            
            // Add location indicator
            const indicator = document.createElement('span');
            indicator.textContent = ' 📍';
            indicator.className = 'ml-1';
            cityButton.appendChild(indicator);
        }
    }

    /**
     * Initialize India-specific features
     */
    initializeIndiaSpecificFeatures() {
        this.simulateLiveUpdates();
        this.initializeIndiaAnimations();
    }

    /**
     * Simulate live updates for crowd levels and status
     */
    simulateLiveUpdates() {
        setInterval(() => {
            // Update crowd levels randomly
            const crowdIndicators = document.querySelectorAll('.crowd-level-low, .crowd-level-medium, .crowd-level-high');
            crowdIndicators.forEach(indicator => {
                const levels = ['crowd-level-low', 'crowd-level-medium', 'crowd-level-high'];
                const currentLevel = levels.find(level => indicator.classList.contains(level));
                if (currentLevel) {
                    indicator.classList.remove(currentLevel);
                    const newLevel = levels[Math.floor(Math.random() * levels.length)];
                    indicator.classList.add(newLevel);
                }
            });
        }, 30000); // Update every 30 seconds
    }

    /**
     * Initialize India-specific animations
     */
    initializeIndiaAnimations() {
        // Animate India-specific elements
        if (typeof anime !== 'undefined') {
            // Animate metro lines
            anime({
                targets: '.metro-line',
                scaleX: [0, 1],
                duration: 1000,
                delay: anime.stagger(200, {start: 2000}),
                easing: 'easeOutExpo'
            });

            // Animate city cards
            anime({
                targets: '.city-card',
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(150, {start: 1000}),
                easing: 'easeOutExpo'
            });
        }
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            
            if (!mobileMenu.classList.contains('hidden')) {
                this.modules.animations.animateMobileMenu();
            }
        }
    }

    /**
     * Handle scroll effects
     */
    handleScroll() {
        const navbar = document.querySelector('nav');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg');
            } else {
                navbar.classList.remove('shadow-lg');
            }
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Reinitialize charts on resize
        if (this.modules.analytics) {
            this.modules.analytics.resizeCharts();
        }
        
        // Close mobile menu on large screens
        if (window.innerWidth > 768) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        }
    }

    /**
     * Handle page visibility changes
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Refresh animations when page becomes visible
            this.modules.animations.refreshAnimations();
        }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Initialize Splitting.js
        if (typeof Splitting !== 'undefined') {
            Splitting();
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 3000) {
        this.modules.notifications.show(message, type, duration);
    }

    /**
     * Update application state
     */
    updateState(updates) {
        this.state = { ...this.state, ...updates };
        this.emitStateChange();
    }

    /**
     * Emit state change event
     */
    emitStateChange() {
        const event = new CustomEvent('transitrate:statechange', {
            detail: this.state
        });
        document.dispatchEvent(event);
    }
}

/**
 * Animation Module
 */
class AnimationModule {
    constructor(app) {
        this.app = app;
        this.initialized = false;
    }

    /**
     * Initialize hero animations
     */
    initializeHeroAnimations() {
        // Animate hero text
        anime({
            targets: '[data-splitting] .char',
            translateY: [100, 0],
            opacity: [0, 1],
            easing: this.app.config.easing,
            duration: this.app.config.animationDuration,
            delay: anime.stagger(30)
        });

        // Animate rating card
        anime({
            targets: '.rating-card',
            translateY: [50, 0],
            opacity: [0, 1],
            easing: this.app.config.easing,
            duration: 1000,
            delay: 800
        });

        // Animate feature cards
        anime({
            targets: '.text-center.p-8',
            translateY: [30, 0],
            opacity: [0, 1],
            easing: this.app.config.easing,
            duration: 800,
            delay: anime.stagger(200, {start: 1200})
        });
    }

    /**
     * Initialize counter animations
     */
    initializeCounters() {
        const counters = document.querySelectorAll('.animate-counter');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Animate individual counter
     */
    animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target % 1 === 0) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = current.toFixed(1);
            }
        }, 16);
    }

    /**
     * Animate mobile menu
     */
    animateMobileMenu() {
        anime({
            targets: '#mobile-menu a',
            translateX: [-20, 0],
            opacity: [0, 1],
            easing: this.app.config.easing,
            duration: 300,
            delay: anime.stagger(50)
        });
    }

    /**
     * Refresh animations
     */
    refreshAnimations() {
        // Reinitialize animations when page becomes visible
        this.initializeHeroAnimations();
    }
}

/**
 * Rating Module
 */
class RatingModule {
    constructor(app) {
        this.app = app;
        this.currentRating = 0;
    }

    /**
     * Initialize quick rating system
     */
    initializeQuickRating() {
        const stars = document.querySelectorAll('.star-rating');
        const ratingText = document.getElementById('rating-text');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.setRating(rating);
            });
            
            star.addEventListener('mouseenter', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.highlightStars(rating);
            });
        });
        
        // Reset on mouse leave
        const ratingContainer = document.getElementById('overall-rating');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', () => {
                this.highlightStars(this.currentRating);
            });
        }
    }

    /**
     * Initialize detailed rating system
     */
    initializeDetailedRating() {
        const ratingContainers = ['overall-rating', 'punctuality-rating', 'cleanliness-rating', 'driver-rating', 'comfort-rating'];
        
        ratingContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const stars = container.querySelectorAll('.star-rating');
            
            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    const rating = parseInt(e.target.dataset.rating);
                    const ratingType = containerId.replace('-rating', '');
                    
                    this.app.state.ratings[ratingType] = rating;
                    this.updateRatingDisplay(containerId, rating);
                    this.animateRatingSelection(containerId);
                });
                
                star.addEventListener('mouseenter', (e) => {
                    const rating = parseInt(e.target.dataset.rating);
                    this.highlightStars(containerId, rating);
                });
            });
            
            container.addEventListener('mouseleave', () => {
                const ratingType = containerId.replace('-rating', '');
                this.updateRatingDisplay(containerId, this.app.state.ratings[ratingType]);
            });
        });
    }

    /**
     * Set rating
     */
    setRating(rating) {
        this.currentRating = rating;
        this.highlightStars(rating);
        
        const ratingTexts = {
            1: 'Poor - Needs significant improvement',
            2: 'Fair - Below average experience',
            3: 'Good - Average service',
            4: 'Very Good - Above average',
            5: 'Excellent - Outstanding service'
        };
        
        const ratingText = document.getElementById('rating-text');
        if (ratingText) {
            ratingText.textContent = ratingTexts[rating];
        }
        
        // Animate rating confirmation
        anime({
            targets: '#overall-rating',
            scale: [1, 1.1, 1],
            duration: 400,
            easing: 'easeOutElastic(1, .8)'
        });
    }

    /**
     * Highlight stars
     */
    highlightStars(containerId, rating) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stars = container.querySelectorAll('.star-rating');
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('empty');
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
                star.classList.add('empty');
            }
        });
    }

    /**
     * Update rating display
     */
    updateRatingDisplay(containerId, rating) {
        this.highlightStars(containerId, rating);
    }

    /**
     * Animate rating selection
     */
    animateRatingSelection(containerId) {
        anime({
            targets: `#${containerId}`,
            scale: [1, 1.05, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });
    }
}

/**
 * Analytics Module
 */
class AnalyticsModule {
    constructor(app) {
        this.app = app;
        this.charts = {};
    }

    /**
     * Initialize charts
     */
    initializeCharts() {
        this.initializeRatingTrendsChart();
        this.initializeRatingDistributionChart();
        this.initializeRouteComparisonChart();
        this.initializeReviewVolumeChart();
    }

    /**
     * Initialize rating trends chart
     */
    initializeRatingTrendsChart() {
        const chartElement = document.getElementById('rating-trends-chart');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['Overall Rating', 'Punctuality', 'Cleanliness', 'Comfort']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 5
            },
            series: [
                {
                    name: 'Overall Rating',
                    type: 'line',
                    data: [3.8, 3.9, 4.0, 4.1, 4.2, 4.2],
                    smooth: true,
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: 'Punctuality',
                    type: 'line',
                    data: [3.5, 3.7, 3.8, 3.9, 4.0, 4.1],
                    smooth: true,
                    itemStyle: { color: '#06b6d4' }
                },
                {
                    name: 'Cleanliness',
                    type: 'line',
                    data: [4.0, 4.1, 4.0, 4.2, 4.3, 4.2],
                    smooth: true,
                    itemStyle: { color: '#10b981' }
                },
                {
                    name: 'Comfort',
                    type: 'line',
                    data: [3.9, 4.0, 4.1, 4.0, 4.1, 4.2],
                    smooth: true,
                    itemStyle: { color: '#8b5cf6' }
                }
            ]
        };
        
        chart.setOption(option);
        this.charts.ratingTrends = chart;
    }

    /**
     * Initialize rating distribution chart
     */
    initializeRatingDistributionChart() {
        const chartElement = document.getElementById('rating-distribution-chart');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star']
            },
            series: [
                {
                    name: 'Rating Distribution',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 3542, name: '5 Stars', itemStyle: { color: '#10b981' } },
                        { value: 3127, name: '4 Stars', itemStyle: { color: '#3b82f6' } },
                        { value: 1563, name: '3 Stars', itemStyle: { color: '#f59e0b' } },
                        { value: 521, name: '2 Stars', itemStyle: { color: '#ef4444' } },
                        { value: 179, name: '1 Star', itemStyle: { color: '#dc2626' } }
                    ]
                }
            ]
        };
        
        chart.setOption(option);
        this.charts.ratingDistribution = chart;
    }

    /**
     * Initialize route comparison chart
     */
    initializeRouteComparisonChart() {
        const chartElement = document.getElementById('route-comparison-chart');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Overall', 'Punctuality', 'Cleanliness', 'Comfort', 'Driver']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Route 15', 'Route 23', 'Route 7', 'Route 42', 'Route 11']
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 5
            },
            series: [
                {
                    name: 'Overall',
                    type: 'bar',
                    data: [4.5, 4.2, 3.8, 4.7, 4.1],
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: 'Punctuality',
                    type: 'bar',
                    data: [4.3, 4.0, 3.5, 4.6, 3.9],
                    itemStyle: { color: '#06b6d4' }
                },
                {
                    name: 'Cleanliness',
                    type: 'bar',
                    data: [4.6, 4.3, 4.0, 4.8, 4.2],
                    itemStyle: { color: '#10b981' }
                },
                {
                    name: 'Comfort',
                    type: 'bar',
                    data: [4.4, 4.1, 3.9, 4.5, 4.0],
                    itemStyle: { color: '#8b5cf6' }
                },
                {
                    name: 'Driver',
                    type: 'bar',
                    data: [4.7, 4.4, 4.1, 4.9, 4.3],
                    itemStyle: { color: '#f59e0b' }
                }
            ]
        };
        
        chart.setOption(option);
        this.charts.routeComparison = chart;
    }

    /**
     * Initialize review volume chart
     */
    initializeReviewVolumeChart() {
        const chartElement = document.getElementById('review-volume-chart');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Reviews',
                    type: 'bar',
                    data: [1200, 1350, 1180, 1420, 1650, 1532],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#3b82f6' },
                            { offset: 1, color: '#1d4ed8' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#60a5fa' },
                                { offset: 1, color: '#3b82f6' }
                            ])
                        }
                    }
                }
            ]
        };
        
        chart.setOption(option);
        this.charts.reviewVolume = chart;
    }

    /**
     * Resize charts
     */
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
}

/**
 * Form Module
 */
class FormModule {
    constructor(app) {
        this.app = app;
        this.currentStep = 1;
        this.maxSteps = 4;
    }

    /**
     * Initialize multi-step form
     */
    initializeMultiStepForm() {
        this.updateStepDisplay();
        this.updateProgressBar();
    }

    /**
     * Initialize file upload
     */
    initializeFileUpload() {
        const fileUploadArea = document.getElementById('file-upload');
        const photoInput = document.getElementById('photo-input');
        
        if (!fileUploadArea || !photoInput) return;
        
        fileUploadArea.addEventListener('click', () => photoInput.click());
        
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });
        
        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        photoInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    /**
     * Initialize form validation
     */
    initializeFormValidation() {
        const reviewContent = document.getElementById('review-content');
        const wordCounter = document.getElementById('word-counter');
        const qualityIndicator = document.getElementById('quality-indicator');
        
        if (!reviewContent || !wordCounter || !qualityIndicator) return;
        
        reviewContent.addEventListener('input', () => {
            const wordCount = reviewContent.value.length;
            wordCounter.textContent = wordCount;
            
            // Update quality indicator
            qualityIndicator.className = 'quality-indicator text-xs px-3 py-1 rounded-full ';
            
            if (wordCount < 50) {
                qualityIndicator.className += 'poor';
                qualityIndicator.textContent = 'Needs more detail';
            } else if (wordCount < 100) {
                qualityIndicator.className += 'fair';
                qualityIndicator.textContent = 'Fair detail';
            } else if (wordCount < 200) {
                qualityIndicator.className += 'good';
                qualityIndicator.textContent = 'Good detail';
            } else {
                qualityIndicator.className += 'excellent';
                qualityIndicator.textContent = 'Excellent detail';
            }
        });
    }

    /**
     * Handle file uploads
     */
    handleFiles(files) {
        const photoPreview = document.getElementById('photo-preview');
        if (!photoPreview) return;
        
        const maxFiles = this.app.config.maxFiles;
        const validFiles = Array.from(files).slice(0, maxFiles);
        
        photoPreview.innerHTML = '';
        
        if (validFiles.length > 0) {
            photoPreview.classList.remove('hidden');
            
            validFiles.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const photoDiv = document.createElement('div');
                        photoDiv.className = 'relative';
                        photoDiv.innerHTML = `
                            <img src="${e.target.result}" alt="Photo ${index + 1}" class="w-full h-24 object-cover rounded-lg">
                            <button type="button" class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700" onclick="this.parentElement.remove()">
                                ×
                            </button>
                        `;
                        photoPreview.appendChild(photoDiv);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    /**
     * Update step display
     */
    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNumber = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                indicator.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                indicator.classList.add('active');
            }
        });
        
        // Update step description
        const descriptions = {
            1: 'Route Selection & Verification',
            2: 'Detailed Ratings',
            3: 'Written Review',
            4: 'Review & Submit'
        };
        
        const stepDescription = document.getElementById('step-description');
        if (stepDescription) {
            stepDescription.textContent = descriptions[this.currentStep];
        }
        
        // Animate step transition
        anime({
            targets: '.form-step.active',
            translateX: [30, 0],
            opacity: [0, 1],
            duration: 500,
            easing: this.app.config.easing
        });
    }

    /**
     * Update progress bar
     */
    updateProgressBar() {
        const progress = (this.currentStep / this.maxSteps) * 100;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    /**
     * Next step
     */
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateProgressBar();
                
                if (this.currentStep === this.maxSteps) {
                    this.populatePreview();
                }
            }
        }
    }

    /**
     * Previous step
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgressBar();
        }
    }

    /**
     * Validate current step
     */
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            case 3:
                return this.validateStep3();
            default:
                return true;
        }
    }

    /**
     * Validate step 1
     */
    validateStep1() {
        const routeSelect = document.getElementById('route-select');
        const travelDate = document.getElementById('travel-date');
        
        if (!routeSelect || !routeSelect.value) {
            this.app.showNotification('Please select a route', 'warning');
            return false;
        }
        
        if (!travelDate || !travelDate.value) {
            this.app.showNotification('Please select your travel date', 'warning');
            return false;
        }
        
        // Check if date is not in future
        const selectedDate = new Date(travelDate.value);
        const today = new Date();
        if (selectedDate > today) {
            this.app.showNotification('Travel date cannot be in the future', 'warning');
            return false;
        }
        
        return true;
    }

    /**
     * Validate step 2
     */
    validateStep2() {
        if (this.app.state.ratings.overall === 0) {
            this.app.showNotification('Please provide an overall rating', 'warning');
            return false;
        }
        return true;
    }

    /**
     * Validate step 3
     */
    validateStep3() {
        const reviewContent = document.getElementById('review-content');
        if (!reviewContent || reviewContent.value.length < this.app.config.minReviewLength) {
            this.app.showNotification(`Please write at least ${this.app.config.minReviewLength} characters`, 'warning');
            return false;
        }
        return true;
    }

    /**
     * Populate preview
     */
    populatePreview() {
        // Route information
        const routeSelect = document.getElementById('route-select');
        const travelDate = document.getElementById('travel-date');
        const travelTime = document.getElementById('travel-time');
        
        if (routeSelect) {
            const previewRoute = document.getElementById('preview-route');
            if (previewRoute) {
                previewRoute.textContent = routeSelect.options[routeSelect.selectedIndex].text;
            }
        }
        
        if (travelDate) {
            const previewDate = document.getElementById('preview-date');
            if (previewDate) {
                previewDate.textContent = new Date(travelDate.value).toLocaleDateString();
            }
        }
        
        if (travelTime) {
            const previewTime = document.getElementById('preview-time');
            if (previewTime) {
                previewTime.textContent = travelTime.options[travelTime.selectedIndex].text || 'Not specified';
            }
        }
        
        // Ratings
        const ratings = this.app.state.ratings;
        const ratingElements = {
            'preview-overall': `${ratings.overall}/5 stars`,
            'preview-punctuality': `${ratings.punctuality || 'Not rated'}/5`,
            'preview-cleanliness': `${ratings.cleanliness || 'Not rated'}/5`,
            'preview-driver': `${ratings.driver || 'Not rated'}/5`,
            'preview-comfort': `${ratings.comfort || 'Not rated'}/5`
        };
        
        Object.entries(ratingElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Review content
        const reviewContent = document.getElementById('review-content');
        const previewContent = document.getElementById('preview-content');
        if (reviewContent && previewContent) {
            previewContent.textContent = reviewContent.value;
        }
    }
}

/**
 * Notification Module
 */
class NotificationModule {
    constructor(app) {
        this.app = app;
    }

    /**
     * Show notification
     */
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transform translate-x-full transition-transform duration-300`;
        
        const colors = {
            success: 'bg-green-500',
            warning: 'bg-yellow-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };
        
        notification.classList.add(colors[type]);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
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
}

/**
 * Storage Module
 */
class StorageModule {
    constructor(app) {
        this.app = app;
        this.prefix = 'transitrate_';
    }

    /**
     * Set item in storage
     */
    set(key, value) {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, data);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    /**
     * Get item from storage
     */
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    }

    /**
     * Remove item from storage
     */
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    /**
     * Clear all storage
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }
}

/**
 * Utils Module
 */
class UtilsModule {
    constructor(app) {
        this.app = app;
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
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

    /**
     * Format date
     */
    formatDate(date, format = 'short') {
        const d = new Date(date);
        const options = format === 'short' 
            ? { year: 'numeric', month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        
        return d.toLocaleDateString('en-US', options);
    }

    /**
     * Format number
     */
    formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    /**
     * Generate random ID
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate file
     */
    validateFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const isValidType = validTypes.includes(file.type);
        const isValidSize = file.size <= this.app.config.maxFileSize;
        
        return {
            valid: isValidType && isValidSize,
            typeError: !isValidType,
            sizeError: !isValidSize
        };
    }
}

// Initialize TransitRate when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.TransitRateApp = new TransitRate();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitRate;
}