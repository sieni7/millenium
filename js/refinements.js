/* ============================================
   Millenium Côte d'Ivoire - UI/UX REFINEMENTS (Top 10)
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

    // 7. Débounce pour recherche (à intégrer avec filterBar existant)
    function debounce(func, delay = 300) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 8. Compteur de résultats et badge filtre actif
    function enhanceFiltering() {
        const filterBar = document.querySelector('#filter-bar-container');
        const gridContainer = document.querySelector('#product-grid-container');

        if (!filterBar || !gridContainer) return;

        // Ajouter conteneur compteur
        const counterContainer = document.createElement('div');
        counterContainer.className = 'results-counter';
        filterBar.parentNode.insertBefore(counterContainer, filterBar.nextSibling);

        // Ajouter conteneur badges filtres actifs
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'active-filters';
        filterBar.parentNode.insertBefore(badgeContainer, filterBar.nextSibling);

        // Observer les changements de filtre
        const observer = new MutationObserver(() => {
            updateResultsCounter();
        });

        observer.observe(gridContainer, { childList: true, subtree: true });
    }

    function updateResultsCounter() {
        const products = document.querySelectorAll('.product-card');
        const counter = document.querySelector('.results-counter');
        if (counter) {
            const count = products.length;
            counter.innerHTML = `📦 ${count} produit${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
        }
    }

    // 9. Message "aucun résultat" illustré
    function enhanceEmptyState() {
        const gridContainer = document.querySelector('#product-grid-container');
        if (!gridContainer) return;

        const originalFilterLogic = window.filterProducts;
        if (originalFilterLogic) {
            // Wrap la fonction de filtrage existante
            window.filterProducts = function (...args) {
                const result = originalFilterLogic.apply(this, args);
                const products = document.querySelectorAll('.product-card');
                let emptyState = document.querySelector('.empty-state');

                if (products.length === 0) {
                    if (!emptyState) {
                        emptyState = document.createElement('div');
                        emptyState.className = 'empty-state';
                        emptyState.innerHTML = `
              <div class="empty-state-icon">🔍</div>
              <h3>Aucun produit trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
              <div class="suggestion">💡 Suggestions : PharmaCI, EuroPharm, Antibiotique</div>
            `;
                        gridContainer.appendChild(emptyState);
                    }
                } else if (emptyState) {
                    emptyState.remove();
                }
                return result;
            };
        }
    }

    // 10. Amélioration menu mobile (animation cascade)
    function enhanceMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('open');
            });
        }
    }

    // 11. Badge filtre actif (fonction complémentaire)
    function addActiveFilterBadge(filterName, filterValue) {
        const badgeContainer = document.querySelector('.active-filters');
        if (!badgeContainer) return;

        // Vérifier si le filtre existe déjà
        const existing = badgeContainer.querySelector(`[data-filter="${filterName}"]`);
        if (existing) return;

        const badge = document.createElement('div');
        badge.className = 'filter-badge';
        badge.setAttribute('data-filter', filterName);
        badge.innerHTML = `
      ${filterName}: ${filterValue}
      <button class="remove-filter" aria-label="Supprimer le filtre">×</button>
    `;

        badge.querySelector('.remove-filter').addEventListener('click', () => {
            badge.remove();
            // Déclencher réinitialisation du filtre correspondant
            const resetBtn = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
            if (resetBtn) resetBtn.click();
            else window.location.reload();
        });

        badgeContainer.appendChild(badge);
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        initBackToTop();
        initProgressBar();
        initSmoothAnchors();
        initDoubleClickProtection();
        enhanceFiltering();
        enhanceEmptyState();
        enhanceMobileMenu();

        // Exposer helper pour badges (sera utilisé par filterBar.js)
        window.addActiveFilterBadge = addActiveFilterBadge;
        window.debounce = debounce;

        console.log('✅ UI/UX Refinements chargés (Top 10)');
    });
})();