import Toast from './toast.js';
import AdminAnalytics from './adminAnalytics.js';
import ActivityLog from './activityLog.js';
import DragDrop from './dragDrop.js';
import ImageUpload from './imageUpload.js';
import AdminDarkMode from './darkMode.admin.js';
import GithubSync from './githubSync.js';

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
    team: { icon: 'fas fa-users', label: 'Équipe' },
    partners: { icon: 'fas fa-handshake', label: 'Partenaires' },
    testimonials: { icon: 'fas fa-quote-right', label: 'Témoignages' },
    journal: { icon: 'fas fa-clipboard-list', label: 'Journal' }
};

window.markDirty = () => {
    isDirty = true;
    document.getElementById('save-bar').style.display = 'flex';
};

// ── AUTH ──────────────────────────────────────────────────
// Mots de passe stockés en SHA-256 (jamais en clair).
// Hashes des comptes autorisés — à remplacer via A4 (config distante).
const AUTH_HASHES = new Set([
    'e2d2e2735b2f471b51f19f4ef1f2eb57801ef11fd230ba4291eeaa67847abc5f', // MilleniumAdmin2026
    '6aef9995b92181c3233da005a2e34e5ef3d1d61fb23eb3a2d7c052a74fed9b87'  // Millenium2026
]);

const AUTH_MAX_ATTEMPTS = 5;
const AUTH_LOCKOUT_MS = 30000;

const sha256 = async (text) => {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const lockoutRemaining = () => {
    const until = parseInt(sessionStorage.getItem('admin_lock_until') || '0', 10);
    return Math.max(0, until - Date.now());
};

const checkAuth = () => {
    const auth = sessionStorage.getItem('admin_auth');
    const pending = sessionStorage.getItem('admin_pending_login');
    if ((auth === 'true' || pending === 'true') && lockoutRemaining() === 0) {
        document.getElementById('login-overlay').classList.remove('active');
        document.getElementById('admin-dashboard').style.display = 'flex';
        loadConfig();
        AdminAnalytics.render('analytics-dashboard-container');
        ActivityLog.updateBadge();
    }
};

const login = async () => {
    const password = document.getElementById('admin-password').value;
    const loginError = document.getElementById('login-error');
    const remaining = lockoutRemaining();

    if (remaining > 0) {
        loginError.textContent = `Trop de tentatives. Réessayez dans ${Math.ceil(remaining / 1000)} s.`;
        loginError.style.display = 'block';
        return;
    }

    const hash = await sha256(password || '');
    if (AUTH_HASHES.has(hash)) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_pending_login', 'true');
        sessionStorage.removeItem('admin_fail_count');
        sessionStorage.removeItem('admin_lock_until');
        ActivityLog.add('config', 'Connexion au backoffice', 'Auth');
        checkAuth();
    } else {
        let fails = parseInt(sessionStorage.getItem('admin_fail_count') || '0', 10) + 1;
        if (fails >= AUTH_MAX_ATTEMPTS) {
            sessionStorage.setItem('admin_lock_until', String(Date.now() + AUTH_LOCKOUT_MS));
            sessionStorage.removeItem('admin_fail_count');
            loginError.textContent = 'Trop de tentatives. Backoffice verrouillé 30 s.';
        } else {
            sessionStorage.setItem('admin_fail_count', String(fails));
            loginError.textContent = `Mot de passe incorrect (${AUTH_MAX_ATTEMPTS - fails} essai(s) restant(s)).`;
            ActivityLog.add('config', `Tentative de connexion échouée (${fails}/${AUTH_MAX_ATTEMPTS})`, 'Auth');
        }
        loginError.style.display = 'block';
    }
};

const logout = () => {
    ActivityLog.add('config', 'Déconnexion du backoffice', 'Auth');
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_pending_login');
    sessionStorage.removeItem('admin_fail_count');
    window.location.href = '/';
};

