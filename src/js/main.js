/**
 * Hope & Harmony NGO — Main JS
 * Optimised: No Lenis, no heavy parallax — fast native scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    initNavbar();
    initHamburger();
    initLoginDropdown();
    initHorizonHero();
    initHorizontalScroll();
    initScrollReveal();
    initCounters();
    initMagneticButtons();
    initCalculator();
    initPremiumForm();
    initTestimonialSlider();
    initFilterButtons();
    initTooltips();
    initImageFallbacks();
});

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
    const header = document.querySelector('.header-standard');
    const links = document.querySelectorAll('.standard-links a');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPage) link.classList.add('active');
    });
}

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobileNavOverlay');
    const header = document.querySelector('.header-standard');
    if (!hamburger || !overlay) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        overlay.classList.toggle('open');
        if (header) {
            header.classList.toggle('mobile-menu-active', hamburger.classList.contains('open'));
        }
        document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });

    overlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            overlay.classList.remove('open');
            if (header) {
                header.classList.remove('mobile-menu-active');
            }
            document.body.style.overflow = '';
        });
    });
}

/* ============================================================
   HORIZON HERO — lightweight entrance (no mousemove parallax)
   ============================================================ */
function initHorizonHero() {
    const leftSide = document.querySelector('.hero-side.left');
    const rightSide = document.querySelector('.hero-side.right');
    if (!leftSide || !rightSide) return;

    if (typeof gsap === 'undefined') return;

    const eyebrow = document.querySelector('.hero-eyebrow');
    const title = document.querySelector('.hero-content-immersive h1');
    const subtitle = document.querySelector('.hero-content-immersive p');
    const ctas = document.querySelector('.hero-cta-group');
    const scrollInd = document.querySelector('.scroll-down-indicator');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to([leftSide, rightSide], { x: 0, duration: 1.4, delay: 0.2 })
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to(title, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
        .to(subtitle, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to(ctas, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to(scrollInd, { opacity: 1, duration: 0.5 }, '-=0.3');
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver only (no GSAP overhead)
   ============================================================ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('active');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
    const counters = document.querySelectorAll('.count-value');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.getAttribute('data-target');
            if (!target) return;

            if (typeof gsap !== 'undefined') {
                gsap.to(el, {
                    innerText: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate() {
                        el.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString() + '+';
                    }
                });
            } else {
                // Fallback: simple counter
                let start = 0;
                const duration = 1800;
                const step = target / (duration / 16);
                const timer = setInterval(() => {
                    start = Math.min(start + step, target);
                    el.innerText = Math.ceil(start).toLocaleString() + '+';
                    if (start >= target) clearInterval(timer);
                }, 16);
            }
            observer.unobserve(el);
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

/* ============================================================
   MAGNETIC BUTTONS — desktop only, no tilt
   ============================================================ */
function initMagneticButtons() {
    // Skip on touch devices to prevent input lag
    if ('ontouchstart' in window) return;
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
            gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
        }, { passive: true });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
        });
    });
}

/* ============================================================
   IMPACT CALCULATOR
   ============================================================ */
function initCalculator() {
    const input = document.getElementById('donationInput');
    const slider = document.getElementById('donationSlider');
    if (!input || !slider) return;

    const mealsEl = document.getElementById('resMeals');
    const booksEl = document.getElementById('resBooks');
    const medsEl = document.getElementById('resMeds');

    const update = (val) => {
        if (mealsEl) mealsEl.textContent = Math.floor(val * 2);
        if (booksEl) booksEl.textContent = Math.floor(val * 0.1);
        if (medsEl) medsEl.textContent = Math.floor(val * 0.04);
    };

    input.addEventListener('input', (e) => { slider.value = e.target.value; update(e.target.value); });
    slider.addEventListener('input', (e) => { input.value = e.target.value; update(e.target.value); });
}

