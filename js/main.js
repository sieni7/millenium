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

    // 3. Product Grid with Skeleton
    const gridContainer = document.querySelector('#product-grid-container');
    if (gridContainer && config.products) {
        gridContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">
                ${Array(3).fill('<div class="skeleton" style="height: 400px; border-radius: 20px;"></div>').join('')}
            </div>
        `;
        
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
    
    // 5. Contact & Footer Dynamique (Sprint 4 - Phase 1)
    if (document.querySelector('#contact-container')) {
        ContactForm.render('#contact-container', config);
    }
    
    if (document.querySelector('#footer-container')) {
        Footer.render('#footer-container', config);
    }

    // 6. Identity & Global Animation Refresh
    Animations.initReveal();

    // 8. Sticky CTA with Analytics integration
    const ctaContainer = document.querySelector('#sticky-cta-container');
    if (ctaContainer) {
        ctaContainer.innerHTML = `
            <a href="#contact" class="sticky-cta">
                <i class="fas fa-paper-plane"></i>
                <span>Parler à un expert</span>
            </a>
        `;
        const ctaEl = ctaContainer.querySelector('.sticky-cta');
        ctaEl.addEventListener('click', () => {
            Analytics.trackEvent('Contact', 'Click CTA Sticky');
            Toast.show("Redirection vers le formulaire...", "info");
        });
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
