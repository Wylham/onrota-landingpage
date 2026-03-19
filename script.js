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

        const navH = navbar.offsetHeight;
        const vH = window.innerHeight - navH; // available viewport below navbar

        // Use the inner .container as the scroll anchor to skip section padding
        const inner = target.querySelector(':scope > .container') || target;
        const innerTop = inner.getBoundingClientRect().top + window.scrollY;
        const innerH = inner.offsetHeight;

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
    /* LOGO MARQUEE */
    const logoMarquees = document.querySelectorAll('[data-logo-marquee]');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    logoMarquees.forEach(root => {
        const track = root.querySelector('.logo-marquee__track');
        if (!track) return;

        const sourceItems = Array.from(track.children).map(item => item.cloneNode(true));
        const sourceImages = Array.from(track.querySelectorAll('img'));

        if (!sourceItems.length) return;

        let frameId = 0;
        let resizeFrame = 0;
        let lastTime = 0;
        let offset = 0;
        let loopWidth = 0;
        let isHovering = false;

        function cloneItem(template, hidden) {
            const clone = template.cloneNode(true);

            if (hidden) {
                clone.setAttribute('aria-hidden', 'true');
            } else {
                clone.removeAttribute('aria-hidden');
            }

            return clone;
        }

        function buildTrack() {
            track.textContent = '';

            let sequenceCount = 0;
            let sequenceWidth = 0;

            do {
                sourceItems.forEach(template => {
                    track.appendChild(cloneItem(template, sequenceCount > 0));
                });

                sequenceCount += 1;
                sequenceWidth = track.scrollWidth;
            } while (sequenceWidth < root.offsetWidth + 120 && sequenceCount < 8);

            loopWidth = sequenceWidth;

            Array.from(track.children).forEach(item => {
                track.appendChild(cloneItem(item, true));
            });

            if (!reducedMotionQuery.matches && loopWidth > 0) {
                offset = offset % loopWidth;
                track.style.transform = `translate3d(-${offset}px, 0, 0)`;
                return;
            }

            offset = 0;
            track.style.transform = 'translate3d(0, 0, 0)';
        }

        function step(time) {
            if (!lastTime) lastTime = time;

            const delta = (time - lastTime) / 8000;
            lastTime = time;

            if (loopWidth > 0) {
                const speed = isHovering ? 28 : 70;
                offset = (offset + speed * delta) % loopWidth;
                track.style.transform = `translate3d(-${offset}px, 0, 0)`;
            }

            frameId = window.requestAnimationFrame(step);
        }

        function stop(resetPosition) {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
                frameId = 0;
            }

            lastTime = 0;

            if (resetPosition) {
                offset = 0;
                track.style.transform = 'translate3d(0, 0, 0)';
            }
        }

        function start() {
            if (frameId || reducedMotionQuery.matches) return;
            frameId = window.requestAnimationFrame(step);
        }

        function rebuild() {
            stop(reducedMotionQuery.matches);
            buildTrack();
            start();
        }

        function scheduleRebuild() {
            if (resizeFrame) window.cancelAnimationFrame(resizeFrame);

            resizeFrame = window.requestAnimationFrame(() => {
                resizeFrame = 0;
                rebuild();
            });
        }

        buildTrack();
        start();

        root.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        root.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        window.addEventListener('resize', scheduleRebuild, { passive: true });
        window.addEventListener('load', scheduleRebuild, { once: true });

        sourceImages.forEach(image => {
            if (!image.complete) {
                image.addEventListener('load', scheduleRebuild, { once: true });
            }
        });

        const handleReducedMotionChange = () => {
            rebuild();
        };

        if (typeof reducedMotionQuery.addEventListener === 'function') {
            reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
        } else if (typeof reducedMotionQuery.addListener === 'function') {
            reducedMotionQuery.addListener(handleReducedMotionChange);
        }
    });

    const style = document.createElement('style');
    style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    const animatables = document.querySelectorAll(
        '.feature-card, .service-card, .testimonial-card, .stat-item, ' +
        '.whyus-card, .about-img, .faq-item, .hero-content, .mvv-card, .value-item, .hq-content, .leader-card'
    );

    const fadeObserver = new IntersectionObserver(entries => {
        let delayCore = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delayCore * 100);
                delayCore++;
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    animatables.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.33, 1, 0.68, 1), transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)';
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

/* -- CARROSEL SEDE ----------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('hqCarousel');
    const prevBtn = document.getElementById('sedePrev');
    const nextBtn = document.getElementById('sedeNext');

    if (carousel && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -carousel.offsetWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: carousel.offsetWidth, behavior: 'smooth' });
        });
    }
});
