document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation Menu ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Hero Slider/Carousel & Design Comparison Switcher ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.arrow-prev');
    const nextBtn = document.querySelector('.arrow-next');
    const toggleBtns = document.querySelectorAll('.design-toggle-btns .toggle-btn');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        let isSlideshowMode = true; // Default to slideshow mode

        const showSlide = (n) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        };

        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };

        const startSlideShow = () => {
            if (isSlideshowMode) {
                slideInterval = setInterval(nextSlide, 8000); // Super-relaxed, premium 8-second slow interval
            }
        };

        const stopSlideShow = () => {
            clearInterval(slideInterval);
        };

        const resetSlideShow = () => {
            stopSlideShow();
            startSlideShow();
        };

        // Arrow navigation
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (isSlideshowMode) {
                    nextSlide();
                    resetSlideShow();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (isSlideshowMode) {
                    prevSlide();
                    resetSlideShow();
                }
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (isSlideshowMode) {
                    showSlide(index);
                    resetSlideShow();
                }
            });
        });

        // Initialize slideshow
        showSlide(0);
        startSlideShow();

        // Handle Design Toggle Buttons (Interactive UX comparison)
        if (toggleBtns.length > 0) {
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    toggleBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const mode = btn.getAttribute('data-mode');
                    if (mode === 'static') {
                        // Switch to Single Static Image Mode
                        isSlideshowMode = false;
                        stopSlideShow();
                        showSlide(0); // Lock to Slide 1 (Roro - male partner)
                        
                        // Hide dots and arrows smoothly
                        if (prevBtn) prevBtn.style.display = 'none';
                        if (nextBtn) nextBtn.style.display = 'none';
                        if (sliderDotsContainer) sliderDotsContainer.style.opacity = '0';
                    } else {
                        // Switch to Elegant 4-Slide Slider Mode
                        isSlideshowMode = true;
                        
                        // Show dots and arrows smoothly
                        if (prevBtn) prevBtn.style.display = 'flex';
                        if (nextBtn) nextBtn.style.display = 'flex';
                        if (sliderDotsContainer) sliderDotsContainer.style.opacity = '1';
                        
                        resetSlideShow();
                    }
                });
            });
        }
    }

    // --- Filter Mechanism (Visa & Job Pages) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const itemCards = document.querySelectorAll('.item-card');

    if (filterButtons.length > 0 && itemCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set active class
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                itemCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        // Subtle fading animation
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Sliding Details Drawer (Visa & Job Details) ---
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawer-close');

    // Drawer content DOM nodes
    const dBadge = document.getElementById('drawer-badge');
    const dTitle = document.getElementById('drawer-title');
    const dImg = document.getElementById('drawer-img');
    const dAbout = document.getElementById('drawer-about');
    const dEligibility = document.getElementById('drawer-eligibility');
    const dRequired = document.getElementById('drawer-required');

    if (itemCards.length > 0 && drawer && drawerBackdrop) {
        // Add click listener to all cards
        itemCards.forEach(card => {
            card.addEventListener('click', () => {
                // Pull data attributes from clicked card
                const category = card.getAttribute('data-category-name') || '';
                const title = card.querySelector('h3').innerText;
                const imgSrc = card.querySelector('.item-img-container img').src;
                
                // Detailed data parsing
                const detailsStr = card.getAttribute('data-details');
                let details = { about: '', eligibility: [], required: [] };
                
                if (detailsStr) {
                    try {
                        details = JSON.parse(detailsStr);
                    } catch(e) {
                        console.error("Error parsing details JSON:", e);
                    }
                }

                // Populate drawer elements
                if (dBadge) dBadge.innerText = category;
                if (dTitle) dTitle.innerText = title;
                if (dImg) dImg.src = imgSrc;
                if (dAbout) dAbout.innerText = details.about || '상세 정보가 준비 중입니다.';
                
                // Handle eligibility list
                if (dEligibility) {
                    dEligibility.innerHTML = '';
                    if (details.eligibility && details.eligibility.length > 0) {
                        details.eligibility.forEach(item => {
                            const li = document.createElement('li');
                            li.innerText = item;
                            dEligibility.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.innerText = '상담을 통해 확인하세요.';
                        dEligibility.appendChild(li);
                    }
                }

                // Handle required documents list
                if (dRequired) {
                    dRequired.innerHTML = '';
                    if (details.required && details.required.length > 0) {
                        details.required.forEach(item => {
                            const li = document.createElement('li');
                            li.innerText = item;
                            dRequired.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.innerText = '준비 서류는 상황에 따라 다를 수 있으며, 정밀 상담 시 개별 안내됩니다.';
                        dRequired.appendChild(li);
                    }
                }

                // Open Drawer
                drawerBackdrop.classList.add('active');
                drawer.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent body scroll
            });
        });

        // Close Drawer Handlers
        const closeDrawer = () => {
            drawerBackdrop.classList.remove('active');
            drawer.classList.remove('active');
            document.body.style.overflow = ''; // restore scroll
        };

        if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
        if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
    }
});
