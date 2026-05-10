/**
 * Dark Mode for Admin — #10
 * 🎨 Theme Agent — CSS variables, prefers-color-scheme
 */
const AdminDarkMode = {
    KEY: 'admin_dark_mode',

    init() {
        // Load saved preference or system default
        const saved = localStorage.getItem(this.KEY);
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        this.updateIcons();

        // Toggle buttons
        const toggle = document.getElementById('dark-mode-toggle');
        const mobileToggle = document.getElementById('mobile-dark-toggle');

        if (toggle) toggle.addEventListener('click', () => this.toggle());
        if (mobileToggle) mobileToggle.addEventListener('click', () => this.toggle());
    },

    toggle() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(this.KEY, 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(this.KEY, 'dark');
        }
        this.updateIcons();
    },

    updateIcons() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const icon = isDark ? 'fa-sun' : 'fa-moon';
        const label = isDark ? 'Mode Clair' : 'Mode Sombre';

        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            toggle.querySelector('i').className = `fas ${icon}`;
            const span = toggle.querySelector('span');
            if (span) span.textContent = label;
        }
        const mobileToggle = document.getElementById('mobile-dark-toggle');
        if (mobileToggle) {
            mobileToggle.querySelector('i').className = `fas ${icon}`;
        }
    }
};

export default AdminDarkMode;
