const ProductList = {
  render: (containerSelector, products) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Get unique categories and labs for filters
    const categories = [...new Set(products.map(p => p.category))];
    const labs = [...new Set(products.map(p => p.lab))];

    container.innerHTML = `
      <div class="product-filters">
          <div class="filter-group">
              <input type="text" id="product-search" placeholder="Rechercher un produit ou actif..." aria-label="Recherche">
          </div>
          <div class="filter-group">
              <select id="filter-category" aria-label="Catégorie">
                  <option value="all">Toutes catégories</option>
                  ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
          </div>
          <div class="filter-group">
              <select id="filter-lab" aria-label="Laboratoire">
                  <option value="all">Tous laboratoires</option>
                  ${labs.map(l => `<option value="${l}">${l}</option>`).join('')}
              </select>
          </div>
      </div>
      <div class="product-grid" id="product-grid-inner"></div>
    `;

    const grid = container.querySelector('#product-grid-inner');
    const searchInput = container.querySelector('#product-search');
    const categorySelect = container.querySelector('#filter-category');
    const labSelect = container.querySelector('#filter-lab');

    const updateGrid = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const catFilter = categorySelect.value;
      const labFilter = labSelect.value;

      const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                              p.active.toLowerCase().includes(searchTerm);
        const matchesCat = catFilter === 'all' || p.category === catFilter;
        const matchesLab = labFilter === 'all' || p.lab === labFilter;
        return matchesSearch && matchesCat && matchesLab;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results"><h3>Aucun produit trouvé</h3><p>Essayez d'ajuster vos filtres ou votre recherche.</p></div>`;
        return;
      }

      grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <span class="product-tag">${p.category}</span>
            <h3 style="font-family: var(--font-heading);">${p.name}</h3>
            <div class="product-lab">Laboratoire : ${p.lab}</div>
            <div class="product-active">
                <strong>Principe Actif :</strong><br>
                ${p.active}
            </div>
            <p style="margin-top: 15px; font-size: 0.85rem; color: var(--text-muted);">${p.description}</p>
        </div>
      `).join('');
    };

    // Event listeners
    searchInput.addEventListener('input', updateGrid);
    categorySelect.addEventListener('change', updateGrid);
    labSelect.addEventListener('change', updateGrid);

    // Initial render
    updateGrid();
  }
};

export default ProductList;
