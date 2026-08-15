/* ============================================
   Millenium Coop Initiative - UI/UX REFINEMENTS (Top 10)
   ============================================ */

(function () {
    'use strict';

    // 1. Hover cartes avec glow (CSS uniquement - déjà dans refinements.css)

    // 2. Smooth scroll (CSS uniquement - déjà dans refinements.css)

    // 3. Back-to-top button
    function initBackToTop() {
        const existingBtn = document.querySelector('#back-to-top');
        const btn = existingBtn || document.createElement('button');

        if (!existingBtn) {
            btn.id = 'back-to-top';
            btn.className = 'back-to-top';
            btn.innerHTML = '↑';
            btn.setAttribute('aria-label', 'Retour en haut');
            document.body.appendChild(btn);
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('visible', 'active');
            } else {
                btn.classList.remove('visible', 'active');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Progress bar
    function initProgressBar() {
        const container = document.createElement('div');
        container.className = 'progress-bar-container';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        container.appendChild(bar);
        document.body.appendChild(container);

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            bar.style.width = scrolled + '%';
        });
    }

    // 5. Smooth scroll pour ancres (renforcement)
    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Mettre à jour l'URL sans rechargement
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // 6. Protection double-clic sur formulaires
    function initDoubleClickProtection() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function (e) {
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn && submitBtn.disabled) {
                    e.preventDefault();
                    return;
                }
                if (submitBtn) {
                    submitBtn.disabled = true;
                    // Ajouter un spinner visuel si possible
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<span class="spinner"></span> Envoi...';
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }, 5000);
                }
            });
        });
    }

    // 7. Amélioration menu mobile (animation cascade)
    function enhanceMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('open');
            });
        }
    }

    // 10. Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        initBackToTop();
        initProgressBar();
        initSmoothAnchors();
        initDoubleClickProtection();
        enhanceMobileMenu();

        console.log('✅ UI/UX Refinements chargés');
    });
})();