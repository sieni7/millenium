const Services = {
  render: (containerSelector, services) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (!services || services.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <div class="services-grid">
        ${services.map(s => `
          <div class="service-card reveal mci-card">
            <i class="fas ${s.icon} mci-accent-gold"></i>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
};

export default Services;