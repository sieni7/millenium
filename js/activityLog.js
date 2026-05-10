/**
 * Activity Log — #2 Journal d'activité
 * 🗄️ Backend Agent — Storage, logging, CRUD events
 */
const ActivityLog = {
    KEY: 'millenium_activity_log',

    getAll() {
        try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
        catch { return []; }
    },

    add(action, details, section) {
        const logs = this.getAll();
        logs.unshift({
            id: 'log_' + Date.now(),
            timestamp: new Date().toISOString(),
            action,
            details,
            section
        });
        // Keep max 500 entries
        if (logs.length > 500) logs.length = 500;
        localStorage.setItem(this.KEY, JSON.stringify(logs));
        this.updateBadge();
    },

    clear() {
        if (!confirm('Supprimer tout le journal d\'activité ?')) return false;
        localStorage.removeItem(this.KEY);
        this.updateBadge();
        return true;
    },

    updateBadge() {
        const badge = document.getElementById('journal-badge');
        if (!badge) return;
        const logs = this.getAll();
        const today = new Date().toISOString().split('T')[0];
        const todayCount = logs.filter(l => l.timestamp.startsWith(today)).length;
        if (todayCount > 0) {
            badge.textContent = todayCount;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    },

    render(filter = 'all') {
        const logs = this.getAll();
        const filtered = filter === 'all' ? logs : logs.filter(l => l.action === filter);
        const tbody = document.getElementById('journal-body');
        const empty = document.getElementById('journal-empty');
        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }
        if (empty) empty.style.display = 'none';

        const badgeClass = { create: 'badge-create', update: 'badge-update', delete: 'badge-delete', config: 'badge-config' };
        const badgeLabel = { create: 'Création', update: 'Modification', delete: 'Suppression', config: 'Config' };

        tbody.innerHTML = filtered.slice(0, 100).map(log => {
            const d = new Date(log.timestamp);
            const dateStr = d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const cls = badgeClass[log.action] || 'badge-config';
            const label = badgeLabel[log.action] || log.action;
            return `<tr>
                <td style="white-space:nowrap;">${dateStr}</td>
                <td><span class="journal-action-badge ${cls}">${label}</span></td>
                <td>${log.details}</td>
                <td style="color:var(--text-muted);">${log.section || '—'}</td>
            </tr>`;
        }).join('');
    },

    exportCSV() {
        const logs = this.getAll();
        if (logs.length === 0) return;
        const headers = ['Date', 'Action', 'Détails', 'Section'];
        const rows = logs.map(l => [l.timestamp, l.action, l.details, l.section]);
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `millenium_journal_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
};

export default ActivityLog;
