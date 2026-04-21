const StatsSection = {
  render: (containerSelector, stats) => {
    const container = document.querySelector(containerSelector);
    if (!container || !stats) return;

    container.innerHTML = `
      <section class="stats-section reveal">
        <div class="container">
          <div class="stats-grid">
            ${stats.map(stat => `
              <div class="stat-item">
                <div class="stat-value" data-target="${stat.value}">0</div>
                <div class="stat-suffix">${stat.suffix}</div>
                <div class="stat-label">${window.kiram_i18n?.[stat.key] || stat.key}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    // Intersection Observer to start animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            StatsSection.animateCounters(container);
            observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(container.querySelector('.stats-section'));
  },

  animateCounters: (container) => {
    const counters = container.querySelectorAll('.stat-value');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const step = target / (duration / 16); // 60fps

      let current = 0;
      const update = () => {
        current += step;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };
      update();
    });
  }
};

export default StatsSection;
