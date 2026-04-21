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
              <p>SARL basée à Abidjan, spécialisée dans la représentation, la promotion médicale et la commercialisation de produits pharmaceutiques en Côte d'Ivoire.</p>
            </div>
            
            <div class="footer-col">
              <h4>Coordonnées</h4>
              <p><i class="fas fa-map-marker-alt"></i> ${data.company.address}</p>
              <p><i class="fas fa-phone"></i> ${data.contact.phone}</p>
              <p><i class="fas fa-envelope"></i> ${data.contact.email}</p>
              <p><i class="fas fa-file-alt"></i> RCCM : ${data.company.rccm}</p>
            </div>
            
            <div class="footer-col" id="footer-quick-links">
              <h4>Liens rapides</h4>
              <p><a href="#accueil">Accueil</a></p>
              <p><a href="#activites">Nos activités</a></p>
              <p><a href="#produits">Catalogue</a></p>
              <p><a href="#contact">Contact</a></p>
              <p><a href="admin.html">Administration</a></p>
            </div>
            
            <div class="footer-col">
              <h4>Suivez-nous</h4>
              ${socialHtml}
              ${agreementsHtml}
            </div>
            
          </div>
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} ${data.company.name} – Tous droits réservés</p>
            <p style="margin-top: 0.5rem; font-size: 0.75rem;">
              Site conçu avec ❤️ par OULAI Siéni
            </p>
          </div>
        </div>
      </footer>
    `;
  }
};

export default Footer;
