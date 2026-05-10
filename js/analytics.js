/**
 * Matomo / Plausible Analytics Integration & RGPD Consent Management
 */

const Analytics = {
    init() {
        this.renderConsentBanner();
        this.injectTrackingScript();
        this.bindCustomEvents();
    },

    renderConsentBanner() {
        if (localStorage.getItem('analytics_consent')) return;

        const banner = document.createElement('div');
        banner.id = 'analytics-banner';
        banner.innerHTML = `
            <div class="container" style="
                position: fixed;
                bottom: 0; left: 0; width: 100%;
                background: var(--surface);
                padding: 20px 40px;
                box-shadow: 0 -10px 30px rgba(0,0,0,0.05);
                z-index: 9998;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(30,127,110,0.1);
            ">
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-right: 20px;">
                    🍪 Nous utilisons des cookies pour optimiser votre expérience. En acceptant, vous nous aidez à améliorer Millenium Côte d'Ivoire.
                </p>
                <div style="display: flex; gap: 10px;">
                    <button id="analytics-deny" class="btn btn-sm btn-outline">Refuser</button>
                    <button id="analytics-accept" class="btn btn-sm">Accepter</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('analytics-accept').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'accepted');
            banner.remove();
            this.injectTrackingScript();
            if (window.Toast) window.Toast.show('Merci ! Vos préférences ont été enregistrées.', 'success');
        });

        document.getElementById('analytics-deny').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'denied');
            banner.remove();
        });
    },

    injectTrackingScript() {
        if (localStorage.getItem('analytics_consent') !== 'accepted') return;

        // Placeholder for Matomo Cloud / Plausible
        console.log('[Analytics] Live Tracking Active.');
        
        /* Matomo Example:
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="//analytics.milleniumci.com/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '1']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
        */
    },

    trackEvent(category, action, name = null) {
        if (localStorage.getItem('analytics_consent') !== 'accepted') return;

        console.log(`[Analytics Event] ${category} -> ${action}${name ? ' (' + name + ')' : ''}`);
        
        // Matomo implementation:
        // if (window._paq) {
        //     window._paq.push(['trackEvent', category, action, name]);
        // }
    },

    bindCustomEvents() {
        // 1. PDF Export (N3-012) - Injected via global window event if needed
        window.addEventListener('export:pdf', () => {
            this.trackEvent('Documents', 'Export PDF', 'Catalogue Complet');
        });

        // 2. Product Click (N3-008)
        window.addEventListener('product:show', (e) => {
            this.trackEvent('Catalogue', 'Click Produit', e.detail.name);
        });

        // 3. Filter Change (N3-009)
        window.addEventListener('filter:change', (e) => {
            this.trackEvent('Catalogue', 'Filter Zone', e.detail.lab);
        });

        // 4. Contact Form Submit (N3-005)
        window.addEventListener('form:submit', () => {
            this.trackEvent('Contact', 'Submit Form', 'Prestation');
        });
    }
};

export default Analytics;
