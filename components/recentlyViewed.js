const RecentlyViewed = {
  render: (containerSelector, allProducts = []) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const updateView = () => {
        const stored = JSON.parse(localStorage.getItem('millenium_viewed') || '[]');
        
        // Filter and Hydrate: Only keep items that exist in current allProducts
        // Handle both formats: [{id: '...'}, ...] or ['id1', 'id2', ...]
        const products = stored
            .map(item => {
                const id = typeof item === 'object' ? item.id : item;
                return allProducts.find(p => p.id === id);
            })
            .filter(p => p !== undefined); // Remove nulls (deleted items)

        if (products.length === 0) {
            container.innerHTML = '';
            container.hidden = true;
            container.classList.add('is-empty');
            return;
        }

        container.hidden = false;
        container.classList.remove('is-empty');
        container.innerHTML = `
            <div class="section-title" style="margin-bottom: 30px; text-align: left;">
                <h3 style="font-size: 1.8rem; color: var(--secondary);">${window.millenium_i18n?.recently_viewed || 'Vus récemment'}</h3>
                <span style="margin: 10px 0 0 0; width: 40px;"></span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                ${products.map(p => {
                    const displayImage = (p.images && p.images.length > 0) ? p.images[0] : (p.image || '');
                    return `
                    <div class="product-card fade-in" data-id="${p.id}" style="padding: 15px; cursor: pointer;">
                        <img src="${displayImage}" alt="${p.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">
                        <h4 style="font-size: 0.9rem; margin-bottom: 5px;">${p.name}</h4>
                        <div style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">${p.zone}</div>
                    </div>
                `}).join('')}
            </div>
        `;

        // Re-attach click events to open modal
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                window.dispatchEvent(new CustomEvent('product:show', { detail: { id } }));
            });
        });
    };

    updateView();
    window.addEventListener('product:viewed_refresh', updateView);
  }
};

export default RecentlyViewed;
