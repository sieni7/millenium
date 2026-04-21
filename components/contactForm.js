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

      const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone ? form.phone.value : '',
        message: form.message.value
      };

      // Simple internal validation (since we don't have error spans in the new layout yet)
      if (!formData.name || !formData.email || !formData.message) {
        if (window.Toast) window.Toast.show("Veuillez remplir tous les champs obligatoires", "warning");
        return;
      }

      // Submit
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner"></div><span>Envoi...</span>';
      
      try {
        const response = await sendToWebhook(formData, data.contact.webhook_url);
        if (window.Toast) window.Toast.show(response.message || "Message envoyé avec succès !", "success");
        form.reset();
      } catch (err) {
        if (window.Toast) window.Toast.show("Une erreur est survenue lors de l'envoi.", "error");
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
            Nos coordonnées
          </h3>
          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-map-pin"></i></div>
              <div class="contact-text">
                <strong>Adresse</strong>
                <span>${data.company.address}</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
              <div class="contact-text">
                <strong>Téléphone</strong>
                <span>${data.contact.phone}</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-envelope"></i></div>
              <div class="contact-text">
                <strong>Email</strong>
                <a href="mailto:${data.contact.email}">${data.contact.email}</a>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-clock"></i></div>
              <div class="contact-text">
                <strong>Horaires</strong>
                <span>${data.contact.hours}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Formulaire -->
        <div class="contact-form-card">
          <h3>
            <i class="fas fa-paper-plane" style="color: #1e7f6e;"></i>
            Envoyez-nous un message
          </h3>
          <form id="contact-form" class="contact-form">
            <div class="form-group">
              <label for="name">Nom complet *</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="phone">Téléphone</label>
              <input type="tel" id="phone" name="phone">
            </div>
            <div class="form-group">
              <label for="message">Message *</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" class="submit-btn">
              <i class="fas fa-paper-plane"></i>
              Envoyer le message
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
