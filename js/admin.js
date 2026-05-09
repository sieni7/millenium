import Toast from './toast.js';

Toast.init();

let currentConfig = null;
let originalConfig = null;
let isDirty = false;

window.markDirty = () => {
    isDirty = true;
    document.getElementById('save-bar').style.display = 'flex';
};

const checkAuth = () => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
        document.getElementById('login-overlay').classList.remove('active');
        document.getElementById('admin-dashboard').style.display = 'block';
        loadConfig();
    }
};

const login = () => {
    const password = document.getElementById('admin-password').value;
    if (password === 'MilleniumAdmin2026' || password === 'Millenium2026') {
        sessionStorage.setItem('admin_auth', 'true');
        checkAuth();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
};

const logout = () => {
    sessionStorage.removeItem('admin_auth');
    location.reload();
};

async function loadConfig() {
    try {
        const res = await fetch('config.json');
        originalConfig = await res.json();
        currentConfig = JSON.parse(JSON.stringify(originalConfig)); 

        renderProfile();
        renderHero();
        renderActivities();
        renderScenarios();
    } catch (e) {
        console.error('Failed to load config:', e);
        Toast.show("Erreur de chargement", "error");
    }
}

const discardChanges = () => {
    if (confirm('Annuler toutes les modifications ?')) {
        location.reload(); 
    }
};

const saveConfig = async () => {
    try {
        const response = await fetch('/api/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentConfig, null, 2)
        });
        
        if (response.ok) {
            Toast.show("Sauvegarde automatique réussie !", "success");
            originalConfig = JSON.parse(JSON.stringify(currentConfig));
            isDirty = false;
            document.getElementById('save-bar').style.display = 'none';
        } else {
            triggerDownload();
        }
    } catch(e) {
        // Mode Production (Netlify) : l'API locale n'existe pas, on télécharge.
        triggerDownload();
    }
};

const triggerDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    Toast.show("Export réussi ! Veuillez remplacer le fichier 'config.json' par celui téléchargé.", "success", 5000);
    
    originalConfig = JSON.parse(JSON.stringify(currentConfig));
    isDirty = false;
    document.getElementById('save-bar').style.display = 'none';
};

// --- RENDERERS ---

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
    if(field === 'value') currentConfig.company.stats[idx].value = parseInt(value) || value;
    if(field === 'suffix') currentConfig.company.stats[idx].suffix = value;
    window.markDirty();
};

const renderHero = () => {
    const container = document.getElementById('hero-slides-container');
    container.innerHTML = currentConfig.hero.slides.map((slide, idx) => `
        <div class="slide-group">
            <h4>Slide ${idx + 1}</h4>
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
                    <label>URL Image (Unsplash ou locale)</label>
                    <input type="text" value="${slide.image}" oninput="updateSlide(${idx}, 'image', this.value)">
                </div>
            </div>
        </div>
    `).join('');
};

window.updateSlide = (idx, field, value) => {
    currentConfig.hero.slides[idx][field] = value;
    window.markDirty();
};

const renderActivities = () => {
    const tbody = document.getElementById('activities-body');
    tbody.innerHTML = currentConfig.activities.map(act => `
        <tr>
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
};

const renderScenarios = () => {
    const tbody = document.getElementById('scenarios-body');
    tbody.innerHTML = currentConfig.products.map(p => `
        <tr>
            <td><strong>${p.name}</strong><br><small>${p.presentation}</small></td>
            <td>${p.laboratory}</td>
            <td>${p.active_ingredient}</td>
            <td>
                <div class="actions">
                    <button class="action-btn edit-btn" onclick="openScenarioForm('${p.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteScenario('${p.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
};

// --- CRUD ACTIVITIES ---
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
    if (confirm('Voulez-vous vraiment supprimer cette activité ?')) {
        currentConfig.activities = currentConfig.activities.filter(a => a.id !== id);
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
    } else {
        currentConfig.activities.push(data);
    }
    window.markDirty();
    renderActivities();
    document.getElementById('activity-form-modal').classList.remove('active');
};

// --- CRUD SCENARIOS ---
window.openScenarioForm = (id) => {
    const modal = document.getElementById('scenario-form-modal');
    modal.classList.add('active');
    
    if (id) {
        const p = currentConfig.products.find(prod => prod.id === id);
        document.getElementById('scenario-form-title').textContent = "Modifier le scénario";
        document.getElementById('form-scenario-id').value = p.id;
        document.getElementById('form-scenario-name').value = p.name;
        document.getElementById('form-scenario-lab').value = p.laboratory;
        document.getElementById('form-scenario-active').value = p.active_ingredient;
        document.getElementById('form-scenario-presentation').value = p.presentation;
        document.getElementById('form-scenario-image').value = p.image_placeholder;
        document.getElementById('form-scenario-indication').value = p.indication;
    } else {
        document.getElementById('scenario-form-title').textContent = "Nouveau Scénario";
        document.getElementById('scenario-form').reset();
        document.getElementById('form-scenario-id').value = '';
    }
};

window.deleteScenario = (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce scénario ?')) {
        currentConfig.products = currentConfig.products.filter(p => p.id !== id);
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
        laboratory: document.getElementById('form-scenario-lab').value,
        active_ingredient: document.getElementById('form-scenario-active').value,
        presentation: document.getElementById('form-scenario-presentation').value,
        image_placeholder: document.getElementById('form-scenario-image').value,
        indication: document.getElementById('form-scenario-indication').value
    };

    if (id) {
        const index = currentConfig.products.findIndex(p => p.id === id);
        currentConfig.products[index] = data;
    } else {
        currentConfig.products.push(data);
    }
    window.markDirty();
    renderScenarios();
    document.getElementById('scenario-form-modal').classList.remove('active');
};

// --- TABS & INIT ---
const setupTabs = () => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupTabs();

    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    document.getElementById('add-activity-btn').addEventListener('click', () => window.openActivityForm());
    document.getElementById('activity-form').addEventListener('submit', handleActivitySubmit);
    
    document.getElementById('add-scenario-btn').addEventListener('click', () => window.openScenarioForm());
    document.getElementById('scenario-form').addEventListener('submit', handleScenarioSubmit);
    
    document.getElementById('discard-btn').addEventListener('click', discardChanges);
    document.getElementById('save-config-btn').addEventListener('click', saveConfig);
    
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
        window.markDirty();
    });
});
