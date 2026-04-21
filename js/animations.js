/**
 * Premium Reveal Animations & Product Skeleton Management
 */

const Animations = {
    observer: null,

    initReveal() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => {
            this.observer.observe(el);
        });
    },

    // Refresh observer for dynamically added content
    refresh() {
        if (this.observer) {
            document.querySelectorAll('.reveal:not(.active)').forEach(el => {
                this.observer.observe(el);
            });
        }
    },

    // Hover effect for products (Glow & Lift)
    initMicroInteractions() {
        document.querySelectorAll('.product-card, .btn, .ripple').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-5px)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }
};

export default Animations;