// ── CONFIG ───────────────────────────────────────────────
// L'admin a été construit sur l'ancien modèle de données (products/activities/
// contact/company.stats), tandis que le config.json MCI utilise projects/
// services/company.*. Ce pont évite les crashs (forEach sur undefined) et
// conserve l'architecture existante sans toucher au config.json.
function normalizeConfig(cfg) {
    cfg = cfg || {};
    if (!cfg.company) cfg.company = {};
    if (!cfg.hero) cfg.hero = { slides: [] };
    if (!Array.isArray(cfg.hero.slides)) cfg.hero.slides = [];

    // Hero slides : l'admin lit `text`, le config public utilise `subtitle`
    cfg.hero.slides = cfg.hero.slides.map(s => ({
        ...s,
        title: s.title || '',
        text: s.text || s.subtitle || '',
        subtitle: s.subtitle || s.text || '',
        cta: s.cta || '',
        image: s.image || ''
    }));

    // Projets (admin: products) ← config: projects
    const rawProducts = Array.isArray(cfg.projects) ? cfg.projects : (Array.isArray(cfg.products) ? cfg.products : []);
    cfg.products = rawProducts.map(p => {
        const mapped = {
            id: p.id || 'proj_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            name: p.title || p.name || 'Projet',
            zone: p.subtitle || p.zone || '',
            standing: p.standing || '',
            type: p.type || (p.results ? 'Étude de cas' : 'Projet'),
            description: p.context || p.description || '',
            image: p.image || (p.images && p.images[0]) || '',
            images: p.images || (p.image ? [p.image] : [])
        };
        // Conserve les données d'étude de cas (écrites en writeBack) sans perte
        mapped.challenge = p.challenge || mapped.description;
        mapped.solution = p.solution || '';
        mapped.results = p.results || '';
        mapped.context = p.context || mapped.description;
        return mapped;
    });

    // Activités (admin: activities) ← config: services
    const rawActivities = Array.isArray(cfg.services) ? cfg.services : (Array.isArray(cfg.activities) ? cfg.activities : []);
    cfg.activities = rawActivities.map(s => ({
        id: s.id || 'act_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title: s.title || 'Activité',
        icon: s.icon || 'fas fa-circle',
        description: s.description || ''
    }));

    // Stats (anciennement company.stats) : défaut cohérent si absent du config
    if (!Array.isArray(cfg.company.stats) || cfg.company.stats.length === 0) {
        cfg.company.stats = [
            { key: 'coops', value: 12, suffix: '+' },
            { key: 'farmers', value: 850, suffix: '+' },
            { key: 'years', value: 5, suffix: '' },
            { key: 'success_rate', value: 98, suffix: '%' }
        ];
        if (!cfg.i18n) cfg.i18n = { fr: {} };
        cfg.i18n.fr.coops = 'Coopératives accompagnées';
        cfg.i18n.fr.farmers = 'Producteurs formés';
        cfg.i18n.fr.years = 'Années d\'expérience';
        cfg.i18n.fr.success_rate = 'Taux de réussite';
    }

    // Contact (admin: config.contact) ← config: company.phone/email
    if (!cfg.contact) {
        cfg.contact = {
            email: cfg.company.email || '',
            phone: cfg.company.phone || '',
            webhook_url: cfg.company.webhook_url || ''
        };
    }
    // Préserve social (LinkedIn/Facebook/WhatsApp) manipulé en Profil
    if (!cfg.company.social) cfg.company.social = {};

    // Team (membres directs)
    cfg.team = Array.isArray(cfg.team) ? cfg.team : [];
    cfg.team = cfg.team.map(t => ({
        id: t.id || 'member_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        name: t.name || '',
        role: t.role || '',
        description: t.description || '',
        photo: t.photo || ''
    }));

    // Partenaires
    cfg.partners = Array.isArray(cfg.partners) ? cfg.partners : [];
    cfg.partners = cfg.partners.map(p => ({
        id: p.id || 'part_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        name: p.name || '',
        logo: p.logo || '',
        url: p.url || ''
    }));

    // Témoignages
    cfg.testimonials = Array.isArray(cfg.testimonials) ? cfg.testimonials : [];
    cfg.testimonials = cfg.testimonials.map(t => ({
        id: t.id || 'testi_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        name: t.name || '',
        role: t.role || '',
        organization: t.organization || '',
        text: t.text || t.message || ''
    }));

    if (!cfg.settings) cfg.settings = {};
    if (!cfg.i18n) cfg.i18n = { fr: {} };
    return cfg;
}

