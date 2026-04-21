const ProductGrid = {
  allProducts: [],
  filters: { lab: 'all', search: '' },

  showSkeleton: (containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">
            ${Array(3).fill(`
                <div class="product-card skeleton-card">
                    <div class="skeleton" style="height: 200px; border-radius: 15px 15px 0 0;"></div>
                    <div style="padding: 20px;">
                        <div class="skeleton" style="height: 12px; width: 40%; margin-bottom: 10px;"></div>
                        <div class="skeleton" style="height: 18px; width: 70%; margin-bottom: 20px;"></div>
                        <div class="skeleton" style="height: 40px; border-radius: 10px;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
  },

  render: (containerSelector, products) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Initialize state
    ProductGrid.allProducts = products;
    
    // Clear and prepare grid
    container.innerHTML = `
        <div id="results-count" class="results-counter">
            ${window.kiram_i18n?.results_count_prefix || 'Affichage de'} ${products.length} ${window.kiram_i18n?.results_count || 'produits'}
        </div>
        <div class="product-grid" id="product-grid-inner"></div>
    `;
    
    const gridDiv = container.querySelector('#product-grid-inner');
    ProductGrid.update(gridDiv, products);

    // Listen for filtering events (remove old ones if any to avoid stacking)
    window.removeEventListener('filter:laboratory', ProductGrid.handleLabFilter);
    window.removeEventListener('filter:search', ProductGrid.handleSearchFilter);
    
    window.addEventListener('filter:laboratory', ProductGrid.handleLabFilter);
    window.addEventListener('filter:search', ProductGrid.handleSearchFilter);
  },

  handleLabFilter: (e) => {
    ProductGrid.filters.lab = e.detail.lab;
    ProductGrid.applyFilters();
  },

  handleSearchFilter: (e) => {
    ProductGrid.filters.search = e.detail.query.toLowerCase();
    ProductGrid.applyFilters();
  },

  applyFilters: () => {
    const filtered = ProductGrid.allProducts.filter(p => {
        const matchesLab = ProductGrid.filters.lab === 'all' || p.laboratory === ProductGrid.filters.lab;
        const matchesSearch = p.name.toLowerCase().includes(ProductGrid.filters.search) || 
                              p.active_ingredient.toLowerCase().includes(ProductGrid.filters.search);
        return matchesLab && matchesSearch;
    });

    const gridDiv = document.querySelector('#product-grid-inner');
    if (gridDiv) {
        ProductGrid.update(gridDiv, filtered);
        
        // Update Counter
        const counter = document.querySelector('#results-count');
        if (counter) {
            counter.textContent = `Affichage de ${filtered.length} produit${filtered.length > 1 ? 's' : ''}`;
        }

        // Toggle Empty State
        if (filtered.length === 0) {
            gridDiv.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search-minus" style="font-size: 3rem; color: var(--primary); opacity: 0.3; margin-bottom: 20px;"></i>
                    <h3 style="color: var(--secondary);">${window.kiram_i18n?.no_results || 'Aucun résultat trouvé'}</h3>
                    <p style="color: var(--text-muted);">${window.currentLang === 'fr' ? 'Essayez de réinitialiser vos filtres.' : 'Try resetting your filters.'}</p>
                </div>
            `;
        }
    }
  },

  update: (gridElement, products) => {
    gridElement.innerHTML = products.map(product => `
      <div class="product-card fade-in" data-id="${product.id}" data-lab="${product.laboratory}">
          ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
          <div class="product-image">
              <img src="${product.image_placeholder}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-body">
              <div class="product-lab">${product.laboratory}</div>
              <h3>${product.name}</h3>
              <div class="product-info">
                  <strong>${window.currentLang === 'fr' ? 'Actif' : 'Active'} :</strong> ${product.active_ingredient}<br>
                  <strong>Format :</strong> ${product.presentation}
              </div>
              <div class="product-actions">
                  <button class="btn show-details" data-id="${product.id}">
                    ${window.kiram_i18n?.view_details || 'Voir détails'}
                  </button>
              </div>
          </div>
      </div>
    `).join('');

    // Attach event listeners for details button
    gridElement.querySelectorAll('.show-details').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        const event = new CustomEvent('product:show', { detail: { id: productId } });
        window.dispatchEvent(event);
      });
    });
  }
};

export default ProductGrid;
