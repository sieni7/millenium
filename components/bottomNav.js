const BottomNav = {
  render: (containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.className = 'bottom-nav-wrapper';
    container.innerHTML = `
      <div class="bottom-nav">
          <a href="#" class="bottom-nav-item active">
              <i class="fas fa-home"></i>
              <span>${window.millenium_i18n?.nav_home || 'Accueil'}</span>
          </a>
          <a href="#produits" class="bottom-nav-item">
              <i class="fas fa-pills"></i>
              <span>Produits</span>
          </a>
          <a href="tel:+2250506093561" class="bottom-nav-item">
              <i class="fas fa-phone"></i>
              <span>Appeler</span>
          </a>
          <a href="#contact" class="bottom-nav-item">
              <i class="fas fa-envelope"></i>
              <span>Contact</span>
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
