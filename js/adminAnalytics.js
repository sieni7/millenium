/**
 * Admin Analytics Dashboard — Renders KPI metrics from localStorage visit data.
 * Pure CSS charts, emoji flags, zero dependencies.
 */

const AdminAnalytics = {
    // Convert country code to flag emoji
    flag(cc) {
        if (!cc || cc.length !== 2) return '🌐';
        return String.fromCodePoint(...[...cc.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
    },

    // Relative time (e.g. "il y a 2 min")
    timeAgo(dateStr) {
        const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return 'à l\'instant';
        if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
        if (seconds < 604800) return `il y a ${Math.floor(seconds / 86400)}j`;
        return new Date(dateStr).toLocaleDateString('fr-FR');
    },

    // Format seconds to readable duration
    formatDuration(secs) {
        if (!secs || secs < 1) return '—';
        if (secs < 60) return `${secs}s`;
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m${s > 0 ? s + 's' : ''}`;
    },

    // Get all visits from localStorage
    getVisits() {
        try { return JSON.parse(localStorage.getItem('millenium_visits') || '[]'); }
        catch { return []; }
    },

    // Get product views
    getProductViews() {
        try { return JSON.parse(localStorage.getItem('millenium_product_views') || '{}'); }
        catch { return {}; }
    },

    // ── COMPUTE METRICS ──────────────────────────────────────
    computeMetrics() {
        const visits = this.getVisits();
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        const todayVisits = visits.filter(v => v.timestamp.startsWith(todayStr));

        // Average duration
        const durations = visits.filter(v => v.duration > 0).map(v => v.duration);
        const avgDuration = durations.length > 0
            ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
            : 0;

        // Country breakdown
        const countries = {};
        visits.forEach(v => {
            const key = v.countryCode || 'XX';
            if (!countries[key]) countries[key] = { name: v.country || 'Inconnu', count: 0 };
            countries[key].count++;
        });
        const topCountries = Object.entries(countries)
            .map(([code, data]) => ({ code, name: data.name, count: data.count }))
            .sort((a, b) => b.count - a.count);

        // Device breakdown
        const devices = {};
        visits.forEach(v => { devices[v.device] = (devices[v.device] || 0) + 1; });

        // Browser breakdown
        const browsers = {};
        visits.forEach(v => { browsers[v.browser] = (browsers[v.browser] || 0) + 1; });

        // Last 7 days activity
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dayStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
            const count = visits.filter(v => v.timestamp.startsWith(dayStr)).length;
            last7Days.push({ day: dayName, date: dayStr, count });
        }

        // Top pages
        const pages = {};
        visits.forEach(v => { pages[v.page] = (pages[v.page] || 0) + 1; });

        // Product views
        const productViews = this.getProductViews();
        const topProducts = Object.entries(productViews)
            .map(([id, data]) => ({ id, name: data.name, count: data.count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Referrers
        const referrers = {};
        visits.forEach(v => {
            const ref = v.referrer === 'direct' ? 'Direct' : new URL(v.referrer, 'http://x').hostname || 'Direct';
            referrers[ref] = (referrers[ref] || 0) + 1;
        });

        return {
            total: visits.length,
            today: todayVisits.length,
            avgDuration,
            topCountry: topCountries[0] || { code: 'XX', name: 'Aucune', count: 0 },
            topCountries,
            devices,
            browsers,
            last7Days,
            recentVisits: visits.slice(0, 15),
            topProducts,
            referrers,
            pages
        };
    },

    // ── RENDER ────────────────────────────────────────────────
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const m = this.computeMetrics();
        const maxDayCount = Math.max(...m.last7Days.map(d => d.count), 1);

        container.innerHTML = `
            <!-- KPI CARDS -->
            <div class="analytics-kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-eye"></i></div>
                    <div class="kpi-value">${m.total}</div>
                    <div class="kpi-label">Visites totales</div>
                </div>
                <div class="kpi-card kpi-highlight">
                    <div class="kpi-icon"><i class="fas fa-calendar-day"></i></div>
                    <div class="kpi-value">${m.today}</div>
                    <div class="kpi-label">Aujourd'hui</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><span style="font-size: 1.5rem;">${this.flag(m.topCountry.code)}</span></div>
                    <div class="kpi-value">${m.topCountry.name}</div>
                    <div class="kpi-label">Top pays</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-clock"></i></div>
                    <div class="kpi-value">${this.formatDuration(m.avgDuration)}</div>
                    <div class="kpi-label">Durée moyenne</div>
                </div>
            </div>

            <!-- CHARTS ROW -->
            <div class="analytics-charts-row">
                <!-- 7 Day Activity Chart -->
                <div class="analytics-card">
                    <h4><i class="fas fa-chart-bar"></i> Activité (7 derniers jours)</h4>
                    <div class="chart-7days">
                        ${m.last7Days.map(d => `
                            <div class="chart-bar-wrapper">
                                <div class="chart-bar-count">${d.count}</div>
                                <div class="chart-bar" style="height: ${Math.max((d.count / maxDayCount) * 100, 4)}%;"></div>
                                <div class="chart-bar-label">${d.day}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Geographic Distribution -->
                <div class="analytics-card">
                    <h4><i class="fas fa-globe-africa"></i> Répartition géographique</h4>
                    <div class="geo-list">
                        ${m.topCountries.length === 0 ? '<p class="analytics-empty">Aucune donnée</p>' :
                          m.topCountries.slice(0, 8).map(c => {
                            const pct = m.total > 0 ? Math.round((c.count / m.total) * 100) : 0;
                            return `
                                <div class="geo-row">
                                    <span class="geo-flag">${this.flag(c.code)}</span>
                                    <span class="geo-name">${c.name}</span>
                                    <div class="geo-bar-track">
                                        <div class="geo-bar-fill" style="width: ${pct}%;"></div>
                                    </div>
                                    <span class="geo-pct">${pct}%</span>
                                </div>
                            `;
                          }).join('')}
                    </div>
                </div>
            </div>

            <!-- SECOND ROW: Devices + Browsers -->
            <div class="analytics-charts-row">
                <div class="analytics-card analytics-card-sm">
                    <h4><i class="fas fa-mobile-alt"></i> Appareils</h4>
                    <div class="breakdown-list">
                        ${this.renderBreakdown(m.devices, m.total, {
                            desktop: { icon: 'fas fa-desktop', label: 'Desktop' },
                            mobile: { icon: 'fas fa-mobile-alt', label: 'Mobile' },
                            tablet: { icon: 'fas fa-tablet-alt', label: 'Tablette' }
                        })}
                    </div>
                </div>
                <div class="analytics-card analytics-card-sm">
                    <h4><i class="fas fa-globe"></i> Navigateurs</h4>
                    <div class="breakdown-list">
                        ${this.renderBreakdown(m.browsers, m.total)}
                    </div>
                </div>
                <div class="analytics-card analytics-card-sm">
                    <h4><i class="fas fa-fire"></i> Projets les plus vus</h4>
                    <div class="top-products-list">
                        ${m.topProducts.length === 0 ? '<p class="analytics-empty">Aucun clic enregistré</p>' :
                          m.topProducts.map((p, i) => `
                            <div class="top-product-row">
                                <span class="top-product-rank">${i + 1}</span>
                                <span class="top-product-name">${p.name}</span>
                                <span class="top-product-count">${p.count} vue${p.count > 1 ? 's' : ''}</span>
                            </div>
                          `).join('')}
                    </div>
                </div>
            </div>

            <!-- RECENT VISITS TABLE -->
            <div class="analytics-card analytics-card-full">
                <h4><i class="fas fa-history"></i> Dernières visites</h4>
                <div class="visits-table-wrapper">
                    <table class="visits-table">
                        <thead>
                            <tr>
                                <th>Pays</th>
                                <th>Ville</th>
                                <th>Page</th>
                                <th>Appareil</th>
                                <th>Navigateur</th>
                                <th>Durée</th>
                                <th>Quand</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${m.recentVisits.length === 0 ? '<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">Aucune visite enregistrée</td></tr>' :
                              m.recentVisits.map(v => `
                                <tr>
                                    <td><span class="visit-flag">${this.flag(v.countryCode)}</span> ${v.countryCode || '—'}</td>
                                    <td>${v.city || '—'}</td>
                                    <td><code>${v.page}</code></td>
                                    <td>${v.device}</td>
                                    <td>${v.browser}</td>
                                    <td>${this.formatDuration(v.duration)}</td>
                                    <td class="visit-time">${this.timeAgo(v.timestamp)}</td>
                                </tr>
                              `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="analytics-actions">
                <button id="analytics-purge-btn" class="btn btn-outline" style="border-color: var(--warning); color: var(--warning);">
                    <i class="fas fa-trash-alt"></i> Purger les données
                </button>
                <button id="analytics-export-btn" class="btn btn-outline">
                    <i class="fas fa-file-csv"></i> Exporter CSV
                </button>
                <button id="analytics-refresh-btn" class="btn btn-sm">
                    <i class="fas fa-sync-alt"></i> Rafraîchir
                </button>
            </div>
        `;

        // Bind actions
        document.getElementById('analytics-purge-btn')?.addEventListener('click', () => this.purge(containerId));
        document.getElementById('analytics-export-btn')?.addEventListener('click', () => this.exportCSV());
        document.getElementById('analytics-refresh-btn')?.addEventListener('click', () => this.render(containerId));
    },

    // ── BREAKDOWN RENDERER ────────────────────────────────────
    renderBreakdown(data, total, labels = {}) {
        const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return '<p class="analytics-empty">Aucune donnée</p>';

        return entries.map(([key, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const meta = labels[key] || {};
            const icon = meta.icon ? `<i class="${meta.icon}"></i> ` : '';
            const label = meta.label || key;
            return `
                <div class="breakdown-row">
                    <span class="breakdown-label">${icon}${label}</span>
                    <div class="geo-bar-track">
                        <div class="geo-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <span class="geo-pct">${pct}%</span>
                </div>
            `;
        }).join('');
    },

    // ── PURGE ─────────────────────────────────────────────────
    purge(containerId) {
        if (!confirm('Supprimer toutes les données analytics ? Cette action est irréversible.')) return;
        localStorage.removeItem('millenium_visits');
        localStorage.removeItem('millenium_product_views');
        this.render(containerId);
        if (window.Toast) window.Toast.show('🗑️ Données analytics purgées', 'success');
    },

    // ── EXPORT CSV ────────────────────────────────────────────
    exportCSV() {
        const visits = this.getVisits();
        if (visits.length === 0) {
            if (window.Toast) window.Toast.show('Aucune donnée à exporter', 'error');
            return;
        }

        const headers = ['Date', 'Page', 'Pays', 'Code', 'Ville', 'Région', 'Appareil', 'Navigateur', 'Durée (s)', 'Referrer'];
        const rows = visits.map(v => [
            v.timestamp,
            v.page,
            v.country,
            v.countryCode,
            v.city,
            v.region,
            v.device,
            v.browser,
            v.duration,
            v.referrer
        ]);

        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `millenium_analytics_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        if (window.Toast) window.Toast.show('📦 Export CSV téléchargé', 'success');
    }
};

export default AdminAnalytics;
