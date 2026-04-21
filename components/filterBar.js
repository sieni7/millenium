const FilterBar = {
  render: (containerSelector, products) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const labs = [...new Set(products.map(p => p.laboratory))];
    
    container.innerHTML = `
      <div class="filter-bar" id="product-filter-bar">
          <div class="search-box" style="margin-right: 20px;">
              <input type="text" id="product-search" placeholder="${window.kiram_i18n?.search_placeholder || 'Rechercher...'}" style="
                  padding: 12px 25px;
                  border-radius: 100px;
                  border: 1px solid rgba(30,127,110,0.1);
                  font-family: var(--font-body);
                  box-shadow: var(--shadow-soft);
              ">
          </div>
          <button class="filter-btn active" data-lab="all">${window.kiram_i18n?.filter_all || 'Tous'}</button>
          ${labs.map(lab => `<button class="filter-btn" data-lab="${lab}">${lab}</button>`).join('')}
      </div>
    `;

    const searchInput = container.querySelector('#product-search');
    const buttons = container.querySelectorAll('.filter-btn');

    // Simple local debounce (N3-021)
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

    const dispatchLab = (lab) => {
        window.dispatchEvent(new CustomEvent('filter:laboratory', { detail: { lab } }));
    };

    searchInput.addEventListener('input', (e) => dispatchSearch(e.target.value));

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const lab = btn.getAttribute('data-lab');
        dispatchLab(lab);

        // Add Active Filter Badge (N3-022)
        if (window.addActiveFilterBadge && lab !== 'all') {
            window.addActiveFilterBadge('Laboratoire', lab);
        }
      });
    });
  }
};

export default FilterBar;
