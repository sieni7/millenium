const About = {
  render: (containerSelector, config) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const company = config.company;
    container.innerHTML = `
      <div class="about-text">
        <h2 class="mci-accent-emerald">À propos</h2>
        <p><strong>${company.name}</strong></p>
        <p>${company.mission}</p>
        <blockquote>« ${company.slogan} »</blockquote>
      </div>
    `;
  }
};

export default About;