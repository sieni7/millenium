import Hero from '../components/hero.js';
import ActivityCard from '../components/activityCard.js';
import EngagementCard from '../components/engagementCard.js';
import ProductGrid from '../components/productGrid.js';
import ProductModal from '../components/productModal.js';
import FilterBar from '../components/filterBar.js';
import ContactForm from '../components/contactForm.js';
import Footer from '../components/footer.js';
import Partners from '../components/partners.js';
import LoadingScreen from '../components/loadingScreen.js';
import BottomNav from '../components/bottomNav.js';
import RecentlyViewed from '../components/recentlyViewed.js';
import StatsSection from '../components/statsSection.js';

// Sprint 4 Modules
import Animations from './animations.js';
import MobileMenu from './mobileMenu.js';
import Toast from './toast.js';
import Analytics from './analytics.js';
import SEO from './seo.js';
import DarkMode from './darkMode.js';
import UXRefinements from './ux-refinements.js';

// Global access for Toast & Analytics
window.Toast = Toast;
window.Analytics = Analytics;

// Load Styles for Vite Bundle
import '../css/animations.css';
import '../css/mobile.css';
import '../css/dark-mode.css';
import '../css/refinements.css';
import '../css/layout-fix.css';
import '../css/hero.css';
import '../css/partenaires.css';
import '../css/productGrid.css';
import '../css/productModal.css';
import '../css/filterBar.css';
import '../css/productList.css';

