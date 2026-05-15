import Toast from './toast.js';
import AdminAnalytics from './adminAnalytics.js';
import ActivityLog from './activityLog.js';
import DragDrop from './dragDrop.js';
import ImageUpload from './imageUpload.js';
import AdminDarkMode from './darkMode.admin.js';

Toast.init();

let currentConfig = null;
let originalConfig = null;
let isDirty = false;

// ── BREADCRUMB LABELS ────────────────────────────────────
const tabLabels = {
    audience: { icon: 'fas fa-chart-line', label: 'Audience' },
    profile: { icon: 'fas fa-building', label: 'Profil & Stats' },
    hero: { icon: 'fas fa-images', label: 'Hero & Accroches' },
    activities: { icon: 'fas fa-tasks', label: 'Activités' },
    scenarios: { icon: 'fas fa-home', label: 'Projets' },
    journal: { icon: 'fas fa-clipboard-list', label: 'Journal' }
};

window.markDirty = () => {
    isDirty = true;
    document.getElementById('save-bar').style.display = 'flex';
};

// ── AUTH ──────────────────────────────────────────────────
const checkAuth = () => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
        document.getElementById('login-overlay').classList.remove('active');
        document.getElementById('admin-dashboard').style.display = 'flex';
        loadConfig();
        AdminAnalytics.render('analytics-dashboard-container');
        ActivityLog.updateBadge();
    }
};

const login = () => {
    const password = document.getElementById('admin-password').value;
    if (password === 'MilleniumAdmin2026' || password === 'Millenium2026') {
        sessionStorage.setItem('admin_auth', 'true');
        ActivityLog.add('config', 'Connexion au backoffice', 'Auth');
        checkAuth();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
};

const logout = () => {
    ActivityLog.add('config', 'Déconnexion du backoffice', 'Auth');
    sessionStorage.removeItem('admin_auth');
    window.location.href = '/';
};

// ── CONFIG ───────────────────────────────────────────────
async function loadConfig() {
    try {
        const stored = localStorage.getItem('millenium_config');
        if (stored) {
            originalConfig = JSON.parse(stored);
            Toast.show("Configuration chargée", "success", 2000);
        } else {
            const res = await fetch('config.json');
            originalConfig = await res.json();
        }
        currentConfig = JSON.parse(JSON.stringify(originalConfig));
        renderProfile();
        renderHero();
        renderActivities();
        renderScenarios();
        ActivityLog.render();
    } catch (e) {
        console.error('Failed to load config:', e);
        Toast.show("Erreur de chargement", "error");
    }
}

const discardChanges = () => {
    if (confirm('Annuler toutes les modifications ?')) location.reload();
};

const saveConfig = () => {
    try {
        localStorage.setItem('millenium_config', JSON.stringify(currentConfig));
        Toast.show("✅ Configuration sauvegardée !", "success");
        ActivityLog.add('config', 'Configuration sauvegardée', 'Système');
        originalConfig = JSON.parse(JSON.stringify(currentConfig));
        isDirty = false;
        document.getElementById('save-bar').style.display = 'none';
    } catch (e) {
        Toast.show("Erreur de sauvegarde", "error");
    }
};

const exportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    Toast.show("📦 config.json exporté", "success", 3000);
};

const resetToDefault = async () => {
    if (!confirm('Réinitialiser aux valeurs par défaut ?')) return;
    try {
        localStorage.removeItem('millenium_config');
        const res = await fetch('config.json');
        originalConfig = await res.json();
        currentConfig = JSON.parse(JSON.stringify(originalConfig));
        renderProfile(); renderHero(); renderActivities(); renderScenarios();
        isDirty = false;
        document.getElementById('save-bar').style.display = 'none';
        ActivityLog.add('config', 'Configuration réinitialisée', 'Système');
        Toast.show("🔄 Réinitialisé", "success");
    } catch (e) {
        Toast.show("Erreur de réinitialisation", "error");
    }
};

// ── RENDERERS ────────────────────────────────────────────
const renderProfile = () => {
    document.getElementById('edit-company-name').value = currentConfig.company.name;
    document.getElementById('edit-company-email').value = currentConfig.contact.email;
    document.getElementById('edit-company-phone').value = currentConfig.contact.phone;
    document.getElementById('edit-webhook-url').value = currentConfig.contact.webhook_url;
    document.getElementById('edit-company-address').value = currentConfig.company.address;
    document.getElementById('edit-maintenance-mode').checked = currentConfig.settings?.maintenanceMode || false;

    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = currentConfig.company.stats.map((stat, idx) => `
        <div class="stat-group">
            <input type="text" value="${stat.value}" onchange="updateStat(${idx}, 'value', this.value)" style="width: 80px;" placeholder="Valeur">
            <input type="text" value="${stat.suffix}" onchange="updateStat(${idx}, 'suffix', this.value)" style="width: 50px;" placeholder="Suffixe">
            <small>${currentConfig.i18n.fr[stat.key] || stat.key}</small>
        </div>
    `).join('');
};