/* ============================================================
   PREMIUM FORM VALIDATION & SUBMISSION
   ============================================================ */
function initPremiumForm() {
    const forms = document.querySelectorAll('form[novalidate], #contactFormHome, #contactForm, .glass-form');
    forms.forEach(form => {
        if (!form) return;
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        const textEl = btn.querySelector('.btn-text');
        const originalText = textEl ? textEl.innerText : btn.innerText;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            form.querySelectorAll('[required]').forEach(field => {
                const group = field.closest('.form-group-v2') || field.closest('.form-group');
                if (!field.value.trim()) {
                    valid = false;
                    if (group) group.classList.add('error');
                } else {
                    if (group) group.classList.remove('error');
                }
                if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    valid = false;
                    if (group) group.classList.add('error');
                }
            });

            if (!valid) return;

            const loaderEl = btn.querySelector('.btn-loader');
            if (textEl) textEl.innerText = 'Sending...';
            if (loaderEl) loaderEl.style.display = 'inline-block';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                if (textEl) textEl.innerText = 'Message Sent ✓';
                if (loaderEl) loaderEl.style.display = 'none';
                btn.style.background = '#059669';
                form.reset();

                setTimeout(() => {
                    if (textEl) textEl.innerText = originalText;
                    btn.style.background = '';
                    btn.style.pointerEvents = 'all';
                }, 3000);
            }, 1500);
        });

        // Live validation clear
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('input', () => {
                const group = field.closest('.form-group-v2') || field.closest('.form-group');
                if (field.value.trim() && group) group.classList.remove('error');
            });
        });
    });
}

/* ============================================================
   TESTIMONIAL SLIDER
   ============================================================ */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slider .slide');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const progress = document.querySelector('.progress');
    const sliderContainer = document.querySelector('.testimonial-slider');
    if (!slides.length) return;

    let current = 0;
    const total = slides.length;

    const showSlide = (idx) => {
        slides[current].classList.remove('active');
        current = (idx + total) % total;
        slides[current].classList.add('active');
        if (progress) progress.style.width = `${((current + 1) / total) * 100}%`;
    };

    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));

    // Keyboard navigation
    if (sliderContainer) {
        sliderContainer.setAttribute('tabindex', '0');
        sliderContainer.setAttribute('aria-label', 'Testimonial slider');
        sliderContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') showSlide(current - 1);
            if (e.key === 'ArrowRight') showSlide(current + 1);
        });
    }

    // Auto-advance
    let autoInterval = setInterval(() => showSlide(current + 1), 6000);

    // Pause on hover
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoInterval));
        sliderContainer.addEventListener('mouseleave', () => {
            clearInterval(autoInterval);
            autoInterval = setInterval(() => showSlide(current + 1), 6000);
        });
    }
}

/* ============================================================
   FILTER BUTTONS
   ============================================================ */
function initFilterButtons() {
    document.querySelectorAll('.filter-bar').forEach(bar => {
        const btns = bar.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });
}

/* ============================================================
   LOGIN DROPDOWN
   ============================================================ */
