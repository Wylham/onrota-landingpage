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

    function setMenuState(isOpen) {
        mobileMenu.classList.toggle('open', isOpen);
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function toggleMenu() {
        const isOpen = !mobileMenu.classList.contains('open');
        setMenuState(isOpen);
    }

    function closeMenu() {
        setMenuState(false);
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

    /* ── SOLUTIONS SHOWCASE ───────────────────────────── */
    function hexToRgb(hex) {
        const normalized = hex.replace('#', '');
        const fullHex = normalized.length === 3
            ? normalized.split('').map(char => char + char).join('')
            : normalized;
        const value = Number.parseInt(fullHex, 16);

        return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const showcaseProducts = [
        {
            id: 'onrisk',
            name: 'OnRisk',
            shortName: 'Decisão antifraude em segundos.',
            subtitle: 'Análise de Risco',
            description: 'Centraliza consultas de CNH, processos judiciais, ANTT, CRLV e dados cadastrais em um fluxo único para validar motoristas e veículos com rapidez, score judicial automático e rastreabilidade em cada decisão.',
            color: '#74b8ff',
            icon: 'public/images/logos/solucoes/onrisk.webp',
            tags: ['CNH', 'ANTT', 'CRLV', 'Score Judicial', 'Bases oficiais'],
            ctaLabel: 'Conhecer OnRisk'
        },
        {
            id: 'oncad',
            name: 'OnCad',
            shortName: 'Cadastro seguro sem retrabalho.',
            subtitle: 'Automação de Cadastros',
            description: 'Automatiza o onboarding de motoristas e agregados com OCR, validações oficiais e integração nativa com os principais TMS do mercado. O resultado é consistência de dados, menor custo operacional e ativação mais rápida da operação.',
            color: '#4f9eff',
            icon: 'public/images/logos/solucoes/oncad.webp',
            tags: ['ATUA', 'SAT', 'Sankhya', 'OCR', 'Login unificado'],
            ctaLabel: 'Conhecer OnCad'
        },
        {
            id: 'ontrack',
            name: 'OnTrack',
            shortName: 'Rastreamento em tempo real via WhatsApp.',
            subtitle: 'Rastreamento via WhatsApp',
            description: 'Ativa o acompanhamento pelo próprio WhatsApp do motorista em segundos, sem download de aplicativo e sem hardware adicional. Entrega histórico de rota, alertas de parada e velocidade com uma operação simples para a base logística.',
            color: '#2f82ff',
            icon: 'public/images/logos/solucoes/ontrack.webp',
            tags: ['WhatsApp', 'Tempo real', 'Alertas de rota', 'Paradas', 'Velocidade'],
            ctaLabel: 'Conhecer OnTrack'
        },
        {
            id: 'onid',
            name: 'OnID',
            shortName: 'Identidade validada na origem.',
            subtitle: 'Identificação Biométrica',
            description: 'Executa biometria facial com captura guiada, comparação com a foto da CNH e validação direta nas bases do Detran. Retorna similaridade, geolocalização e alertas de autenticidade para reduzir fraudes de identidade com precisão.',
            color: '#63d8ff',
            icon: 'public/images/logos/solucoes/onid.webp',
            tags: ['Biometria facial', 'CNH', 'Detran', 'Similaridade', 'Geolocalização'],
            ctaLabel: 'Conhecer OnID'
        },
        {
            id: 'ondeep',
            name: 'OnDeep',
            shortName: 'Contexto completo para análises sensíveis.',
            subtitle: 'Análise 360°',
            description: 'Combina histórico profissional, dados judiciais, habilitação e consistência documental em uma leitura única do candidato. Ideal para aprofundar validações críticas com mais contexto, rastreabilidade e segurança operacional.',
            color: '#3d72dc',
            icon: 'public/images/logos/solucoes/ondeep.webp',
            tags: ['Histórico profissional', 'Judicial', 'Habilitação', 'Documentos', 'Visão 360°'],
            ctaLabel: 'Conhecer OnDeep'
        },
        {
            id: 'onrota',
            name: 'OnRota',
            shortName: 'Diagnóstico, plano de ação e ganho real de eficiência.',
            subtitle: 'Consultoria Especializada',
            description: 'A consultoria da OnRota analisa a operação de ponta a ponta para identificar desperdícios, falhas de processo, riscos de fraude e oportunidades de otimização. O trabalho combina diagnóstico, planejamento, implementação assistida e acompanhamento contínuo com foco em segurança e resultado operacional.',
            color: '#8abfff',
            icon: 'public/images/logos/onrota.webp',
            tags: ['Diagnóstico', 'Planejamento', 'Implementação', 'Auditoria', 'Resultados'],
            ctaLabel: 'Conhecer a consultoria'
        }
    ].map(product => ({
        ...product,
        colorRgb: hexToRgb(product.color)
    }));

    function renderShowcasePanel(product, isActive) {
        const colorStyle = `--solution-color: ${product.color}; --solution-color-rgb: ${product.colorRgb};`;

        return `
            <article class="solutions-product-panel${isActive ? ' is-active' : ''}" role="tabpanel"
                id="solution-panel-${product.id}" aria-labelledby="solution-tab-${product.id}"
                aria-hidden="${isActive ? 'false' : 'true'}" tabindex="${isActive ? '0' : '-1'}"
                style="${colorStyle}">
                <div class="solutions-product-panel__inner">
                    <div class="solutions-product-panel__hero">
                        <div class="solutions-product-panel__icon" aria-hidden="true">
                            <img src="${product.icon}" alt="" loading="lazy" decoding="async" />
                        </div>
                        <div class="solutions-product-panel__title-group">
                            <p class="solutions-product-panel__eyebrow">${escapeHtml(product.subtitle)}</p>
                            <p class="solutions-product-panel__tagline">${escapeHtml(product.shortName)}</p>
                        </div>
                    </div>
                    <p class="solutions-product-panel__description">${escapeHtml(product.description)}</p>
                    <div class="solutions-product-panel__meta">
                        <span class="solutions-product-panel__meta-label">Integrações e sinais críticos</span>
                        <div class="solutions-product-panel__tags">
                            ${product.tags.map(tag => `<span class="solutions-product-panel__tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>
                    <div class="solutions-product-panel__footer">
                        <a href="#contact" class="solutions-product-panel__cta">
                            <span class="solutions-product-panel__cta-text">${escapeHtml(product.ctaLabel)}</span>
                            <span class="solutions-product-panel__cta-icon" aria-hidden="true">
                                <i class="ph ph-arrow-right"></i>
                            </span>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    document.querySelectorAll('[data-solutions-showcase]').forEach(root => {
        root.innerHTML = `
            <div class="solutions-tabs" role="tablist" aria-label="Produtos OnRota" aria-orientation="vertical">
                ${showcaseProducts.map((product, index) => {
                    const colorStyle = `--solution-color: ${product.color}; --solution-color-rgb: ${product.colorRgb};`;

                    return `
                        <button class="solutions-tab${index === 0 ? ' is-active' : ''}" type="button" role="tab"
                            id="solution-tab-${product.id}" aria-selected="${index === 0 ? 'true' : 'false'}"
                            aria-controls="solution-panel-${product.id}" tabindex="${index === 0 ? '0' : '-1'}"
                            aria-label="${escapeHtml(product.name)}"
                            style="${colorStyle}">
                            <span class="solutions-tab__icon" aria-hidden="true">
                                <img src="${product.icon}" alt="" loading="lazy" decoding="async" />
                            </span>
                            <span class="solutions-tab__copy">
                                <span class="solutions-tab__subtitle">${escapeHtml(product.subtitle)}</span>
                            </span>
                        </button>
                    `;
                }).join('')}
            </div>
            <div class="solutions-panel-stack">
                ${showcaseProducts.map((product, index) => renderShowcasePanel(product, index === 0)).join('')}
            </div>
        `;

        const tabs = Array.from(root.querySelectorAll('.solutions-tab'));
        const panels = Array.from(root.querySelectorAll('.solutions-product-panel'));
        let activeIndex = -1;

        function setActiveSolution(nextIndex, focusTab) {
            if (nextIndex === activeIndex) {
                if (focusTab) tabs[nextIndex].focus();
                return;
            }

            activeIndex = nextIndex;

            tabs.forEach((tab, index) => {
                const isActive = index === nextIndex;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', String(isActive));
                tab.tabIndex = isActive ? 0 : -1;
            });

            panels.forEach((panel, index) => {
                const isActive = index === nextIndex;
                panel.classList.toggle('is-active', isActive);
                panel.setAttribute('aria-hidden', String(!isActive));
                panel.tabIndex = isActive ? 0 : -1;
                panel.inert = !isActive;
            });

            if (focusTab) tabs[nextIndex].focus();
        }

        setActiveSolution(0, false);

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                setActiveSolution(index, false);
            });

            tab.addEventListener('keydown', event => {
                let nextIndex = null;

                switch (event.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        nextIndex = (index + 1) % tabs.length;
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        nextIndex = (index - 1 + tabs.length) % tabs.length;
                        break;
                    case 'Home':
                        nextIndex = 0;
                        break;
                    case 'End':
                        nextIndex = tabs.length - 1;
                        break;
                    case 'Enter':
                    case ' ':
                        event.preventDefault();
                        setActiveSolution(index, true);
                        return;
                    default:
                        return;
                }

                event.preventDefault();
                setActiveSolution(nextIndex, true);
            });
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
        '.solutions-showcase, .service-card, .testimonial-card, .stat-item, ' +
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
