# ARCHITECTURE.md – KIRAM PHARMA

## Vue d’ensemble
┌─────────────────────────────────────────────────────────────┐
│ USER (Browser) │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ index.html (skeleton) │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│ │ NavBar │ │ Hero │ │ Sections │ │ Footer │ │
│ │ Component│ │Carousel │ │ dynamiques│ │ Component │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ main.js (orchestrator) │
│ Charge composants + hydrate avec config.json │
└─────────────────────────────────────────────────────────────┘
│
┌───────────────┼───────────────┐
▼ ▼ ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ config.json│ │ components/│ │ css/ │
│ (données) │ │ (JS vanille)│ │ (styles) │
└────────────┘ └────────────┘ └────────────┘

text

---

## Stack technique (V1)

| Couche | Technologie | Justification |
|--------|-------------|----------------|
| Frontend | HTML5 / CSS3 / Vanilla JS | Pas de surcharge, progressive enhancement |
| State | Pas de state global (props via render()) | Simplifie V1 |
| Configuration | JSON statique | Modifiable sans rebuild |
| Hébergement | Netlify / GitHub Pages | Gratuit, CI/CD simple |
| Forms | Webhook (Discord/EmailJS) | Pas de backend nécessaire |
| Monitoring | Lighthouse + console | Léger |

---

## Structure de fichiers (après Sprint 1)
kiram-pharma/
├── index.html
├── config.json
├── config.schema.json
├── css/
│ ├── style.css
│ └── partenaires.css
├── js/
│ ├── main.js (orchestrateur)
│ ├── validation.js
│ └── webhook.js
├── components/
│ ├── hero.js
│ ├── carousel.js
│ ├── productCard.js
│ ├── contactForm.js
│ ├── navBar.js
│ └── footer.js
├── sections/
│ └── partenaires.html
├── reports/
│ ├── a11y_audit.md
│ ├── qa_report.md
│ └── workspace_status.json
└── docs/
├── ARCHITECTURE.md
├── PRODUCT.md
└── DECISION_LOG.md

text

---

## Contrat des composants

Chaque composant expose :

```javascript
const Component = {
  render: (containerSelector, data) => {
    // containerSelector: string (ex: '#hero-container')
    // data: object (ex: config.slides[0])
    // retourne: HTMLElement ou void (monté directement)
  }
}
Flux de données
text
config.json (chargé au démarrage)
        │
        ▼
main.js (parse et distribue)
        │
        ├──→ NavBar.render(config.nav)
        ├──→ Hero.render(config.slides)
        ├──→ ContactForm.render(config.contact)
        └──→ Footer.render(config.footer)
Évolutions prévues (V2)
Module	Évolution	Technologie cible
Produits	JSON → grille filtrante	Vanilla JS + localStorage
Admin	Panel simple	Page protégée par mot de passe
Backend	Si besoin	Supabase (light)
Performance	Lazy loading	Intersection Observer
Contraintes techniques
Contrainte	Imposition
Compatibilité	Chrome, Firefox, Safari (2 dernières versions)
Responsive	Breakpoints : 320px, 768px, 1024px, 1280px
Accessibilité	WCAG 2.1 AA (Lighthouse > 90)
Performance	First Contentful Paint < 1.5s
Sécurité	HTTPS, pas d’eval(), pas de innerHTML non contrôlé
Décisions d’architecture validées
Pas de framework frontend (React/Vue) en V1

Pas de base de données (JSON file suffit)

Déploiement statique (Netlify)

Séparation stricte données (config.json) / UI (composants)
