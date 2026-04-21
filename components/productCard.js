const ProductCard = {
  render: (containerSelector, data) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.className = 'grid';
    container.innerHTML = data.map(item => `
      <div class="card" aria-label="${item.title}">
          <i class="${item.icon}" aria-hidden="true"></i>
          <h3 style="font-family: var(--font-heading);">${item.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">${item.description}</p>
      </div>
    `).join('');
  }
};

export default ProductCard;