// Renvoie les données éditables vers les clés publiques (projects/services/company)
function writeBackConfig() {
    if (!currentConfig) return;
    currentConfig.projects = currentConfig.products.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: p.zone,
        context: p.context || p.description,
        challenge: p.challenge || p.description,
        solution: p.solution || '',
        results: p.results || '',
        image: p.image,
        images: p.images || [],
        standing: p.standing || '',
        type: p.type || 'Projet'
    }));
    currentConfig.services = currentConfig.activities.map(a => ({
        id: a.id,
        title: a.title,
        icon: a.icon,
        description: a.description
    }));
    // Hero slides : renvoyer `text` → `subtitle` (clé publique)
    currentConfig.hero.slides = currentConfig.hero.slides.map(s => ({
        ...s,
        subtitle: s.subtitle || s.text || '',
        text: s.text || s.subtitle || ''
    }));
    currentConfig.company.email = currentConfig.contact.email || '';
    currentConfig.company.phone = currentConfig.contact.phone || '';
    if (currentConfig.contact.webhook_url) currentConfig.company.webhook_url = currentConfig.contact.webhook_url;

    // Préserve slogan, mission, adresse, whatsapp, réseaux (Profil)
    currentConfig.company.slogan = currentConfig.company.slogan || '';
    currentConfig.company.mission = currentConfig.company.mission || '';
    currentConfig.company.address = currentConfig.company.address || '';
    currentConfig.company.whatsapp = currentConfig.contact.whatsapp || currentConfig.company.whatsapp || '';
    if (!currentConfig.company.social) currentConfig.company.social = {};
    currentConfig.company.social.linkedin = currentConfig.company.social.linkedin || '';
    currentConfig.company.social.facebook = currentConfig.company.social.facebook || '';
    currentConfig.company.social.instagram = currentConfig.company.social.instagram || '';
    currentConfig.company.social.whatsapp = currentConfig.company.social.whatsapp || `https://wa.me/225${(currentConfig.company.whatsapp || '').replace(/\D/g, '')}`;

    // Team / Partenaires / Témoignages (formats publics attendus)
    currentConfig.team = currentConfig.team.map(t => ({
        name: t.name || '',
        role: t.role || '',
        description: t.description || '',
        photo: t.photo || ''
    }));
    currentConfig.partners = currentConfig.partners.map(p => ({
        name: p.name || '',
        logo: p.logo || '',
        url: p.url || ''
    }));
    currentConfig.testimonials = currentConfig.testimonials.map(t => ({
        name: t.name || '',
        role: t.role || '',
        organization: t.organization || '',
        text: t.text || ''
    }));
    if (Array.isArray(currentConfig.products)) {
        currentConfig.company.stats = currentConfig.company.stats.filter(s =>
            typeof s.key === 'string' && s.key && typeof s.value !== 'undefined'
        );
        if (!currentConfig.i18n) currentConfig.i18n = { fr: {} };
    }
}

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
        originalConfig = normalizeConfig(originalConfig);
        currentConfig = JSON.parse(JSON.stringify(originalConfig));

        // Backfill images compat (ancien: p.image seul → p.images[])
        currentConfig.products.forEach(p => {
            if (p.image && (!p.images || p.images.length === 0)) p.images = [p.image];
            if (!p.images) p.images = [];
        });

        renderProfile();
        renderHero();
        renderActivities();
        renderScenarios();
        renderTeam();
        renderPartners();
        renderTestimonials();
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
        writeBackConfig();
        localStorage.setItem('millenium_config', JSON.stringify(currentConfig));
        Toast.show("✅ Configuration sauvegardée !", "success");
        ActivityLog.add('config', 'Configuration sauvegardée', 'Système');
        originalConfig = JSON.parse(JSON.stringify(currentConfig));
        isDirty = false;
        document.getElementById('save-bar').style.display = 'none';
    } catch (e) {
        console.error('Save failed:', e);
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            Toast.show("❌ Mémoire saturée ! Réduisez la taille des images.", "error", 5000);
        } else {
            Toast.show("Erreur de sauvegarde", "error");
        }
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
        originalConfig = normalizeConfig(await res.json());
        currentConfig = JSON.parse(JSON.stringify(originalConfig));
        renderProfile(); renderHero(); renderActivities(); renderScenarios();
        renderTeam(); renderPartners(); renderTestimonials();
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
    document.getElementById('edit-company-whatsapp').value = currentConfig.company.whatsapp || '';
    document.getElementById('edit-social-linkedin').value = currentConfig.company.social?.linkedin || '';
    document.getElementById('edit-social-facebook').value = currentConfig.company.social?.facebook || '';
    document.getElementById('edit-social-instagram').value = currentConfig.company.social?.instagram || '';
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
    
    // Global temp array for the form
    window._tempScenarioImages = [];

    if (id) {
        const p = currentConfig.products.find(prod => prod.id === id);
        document.getElementById('scenario-form-title').textContent = "Modifier le scénario";
        document.getElementById('form-scenario-id').value = p.id;
        document.getElementById('form-scenario-name').value = p.name;
        document.getElementById('form-scenario-lab').value = p.zone;
        document.getElementById('form-scenario-active').value = p.standing;
        document.getElementById('form-scenario-presentation').value = p.type;
        document.getElementById('form-scenario-challenge').value = p.challenge || '';
        document.getElementById('form-scenario-solution').value = p.solution || '';
        document.getElementById('form-scenario-results').value = p.results || '';
        document.getElementById('form-scenario-indication').value = p.description;

        // Load existing images
        window._tempScenarioImages = p.images ? [...p.images] : (p.image ? [p.image] : []);
    } else {
        document.getElementById('scenario-form-title').textContent = "Nouveau Scénario";
        document.getElementById('scenario-form').reset();
        document.getElementById('form-scenario-id').value = '';
        document.getElementById('form-scenario-presentation').value = 'Étude de cas';
        document.getElementById('form-scenario-challenge').value = '';
        document.getElementById('form-scenario-solution').value = '';
        document.getElementById('form-scenario-results').value = '';
        window._tempScenarioImages = [];
    }
    
    renderScenarioGallery();
};