function initLoginDropdown() {
    const btn = document.getElementById('loginIconBtn');
    const dropdown = document.getElementById('loginDropdown');
    const wrap = document.getElementById('loginDropWrap');
    if (!btn || !dropdown) return;

    const open = () => { dropdown.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const close = () => { dropdown.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    const toggle = () => dropdown.classList.contains('open') ? close() : open();

    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

    document.addEventListener('click', (e) => { if (wrap && !wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const links = dropdown.querySelectorAll('a');
    if (links.length) {
        links[links.length - 1].addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) close();
        });
    }
}

/* ============================================================
   HORIZONTAL SCROLL PROJECTS
   ============================================================ */
function initHorizontalScroll() {
    const container = document.querySelector('.horizontal-scroll-container');
    const inner = document.querySelector('.horizontal-inner');
    if (!container || !inner) return;

    // Only on desktop (min-width 992px)
    if (window.innerWidth < 992) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const scrollTween = gsap.to(inner, {
        x: () => -(inner.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${inner.scrollWidth}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1
        }
    });

    // Native Auto-Scroll logic
    let isHovered = false;
    let autoScrollActive = false;
    let scrollSpeed = 0.6; // pixels per frame (slower/subtle)

    function autoScroll() {
        if (!autoScrollActive || isHovered) return;

        const trigger = scrollTween.scrollTrigger;
        if (!trigger) return;

        const start = trigger.start;
        const end = trigger.end;
        const current = window.scrollY;

        if (current >= start && current < end - 4) {
            window.scrollTo(0, current + scrollSpeed);
            requestAnimationFrame(autoScroll);
        } else if (current >= end - 4) {
            // Loop back to start smoothly after a small delay
            autoScrollActive = false;
            setTimeout(() => {
                let steps = 60;
                let currentStep = 0;
                const startScroll = window.scrollY;
                const scrollDiff = start - startScroll;

                function easeInOutQuad(t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                }

                function animateBack() {
                    if (isHovered) {
                        autoScrollActive = true;
                        return;
                    }
                    currentStep++;
                    const progress = currentStep / steps;
                    const easeVal = easeInOutQuad(progress);
                    window.scrollTo(0, startScroll + scrollDiff * easeVal);

                    if (currentStep < steps) {
                        requestAnimationFrame(animateBack);
                    } else {
                        // Small delay at start before scrolling again
                        setTimeout(() => {
                            autoScrollActive = true;
                            autoScroll();
                        }, 1000);
                    }
                }
                animateBack();
            }, 2500);
        } else {
            requestAnimationFrame(autoScroll);
        }
    }

    // Trigger auto scroll when section enters viewport
    ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        onToggle: self => {
            if (self.isActive) {
                autoScrollActive = true;
                autoScroll();
            } else {
                autoScrollActive = false;
            }
        }
    });

    container.addEventListener('mouseenter', () => {
        isHovered = true;
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
        isHovered = false;
        if (autoScrollActive) {
            autoScroll();
        }
    }, { passive: true });
}

/* ============================================================
   TOOLTIPS (map pins)
   ============================================================ */
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.setAttribute('title', el.getAttribute('data-tooltip'));
    });
}

/* ============================================================
   IMAGE FALLBACKS
   ============================================================ */
function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalHeight === 0) {
            handleImageError(img);
        }
        img.addEventListener('error', () => {
            handleImageError(img);
        });
    });
}

function handleImageError(img) {
    if (img.classList.contains('img-fallback-active')) return;
    img.classList.add('img-fallback-active');
    
    const altText = (img.getAttribute('alt') || '').toLowerCase();
    
    if (altText.includes('water')) {
        img.src = 'https://images.unsplash.com/photo-1548932813-71ede393952d?q=80&w=600&auto=format&fit=crop';
    } else if (altText.includes('education') || altText.includes('school') || altText.includes('class') || altText.includes('learning')) {
        img.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop';
    } else if (altText.includes('climate') || altText.includes('earth') || altText.includes('green') || altText.includes('forest') || altText.includes('nature')) {
        img.src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop';
    } else if (altText.includes('healthcare') || altText.includes('medical') || altText.includes('vaccine') || altText.includes('clinic') || altText.includes('wellness')) {
        img.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop';
    } else if (altText.includes('empower') || altText.includes('women') || altText.includes('skills') || altText.includes('team') || altText.includes('community')) {
        img.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop';
    } else if (altText.includes('food') || altText.includes('farm') || altText.includes('feed') || altText.includes('hungry')) {
        img.src = 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=600&auto=format&fit=crop';
    } else if (altText.includes('avatar') || altText.includes('sarah') || altText.includes('james') || altText.includes('founder') || img.classList.contains('avatar')) {
        img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
    } else {
        img.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop';
    }
}
