/**
 * UX Refinements: Back-to-top and scroll behaviors
 */

const UXRefinements = {
    init(config) {
        this.addBackToTop();
        this.initScrollReveal();
        if (config) this.addWhatsAppWidget(config);
    },

    addBackToTop() {
        const existingBtn = document.querySelector('#back-to-top');
        const btn = existingBtn || document.createElement('button');

        if (!existingBtn) {
            btn.id = 'back-to-top';
            btn.className = 'back-to-top';
            btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            btn.setAttribute('aria-label', 'Retour en haut');
            document.body.appendChild(btn);
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('visible', 'active');
            } else {
                btn.classList.remove('visible', 'active');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    initScrollReveal() {
        // Optionnel : Ajout d'une barre de progression de lecture (Premium)
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bar-container';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    },

    addWhatsAppWidget(config) {
        if (!config.contact || !config.contact.social || !config.contact.social.whatsapp) return;

        const whatsappNum = config.contact.social.whatsapp;
        const waUrl = `https://wa.me/${whatsappNum}`;

        const waBtn = document.createElement('a');
        waBtn.href = waUrl;
        waBtn.target = "_blank";
        waBtn.className = 'whatsapp-widget';
        waBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        waBtn.setAttribute('aria-label', 'Contactez-nous sur WhatsApp');

        document.body.appendChild(waBtn);
    }
};

export default UXRefinements;
