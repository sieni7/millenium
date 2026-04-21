/**
 * Global Toast Notification System
 * Usage: Toast.show('Message', 'success' | 'error' | 'info', 3000)
 */

const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Icon mapping
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        // Animation in
        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
            }, 400); // Wait for transition out
        }, duration);
    }
};

// Internal replacement for alert() during this sprint
window.alert = (msg) => Toast.show(msg, 'info');

export default Toast;
