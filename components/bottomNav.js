const BottomNav = {
  render: (containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.className = 'bottom-nav-wrapper';
    container.innerHTML = `
      <div class="bottom-nav">
          <a href="#about" class="bottom-nav-item active">
              <i class="fas fa-home"></i>
              <span>${window.millenium_i18n?.menu?.home || 'Accueil'}</span>
          </a>
          <a href="#services" class="bottom-nav-item">
              <i class="fas fa-chart-line"></i>
              <span>${window.millenium_i18n?.menu?.services || 'Services'}</span>
          </a>
          <a href="#realisations" class="bottom-nav-item">
              <i class="fas fa-briefcase"></i>
              <span>${window.millenium_i18n?.menu?.projects || 'Réalisations'}</span>
          </a>
          <a href="#contact" class="bottom-nav-item">
              <i class="fas fa-envelope"></i>
              <span>${window.millenium_i18n?.menu?.contact || 'Contact'}</span>
          </a>
      </div>
    `;

    // Active state handling
    const items = container.querySelectorAll('.bottom-nav-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
  }
};

export default BottomNav;