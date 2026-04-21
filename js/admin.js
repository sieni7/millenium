import AdminEditor from './adminEditor.js';
import PDFExport from './pdfExport.js';
import Toast from './toast.js';

// Initialize Toast for Admin
Toast.init();

let currentConfig = null;
let originalConfig = null;
let isDirty = false;

// 1. Auth Logic - Globals for window access
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
    if (password === 'KiramAdmin2026') {
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

// 2. Data Management
async function loadConfig() {
    try {
        const res = await fetch('config.json');
        originalConfig = await res.json();
        currentConfig = JSON.parse(JSON.stringify(originalConfig)); // Deep copy
        
        // Expose to window for PDF export
        window.currentConfig = currentConfig;

        renderProducts();
        renderContentFields();
        initAdvancedTools();
    } catch (e) {
        console.error('Failed to load config:', e);
    }
}

const discardChanges = () => {
    if (confirm('Annuler toutes les modifications ?')) {
        location.reload(); // Simplest way to reset state
    }
};

const saveConfig = () => {
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

// 3. UI Rendering & Interactions
const renderProducts = () => {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = currentConfig.products.map(p => `
        <tr>
            <td><strong>${p.name}</strong><br><small>${p.presentation}</small></td>
            <td>${p.laboratory}</td>
            <td>${p.active_ingredient}</td>
            <td>
                <div class="actions">
                    <button class="action-btn edit-btn" onclick="openProductForm('${p.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
};

const renderContentFields = () => {
    document.getElementById('edit-company-name').value = currentConfig.company.name;
    document.getElementById('edit-company-phone').value = currentConfig.contact.phone || '';
    document.getElementById('edit-company-address').value = currentConfig.company.address;
};

const initAdvancedTools = () => {
    // [N3-011] WYSIWYG Editor
    AdminEditor.init([
        {
            id: '#editor-presentation-container',
            field: 'presentation',
            getValue: () => currentConfig.hero.slides[0].text,
            setValue: (val) => currentConfig.hero.slides[0].text = val
        },
        {
            id: '#editor-vision-container',
            field: 'vision',
            getValue: () => currentConfig.hero.slides[1].text, // Simple mapping for vision
            setValue: (val) => currentConfig.hero.slides[1].text = val
        }
    ], currentConfig);

    // [N3-012] PDF Export
    PDFExport.init();
};

// CRUD Operations
window.openProductForm = (id) => {
    const modal = document.getElementById('product-form-modal');
    modal.classList.add('active');
    
    if (id) {
        const p = currentConfig.products.find(prod => prod.id === id);
        document.getElementById('form-title').textContent = "Modifier le produit";
        document.getElementById('form-product-id').value = p.id;
        document.getElementById('form-name').value = p.name;
        document.getElementById('form-lab').value = p.laboratory;
        document.getElementById('form-active').value = p.active_ingredient;
        document.getElementById('form-presentation').value = p.presentation;
        document.getElementById('form-image').value = p.image_placeholder;
        document.getElementById('form-indication').value = p.indication;
    } else {
        document.getElementById('form-title').textContent = "Nouveau Produit";
        document.getElementById('product-form').reset();
        document.getElementById('form-product-id').value = '';
    }
};

window.deleteProduct = (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
        currentConfig.products = currentConfig.products.filter(p => p.id !== id);
        window.markDirty();
        renderProducts();
    }
};

const handleProductFormSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('form-product-id').value;
    const productData = {
        id: id || 'prod_' + Date.now(),
        name: document.getElementById('form-name').value,
        laboratory: document.getElementById('form-lab').value,
        active_ingredient: document.getElementById('form-active').value,
        presentation: document.getElementById('form-presentation').value,
        image_placeholder: document.getElementById('form-image').value,
        indication: document.getElementById('form-indication').value
    };

    if (id) {
        const index = currentConfig.products.findIndex(p => p.id === id);
        currentConfig.products[index] = productData;
    } else {
        currentConfig.products.push(productData);
    }

    window.markDirty();
    renderProducts();
    document.getElementById('product-form-modal').classList.remove('active');
};

// Tab Management
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupTabs();

    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('add-product-btn').addEventListener('click', () => window.openProductForm());
    document.getElementById('product-form').addEventListener('submit', handleProductFormSubmit);
    document.getElementById('discard-btn').addEventListener('click', discardChanges);
    document.getElementById('save-config-btn').addEventListener('click', saveConfig);
    
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('product-form-modal').classList.remove('active');
    });

    // Content sync
    ['edit-company-name', 'edit-company-phone', 'edit-company-address'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            const field = id.split('-')[2]; // company-name -> name
            if (id.includes('company')) {
                if (id === 'edit-company-phone') {
                    currentConfig.contact.phone = e.target.value;
                } else {
                    currentConfig.company[field] = e.target.value;
                }
            }
            window.markDirty();
        });
    });
});