async function init() {
  // 0. Afficher l'écran de chargement immédiatement
  LoadingScreen.render();

  try {
    const response = await fetch('config.json');
    if (!response.ok) throw new Error('Could not load config.json');
    const config = await response.json();

    // -- MAINTENANCE MODE CHECK --
    if (config.settings && config.settings.maintenanceMode) {
        document.body.innerHTML = `
            <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--background); text-align: center; padding: 40px;">
                <i class="fas fa-tools" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
                <h1 style="font-family: var(--font-heading); font-size: 3rem;">Site en Maintenance</h1>
                <p style="font-family: var(--font-body); max-width: 500px; color: var(--text-muted);">Nous mettons à jour notre plateforme pour mieux vous servir. Nous serons de retour très bientôt !</p>
                <div style="margin-top: 30px; font-weight: 600; color: var(--secondary);">${config.company.name}</div>
            </div>
        `;
        LoadingScreen.hide();
        return;
    }

    // -- I18N INITIALIZATION --
    const lang = localStorage.getItem('kiram_lang') || config.settings.defaultLanguage || 'fr';
    window.kiram_i18n = config.i18n[lang];
    window.currentLang = lang;

    // 1. Initialize Global UI & Infrastructure
    MobileMenu.init();
    Toast.init();
    Analytics.init();
    SEO.init(config);
    DarkMode.init();
    UXRefinements.init();

    // 2. Render Hero & Content
    if (document.querySelector('#hero-slider-container')) {
        Hero.render('#hero-slider-container', config.hero);
    }
    
    if (document.querySelector('#activities-container')) {
        ActivityCard.render('#activities-container', config.activities);
    }

    if (document.querySelector('#engagement-cards-container')) {
        const engagementData = [
            { title: "Expertise Durable", icon: "fas fa-award", description: "Madame Fofana Geneviève, Gérante, pilote KIRAM PHARMA depui 2018 avec une rigueur éthique et scientifique." },
            { title: "Proximité Stratégique", icon: "fas fa-map-marked-alt", description: "Basés à Abidjan (Cocody Angré Djibi), nous assurons une disponibilité totale pour nos partenaires et patients." },
            { title: "Vision Pharmaceutique", icon: "fas fa-lightbulb", description: "Représenter les meilleurs laboratoires internationaux pour offrir l'excellence pharmaceutique en Côte d'Ivoire." }
        ];
        EngagementCard.render('#engagement-cards-container', engagementData);
    }

    // 2.5 Render Stats Section (ProMax Phase 2)
    if (document.querySelector('#stats-section-container') && config.company.stats) {
        StatsSection.render('#stats-section-container', config.company.stats);
    }

    // 3. Product Grid with Skeleton
    const gridContainer = document.querySelector('#product-grid-container');
    if (gridContainer && config.products) {
        ProductGrid.showSkeleton('#product-grid-container');
        
        setTimeout(() => {
            ProductGrid.render('#product-grid-container', config.products);
            Animations.refresh();
            Animations.initMicroInteractions();
        }, 800);
    }

    // 4. Modal & Filter Bar
    if (document.querySelector('#product-modal-container') && config.products) {
        ProductModal.render('#product-modal-container', config.products);
    }

    if (document.querySelector('#filter-bar-container') && config.products) {
        FilterBar.render('#filter-bar-container', config.products);
    }
    
    const partnersContainer = document.querySelector('#partners-section-container');
    if (partnersContainer) {
        try {
            const partnersRes = await fetch('sections/partenaires.html');
            if (partnersRes.ok) {
                const partnersHtml = await partnersRes.text();
                partnersContainer.innerHTML = partnersHtml;
                
                // Hydratation dynamique (Sprint 4)
                if (config.partners) {
                    Partners.render('#partners-grid-container', config.partners);
                }
            }
        } catch (e) { console.warn('Partners error:', e); }
    }
    
    // 5. Contact & Footer Dynamique
    if (document.querySelector('#contact-container')) {
        ContactForm.render('#contact-container', config);
    }

    // -- STATIC TITLES I18N --
    const catalogueTitle = document.querySelector('#produits h2');
    const catalogueSubtitle = document.querySelector('#produits p');
    if (catalogueTitle) catalogueTitle.textContent = window.kiram_i18n?.catalogue_title || catalogueTitle.textContent;
    if (catalogueSubtitle) catalogueSubtitle.textContent = window.kiram_i18n?.catalogue_subtitle || catalogueSubtitle.textContent;

    const engagementTitle = document.querySelector('#identite h2');
    const engagementSubtitle = document.querySelector('#identite p');
    if (engagementTitle) engagementTitle.textContent = window.kiram_i18n?.engagement_title || engagementTitle.textContent;
    if (engagementSubtitle) engagementSubtitle.textContent = window.kiram_i18n?.engagement_subtitle || engagementSubtitle.textContent;

    const expertiseTitle = document.querySelector('#activites h2');
    if (expertiseTitle) expertiseTitle.textContent = window.kiram_i18n?.expertise_title || expertiseTitle.textContent;

    if (document.querySelector('#footer-container')) {
        Footer.render('#footer-container', config);
    }

    // 6. Identity & Global Animation Refresh
    Animations.initReveal();

    // -- BACK TO TOP & SCROLL LOGIC --
    const bttBtn = document.querySelector('#back-to-top');
    const scrollProgress = document.querySelector('#scroll-progress');

    window.addEventListener('scroll', () => {
        // Back to Top visibility
        if (window.scrollY > 500) bttBtn?.classList.add('active');
        else bttBtn?.classList.remove('active');

        // Scroll progress bar
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        }
    });

    if (bttBtn) {
        bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -- RECENTLY VIEWED CONTAINER --
    const footerContainer = document.querySelector('#footer-container');
    if (footerContainer) {
        const recentlyViewedDiv = document.createElement('div');
        recentlyViewedDiv.id = 'recently-viewed-container';
        recentlyViewedDiv.className = 'container reveal';
        recentlyViewedDiv.style.paddingTop = '60px';
        recentlyViewedDiv.style.paddingBottom = '100px';
        footerContainer.parentNode.insertBefore(recentlyViewedDiv, footerContainer);
        RecentlyViewed.render('#recently-viewed-container');
    }

    // -- BOTTOM NAV FOR MOBILE --
    if (window.innerWidth <= 768) {
        BottomNav.render('#bottom-nav-container');
    }

    // 9. Cacher l'écran de chargement (Sprint 4)
    setTimeout(() => {
        LoadingScreen.hide();
    }, 500);

  } catch (error) {
    console.error('KIRAM Init Error:', error);
    if (window.Toast) Toast.show("Erreur de chargement des données", "error");
  }
}

document.addEventListener('DOMContentLoaded', init);
