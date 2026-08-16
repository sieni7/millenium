const BottomNav = {
  render: (containerSelector, config) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const navConfig = config?.bottomNav;
    if (!navConfig || !navConfig.items || !navConfig.items.length) {
        container.style.display = 'none';
        return;
    }

    // Sort by order, filter visible
    const items = [...navConfig.items]
        .filter(item => item.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (!items.length) {
        container.style.display = 'none';
        return;
    }

    container.className = 'bottom-nav-wrapper';
    container.innerHTML = `
      <div class="bottom-nav">
          ${items.map((item, idx) => `
              <a href="${item.href || '#'}" class="bottom-nav-item ${idx === 0 ? 'active' : ''}" data-nav-id="${item.id}">
                  <i class="${item.icon || 'fas fa-circle'}"></i>
                  <span>${window.millenium_i18n?.menu?.[item.label] || item.label || item.id}</span>
              </a>
          `).join('')}
      </div>
    `;

    // Active state handling
    const itemsEl = container.querySelectorAll('.bottom-nav-item');
    itemsEl.forEach(item => {
        item.addEventListener('click', () => {
            itemsEl.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
  }
};

export default BottomNav;