const Footer = {
  render: (containerSelector, data) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const agreementsHtml = data.contact.agreements ? data.contact.agreements.map(a => `
      <p style="margin-top: 1rem;">
        <i class="${a.icon}"></i> ${a.name}
      </p>
    `).join('') : '';

    const socialHtml = `
      <div class="footer-social">
        ${data.contact.social.linkedin ? `<a href="${data.contact.social.linkedin}" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        ${data.contact.social.facebook ? `<a href="${data.contact.social.facebook}" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>` : ''}
        ${data.contact.social.whatsapp ? `<a href="https://wa.me/${data.contact.social.whatsapp.replace(/\+/g, '')}" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
      </div>
    `;

    container.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            
            <div class="footer-col">
              <h4>${data.company.name}</h4>
              <p>${window.currentLang === 'fr' 
                  ? "SARL basée à Abidjan, spécialisée dans la sécurisation foncière, le conseil patrimonial et la construction premium en Côte d'Ivoire."
                  : "SARL based in Abidjan, specialized in land securing, wealth management advice, and premium construction in Côte d'Ivoire."}</p>
            </div>
            
            <div class="footer-col">
              <h4>${window.currentLang === 'fr' ? 'Coordonnées' : 'Contact Details'}</h4>
              <p><i class="fas fa-map-marker-alt"></i> ${data.company.address}</p>
              <p><i class="fas fa-phone"></i> ${data.contact.phone}</p>
              <p><i class="fas fa-envelope"></i> ${data.contact.email}</p>
              <p><i class="fas fa-file-alt"></i> RCCM : ${data.company.rccm}</p>
            </div>
            
            <div class="footer-col" id="footer-quick-links">
              <h4>${window.currentLang === 'fr' ? 'Liens rapides' : 'Quick Links'}</h4>
              <p><a href="#accueil">${window.millenium_i18n?.nav_home || 'Accueil'}</a></p>
              <p><a href="#activites">${window.millenium_i18n?.nav_expertise || 'Activités'}</a></p>
              <p><a href="#produits">${window.currentLang === 'fr' ? 'Catalogue' : 'Catalogue'}</a></p>
              <p><a href="#contact">${window.millenium_i18n?.nav_contact || 'Contact'}</a></p>
              <p><a href="admin.html">Administration</a></p>
            </div>
            
            <div class="footer-col">
              <h4>Suivez-nous</h4>
              ${socialHtml}
              ${agreementsHtml}
            </div>
            
          </div>
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} ${data.company.name} – ${window.currentLang === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}</p>
            <p style="margin-top: 0.5rem; font-size: 0.75rem;">
              ${window.currentLang === 'fr' ? 'Site conçu avec ❤️ par OULAI Siéni' : 'Website designed with ❤️ by OULAI Siéni'}
            </p>
          </div>
        </div>
      </footer>
    `;
  }
};

export default Footer;
