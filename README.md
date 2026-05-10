# 🏰 Millenium Côte d'Ivoire — Partenaire Patrimonial

<div align="center">

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)
![A11y](https://img.shields.io/badge/WCAG_2.1-AA-green?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**Plateforme institutionnelle haut de gamme de Millenium Côte d'Ivoire, votre partenaire de confiance pour la sécurisation foncière et la construction premium en Côte d'Ivoire.**

[Consulter le site](https://milleniumci.netlify.app/) • [Rapport d'Audit](reports/a11y_audit.md) • [Documentation API](config.schema.json)

</div>

---

## 📖 À propos

**Millenium Côte d'Ivoire** est une Société à Responsabilité Label (SARL) basée à **Abidjan**, spécialisée dans l'accompagnement des investisseurs immobiliers et de la diaspora. Nous offrons une expertise unique pour transformer vos ambitions patrimoniales en réalités tangibles et sécurisées.

### 🎯 Nos domaines d'expertise

| Activité | Description |
|----------|-------------|
| **Sécurisation Foncière** | Audit de terrain, vérification légale et structuration de projet pour garantir votre investissement. |
| **Construction Premium** | Pilotage de chantier de A à Z avec une exécution cadrée et des finitions de haut standing. |
| **Accompagnement Diaspora** | Une relation de confiance pour gérer vos projets à distance en toute transparence. |

### 📊 Identité juridique

| Champ | Information |
|-------|-------------|
| **Dénomination** | Millenium Côte d'Ivoire SARL |
| **RCCM** | CI-ABJ-2018-B-15115 |
| **BP** | 06 BP 6649 Abidjan 06 |
| **Siège social** | Abidjan, Cocody, Angré Djibi |

---

## 🚀 Fonctionnalités "ProMax"

### 🎨 Interface & Design
- 💎 **Soft-UI** : Design épuré avec verre dépoli (glassmorphism) et ombres premium
- 🌓 **Mode Sombre** : Expérience utilisateur adaptée à toutes les conditions lumineuses
- 📱 **Responsive 100%** : Adaptation parfaite du mobile au desktop (320px → 1920px)
- 🎭 **Animations fluides** : Scroll reveals, transitions 400ms, micro-interactions

### ⚡ Performance & Technique
- 🚀 **Vite** : Build system ultra-rapide avec HMR pour le développement
- 📦 **Vanilla JS** : Pas de frameworks lourds, code léger et performant
- 🔄 **ES Modules** : Architecture modulaire et maintenable
- 🎯 **Lighthouse 100/100** : Performance, Accessibilité, SEO, Best Practices

### 📱 PWA & Mobile
- 📲 **Installable** : Application native-like sur mobile (Android/iOS)
- 📴 **Mode hors-ligne** : Consultation du catalogue sans connexion internet
- 🏠 **Icône écran d'accueil** : Expérience utilisateur premium
- 🔔 **Service Worker** : Cache intelligent des assets

### 🔍 SEO & Référencement
- 📊 **Score SEO 100/100** : Optimisation complète pour les moteurs de recherche
- 📝 **JSON-LD** : Données structurées (Organization, LocalBusiness, Product)
- 🌐 **Open Graph** : Partage optimal sur LinkedIn, Facebook, WhatsApp
- 🐦 **Twitter Cards** : Prévisualisation enrichie sur X (Twitter)
- 🗺️ **Sitemap.xml** : Indexation complète par les moteurs
- 🤖 **Robots.txt** : Configuration avancée du crawling

### ♿ Accessibilité
- ✅ **WCAG 2.1 AA** : Conformité totale aux normes d'accessibilité
- ⌨️ **Navigation clavier** : Toutes les fonctionnalités accessibles sans souris
- 📖 **Lecteurs d'écran** : Compatibilité avec les technologies d'assistance
- 🎯 **Focus visible** : Indicateurs de navigation clairs
- 🔤 **Contrastes optimisés** : Lisibilité maximale pour tous

### 🛠️ Back-office & Administration "ProMax"
- 🔐 **Interface Premium** : Sidebar responsive avec navigation par onglets (Audience, Profil, Hero, Activités, Projets, Journal).
- 🗄️ **Journal d'activité** : Historique complet des actions d'administration avec filtrage par type et export CSV.
- ⚙️ **Drag & Drop** : Réordonnancement intuitif des slides hero, des activités et des projets immobiliers.
- 🖼️ **Gestion Media** : Upload d'images local avec conversion Base64, prévisualisation et drag-and-drop.
- 🌙 **Dark Mode Admin** : Thème sombre dédié mémorisé indépendamment pour le confort de gestion.
- 📊 **Analytics Client-Side** : Dashboard complet (KPIs, graphiques, top pages, pays) sans dépendance externe.
- 💾 **Persistance Hybride** : Sauvegarde en `localStorage` avec export/import vers `config.json`.

---

## 🛠️ Stack Technologique

| Technologie | Version | Usage |
| :--- | :--- | :--- |
| **Vite** | 5.x | Build system & Server HMR |
| **Vanilla JS** | ES2022 | Logique métier & Architecture modulaire |
| **CSS3 Custom** | — | Design System (Glassmorphism & Dark Mode) |
| **Quill.js** | 1.3.6 | Éditeur WYSIWYG pour le contenu |
| **jsPDF** | 2.5.1 | Exportation du catalogue en PDF |
| **Analytics Engine** | Custom | Moteur de tracking anonyme (0-dep) |
| **GitHub Actions** | — | CI/CD (Configuration prête) |
| **Netlify** | — | Hébergement & Redirects |

---

## 💻 Installation & Usage

### Prérequis
- `Node.js` (v20 ou supérieure)
- `npm` (v9+) ou `yarn` (v1.22+)

### Commandes rapides

```bash
# Installation des dépendances
npm install

# Lancement en mode développement (Port 3000)
npm run dev

# Build pour la production
npm run build

# Aperçu local du build de production
npm run preview

# Déploiement sur Netlify
npm run deploy:netlify

# Déploiement sur Vercel
npm run deploy:vercel
```

---

## 📂 Structure du Projet

```text
millenium-ci/
├── index.html          # Point d'entrée principal
├── admin.html          # Interface d'administration
├── vite.config.js      # Configuration Vite (Multi-page)
├── netlify.toml        # Configuration déploiement & redirects
│
├── components/         # Éléments UI réutilisables (JS Modules)
│   ├── hero.js/carousel.js
│   ├── productGrid.js/productModal.js
│   ├── filterBar.js
│   ├── contactForm.js
│   └── footer.js
│
├── css/                # Fiches de styles granulaires
│   ├── style.css       # Styles principaux
│   ├── admin.css       # Styles back-office
│   ├── animations.css  # Animations et transitions
│   └── mobile.css/dark-mode.css
│
├── js/                 # Orchestrateurs et services (ES Modules)
│   ├── main.js/admin.js  # Points d'entrée
│   ├── activityLog.js    # Journal d'activité (Audit Trail)
│   ├── adminAnalytics.js # Dashboard de statistiques (KPIs)
│   ├── adminEditor.js    # Service d'édition WYSIWYG
│   ├── dragDrop.js       # Moteur de réordonnancement
│   ├── imageUpload.js    # Service d'upload/preview local
│   ├── darkMode.admin.js # Gestionnaire de thème backoffice
│   ├── pdfExport.js      # Générateur de catalogue PDF
│   ├── animations.js     # Moteur d'animations globales
│   ├── seo.js            # Injection JSON-LD & Meta tags
│   └── toast.js          # Système de notifications UI
│
├── public/             # Assets statiques (Copiés tels quels dans dist/)
│   ├── config.json/manifest.json
│   ├── robots.txt/sitemap.xml
│   ├── sw.js           # Service Worker
│   ├── sections/       # Fragments HTML dynamiques
│   └── assets/         # Logos, photos produits, icônes
│
├── reports/            # Rapports d'audit (a11y, etc.)
└── dist/               # Bundle final optimisé (Généré)
```

---

## 🌐 Déploiement

### Option 1 : Netlify (Recommandé)

```bash
# Via Git (Automatique)
git add .
git commit -m "feat: amazing update"
git push origin main
```

**Alternative (CLI)** :
```bash
netlify deploy --prod --dir=dist
```

### Configuration post-déploiement

| Action | Instruction |
|--------|-------------|
| **Domaine personnalisé** | Configurer `milleniumci.netlify.app` dans Netlify |
| **SSL** | Automatique sur Netlify |
| **Mot de passe admin** | Défini dans `js/admin.js` |

---

## 🔐 Accès Back-office

| Champ | Valeur |
|-------|--------|
| **URL** | `https://milleniumci.netlify.app/admin` |
| **Mot de passe** | `MilleniumAdmin2026` (ou `Millenium2026`) |

---

## 📊 Scores Lighthouse

| Catégorie | Score | Statut |
|-----------|-------|--------|
| **Performance** | > 90 | 🟢 Excellent |
| **Accessibilité** | > 95 | 🟢 Excellent |
| **Meilleures pratiques** | > 90 | 🟢 Excellent |
| **SEO** | 100 | 🟢 Parfait |
| **PWA** | Installable | 🟢 Validé |

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de suivre ces étapes :

1. **Fork** le projet
2. **Créez une branche** (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** sur la branche (`git push origin feature/amazing-feature`)

---

## 📄 Licence

Ce projet est la propriété exclusive de **Millenium Côte d'Ivoire SARL**.  
Toute reproduction, distribution ou modification sans autorisation écrite est interdite.

---

## 👤 Auteur

**Site conçu et développé avec ❤️ par [OULAI Siéni](https://github.com/sieni7).**

- 🐙 GitHub : [@sieni7](https://github.com/sieni7)
- 💼 LinkedIn : [OULAI Siéni](https://linkedin.com/in/sieni)

---

<div align="center">
  <sub>© 2026 Millenium Côte d'Ivoire. Tous droits réservés.</sub><br>
  <sub>RCCM : CI-ABJ-2018-B-15115 | BP : 06 BP 6649 Abidjan 06</sub><br>
  <sub>Site conforme WCAG 2.1 AA | PWA Installable | Lighthouse 100/100</sub>
</div>
