import { validateForm } from '../js/validation.js';
import { sendToWebhook } from '../js/webhook.js';

const ContactForm = {
  // Method to initialize the form from static HTML (N3-033)
  init: (formSelector, data) => {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
        const submitBtn = form.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;
        const i18n = window.kiram_i18n;

        const formData = {
          name: form.name.value,
          email: form.email.value,
          phone: form.phone ? form.phone.value : '',
          message: form.message.value
        };

        if (!formData.name || !formData.email || !formData.message) {
          if (window.Toast) window.Toast.show(i18n?.form_warning || "Veuillez remplir tous les champs obligatoires", "warning");
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<div class="spinner"></div><span>${i18n?.form_sending || 'Envoi...'}</span>`;
        
        try {
          const response = await sendToWebhook(formData, data.contact.webhook_url);
          if (window.Toast) window.Toast.show(i18n?.form_success || "Message envoyé avec succès !", "success");
          form.reset();
        } catch (err) {
          if (window.Toast) window.Toast.show(i18n?.form_error || "Une erreur est survenue lors de l'envoi.", "error");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
        }
    });
  },

  render: (containerSelector, data) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div class="contact-grid">
        <!-- Carte coordonnées -->
        <div class="contact-info-card">
          <h3>
            <i class="fas fa-map-marker-alt" style="color: #1e7f6e;"></i>
            ${window.kiram_i18n?.contact_title || 'Nos coordonnées'}
          </h3>
          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-map-pin"></i></div>
              <div class="contact-text">
                <strong>${window.currentLang === 'fr' ? 'Adresse' : 'Address'}</strong>
                <span>${data.company.address}</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
              <div class="contact-text">
                <strong>${window.currentLang === 'fr' ? 'Téléphone' : 'Phone'}</strong>
                <span>${data.contact.phone}</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-clock"></i></div>
              <div class="contact-text">
                <strong>${window.currentLang === 'fr' ? 'Horaires' : 'Opening Hours'}</strong>
                <span>${data.contact.hours}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Formulaire -->
        <div class="contact-form-card">
          <h3>
            <i class="fas fa-paper-plane" style="color: #1e7f6e;"></i>
            ${window.kiram_i18n?.form_title || 'Envoyez-nous un message'}
          </h3>
          <form id="contact-form" class="contact-form">
            <div class="form-group">
              <label for="name">${window.currentLang === 'fr' ? 'Nom complet' : 'Full Name'} *</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="message">Message *</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" class="submit-btn">
              <i class="fas fa-paper-plane"></i>
              ${window.kiram_i18n?.form_btn || 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    `;

    // Initialize logic
    ContactForm.init('#contact-form', data);
  }
};

export default ContactForm;
