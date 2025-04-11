import Swiper from 'swiper';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper with enhanced options
    const featuredSwiper = new Swiper('.featured-slider', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        loopAdditionalSlides: 3,
        speed: 600,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 5,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 30
            }
        }
    });

    // Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Modal Functionality
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const closeBtns = document.querySelectorAll('.close-modal');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');

    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'block';
    });

    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });

    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Enhanced Card Animation with staggered effect
    function animateCards() {
        const cards = document.querySelectorAll('.movie-card');
        cards.forEach((card, index) => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(30px)';
            
            // Add shimmer effect class
            card.classList.add('shimmer-effect');
            
            // Use CSS transitions for smooth animation with staggered timing
            card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
            
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
                
                // Remove shimmer effect after animation is complete
                setTimeout(() => {
                    card.classList.remove('shimmer-effect');
                }, 1000);
            }, 100 + (index * 120));
        });
    }

    // Enhanced hover effects for movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(function(card) {
        const playBtn = card.querySelector('.play-btn');
        const poster = card.querySelector('.movie-poster-img');
        
        card.addEventListener('mouseenter', function() {
            poster.style.transform = 'scale(1.08)';
            playBtn.style.transform = 'scale(1.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            poster.style.transform = 'scale(1)';
            playBtn.style.transform = 'scale(1)';
        });
        
        playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openVideoPlayer(card.querySelector('h4').textContent);
        });
    });

    // Video player function
    function openVideoPlayer(title) {
        const videoModal = document.createElement('div');
        videoModal.className = 'video-modal modal';
        videoModal.innerHTML = `
            <div class="modal-content video-modal-content">
                <span class="close-modal">&times;</span>
                <h2>مشاهدة ${title}</h2>
                <div class="video-player">
                    <svg viewBox="0 0 640 360" width="100%" height="auto">
                        <rect width="640" height="360" fill="#000" />
                        <text x="320" y="180" font-size="20" text-anchor="middle" fill="white">
                            جاري تحميل الفيديو...
                        </text>
                        <circle cx="320" cy="180" r="30" fill="none" stroke="#e50914" stroke-width="4">
                            <animate attributeName="r" from="30" to="40" dur="1s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>
                <div class="video-controls">
                    <button class="control-btn play-pause"><i class="fas fa-play"></i></button>
                    <button class="control-btn volume"><i class="fas fa-volume-up"></i></button>
                    <div class="progress-bar">
                        <div class="progress"></div>
                    </div>
                    <button class="control-btn fullscreen"><i class="fas fa-expand"></i></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(videoModal);
        setTimeout(() => videoModal.style.display = 'block', 10);
        
        const closeBtn = videoModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            videoModal.style.display = 'none';
            setTimeout(() => videoModal.remove(), 300);
        });
        
        // Simulate video controls functionality
        setupVideoControls(videoModal);
    }

    // Setup video player controls
    function setupVideoControls(modal) {
        const playPauseBtn = modal.querySelector('.play-pause');
        const progress = modal.querySelector('.progress');
        const volumeBtn = modal.querySelector('.volume');
        const fullscreenBtn = modal.querySelector('.fullscreen');
        let isPlaying = false;
        let progressInterval;
        
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
            
            if (isPlaying) {
                progressInterval = setInterval(() => {
                    const width = parseFloat(progress.style.width || '0');
                    if (width < 100) {
                        progress.style.width = (width + 0.5) + '%';
                    } else {
                        clearInterval(progressInterval);
                        isPlaying = false;
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 100);
            } else {
                clearInterval(progressInterval);
            }
        });
        
        volumeBtn.addEventListener('click', () => {
            const isMuted = volumeBtn.innerHTML.includes('volume-mute');
            volumeBtn.innerHTML = isMuted ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        });
        
        fullscreenBtn.addEventListener('click', () => {
            const isFullscreen = fullscreenBtn.innerHTML.includes('compress');
            fullscreenBtn.innerHTML = isFullscreen ? '<i class="fas fa-expand"></i>' : '<i class="fas fa-compress"></i>';
        });
    }

    // Call animation on page load
    animateCards();

    // Animate cards when scrolling into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.movie-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = 0;
                        card.style.transform = 'translateY(30px)';
                        card.classList.add('shimmer-effect');
                        
                        setTimeout(() => {
                            card.style.opacity = 1;
                            card.style.transform = 'translateY(0)';
                            
                            setTimeout(() => {
                                card.classList.remove('shimmer-effect');
                            }, 1000);
                        }, 100 + (index * 120));
                    }, 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.category-section').forEach(section => {
        observer.observe(section);
    });

    // Form Submission Prevention
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('تم إرسال النموذج بنجاح!');
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    // Mobile Menu Toggle (for smaller screens)
    function setupMobileMenu() {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
            const nav = document.querySelector('nav');
            const navUl = nav.querySelector('ul');
            
            // Create mobile menu toggle button
            const mobileMenuToggle = document.createElement('button');
            mobileMenuToggle.classList.add('mobile-menu-toggle');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Insert before nav
            nav.parentNode.insertBefore(mobileMenuToggle, nav);
            
            // Initially hide the nav menu
            navUl.style.display = 'none';
            
            // Toggle menu on button click
            mobileMenuToggle.addEventListener('click', function() {
                if (navUl.style.display === 'none') {
                    navUl.style.display = 'flex';
                    mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    navUl.style.display = 'none';
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    }

    // Call this function on page load
    setupMobileMenu();

    // Reconsider mobile menu on window resize
    window.addEventListener('resize', function() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navUl = document.querySelector('nav ul');
        
        if (window.innerWidth > 768 && mobileMenuToggle) {
            // Remove mobile menu toggle and show nav
            mobileMenuToggle.remove();
            navUl.style.display = 'flex';
        } else if (window.innerWidth <= 768 && !mobileMenuToggle) {
            setupMobileMenu();
        }
    });
});