const renderScenarioGallery = () => {
    const container = document.getElementById('scenario-gallery-previews');
    if (!container) return;
    
    container.innerHTML = window._tempScenarioImages.map((img, idx) => `
        <div class="gallery-item">
            <img src="${img}" alt="Preview">
            <button type="button" class="remove-btn" onclick="removeScenarioImage(${idx})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
};

window.removeScenarioImage = (idx) => {
    window._tempScenarioImages.splice(idx, 1);
    renderScenarioGallery();
};

window.addScenarioImage = (url) => {
    if (!url) return;
    window._tempScenarioImages.push(url);
    renderScenarioGallery();
    // Clear URL input if it was used
    const urlInput = document.getElementById('form-scenario-image-url');
    if (urlInput) urlInput.value = '';
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
    const images = window._tempScenarioImages || [];
    
    const data = {
        id: id || 'proj_' + Date.now(),
        name: document.getElementById('form-scenario-name').value,
        zone: document.getElementById('form-scenario-lab').value,
        standing: document.getElementById('form-scenario-active').value,
        type: document.getElementById('form-scenario-presentation').value,
        challenge: document.getElementById('form-scenario-challenge').value,
        solution: document.getElementById('form-scenario-solution').value,
        results: document.getElementById('form-scenario-results').value,
        images: images,
        image: images[0] || '', // Backward compatibility
        description: document.getElementById('form-scenario-indication').value
    };
    if (id) {
        const index = currentConfig.products.findIndex(p => p.id === id);
        currentConfig.products[index] = data;
        ActivityLog.add('update', `Projet modifié: ${data.name} (${images.length} images)`, 'Projets');
    } else {
        currentConfig.products.push(data);
        ActivityLog.add('create', `Projet créé: ${data.name} (${images.length} images)`, 'Projets');
    }
    window.markDirty();
    renderScenarios();
    document.getElementById('scenario-form-modal').classList.remove('active');
};

// ── CRUD TEAM ────────────────────────────────────────────
const renderTeam = () => {
    const tbody = document.getElementById('team-body');
    if (!tbody) return;
    tbody.innerHTML = currentConfig.team.length === 0
        ? '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Aucun membre — ajoutez-en un</td></tr>'
        : currentConfig.team.map((t, idx) => `
            <tr draggable="true" data-index="${idx}">
                <td><span class="drag-handle"><i class="fas fa-grip-vertical"></i></span> <strong>${t.name}</strong></td>
                <td>${t.role}</td>
                <td>${t.photo ? `<img src="${t.photo}" alt="${t.name}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;">` : '—'}</td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit-btn" onclick="openTeamForm('${t.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" onclick="deleteTeam('${t.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

    DragDrop.init(tbody, (from, to) => {
        DragDrop.reorderArray(currentConfig.team, from, to);
        ActivityLog.add('update', `Membre réordonné: ${from + 1} → ${to + 1}`, 'Équipe');
        window.markDirty();
        renderTeam();
    });
};

window.openTeamForm = (id) => {
    const modal = document.getElementById('team-form-modal');
    modal.classList.add('active');
    if (id) {
        const t = currentConfig.team.find(m => m.id === id);
        document.getElementById('team-form-title').textContent = "Modifier le membre";
        document.getElementById('form-team-id').value = t.id;
        document.getElementById('form-team-name').value = t.name;
        document.getElementById('form-team-role').value = t.role;
        document.getElementById('form-team-desc').value = t.description;
        document.getElementById('form-team-photo').value = t.photo;
    } else {
        document.getElementById('team-form-title').textContent = "Nouveau membre";
        document.getElementById('team-form').reset();
        document.getElementById('form-team-id').value = '';
    }
};

window.deleteTeam = (id) => {
    const t = currentConfig.team.find(m => m.id === id);
    if (confirm(`Supprimer ${t?.name || 'ce membre'} ?`)) {
        currentConfig.team = currentConfig.team.filter(m => m.id !== id);
        ActivityLog.add('delete', `Membre supprimé: ${t?.name || id}`, 'Équipe');
        window.markDirty();
        renderTeam();
    }
};

const handleTeamSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('form-team-id').value;
    const data = {
        id: id || 'member_' + Date.now(),
        name: document.getElementById('form-team-name').value,
        role: document.getElementById('form-team-role').value,
        description: document.getElementById('form-team-desc').value,
        photo: document.getElementById('form-team-photo').value
    };
    if (id) {
        const index = currentConfig.team.findIndex(m => m.id === id);
        currentConfig.team[index] = data;
        ActivityLog.add('update', `Membre modifié: ${data.name}`, 'Équipe');
    } else {
        currentConfig.team.push(data);
        ActivityLog.add('create', `Membre ajouté: ${data.name}`, 'Équipe');
    }
    window.markDirty();
    renderTeam();
    document.getElementById('team-form-modal').classList.remove('active');
};

// ── CRUD PARTNERS ────────────────────────────────────────
const renderPartners = () => {
    const tbody = document.getElementById('partners-body');
    if (!tbody) return;
    tbody.innerHTML = currentConfig.partners.length === 0
        ? '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Aucun partenaire — la section sera masquée sur le site public</td></tr>'
        : currentConfig.partners.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.logo ? `<img src="${p.logo}" alt="${p.name}" style="height:32px;max-width:90px;object-fit:contain;">` : '<i class="fas fa-handshake" style="color: var(--text-muted);"></i>'}</td>
                <td>${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.url}</a>` : '—'}</td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit-btn" onclick="openPartnerForm('${p.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" onclick="deletePartner('${p.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
};

window.openPartnerForm = (id) => {
    const modal = document.getElementById('partner-form-modal');
    modal.classList.add('active');
    if (id) {
        const p = currentConfig.partners.find(x => x.id === id);
        document.getElementById('partner-form-title').textContent = "Modifier le partenaire";
        document.getElementById('form-partner-id').value = p.id;
        document.getElementById('form-partner-name').value = p.name;
        document.getElementById('form-partner-logo').value = p.logo;
        document.getElementById('form-partner-url').value = p.url;
    } else {
        document.getElementById('partner-form-title').textContent = "Nouveau partenaire";
        document.getElementById('partner-form').reset();
        document.getElementById('form-partner-id').value = '';
    }
};

window.deletePartner = (id) => {
    const p = currentConfig.partners.find(x => x.id === id);
    if (confirm(`Supprimer ${p?.name || 'ce partenaire'} ?`)) {
        currentConfig.partners = currentConfig.partners.filter(x => x.id !== id);
        ActivityLog.add('delete', `Partenaire supprimé: ${p?.name || id}`, 'Partenaires');
        window.markDirty();
        renderPartners();
    }
};

const handlePartnerSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('form-partner-id').value;
    const data = {
        id: id || 'part_' + Date.now(),
        name: document.getElementById('form-partner-name').value,
        logo: document.getElementById('form-partner-logo').value,
        url: document.getElementById('form-partner-url').value
    };
    if (id) {
        const index = currentConfig.partners.findIndex(x => x.id === id);
        currentConfig.partners[index] = data;
        ActivityLog.add('update', `Partenaire modifié: ${data.name}`, 'Partenaires');
    } else {
        currentConfig.partners.push(data);
        ActivityLog.add('create', `Partenaire ajouté: ${data.name}`, 'Partenaires');
    }
    window.markDirty();
    renderPartners();
    document.getElementById('partner-form-modal').classList.remove('active');
};

// ── CRUD TESTIMONIALS ────────────────────────────────────
const renderTestimonials = () => {
    const tbody = document.getElementById('testimonials-body');
    if (!tbody) return;
    tbody.innerHTML = currentConfig.testimonials.length === 0
        ? '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Aucun témoignage — recueillez vos premiers retours clients</td></tr>'
        : currentConfig.testimonials.map(t => `
            <tr>
                <td><strong>${t.name}</strong></td>
                <td>${[t.role, t.organization].filter(Boolean).join(' · ')}</td>
                <td>${t.text && t.text.length > 90 ? t.text.substring(0, 90) + '…' : (t.text || '')}</td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit-btn" onclick="openTestimonialForm('${t.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" onclick="deleteTestimonial('${t.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
};

window.openTestimonialForm = (id) => {
    const modal = document.getElementById('testimonial-form-modal');
    modal.classList.add('active');
    if (id) {
        const t = currentConfig.testimonials.find(x => x.id === id);
        document.getElementById('testimonial-form-title').textContent = "Modifier le témoignage";
        document.getElementById('form-testimonial-id').value = t.id;
        document.getElementById('form-testimonial-name').value = t.name;
        document.getElementById('form-testimonial-role').value = t.role;
        document.getElementById('form-testimonial-organization').value = t.organization;
        document.getElementById('form-testimonial-text').value = t.text;
    } else {
        document.getElementById('testimonial-form-title').textContent = "Nouveau témoignage";
        document.getElementById('testimonial-form').reset();
        document.getElementById('form-testimonial-id').value = '';
    }
};

window.deleteTestimonial = (id) => {
    const t = currentConfig.testimonials.find(x => x.id === id);
    if (confirm(`Supprimer le témoignage de ${t?.name || 'cet auteur'} ?`)) {
        currentConfig.testimonials = currentConfig.testimonials.filter(x => x.id !== id);
        ActivityLog.add('delete', `Témoignage supprimé: ${t?.name || id}`, 'Témoignages');
        window.markDirty();
        renderTestimonials();
    }
};

const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('form-testimonial-id').value;
    const data = {
        id: id || 'testi_' + Date.now(),
        name: document.getElementById('form-testimonial-name').value,
        role: document.getElementById('form-testimonial-role').value,
        organization: document.getElementById('form-testimonial-organization').value,
        text: document.getElementById('form-testimonial-text').value
    };
    if (id) {
        const index = currentConfig.testimonials.findIndex(x => x.id === id);
        currentConfig.testimonials[index] = data;
        ActivityLog.add('update', `Témoignage modifié: ${data.name}`, 'Témoignages');
    } else {
        currentConfig.testimonials.push(data);
        ActivityLog.add('create', `Témoignage ajouté: ${data.name}`, 'Témoignages');
    }
    window.markDirty();
    renderTestimonials();
    document.getElementById('testimonial-form-modal').classList.remove('active');
};

// ── SERVER SAVE (C19) ────────────────────────────────────
const serverSave = async () => {
    try {
        writeBackConfig();
        const res = await fetch('/api/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentConfig, null, 2)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        if (json.success) {
            Toast.show("✅ Configuration écrite sur public/config.json", "success");
            ActivityLog.add('config', 'Configuration sauvegardée sur le serveur', 'Système');
        } else {
            throw new Error(json.error || 'Erreur serveur');
        }
    } catch (e) {
        Toast.show(`Serveur: ${e.message} — disponible en dev uniquement`, "error", 4000);
    }
};

// ── IMPORT CONFIG (C20) ──────────────────────────────────
const importConfig = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const parsed = JSON.parse(ev.target.result);
            if (!parsed || typeof parsed !== 'object' || !parsed.company) {
                throw new Error('Structure invalide');
            }
            if (!confirm('Importer ce fichier ? Les modifications non sauvegardées seront perdues.')) return;
            originalConfig = normalizeConfig(parsed);
            currentConfig = JSON.parse(JSON.stringify(originalConfig));
            currentConfig.products.forEach(p => {
                if (p.image && (!p.images || p.images.length === 0)) p.images = [p.image];
                if (!p.images) p.images = [];
            });
            renderProfile(); renderHero(); renderActivities(); renderScenarios();
            renderTeam(); renderPartners(); renderTestimonials();
            window.markDirty();
            ActivityLog.add('config', 'Configuration importée depuis un fichier', 'Système');
            Toast.show("📂 Configuration importée — vérifiez puis sauvegardez", "success", 4000);
        } catch (e) {
            Toast.show("Fichier JSON invalide", "error");
        }
    };
    reader.readAsText(file);
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

    // Gallery image upload for scenarios
    ImageUpload.init({
        dropzone: 'scenario-dropzone',
        fileInput: 'scenario-file-input',
        textInput: 'form-scenario-image-url',
        onImageChange: (val) => {
            if (val) window.addScenarioImage(val);
        }
    });

    // Journal controls (#2)
    const journalFilter = document.getElementById('journal-filter');
    if (journalFilter) journalFilter.addEventListener('change', () => ActivityLog.render(journalFilter.value));
    const journalExport = document.getElementById('journal-export-btn');
    if (journalExport) journalExport.addEventListener('click', () => ActivityLog.exportCSV());
    const journalClear = document.getElementById('journal-clear-btn');
    if (journalClear) journalClear.addEventListener('click', () => { if (ActivityLog.clear()) ActivityLog.render(); });

    // Team / Partners / Testimonials buttons
    document.getElementById('add-team-btn').addEventListener('click', () => window.openTeamForm());
    document.getElementById('team-form').addEventListener('submit', handleTeamSubmit);
    document.getElementById('add-partner-btn').addEventListener('click', () => window.openPartnerForm());
    document.getElementById('partner-form').addEventListener('submit', handlePartnerSubmit);
    document.getElementById('add-testimonial-btn').addEventListener('click', () => window.openTestimonialForm());
    document.getElementById('testimonial-form').addEventListener('submit', handleTestimonialSubmit);

    // Import / Server save
    document.getElementById('import-config-btn').addEventListener('click', () => document.getElementById('import-config-file').click());
    document.getElementById('import-config-file').addEventListener('change', (e) => {
        if (e.target.files[0]) importConfig(e.target.files[0]);
        e.target.value = '';
    });
    const serverBtn = document.getElementById('server-save-btn');
    if (serverBtn) {
        // Disponible uniquement en dev (plugin vite save-config)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            serverBtn.disabled = false;
            serverBtn.title = "Écrire public/config.json côté serveur (dev)";
        }
        serverBtn.addEventListener('click', serverSave);
    }

    // Auto-save simple fields
    ['edit-company-name', 'edit-company-email', 'edit-company-phone', 'edit-webhook-url', 'edit-company-address', 'edit-company-whatsapp', 'edit-social-linkedin', 'edit-social-facebook', 'edit-social-instagram'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            if (id === 'edit-company-name') currentConfig.company.name = e.target.value;
            if (id === 'edit-company-email') currentConfig.contact.email = e.target.value;
            if (id === 'edit-company-phone') currentConfig.contact.phone = e.target.value;
            if (id === 'edit-webhook-url') currentConfig.contact.webhook_url = e.target.value;
            if (id === 'edit-company-address') currentConfig.company.address = e.target.value;
            if (id === 'edit-company-whatsapp') currentConfig.company.whatsapp = e.target.value;
            if (id === 'edit-social-linkedin') { if (!currentConfig.company.social) currentConfig.company.social = {}; currentConfig.company.social.linkedin = e.target.value; }
            if (id === 'edit-social-facebook') { if (!currentConfig.company.social) currentConfig.company.social = {}; currentConfig.company.social.facebook = e.target.value; }
            if (id === 'edit-social-instagram') { if (!currentConfig.company.social) currentConfig.company.social = {}; currentConfig.company.social.instagram = e.target.value; }
            window.markDirty();
        });
    });

    // Activity icon live preview
    const iconInput = document.getElementById('form-activity-icon');
    const iconPreview = document.getElementById('activity-icon-preview');
    if (iconInput && iconPreview) {
        iconInput.addEventListener('input', () => {
            iconPreview.innerHTML = `<i class="${iconInput.value || 'fas fa-circle'}" style="font-size: 1.6rem;"></i>`;
        });
    }

    document.getElementById('edit-maintenance-mode').addEventListener('change', (e) => {
        if (!currentConfig.settings) currentConfig.settings = {};
        currentConfig.settings.maintenanceMode = e.target.checked;
        ActivityLog.add('config', `Mode maintenance ${e.target.checked ? 'activé' : 'désactivé'}`, 'Paramètres');
        window.markDirty();
    });

    // GitHub sync (Profil)
    GithubSync.init();
});
