const ProductModal = {
  render: (containerSelector, products) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div class="product-modal-overlay" id="product-modal-overlay" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1">
          <div class="product-modal">
              <button class="modal-close" id="modal-close" aria-label="Fermer la fiche produit">
                  <i class="fas fa-times"></i>
              </button>
              <div id="modal-content-inner"></div>
          </div>
      </div>
    `;

    const overlay = container.querySelector('#product-modal-overlay');
    const contentInner = container.querySelector('#modal-content-inner');
    const closeBtn = container.querySelector('#modal-close');

    const closeModal = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Return focus to the grid (N3-008 criterion)
        const lastId = overlay.getAttribute('data-last-id');
        const lastBtn = document.querySelector(`.show-details[data-id="${lastId}"]`);
        if (lastBtn) lastBtn.focus();
    };

    const openModal = (product) => {
        const id = product.id;
        overlay.setAttribute('data-last-id', id);

        // -- RECENTLY VIEWED LOGIC --
        let viewed = JSON.parse(localStorage.getItem('kiram_viewed') || '[]');
        viewed = viewed.filter(v => v.id !== id); // Remove if exists
        viewed.unshift(product); // Add to top
        if (viewed.length > 4) viewed.pop(); // Keep only 4
        localStorage.setItem('kiram_viewed', JSON.stringify(viewed));
        window.dispatchEvent(new CustomEvent('product:viewed_refresh'));

        contentInner.innerHTML = `
            <div class="modal-header">
                <img src="${product.image_placeholder}" alt="${product.name}">
            </div>
            <div class="modal-body">
                <div class="modal-lab">${product.laboratory}</div>
                <h2>${product.name}</h2>
                <div class="modal-details-grid">
                    <div class="detail-item">
                        <h4>Principe Actif</h4>
                        <p>${product.active_ingredient}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Format</h4>
                        <p>${product.presentation}</p>
                    </div>
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <h4>Indication Thérapeutique</h4>
                        <p>${product.indication}</p>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    };

    // Correctly attach persistent event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // Escape Key logic - Re-attaching to window to ensure global capture
    const handleEsc = (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            closeModal();
        }
    };
    window.removeEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleEsc);

    // Listen for custom event from ProductGrid (N3-007)
    window.addEventListener('product:show', (e) => {
        const product = products.find(p => p.id === e.detail.id);
        if (product) openModal(product);
    });

    // -- IMAGE ZOOM LOGIC --
    const zoomOverlay = document.querySelector('#image-zoom-overlay');
    const zoomedImg = document.querySelector('#zoomed-image');

    overlay.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.modal-header')) {
            zoomedImg.src = e.target.src;
            zoomOverlay.classList.add('active');
        }
    });

    zoomOverlay?.addEventListener('click', () => {
        zoomOverlay.classList.remove('active');
    });
  }
};

export default ProductModal;
