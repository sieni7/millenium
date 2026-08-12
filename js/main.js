import Hero from '../components/hero.js';
import Services from '../components/services.js';
import Projects from '../components/projects.js';
import About from '../components/about.js';
import Team from '../components/team.js';
import ContactForm from '../components/contactForm.js';
import Footer from '../components/footer.js';
import Partners from '../components/partners.js';
import LoadingScreen from '../components/loadingScreen.js';
import BottomNav from '../components/bottomNav.js';

// Sprint 4 Modules
import Animations from './animations.js';
import MobileMenu from './mobileMenu.js';
import Toast from './toast.js';
import Analytics from './analytics.js';
import SEO from './seo.js';
import DarkMode from './darkMode.js';
import UXRefinements from './ux-refinements.js';
import CustomCursor from './cursor.js';

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
import '../css/mci-components.css';

async function init() {
  // 0. Afficher l'écran de chargement immédiatement
  LoadingScreen.render();

  try {
    // Priority: localStorage (set by admin) > static config.json
    let config;
    const storedConfig = localStorage.getItem('millenium_config');
    if (storedConfig) {
        config = JSON.parse(storedConfig);
    } else {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error('Could not load config.json');
        config = await response.json();
    }

    // -- MAINTENANCE MODE CHECK --
    if (config.settings && config.settings.maintenanceMode) {
        document.body.innerHTML = `
            <style>
                @keyframes floatHalo {
                    0% { transform: translateY(0px); box-shadow: 0 0 20px rgba(240, 90, 34, 0.2); }
                    50% { transform: translateY(-15px); box-shadow: 0 0 60px rgba(240, 90, 34, 0.8); }
                    100% { transform: translateY(0px); box-shadow: 0 0 20px rgba(240, 90, 34, 0.2); }
                }
                .maintenance-logo {
                    height: 140px;
                    border-radius: 20px;
                    margin-bottom: 40px;
                    animation: floatHalo 4s ease-in-out infinite;
                }
            </style>
            <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--background); text-align: center; padding: 40px;">
                <img src="./assets/logo_millenium.png" alt="Millénium Consulting Innovation" style="height: 140px; width: auto; margin-bottom: 24px; border-radius: 20px;">
                <h1 style="font-family: var(--font-heading); font-size: 3rem;">Site en Maintenance</h1>
                <p style="font-family: var(--font-body); max-width: 500px; color: var(--text-muted); margin-top: 15px;">Nous mettons à jour notre plateforme pour mieux vous servir. Nous serons de retour très bientôt.</p>
                <div style="margin-top: 30px; font-weight: 600; color: var(--secondary);">${config.company.name}</div>
            </div>
        `;
        LoadingScreen.hide();
        return;
    }

    // -- I18N INITIALIZATION --
    const lang = localStorage.getItem('millenium_lang') || config.i18n?.defaultLanguage || config.settings?.defaultLanguage || 'fr';
    window.millenium_i18n = config.i18n[lang];
    window.currentLang = lang;

    // 1. Initialize Global UI & Infrastructure
    MobileMenu.init();
    Toast.init();
    Analytics.init();
    SEO.init(config);
    DarkMode.init();
    UXRefinements.init(config);
    CustomCursor.init();

    // 2. Render Hero & Content
    if (document.querySelector('#hero-slider-container')) {
        Hero.render('#hero-slider-container', config.hero);
    }

    // About Section
    if (document.querySelector('#about-text-container')) {
        About.render('#about-text-container', config);
    }

    // Services Section
    if (document.querySelector('#services-container')) {
        Services.render('#services-container', config.services);
    }

    // Projects / Case Study Section
    if (document.querySelector('#projects-container')) {
        Projects.render('#projects-container', config.projects);
    }

    // Team Section
    if (document.querySelector('#team-container')) {
        Team.render('#team-container', config.team);
    }

    // Partners Section
    const partnersContainer = document.querySelector('#partners-section-container');
    if (partnersContainer) {
        try {
            const partnersRes = await fetch('sections/partenaires.html');
            if (partnersRes.ok) {
                const partnersHtml = await partnersRes.text();
                partnersContainer.innerHTML = partnersHtml;

                // Hydratation dynamique
                if (config.partners) {
                    Partners.render('#partners-grid-container', config.partners);
                }
            }
        } catch (e) { console.warn('Partners error:', e); }
    }

    // 3. Contact & Footer
    if (document.querySelector('#contact-container')) {
        ContactForm.render('#contact-container', config);
    }

    // -- STATIC TITLES I18N --
    const servicesTitle = document.querySelector('#services .section-title h2');
    if (servicesTitle) servicesTitle.textContent = window.millenium_i18n?.menu?.services || servicesTitle.textContent;

    const projectsTitle = document.querySelector('#realisations .section-title h2');
    if (projectsTitle) projectsTitle.textContent = window.millenium_i18n?.menu?.projects || projectsTitle.textContent;

    const teamTitle = document.querySelector('#equipe .section-title h2');
    if (teamTitle) teamTitle.textContent = window.millenium_i18n?.menu?.team || teamTitle.textContent;

    if (document.querySelector('#footer-container')) {
        Footer.render('#footer-container', config);
    }

    // 4. Identity & Global Animation Refresh
    Animations.initReveal();

    // -- BACK TO TOP & SCROLL LOGIC (throttled via rAF) --
    const bttBtn = document.querySelector('#back-to-top');
    const scrollProgress = document.querySelector('#scroll-progress');

    let scrollTicking = false;
    const onScroll = () => {
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
    };
    const onScrollThrottled = () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(() => {
                onScroll();
                scrollTicking = false;
            });
        }
    };
    window.addEventListener('scroll', onScrollThrottled, { passive: true });

    if (bttBtn) {
        bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -- BOTTOM NAV FOR MOBILE --
    if (window.innerWidth <= 768) {
        BottomNav.render('#bottom-nav-container');
    }

    // 5. Cacher l'écran de chargement (minimise le blocage LCP)
    setTimeout(() => {
        LoadingScreen.hide();
    }, 150);

  } catch (error) {
    console.error('MILLENIUM Init Error:', error);
    if (window.Toast) Toast.show("Erreur de chargement des données", "error");
  }
}

document.addEventListener('DOMContentLoaded', init);