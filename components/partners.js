/**
 * Partners Component - Dynamically renders partner logos
 */

const Partners = {
    render: (containerSelector, partners) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        if (!partners || partners.length === 0) {
            // Masquer la section si pas de partenaires
            container.style.display = 'none';
            return;
        }

        container.innerHTML = partners.map(partner => {
            const hasLogo = partner.logo && partner.logo.trim();
            const logoHtml = hasLogo
                ? `<img src="${partner.logo}" alt="${partner.name}" class="partner-logo" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';">`
                : '';
            const iconHtml = hasLogo
                ? `<i class="${partner.icon || 'fas fa-handshake'}" class="partner-logo-placeholder" style="display:none;"></i>`
                : `<i class="${partner.icon || 'fas fa-handshake'}" class="partner-logo-placeholder"></i>`;
            const linkAttrs = partner.url ? `href="${partner.url}" target="_blank" rel="noopener"` : '';
            
            return `
            <div class="partner-item reveal ripple">
                ${linkAttrs ? `<a ${linkAttrs}>` : ''}
                    <div class="partner-logo-wrapper">
                        ${logoHtml}
                        ${iconHtml}
                    </div>
                    <p class="partner-name">${partner.name}</p>
                ${linkAttrs ? '</a>' : ''}
            </div>`;
        }).join('');
    }
};

export default Partners;