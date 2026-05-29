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
    if (!hamburger || !overlay) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });

    overlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            overlay.classList.remove('open');
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

    // Auto-advance
    setInterval(() => showSlide(current + 1), 6000);
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

    // Only on desktop (min-width 1024px or similar)
    if (window.innerWidth < 992) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const scrollWidth = inner.offsetWidth - window.innerWidth;

    gsap.to(inner, {
        x: () => -(inner.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${inner.scrollWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1
        }
    });
}

/* ============================================================
   TOOLTIPS (map pins)
   ============================================================ */
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.setAttribute('title', el.getAttribute('data-tooltip'));
    });
}
