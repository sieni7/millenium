/**
 * Partners Component - Dynamically renders partner logos
 */

const Partners = {
    render: (containerSelector, partners) => {
        const container = document.querySelector(containerSelector);
        if (!container || !partners) return;

        container.innerHTML = partners.map(partner => `
            <div class="partner-item reveal ripple">
                <i class="${partner.icon} partner-logo-placeholder"></i>
                <p class="partner-name">${partner.name}</p>
            </div>
        `).join('');
    }
};

export default Partners;
