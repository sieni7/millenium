const Projects = {
  render: (containerSelector, projects) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (!projects || projects.length === 0) {
      container.style.display = 'none';
      return;
    }

    const p = projects[0]; // on n'a qu'une seule étude de cas

    // Chiffres vérifiés extraits UNIQUEMENT du contenu config.json
    const facts = [];
    const extract = (text, pattern, label) => {
      const m = text ? text.match(pattern) : null;
      if (m) facts.push({ value: m[1], label });
    };
    extract(p.title, /(\d+)\s+coop[ée]ratives/i, 'coopératives');
    extract(p.challenge, /(\d+)\s+jours/i, 'jours');
    extract(p.solution, /(\d+)\s+mois/i, 'mois');
    extract(p.results, /(\d+)\s+r[ée]f[ée]rent/i, 'référent formé');

    const factsHtml = facts.length
      ? `<div class="case-facts">
          ${facts.map(f => `
            <div class="case-fact">
              <span class="case-fact-value">${f.value}</span>
              <span class="case-fact-label">${f.label}</span>
            </div>`).join('')}
        </div>`
      : '';

    const blocks = [
      { num: '01', title: 'Contexte', text: p.context },
      { num: '02', title: 'Défi', text: p.challenge },
      { num: '03', title: 'Intervention', text: p.solution },
      { num: '04', title: 'Résultat', text: p.results }
    ];

    const blocksHtml = blocks
      .filter(b => b.text)
      .map(b => `
        <div class="case-block">
          <span class="case-block-num" aria-hidden="true">${b.num}</span>
          <div class="case-block-body">
            <h4>${b.title}</h4>
            <p>${b.text}</p>
          </div>
        </div>`).join('');

    container.innerHTML = `
      <div class="case-study reveal">
        <h3 class="case-title">${p.title}</h3>
        <p class="case-subtitle">${p.subtitle}</p>
        <div class="case-study-grid">
          <div class="case-media">
            <div class="case-image">
              <img src="${p.image}" alt="${p.title}" width="600" height="400" loading="lazy" onerror="this.style.display='none'">
            </div>
            ${factsHtml}
          </div>
          <div class="case-narrative">
            ${blocksHtml}
          </div>
        </div>
      </div>
    `;
  }
};

export default Projects;
