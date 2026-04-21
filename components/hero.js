const Hero = {
  render: (containerSelector, data) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const slides = data.slides.map((slide, index) => `
      <div class="slide" 
           style="background-image: url('${slide.image}')" 
           role="group" 
           aria-roledescription="diapositive" 
           aria-label="${index + 1} sur ${data.slides.length}">
          <div class="slide-content">
              <h1>${slide.title}</h1>
              <p>${slide.text}</p>
              <a href="${slide.link}" class="btn" aria-label="${slide.cta} - ${slide.title}">${slide.cta}</a>
          </div>
      </div>
    `).join('');

    const dots = data.slides.map((_, index) => `
      <div class="dot ${index === 0 ? 'active' : ''}" 
           data-index="${index}" 
           role="tab" 
           aria-label="Aller à la diapositive ${index + 1}" 
           aria-selected="${index === 0 ? 'true' : 'false'}"
           tabindex="0"></div>
    `).join('');

    container.innerHTML = `
      <div class="carousel" id="carousel" role="region" aria-roledescription="carrousel" aria-live="polite">
          ${slides}
      </div>
      <button class="carousel-btn prev" id="prev" aria-label="Diapositive précédente">
          <i class="fas fa-chevron-left" aria-hidden="true"></i>
      </button>
      <button class="carousel-btn next" id="next" aria-label="Diapositive suivante">
          <i class="fas fa-chevron-right" aria-hidden="true"></i>
      </button>
      <div class="dots" id="dots" role="tablist" aria-label="Sélection des diapositives">
          ${dots}
      </div>
    `;

    // Modern Carousel Logic (Smooth)
    let currentIndex = 0;
    const carouselEl = container.querySelector('#carousel');
    const dotEls = container.querySelectorAll('.dot');
    const totalSlides = data.slides.length;

    const update = () => {
      // Use cubic-bezier for more premium feel
      carouselEl.style.transform = `translateX(-${currentIndex * 100}%)`;
      dotEls.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
        dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
      });
    };

    container.querySelector('#next').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      update();
    });

    container.querySelector('#prev').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      update();
    });

    dotEls.forEach(dot => {
      dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.getAttribute('data-index'));
        update();
      });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            currentIndex = parseInt(dot.getAttribute('data-index'));
            update();
        }
      });
    });

    // Autoplay with Pause on Hover
    let interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      update();
    }, 6000);

    container.addEventListener('mouseenter', () => clearInterval(interval));
    container.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            update();
        }, 6000);
    });
  }
};

export default Hero;
