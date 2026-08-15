import Toast from './toast.js';
import ActivityLog from './activityLog.js';

// ── GITHUB SYNC (Déploiement via API) ─────────────────────────────────
// Publie public/config.json vers api.github.com pour déclencher le
// rebuild Netlify. Le token reste en sessionStorage (jamais persistant).

const GITHUB_API = 'https://api.github.com';
const GITHUB_OWNER = 'sieni7';
const GITHUB_REPO = 'millenium';
const CONFIG_PATH = 'public/config.json';

const githubToken = () => {
    return document.getElementById('github-token')?.value.trim() || sessionStorage.getItem('github_token') || '';
};

const setStatus = (msg, color) => {
    const el = document.getElementById('github-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = color || 'var(--text-muted)';
};

const base64Encode = (str) => {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch {
        return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
    }
};

const githubFetch = async (url, options = {}) => {
    const token = githubToken();
    if (!token) {
        Toast.show("Token GitHub requis (collé dans le champ ou sessionStorage)", "error");
        return null;
    }
    const res = await fetch(url, {
        ...options,
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
            ...(options.headers || {})
        }
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = (body && body.message) ? body.message : `GitHub ${res.status}`;
        Toast.show(`GitHub: ${msg}`, "error", 5000);
        return null;
    }
    return res;
};

const verifyToken = async () => {
    const token = githubToken();
    if (!token) {
        Toast.show("Collez un token GitHub avant de vérifier.", "error");
        setStatus('Token absent', '#ef4444');
        return;
    }
    setStatus('Vérification…', 'var(--text-muted)');
    const res = await fetch('https://api.github.com/user', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' }
    });
    if (res.ok) {
        const user = await res.json();
        sessionStorage.setItem('github_token', token);
        Toast.show(`Token valide — ${user.login}`, "success");
        setStatus(`OK — ${user.login}`, 'var(--primary)');
        ActivityLog.add('config', 'Token GitHub vérifié', 'Système');
    } else {
        Toast.show("Token GitHub invalide", "error");
        setStatus('Token invalide', '#ef4444');
    }
};

const pushToGithub = async () => {
    const token = githubToken();
    if (!token) {
        Toast.show("Collez un token GitHub pour déployer.", "error");
        setStatus('Token absent', '#ef4444');
        return false;
    }

    // Récupère la config active (localStorage sinon fetch)
    let config = null;
    try {
        const stored = localStorage.getItem('millenium_config');
        config = stored ? JSON.parse(stored) : await (await fetch('config.json')).json();
    } catch (e) {
        Toast.show("Impossible de charger la configuration.", "error");
        return false;
    }

    setStatus('Lecture du fichier distant…', 'var(--text-muted)');

    // GET current sha
    const getRes = await githubFetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONFIG_PATH}`);
    if (!getRes) return false;
    const meta = await getRes.json();

    const content = JSON.stringify(config, null, 2);
    const payload = {
        message: `chore(config): mise à jour backoffice — ${new Date().toISOString()}`,
        content: base64Encode(content),
        sha: meta.sha
    };

    setStatus('Envoi vers GitHub…', 'var(--text-muted)');
    const putRes = await githubFetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONFIG_PATH}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
    if (!putRes) return false;

    Toast.show("Config publiée sur GitHub — rebuild Netlify en cours", "success", 5000);
    setStatus("Publié ✓ rebuild Netlify déclenché", 'var(--primary)');
    ActivityLog.add('config', 'Configuration publiée vers GitHub (deploy)', 'Système');
    return true;
};

const initGithubSync = () => {
    const pushBtn = document.getElementById('github-push-btn');
    const verifyBtn = document.getElementById('github-verify-btn');
    if (pushBtn) pushBtn.addEventListener('click', pushToGithub);
    if (verifyBtn) verifyBtn.addEventListener('click', verifyToken);

    const tokenInput = document.getElementById('github-token');
    if (tokenInput) {
        const saved = sessionStorage.getItem('github_token');
        if (saved) tokenInput.value = saved;
    }
};

export default { init: initGithubSync, push: pushToGithub, verify: verifyToken };