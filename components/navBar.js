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
                  <li><a href="#accueil" tabindex="0">Accueil</a></li>
                  <li><a href="#activites" tabindex="0">Expertise</a></li>
                  <li><a href="#identite" tabindex="0">Engagement</a></li>
                  <li><a href="#contact" tabindex="0">Contact</a></li>
              </ul>
              <div class="mobile-menu-btn" id="mobile-toggle" role="button" aria-expanded="false" aria-label="Ouvrir le menu" tabindex="0">
                  <i class="fas fa-bars" aria-hidden="true"></i>
              </div>
          </nav>
      </div>
    `;

    // Mobile Toggle Logic (Improved)
    const toggle = container.querySelector('#mobile-toggle');
    const navLinks = container.querySelector('.nav-links');
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
