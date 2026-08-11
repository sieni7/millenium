const Projects = {
  render: (containerSelector, projects) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (!projects || projects.length === 0) {
      container.style.display = 'none';
      return;
    }

    const p = projects[0]; // on n'a qu'une seule étude de cas
    container.innerHTML = `
      <div class="case-study reveal">
        <h3 class="case-title">${p.title}</h3>
        <p class="case-subtitle">${p.subtitle}</p>
        <div class="case-content">
          <div class="case-image">
            <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.style.display='none'">
          </div>
          <div class="case-text">
            <h4>Contexte</h4>
            <p>${p.context}</p>
            <h4>Défi</h4>
            <p>${p.challenge}</p>
            <h4>Solution</h4>
            <p>${p.solution}</p>
            <h4>Résultats</h4>
            <p>${p.results}</p>
          </div>
        </div>
      </div>
    `;
  }
};

export default Projects;