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
        const i18n = window.millenium_i18n;

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

        // Pas de webhook configuré → basculer vers WhatsApp
        const webhookUrl = data.contact && data.contact.webhook_url;
        if (!webhookUrl && data.company && data.company.social && data.company.social.whatsapp) {
          const message = `Bonjour MCI, je suis ${formData.name} (${formData.email}). ${formData.message}`;
          const waUrl = `${data.company.social.whatsapp.startsWith('https://wa.me/') ? data.company.social.whatsapp : 'https://wa.me/' + data.company.social.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
          window.open(waUrl, '_blank');
          if (window.Toast) window.Toast.show(i18n?.form_success || "Message préparé, continuez sur WhatsApp.", "success");
          form.reset();
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<div class="spinner"></div><span>${i18n?.form_sending || 'Envoi...'}</span>`;
        
        try {
          const response = await sendToWebhook(formData, webhookUrl);
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

    const company = data.company;
    container.innerHTML = `
      <div class="contact-grid">
        <!-- Carte coordonnées -->
        <div class="contact-info-card">
          <h3>
            <i class="fas fa-map-marker-alt" style="color: var(--primary);"></i>
            ${window.millenium_i18n?.contact_title || 'Nos coordonnées'}
          </h3>
          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-map-pin"></i></div>
              <div class="contact-text">
                <strong>${window.currentLang === 'fr' ? 'Adresse' : 'Address'}</strong>
                <span>${company.address}</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
              <div class="contact-text">
                <strong>${window.currentLang === 'fr' ? 'Téléphone' : 'Phone'}</strong>
                <span>${company.phone}</span>
              </div>
            </div>
            ${company.email ? `
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-envelope"></i></div>
              <div class="contact-text">
                <strong>${window.currentLang === 'fr' ? 'Email' : 'Email'}</strong>
                <span>${company.email}</span>
              </div>
            </div>` : ''}
            ${company.social && company.social.whatsapp ? `
            <div class="contact-item">
              <div class="contact-icon"><i class="fab fa-whatsapp"></i></div>
              <div class="contact-text">
                <strong>${window.currentLang === 'fr' ? 'WhatsApp' : 'WhatsApp'}</strong>
                <span><a href="${company.social.whatsapp}" target="_blank" style="color: var(--accent);">${company.whatsapp || company.phone}</a></span>
              </div>
            </div>` : ''}
          </div>
          ${data.team && data.team.length ? `
          <p class="contact-trust" style="margin-top: 1.5rem; padding: 12px 16px; background: var(--background-soft); border-radius: 14px; border-left: 3px solid var(--secondary); font-size: 0.88rem; color: var(--text-muted);">
            <i class="fas fa-user-check" style="color: var(--primary); margin-right: 8px;"></i>
            ${window.currentLang === 'fr'
              ? `Votre demande est traitée directement par <strong style="color: var(--primary);">${data.team[0].name}</strong> (${data.team[0].role}).`
              : `Your request is handled directly by <strong style="color: var(--primary);">${data.team[0].name}</strong> (${data.team[0].role}).`}
          </p>` : ''}
        </div>
        
        <!-- Formulaire -->
        <div class="contact-form-card">
          <h3>
            <i class="fas fa-paper-plane" style="color: var(--primary);"></i>
            ${window.millenium_i18n?.form_title || 'Envoyez-nous un message'}
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
              ${window.millenium_i18n?.form_btn || 'Envoyer le message'}
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