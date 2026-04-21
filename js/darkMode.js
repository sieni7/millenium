/**
 * Global Dark Mode Toggle & Persistence (N3-016)
 */

const DarkMode = {
    init() {
        const toggle = document.querySelector('#theme-toggle');
        if (!toggle) return;

        // Check Local Storage or System Preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.setDark(true);
        }

        toggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            this.setDark(!isDark);
        });
    },

    setDark(isDark) {
        const toggle = document.querySelector('#theme-toggle');
        const icon = toggle.querySelector('i');

        if (isDark) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }

        // Trigger Analytics Event
        if (window.Analytics) {
            window.Analytics.trackEvent('UI', 'Theme Change', isDark ? 'Dark' : 'Light');
        }
    }
};

export default DarkMode;
