const Footer = {
  render: (containerSelector, data) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const agreementsHtml = data.company.footer_agreements && data.company.footer_agreements.length ? data.company.footer_agreements.map(a => `
      <p style="margin-top: 1rem;">
        <i class="${a.icon}"></i> ${a.name}
      </p>
    `).join('') : '';

    const socialHtml = `
      <div class="footer-social">
        ${data.company.social && data.company.social.linkedin ? `<a href="${data.company.social.linkedin}" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        ${data.company.social && data.company.social.facebook ? `<a href="${data.company.social.facebook}" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>` : ''}
        ${data.company.social && data.company.social.whatsapp ? `<a href="${data.company.social.whatsapp.startsWith('http') ? data.company.social.whatsapp : 'https://wa.me/' + data.company.social.whatsapp.replace(/\+/g, '')}" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
      </div>
    `;

    const footerCredit = data.company.footer_credit || (window.currentLang === 'fr' ? 'Site conçu avec ❤️ par OULAI Siéni' : 'Website designed with ❤️ by OULAI Siéni');

    container.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            
            <div class="footer-col">
              <a href="/" class="logo-footer" aria-label="${data.company.name}">
                <img src="${data.company.logo_footer || './assets/logo_footer.png'}" alt="${data.company.name}" width="220" height="220" loading="lazy" style="border-radius: 5px;">
              </a>
              <p class="footer-mission">${data.company.mission}</p>
            </div>
            
            <div class="footer-col">
              <h4>${window.currentLang === 'fr' ? 'Coordonnées' : 'Contact Details'}</h4>
              <p><i class="fas fa-map-marker-alt"></i> ${data.company.address}</p>
              <p><i class="fas fa-phone"></i> ${data.company.phone}</p>
              <p><i class="fas fa-envelope"></i> ${data.company.email || 'Non communiqué'}</p>
            </div>
            
            <div class="footer-col" id="footer-quick-links">
              <h4>${window.currentLang === 'fr' ? 'Liens rapides' : 'Quick Links'}</h4>
              <p><a href="#about">${window.millenium_i18n?.menu?.home || 'Accueil'}</a></p>
              <p><a href="#services">${window.millenium_i18n?.menu?.services || 'Services'}</a></p>
              <p><a href="#realisations">${window.millenium_i18n?.menu?.projects || 'Réalisations'}</a></p>
              <p><a href="#equipe">${window.millenium_i18n?.menu?.team || 'Équipe'}</a></p>
              <p><a href="#contact">${window.millenium_i18n?.menu?.contact || 'Contact'}</a></p>
            </div>
            
            <div class="footer-col">
              <h4>Suivez-nous</h4>
              ${socialHtml}
              ${agreementsHtml}
            </div>
            
          </div>
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} ${data.company.name}. Tous droits réservés.</p>
            <p style="margin-top: 0.5rem; font-size: 0.75rem;">
              ${footerCredit}
            </p>
          </div>
        </div>
      </footer>
    `;
  }
};

export default Footer;