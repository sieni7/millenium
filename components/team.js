const Team = {
  render: (containerSelector, team) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (!team || team.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <div class="team-grid">
        ${team.map(m => `
          <div class="team-card reveal">
            <div class="team-photo">
              <div class="photo-placeholder">
                <i class="fas fa-user"></i>
              </div>
              <img src="${m.photo}" alt="${m.name}" onerror="this.style.display='none'">
            </div>
            <h3>${m.name}</h3>
            <p class="team-role">${m.role}</p>
            <p class="team-desc">${m.description}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
};

export default Team;