const NavBar = {
  render: (containerSelector, data) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div class="container">
          <nav aria-label="Menu principal">
              <a href="#" class="logo" aria-label="KIRAM PHARMA - Retour à l'accueil">
                  <i class="fas fa-hand-holding-medical" aria-hidden="true" style="color: var(--primary);"></i>
                  <span style="font-family: var(--font-heading);">${data.name}</span>
              </a>
              <ul class="nav-links">
                  <li><a href="#accueil" tabindex="0">${window.kiram_i18n?.nav_home || 'Accueil'}</a></li>
                  <li><a href="#activites" tabindex="0">${window.kiram_i18n?.nav_expertise || 'Expertise'}</a></li>
                  <li><a href="#identite" tabindex="0">${window.kiram_i18n?.nav_engagement || 'Engagement'}</a></li>
                  <li><a href="#contact" tabindex="0">${window.kiram_i18n?.nav_contact || 'Contact'}</a></li>
              </ul>
              <div class="nav-actions" style="display: flex; align-items: center; gap: 15px;">
                  <div class="lang-toggle" id="lang-toggle" style="cursor: pointer; font-weight: 600; font-size: 0.9rem; color: var(--primary);">
                      ${window.currentLang === 'fr' ? 'EN' : 'FR'}
                  </div>
                  <div class="mobile-menu-btn" id="mobile-toggle" role="button" aria-expanded="false" aria-label="Ouvrir le menu" tabindex="0">
                      <i class="fas fa-bars" aria-hidden="true"></i>
                  </div>
              </div>
          </nav>
      </div>
    `;

    // Mobile Toggle Logic (Improved)
    const toggle = container.querySelector('#mobile-toggle');
    const navLinks = container.querySelector('.nav-links');
    
    // Language Toggle logic
    const langBtn = container.querySelector('#lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const nextLang = window.currentLang === 'fr' ? 'en' : 'fr';
            localStorage.setItem('kiram_lang', nextLang);
            window.location.reload(); // Simple approach for now
        });
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        navLinks.style.display = expanded ? 'none' : 'flex';
        if (!expanded) {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '90px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--surface)';
            navLinks.style.padding = '40px';
            navLinks.style.boxShadow = 'var(--shadow-premium)';
        }
      });
    }
  }
};

export default NavBar;
