/**
 * Admin Analytics Dashboard — Renders KPIs from localStorage visit data.
 * Chart.js powered charts (7/30 days activity, devices, browsers).
 */

import Chart from 'chart.js/auto';

const P = {
    primary: '#1e7f6e',
    primarySoft: 'rgba(30,127,110,0.85)',
    primaryLight: 'rgba(30,127,110,0.12)',
    textMuted: '#88999b',
    danger: '#ef4444',
    gold: '#C9902E'
};

// Seuil de rebond (durée < 15 s considérée comme "bounce")
const BOUNCE_S = 15;

const AdminAnalytics = {
    _charts: {},
    _timer: null,
    _lastRefresh: null,
    _bounds: { '7d': 7, '30d': 30 },
    _activityRange: '7d',

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

        const inDay = (v, offset) => {
            const d = new Date(now);
            d.setDate(d.getDate() - offset);
            return v.timestamp.startsWith(d.toISOString().split('T')[0]);
        };

        // Périodes courantes
        const todayVisits = visits.filter(v => inDay(v, 0));
        const last7Visits = visits.filter(v => {
            const t = new Date(v.timestamp);
            return now.getTime() - t.getTime() <= 7 * 86400000;
        });
        const last30Visits = visits.filter(v => {
            const t = new Date(v.timestamp);
            return now.getTime() - t.getTime() <= 30 * 86400000;
        });

        // Périodes précédentes (comparaisons)
        const yesterdayVisits = visits.filter(v => inDay(v, 1));
        const prev7Visits = visits.filter(v => {
            const t = new Date(v.timestamp);
            const delta = now.getTime() - t.getTime();
            return delta > 7 * 86400000 && delta <= 14 * 86400000;
        });
        const prev30Visits = visits.filter(v => {
            const t = new Date(v.timestamp);
            const delta = now.getTime() - t.getTime();
            return delta > 30 * 86400000 && delta <= 60 * 86400000;
        });

        // Durée moyenne (session active)
        const avg = arr => {
            const ds = arr.filter(v => v.duration > 0).map(v => v.duration);
            return ds.length > 0 ? Math.round(ds.reduce((a, b) => a + b, 0) / ds.length) : 0;
        };

        // Taux de rebond (durée < seuil)
        const bounce = arr => {
            const withDur = arr.filter(v => typeof v.duration === 'number');
            if (withDur.length === 0) return 0;
            return Math.round((withDur.filter(v => v.duration < BOUNCE_S).length / withDur.length) * 100);
        };

        const pct = (a, b) => {
            if (b === 0) return a > 0 ? 100 : 0;
            return Math.round(((a - b) / b) * 100);
        };

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

        // Device / Browser breakdown
        const devices = {};
        visits.forEach(v => { devices[v.device] = (devices[v.device] || 0) + 1; });
        const browsers = {};
        visits.forEach(v => { browsers[v.browser] = (browsers[v.browser] || 0) + 1; });

        // Last N days activity
        const lastNDays = (n) => {
            const days = [];
            for (let i = n - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dayStr = d.toISOString().split('T')[0];
                days.push({
                    day: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                    weekday: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
                    date: dayStr,
                    count: visits.filter(v => v.timestamp.startsWith(dayStr)).length
                });
            }
            return days;
        };

        // Top pages (vues + durée cumulée)
        const pages = {};
        visits.forEach(v => {
            if (!pages[v.page]) pages[v.page] = { page: v.page, count: 0, duration: 0 };
            pages[v.page].count++;
            pages[v.page].duration += v.duration || 0;
        });
        const topPages = Object.values(pages).sort((a, b) => b.count - a.count);

        // Product views
        const productViews = this.getProductViews();
        const topProducts = Object.entries(productViews)
            .map(([id, data]) => ({ id, name: data.name, count: data.count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Referrers
        const referrers = {};
        visits.forEach(v => {
            let ref = 'Direct';
            if (v.referrer && v.referrer !== 'direct') {
                try { ref = new URL(v.referrer).hostname.replace('www.', ''); }
                catch { ref = v.referrer; }
            }
            referrers[ref] = (referrers[ref] || 0) + 1;
        });
        const topReferrers = Object.entries(referrers)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return {
            total: visits.length,
            today: todayVisits.length,
            yesterday: yesterdayVisits.length,
            todayDelta: pct(todayVisits.length, yesterdayVisits.length),
            last7: last7Visits.length,
            last7Delta: pct(last7Visits.length, prev7Visits.length),
            last30: last30Visits.length,
            last30Delta: pct(last30Visits.length, prev30Visits.length),
            avgDuration: avg(visits),
            avgDuration30: avg(last30Visits),
            bounceRate: bounce(visits),
            bounceRate30: bounce(last30Visits),
            topCountry: topCountries[0] || { code: 'XX', name: 'Aucune', count: 0 },
            topCountries,
            devices,
            browsers,
            last7Days: lastNDays(7),
            last30Days: lastNDays(30),
            recentVisits: visits.slice(0, 15),
            topProducts,
            topPages,
            topReferrers
        };
    },

    // ── CHART HELPERS ───────────────────────────────────────
    destroyChart(name) {
        if (this._charts[name]) {
            try { this._charts[name].destroy(); } catch (e) { /* noop */ }
            delete this._charts[name];
        }
    },

    renderActivityChart(containerId) {
        const m = this.computeMetrics();
        const n = this._activityRange === '30d' ? 30 : 7;
        const data = n === 30 ? m.last30Days : m.last7Days;

        const canvas = document.getElementById('chart-activity');
        if (!canvas) return;
        this.destroyChart('activity');

        this._charts.activity = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.map(d => n === 30 ? d.day : d.weekday),
                datasets: [{
                    label: 'Visites',
                    data: data.map(d => d.count),
                    backgroundColor: P.primarySoft,
                    hoverBackgroundColor: P.primary,
                    borderRadius: 6,
                    maxBarThickness: 28
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                const idx = items[0].dataIndex;
                                return data[idx] ? data[idx].date : '';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0, color: P.textMuted },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        ticks: { color: P.textMuted, maxRotation: n === 30 ? 60 : 0 },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    renderDonutChart(name, canvasId, dataMap, labelMap) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        this.destroyChart(name);

        const entries = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) {
            return;
        }
        const labels = entries.map(([k]) => (labelMap && labelMap[k] ? labelMap[k] : k));
        const values = entries.map(([, v]) => v);

        this._charts[name] = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: [P.primary, P.gold, '#3b82f6', '#a78bfa', '#f59e0b', '#94a3b8'],
                    borderWidth: 2,
                    borderColor: 'var(--surface, #fff)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: P.textMuted, boxWidth: 10, padding: 12 }
                    }
                }
            }
        });
    },

    // ── RENDER ────────────────────────────────────────────────
    render(containerId) {
        const self = this;
        const container = document.getElementById(containerId);
        if (!container) return;

        this._lastRefresh = new Date();
        const m = this.computeMetrics();
        const deltaClass = (v) => v > 0 ? 'delta-up' : (v < 0 ? 'delta-down' : 'delta-flat');
        const deltaSign = (v) => (v > 0 ? '+' : '') + v + ' %';

        container.innerHTML = `
            <!-- KPI CARDS avec comparaisons -->
            <div class="analytics-kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-eye"></i></div>
                    <div class="kpi-value">${m.total}</div>
                    <div class="kpi-label">Visites totales</div>
                    <div class="kpi-delta ${deltaClass(m.last7Delta)}">
                        <i class="fas fa-arrow-${m.last7Delta >= 0 ? 'up' : 'down'}"></i>
                        ${deltaSign(m.last7Delta)} <span class="kpi-delta-period">vs 7 j</span>
                    </div>
                </div>
                <div class="kpi-card kpi-highlight">
                    <div class="kpi-icon"><i class="fas fa-calendar-day"></i></div>
                    <div class="kpi-value">${m.today}</div>
                    <div class="kpi-label">Aujourd'hui</div>
                    <div class="kpi-delta ${deltaClass(m.todayDelta)}">
                        <i class="fas fa-arrow-${m.todayDelta >= 0 ? 'up' : 'down'}"></i>
                        ${deltaSign(m.todayDelta)} <span class="kpi-delta-period">vs hier</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-clock"></i></div>
                    <div class="kpi-value">${this.formatDuration(m.avgDuration)}</div>
                    <div class="kpi-label">Durée moyenne</div>
                    <div class="kpi-delta ${deltaClass(m.last30Delta)}">
                        <i class="fas fa-arrow-${m.last30Delta >= 0 ? 'up' : 'down'}"></i>
                        ${deltaSign(m.last30Delta)} <span class="kpi-delta-period">vs 30 j</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-sign-out-alt"></i></div>
                    <div class="kpi-value">${m.bounceRate}%</div>
                    <div class="kpi-label">Taux de rebond</div>
                    <div class="kpi-delta ${deltaClass(m.bounceRate - m.bounceRate30)}">
                        <i class="fas fa-arrow-${m.bounceRate >= m.bounceRate30 ? 'up' : 'down'}"></i>
                        ${deltaSign(m.bounceRate - m.bounceRate30)} <span class="kpi-delta-period">vs 30 j</span>
                    </div>
                </div>
            </div>

            <!-- CHARTS ROW: Activity (Chart.js) + Geo -->
            <div class="analytics-charts-row">
                <div class="analytics-card">
                    <h4 style="justify-content: space-between;">
                        <span><i class="fas fa-chart-bar"></i> Activité (7 / 30 jours)</span>
                        <div class="chart-range-toggle">
                            <button data-range="7d" class="${this._activityRange === '7d' ? 'active' : ''}">7 j</button>
                            <button data-range="30d" class="${this._activityRange === '30d' ? 'active' : ''}">30 j</button>
                        </div>
                    </h4>
                    <div class="chart-canvas-wrap" style="height: 220px;">
                        <canvas id="chart-activity"></canvas>
                    </div>
                </div>
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

            <!-- SECOND ROW: Donuts Devices + Browsers -->
            <div class="analytics-charts-row">
                <div class="analytics-card analytics-card-sm">
                    <h4><i class="fas fa-mobile-alt"></i> Appareils</h4>
                    <div class="chart-canvas-wrap" style="height: 210px;">
                        <canvas id="chart-devices"></canvas>
                    </div>
                </div>
                <div class="analytics-card analytics-card-sm">
                    <h4><i class="fas fa-globe"></i> Navigateurs</h4>
                    <div class="chart-canvas-wrap" style="height: 210px;">
                        <canvas id="chart-browsers"></canvas>
                    </div>
                </div>
                <div class="analytics-card analytics-card-sm">
                    <h4><i class="fas fa-file-alt"></i> Pages les plus visitées</h4>
                    <div class="top-products-list">
                        ${m.topPages.length === 0 ? '<p class="analytics-empty">Aucune donnée</p>' :
                m.topPages.slice(0, 6).map((p, i) => `
                            <div class="top-product-row">
                                <span class="top-product-rank">${i + 1}</span>
                                <span class="top-product-name">${p.page === '/' ? 'Accueil' : p.page}</span>
                                <span class="top-product-count">${p.count} vue${p.count > 1 ? 's' : ''}</span>
                            </div>
                          `).join('')}
                    </div>
                </div>
            </div>

            <!-- THIRD ROW: Referrers + Top Projets -->
            <div class="analytics-charts-row">
                <div class="analytics-card">
                    <h4><i class="fas fa-external-link-alt"></i> Sources de trafic</h4>
                    <div class="geo-list">
                        ${m.topReferrers.length === 0 ? '<p class="analytics-empty">Aucune donnée</p>' :
                m.topReferrers.slice(0, 6).map(r => {
                    const max = Math.max(...m.topReferrers.map(x => x.count), 1);
                    const pct = Math.round((r.count / max) * 100);
                    return `
                                <div class="breakdown-row">
                                    <span class="breakdown-label"><i class="fas fa-share-alt"></i>${r.name}</span>
                                    <div class="geo-bar-track">
                                        <div class="geo-bar-fill" style="width: ${pct}%;"></div>
                                    </div>
                                    <span class="geo-pct">${r.count}</span>
                                </div>
                            `;
                }).join('')}
                    </div>
                </div>
                <div class="analytics-card">
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
                <span class="analytics-live-badge" id="analytics-live-badge">
                    <span class="live-dot"></span> Live · mis à jour ${this._lastRefresh.toLocaleTimeString('fr-FR')}
                </span>
                <button id="analytics-purge-btn" class="btn btn-outline" style="border-color: var(--warning); color: var(--warning); margin-left: auto;">
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

        // Charts
        this.renderActivityChart(containerId);
        this.renderDonutChart('devices', 'chart-devices', m.devices, {
            desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablette'
        });
        this.renderDonutChart('browsers', 'chart-browsers', m.browsers);

        // Range toggle
        container.querySelectorAll('.chart-range-toggle button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._activityRange = e.target.dataset.range;
                this.render(containerId);
            });
        });

        // Bind actions
        const purgeBtn = document.getElementById('analytics-purge-btn');
        const exportBtn = document.getElementById('analytics-export-btn');
        const refreshBtn = document.getElementById('analytics-refresh-btn');

        if (purgeBtn) purgeBtn.onclick = function () { self.purge(containerId); };
        if (exportBtn) exportBtn.onclick = function () { self.exportCSV(); };
        if (refreshBtn) refreshBtn.onclick = function () { self.render(containerId); };

        // Auto-refresh (30s) — un seul timer global
        if (!this._timer) {
            this._timer = setInterval(() => {
                if (document.getElementById(containerId)) self.render(containerId);
            }, 30000);
        }
    },

    // ── BREAKDOWN RENDERER (fallback texte) ──────────────────
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