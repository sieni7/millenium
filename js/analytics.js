/**
 * Visitor Analytics Tracker & RGPD Consent Management
 * Tracks visits with IP geolocation, device, browser, page, and session duration.
 * Data stored in localStorage under 'millenium_visits'.
 */

const VISITS_KEY = 'millenium_visits';
const MAX_VISITS = 500;

const Analytics = {
    _sessionStart: Date.now(),

    init() {
        this.renderConsentBanner();
        this.trackVisit();
        this.bindCustomEvents();
        this.trackSessionDuration();
    },

    // ── RGPD CONSENT ──────────────────────────────────────────
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
            this.trackVisit();
            if (window.Toast) window.Toast.show('Merci ! Vos préférences ont été enregistrées.', 'success');
        });

        document.getElementById('analytics-deny').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'denied');
            banner.remove();
        });
    },

    // ── VISITOR TRACKING ──────────────────────────────────────
    async trackVisit() {
        if (localStorage.getItem('analytics_consent') !== 'accepted') return;

        const visit = {
            id: 'v_' + Date.now(),
            timestamp: new Date().toISOString(),
            page: window.location.pathname || '/',
            referrer: document.referrer || 'direct',
            device: this.detectDevice(),
            browser: this.detectBrowser(),
            screenWidth: window.screen.width,
            duration: 0, // Updated on unload
            country: '',
            countryCode: '',
            city: '',
            region: ''
        };

        // Geolocation via ip-api.com (free, no key, 45 req/min)
        try {
            const res = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,regionName,city');
            if (res.ok) {
                const geo = await res.json();
                if (geo.status === 'success') {
                    visit.country = geo.country;
                    visit.countryCode = geo.countryCode;
                    visit.city = geo.city;
                    visit.region = geo.regionName;
                }
            }
        } catch (e) {
            console.warn('[Analytics] Geolocation unavailable:', e.message);
        }

        // Store visit
        const visits = this.getVisits();
        visits.unshift(visit);
        // FIFO rotation — keep max entries
        if (visits.length > MAX_VISITS) visits.length = MAX_VISITS;
        localStorage.setItem(VISITS_KEY, JSON.stringify(visits));

        // Store current visit ID for session duration update
        this._currentVisitId = visit.id;

        console.log('[Analytics] Visit tracked:', visit.city || 'unknown', visit.country || '');
    },

    // ── SESSION DURATION ──────────────────────────────────────
    trackSessionDuration() {
        const updateDuration = () => {
            if (!this._currentVisitId) return;
            const visits = this.getVisits();
            const visit = visits.find(v => v.id === this._currentVisitId);
            if (visit) {
                visit.duration = Math.round((Date.now() - this._sessionStart) / 1000);
                localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
            }
        };

        // Update every 30s and on page unload
        setInterval(updateDuration, 30000);
        window.addEventListener('beforeunload', updateDuration);
    },

    // ── PRODUCT VIEW TRACKING ─────────────────────────────────
    trackProductView(productId, productName) {
        if (localStorage.getItem('analytics_consent') !== 'accepted') return;

        const key = 'millenium_product_views';
        const views = JSON.parse(localStorage.getItem(key) || '{}');
        if (!views[productId]) views[productId] = { name: productName, count: 0 };
        views[productId].count++;
        views[productId].name = productName; // Always update name
        localStorage.setItem(key, JSON.stringify(views));
    },

    // ── DETECTION HELPERS ─────────────────────────────────────
    detectDevice() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
        return 'desktop';
    },

    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('SamsungBrowser')) return 'Samsung';
        if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
        if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        return 'Autre';
    },

    // ── DATA ACCESS ───────────────────────────────────────────
    getVisits() {
        try {
            return JSON.parse(localStorage.getItem(VISITS_KEY) || '[]');
        } catch {
            return [];
        }
    },

    // ── CUSTOM EVENT TRACKING ─────────────────────────────────
    trackEvent(category, action, name = null) {
        if (localStorage.getItem('analytics_consent') !== 'accepted') return;
        console.log(`[Analytics Event] ${category} -> ${action}${name ? ' (' + name + ')' : ''}`);
    },

    bindCustomEvents() {
        window.addEventListener('export:pdf', () => {
            this.trackEvent('Documents', 'Export PDF', 'Catalogue Complet');
        });

        window.addEventListener('product:show', (e) => {
            this.trackEvent('Catalogue', 'Click Projet', e.detail.id);
            // Track product view count
            const products = window._millenium_products;
            if (products) {
                const p = products.find(pr => pr.id === e.detail.id);
                if (p) this.trackProductView(p.id, p.name);
            }
        });

        window.addEventListener('filter:zone', (e) => {
            this.trackEvent('Catalogue', 'Filter Zone', e.detail.zone);
        });

        window.addEventListener('form:submit', () => {
            this.trackEvent('Contact', 'Submit Form', 'Demande étude');
        });
    }
};

export default Analytics;
