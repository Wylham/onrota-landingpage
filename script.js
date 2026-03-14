/* ══════════════════════════════════════════════
   ONROTA — script.js
   Navbar scroll, FAQ accordion, mobile menu,
   smooth scroll + hash routing, active nav,
   fade-in animations, stats counter
   ══════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── NAVBAR — scrolled border ───────────────── */
    const navbar = document.getElementById('navbar');

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── MOBILE MENU ────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    /* ── SMOOTH SCROLL + HASH ROUTING ───────────── */
    function scrollToId(id, pushState) {
        const target = document.getElementById(id);
        if (!target) return;

        const navH  = navbar.offsetHeight;
        const vH    = window.innerHeight - navH; // available viewport below navbar

        // Use the inner .container as the scroll anchor to skip section padding
        const inner = target.querySelector(':scope > .container') || target;
        const innerTop = inner.getBoundingClientRect().top + window.scrollY;
        const innerH   = inner.offsetHeight;

        // Center the content when it fits; align to top with breathing room when taller
        const gap = innerH <= vH
            ? Math.floor((vH - innerH) / 2)  // center vertically
            : 24;                              // small top breathing room

        const top = Math.max(0, innerTop - navH - gap);

        window.scrollTo({ top, behavior: 'smooth' });

        if (pushState) {
            history.pushState(null, '', '#' + id);
        }
    }

    /* ── ACTIVE NAV LINK ────────────────────────── */
    const allNavLinks = document.querySelectorAll('.navbar-link, .navbar-cta');

    function setActiveNav(id) {
        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    }

    function clearActiveNav() {
        allNavLinks.forEach(link => link.classList.remove('active'));
    }

    // Intercept all same-page anchor clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');

            // Logo or bare # → clear active and go to top
            if (href === '#') {
                clearActiveNav();
                history.pushState(null, '', location.pathname);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                e.preventDefault();
                closeMenu();
                return;
            }

            const id = href.slice(1);
            if (!document.getElementById(id)) return;

            e.preventDefault();
            closeMenu();
            scrollToId(id, true);
            setActiveNav(id);
        });
    });

    // Restore active state for hash already in the URL on page load
    window.addEventListener('load', () => {
        if (location.hash) {
            const id = location.hash.slice(1);
            setTimeout(() => {
                scrollToId(id, false);
                setActiveNav(id);
            }, 80);
        }
    });

    // React to browser back / forward navigation
    window.addEventListener('hashchange', () => {
        if (location.hash) {
            const id = location.hash.slice(1);
            scrollToId(id, false);
            setActiveNav(id);
        } else {
            clearActiveNav();
        }
    });

    /* ── FAQ ACCORDION ──────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ── FADE-IN ON SCROLL ──────────────────────── */
    const style = document.createElement('style');
    style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    const animatables = document.querySelectorAll(
        '.feature-card, .service-card, .testimonial-card, .stat-item, ' +
        '.whyus-card, .about-img, .faq-item, .hero-content'
    );

    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatables.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.55s ease ${i * 0.05}s, transform 0.55s ease ${i * 0.05}s`;
        fadeObserver.observe(el);
    });

    /* ── STATS COUNTER ──────────────────────────── */
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const plusEl = el.querySelector('.stat-plus');
            const suffix = plusEl ? plusEl.textContent : '';
            const rawText = el.textContent.replace(suffix, '').trim();
            const targetVal = parseFloat(rawText);

            if (isNaN(targetVal)) return;

            counterObserver.unobserve(el);

            const duration = 1400;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(targetVal * eased);

                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) node.textContent = current;
                });

                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

})();
