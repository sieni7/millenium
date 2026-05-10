const FilterBar = {
  render: (containerSelector, products) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const zones = [...new Set(products.map(p => p.zone))];
    
    container.innerHTML = `
      <div class="filter-bar" id="product-filter-bar">
          <div class="search-box" style="margin-right: 20px;">
              <input type="text" id="product-search" placeholder="${window.millenium_i18n?.search_placeholder || 'Rechercher...'}" style="
                  padding: 12px 25px;
                  border-radius: 100px;
                  border: 1px solid rgba(30,127,110,0.1);
                  font-family: var(--font-body);
                  box-shadow: var(--shadow-soft);
              ">
          </div>
          <button class="filter-btn active" data-zone="all">${window.millenium_i18n?.filter_all || 'Tous'}</button>
          ${zones.map(zone => `<button class="filter-btn" data-zone="${zone}">${zone}</button>`).join('')}
      </div>
    `;

    const searchInput = container.querySelector('#product-search');
    const buttons = container.querySelectorAll('.filter-btn');

    // Simple local debounce
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const dispatchSearch = debounce((query) => {
        window.dispatchEvent(new CustomEvent('filter:search', { detail: { query } }));
    }, 300);

    const dispatchZone = (zone) => {
        window.dispatchEvent(new CustomEvent('filter:zone', { detail: { zone } }));
    };

    searchInput.addEventListener('input', (e) => dispatchSearch(e.target.value));

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const zone = btn.getAttribute('data-zone');
        dispatchZone(zone);

        // Add Active Filter Badge
        if (window.addActiveFilterBadge && zone !== 'all') {
            window.addActiveFilterBadge('Zone', zone);
        }
      });
    });
  }
};

export default FilterBar;