window.updateStat = (idx, field, value) => {
    if (field === 'value') currentConfig.company.stats[idx].value = parseInt(value) || value;
    if (field === 'suffix') currentConfig.company.stats[idx].suffix = value;
    window.markDirty();
};

const renderHero = () => {
    const container = document.getElementById('hero-slides-container');
    container.innerHTML = currentConfig.hero.slides.map((slide, idx) => `
        <div class="slide-group" draggable="true" data-index="${idx}">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
                <h4 style="margin:0;">Slide ${idx + 1}</h4>
            </div>
            <div class="form-group">
                <label>Titre</label>
                <input type="text" value="${slide.title}" oninput="updateSlide(${idx}, 'title', this.value)">
            </div>
            <div class="form-group">
                <label>Texte descriptif</label>
                <textarea style="height: 60px;" oninput="updateSlide(${idx}, 'text', this.value)">${slide.text}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Texte du bouton (CTA)</label>
                    <input type="text" value="${slide.cta}" oninput="updateSlide(${idx}, 'cta', this.value)">
                </div>
                <div class="form-group">
                    <label>Image (URL ou Import)</label>
                    <div class="image-upload-zone">
                        <input type="text" id="hero-image-${idx}" value="${slide.image}" oninput="updateSlide(${idx}, 'image', this.value)" placeholder="URL de l'image">
                        <div class="image-dropzone" id="hero-dropzone-${idx}">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Glissez ou <label for="hero-file-${idx}" class="upload-link">parcourez</label></span>
                            <input type="file" id="hero-file-${idx}" accept="image/jpeg,image/png,image/webp" style="display:none;">
                        </div>
                        <div class="image-preview-mini" id="hero-preview-${idx}" style="display:${slide.image ? 'inline-block' : 'none'};">
                            <img id="hero-preview-img-${idx}" src="${slide.image || ''}" alt="Preview">
                            <button type="button" class="remove-preview" onclick="removeHeroImage(${idx})"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    initHeroUploads();

    // Init drag & drop on hero slides
    DragDrop.init(container, (from, to) => {
        DragDrop.reorderArray(currentConfig.hero.slides, from, to);
        ActivityLog.add('update', `Slide réordonnée: ${from + 1} → ${to + 1}`, 'Hero');
        window.markDirty();
        renderHero();
    });
};

window.removeHeroImage = (idx) => {
    updateSlide(idx, 'image', '');
    renderHero();
};

const initHeroUploads = () => {
    currentConfig.hero.slides.forEach((slide, idx) => {
        ImageUpload.init({
            dropzone: `hero-dropzone-${idx}`,
            fileInput: `hero-file-${idx}`,
            preview: `hero-preview-${idx}`,
            previewImg: `hero-preview-img-${idx}`,
            textInput: `hero-image-${idx}`,
            onImageChange: (val) => {
                currentConfig.hero.slides[idx].image = val;
                window.markDirty();
            }
        });
    });
};

window.updateSlide = (idx, field, value) => {
    currentConfig.hero.slides[idx][field] = value;
    window.markDirty();
};

const renderActivities = () => {
    const tbody = document.getElementById('activities-body');
    tbody.innerHTML = currentConfig.activities.map((act, idx) => `
        <tr draggable="true" data-index="${idx}">
            <td><span class="drag-handle"><i class="fas fa-grip-vertical"></i></span></td>
            <td><strong><i class="${act.icon}"></i> ${act.title}</strong></td>
            <td>${act.description.substring(0, 50)}...</td>
            <td>
                <div class="actions">
                    <button class="action-btn edit-btn" onclick="openActivityForm('${act.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteActivity('${act.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');

    DragDrop.init(tbody, (from, to) => {
        DragDrop.reorderArray(currentConfig.activities, from, to);
        ActivityLog.add('update', `Activité réordonnée: ${from + 1} → ${to + 1}`, 'Activités');
        window.markDirty();
        renderActivities();
    });
};

const renderScenarios = () => {
    const tbody = document.getElementById('scenarios-body');
    tbody.innerHTML = currentConfig.products.map((p, idx) => `
        <tr draggable="true" data-index="${idx}">
            <td><span class="drag-handle"><i class="fas fa-grip-vertical"></i></span></td>
            <td><strong>${p.name}</strong><br><small>${p.type}</small></td>
            <td>${p.zone}</td>
            <td>${p.standing}</td>
            <td>
                <div class="actions">
                    <button class="action-btn edit-btn" onclick="openScenarioForm('${p.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteScenario('${p.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');

    DragDrop.init(tbody, (from, to) => {
        DragDrop.reorderArray(currentConfig.products, from, to);
        ActivityLog.add('update', `Projet réordonné: ${from + 1} → ${to + 1}`, 'Projets');
        window.markDirty();
        renderScenarios();
    });
};

// ── CRUD ACTIVITIES ──────────────────────────────────────
window.openActivityForm = (id) => {
    const modal = document.getElementById('activity-form-modal');
    modal.classList.add('active');
    if (id) {
        const act = currentConfig.activities.find(a => a.id === id);
        document.getElementById('activity-form-title').textContent = "Modifier l'activité";
        document.getElementById('form-activity-id').value = act.id;
        document.getElementById('form-activity-title').value = act.title;
        document.getElementById('form-activity-icon').value = act.icon;
        document.getElementById('form-activity-desc').value = act.description;
    } else {
        document.getElementById('activity-form-title').textContent = "Nouvelle Activité";
        document.getElementById('activity-form').reset();
        document.getElementById('form-activity-id').value = '';
    }
};

window.deleteActivity = (id) => {
    if (confirm('Supprimer cette activité ?')) {
        const act = currentConfig.activities.find(a => a.id === id);
        currentConfig.activities = currentConfig.activities.filter(a => a.id !== id);
        ActivityLog.add('delete', `Activité supprimée: ${act?.title || id}`, 'Activités');
        window.markDirty();
        renderActivities();
    }
};

const handleActivitySubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('form-activity-id').value;
    const data = {
        id: id || 'act_' + Date.now(),
        title: document.getElementById('form-activity-title').value,
        icon: document.getElementById('form-activity-icon').value,
        description: document.getElementById('form-activity-desc').value
    };
    if (id) {
        const index = currentConfig.activities.findIndex(a => a.id === id);
        currentConfig.activities[index] = data;
        ActivityLog.add('update', `Activité modifiée: ${data.title}`, 'Activités');
    } else {
        currentConfig.activities.push(data);
        ActivityLog.add('create', `Activité créée: ${data.title}`, 'Activités');
    }
    window.markDirty();
    renderActivities();
    document.getElementById('activity-form-modal').classList.remove('active');
};

// ── CRUD SCENARIOS ───────────────────────────────────────
window.openScenarioForm = (id) => {
    const modal = document.getElementById('scenario-form-modal');
    modal.classList.add('active');
    if (id) {
        const p = currentConfig.products.find(prod => prod.id === id);
        document.getElementById('scenario-form-title').textContent = "Modifier le scénario";
        document.getElementById('form-scenario-id').value = p.id;
        document.getElementById('form-scenario-name').value = p.name;
        document.getElementById('form-scenario-lab').value = p.zone;
        document.getElementById('form-scenario-active').value = p.standing;
        document.getElementById('form-scenario-presentation').value = p.type;
        document.getElementById('form-scenario-image').value = p.image;
        document.getElementById('form-scenario-indication').value = p.description;
    } else {
        document.getElementById('scenario-form-title').textContent = "Nouveau Scénario";
        document.getElementById('scenario-form').reset();
        document.getElementById('form-scenario-id').value = '';
    }
    // Init image preview for existing value
    const imgVal = document.getElementById('form-scenario-image').value;
    const prev = document.getElementById('scenario-preview');
    const prevImg = document.getElementById('scenario-preview-img');
    if (imgVal && (imgVal.startsWith('http') || imgVal.startsWith('data:'))) {
        if (prevImg) prevImg.src = imgVal;
        if (prev) prev.style.display = 'inline-block';
    } else {
        if (prev) prev.style.display = 'none';
    }
};

window.deleteScenario = (id) => {
    if (confirm('Supprimer ce scénario ?')) {
        const p = currentConfig.products.find(prod => prod.id === id);
        currentConfig.products = currentConfig.products.filter(prod => prod.id !== id);
        ActivityLog.add('delete', `Projet supprimé: ${p?.name || id}`, 'Projets');
        window.markDirty();
        renderScenarios();
    }
};

const handleScenarioSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('form-scenario-id').value;
    const data = {
        id: id || 'proj_' + Date.now(),
        name: document.getElementById('form-scenario-name').value,
        zone: document.getElementById('form-scenario-lab').value,
        standing: document.getElementById('form-scenario-active').value,
        type: document.getElementById('form-scenario-presentation').value,
        image: document.getElementById('form-scenario-image').value,
        description: document.getElementById('form-scenario-indication').value
    };
    if (id) {
        const index = currentConfig.products.findIndex(p => p.id === id);
        currentConfig.products[index] = data;
        ActivityLog.add('update', `Projet modifié: ${data.name}`, 'Projets');
    } else {
        currentConfig.products.push(data);
        ActivityLog.add('create', `Projet créé: ${data.name}`, 'Projets');
    }
    window.markDirty();
    renderScenarios();
    document.getElementById('scenario-form-modal').classList.remove('active');
};

// ── SIDEBAR & TABS (#3 — UX Architect) ───────────────────
const setupSidebar = () => {
    const sidebar = document.getElementById('admin-sidebar');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('sidebar-overlay');

    // Collapse toggle (desktop)
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
        });
        // Restore state
        if (localStorage.getItem('sidebar_collapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }
    }

    // Mobile drawer
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        });
    }

    // Tab switching via sidebar links
    document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
        link.addEventListener('click', () => {
            const tab = link.getAttribute('data-tab');
            // Update active states
            document.querySelectorAll('.sidebar-link[data-tab]').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
            // Update breadcrumb
            const info = tabLabels[tab] || { icon: 'fas fa-circle', label: tab };
            document.getElementById('breadcrumb-label').innerHTML = `<i class="${info.icon}"></i> ${info.label}`;
            // Refresh journal when switching to it
            if (tab === 'journal') ActivityLog.render();
            // Close mobile drawer
            sidebar.classList.remove('mobile-open');
            document.getElementById('sidebar-overlay').classList.remove('active');
        });
    });
};

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    AdminDarkMode.init();
    checkAuth();
    setupSidebar();

    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('admin-password').addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });
    document.getElementById('logout-btn').addEventListener('click', logout);

    document.getElementById('add-activity-btn').addEventListener('click', () => window.openActivityForm());
    document.getElementById('activity-form').addEventListener('submit', handleActivitySubmit);

    document.getElementById('add-scenario-btn').addEventListener('click', () => window.openScenarioForm());
    document.getElementById('scenario-form').addEventListener('submit', handleScenarioSubmit);

    document.getElementById('discard-btn').addEventListener('click', discardChanges);
    document.getElementById('save-config-btn').addEventListener('click', saveConfig);
    document.getElementById('export-config-btn').addEventListener('click', exportConfig);
    document.getElementById('reset-config-btn').addEventListener('click', resetToDefault);

    // Image upload for scenarios (#8)
    ImageUpload.init({
        dropzone: 'scenario-dropzone',
        fileInput: 'scenario-file-input',
        preview: 'scenario-preview',
        previewImg: 'scenario-preview-img',
        removeBtn: 'scenario-remove-preview',
        textInput: 'form-scenario-image'
    });

    // Journal controls (#2)
    const journalFilter = document.getElementById('journal-filter');
    if (journalFilter) journalFilter.addEventListener('change', () => ActivityLog.render(journalFilter.value));
    const journalExport = document.getElementById('journal-export-btn');
    if (journalExport) journalExport.addEventListener('click', () => ActivityLog.exportCSV());
    const journalClear = document.getElementById('journal-clear-btn');
    if (journalClear) journalClear.addEventListener('click', () => { if (ActivityLog.clear()) ActivityLog.render(); });

    // Auto-save simple fields
    ['edit-company-name', 'edit-company-email', 'edit-company-phone', 'edit-webhook-url', 'edit-company-address'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            if (id === 'edit-company-name') currentConfig.company.name = e.target.value;
            if (id === 'edit-company-email') currentConfig.contact.email = e.target.value;
            if (id === 'edit-company-phone') currentConfig.contact.phone = e.target.value;
            if (id === 'edit-webhook-url') currentConfig.contact.webhook_url = e.target.value;
            if (id === 'edit-company-address') currentConfig.company.address = e.target.value;
            window.markDirty();
        });
    });

    document.getElementById('edit-maintenance-mode').addEventListener('change', (e) => {
        if (!currentConfig.settings) currentConfig.settings = {};
        currentConfig.settings.maintenanceMode = e.target.checked;
        ActivityLog.add('config', `Mode maintenance ${e.target.checked ? 'activé' : 'désactivé'}`, 'Paramètres');
        window.markDirty();
    });
});
