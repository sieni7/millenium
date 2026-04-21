# 🧪 KIRAM PHARMA — Excellence Pharmaceutique

<div align="center">

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)
![A11y](https://img.shields.io/badge/WCAG_2.1-AA-green?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%25-4B32C3?style=for-the-badge&logo=lighthouse&logoColor=white)

**Site web institutionnel haut de gamme du cabinet médical et pharmaceutique KIRAM PHARMA en Côte d'Ivoire.**

[Consulter le site](https://labo-kiram.netlify.app/) • [Rapport d'Audit](reports/a11y_audit.md) • [Documentation API](config.schema.json)

</div>

---

## 📖 À propos

**KIRAM PHARMA** est une Société à Responsabilité Limitée (SARL) basée à **Abidjan, Cocody Angré Djibi**, dédiée à l'excellence dans le secteur de la santé. Dirigée par **Madame Fofana Geneviève**, l'entreprise réunit expertise locale et rigueur internationale pour la distribution, la représentation et la promotion médicale.

### 🎯 Nos activités principales

| Activité | Description |
|----------|-------------|
| **Représentation** | Agent officiel pour laboratoires pharmaceutiques étrangers et locaux |
| **Promotion médicale** | Visibilité des produits auprès des professionnels de santé |
| **Commercialisation** | Vente et négociation de produits pharmaceutiques et parapharmaceutiques |

### 📊 Identité juridique

| Champ | Information |
|-------|-------------|
| **Dénomination** | KIRAM PHARMA SARL |
| **Date de création** | Juin 2018 (enregistrée au CEPICI le 8 juin 2018) |
| **RCCM** | CI-ABJ-2018-B-15115 |
| **BP** | 06 BP 6649 Abidjan 06 |
| **Siège social** | Abidjan, Cocody, Angré Djibi (proximité agence SIB) |

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

### 🛠️ Back-office & Administration
- 🔐 **Admin sécurisé** : Interface d'administration protégée par mot de passe
- 📦 **CRUD produits** : Ajout, modification, suppression des produits
- ✏️ **Éditeur WYSIWYG** : Modification des textes institutionnels (Quill.js)
- 📄 **Export PDF** : Génération automatique du catalogue produits
- 💾 **Sauvegarde JSON** : Téléchargement du fichier de configuration

---

## 🛠️ Stack Technologique

| Technologie | Version | Usage |
| :--- | :--- | :--- |
| **Vite** | 5.x | Build system & Server HMR |
| **Vanilla JS** | ES2022 | Logique métier & Modules |
| **CSS3 Custom** | — | Design System & Animations |
| **Quill.js** | 1.3.6 | Éditeur WYSIWYG (admin) |
| **jsPDF** | 2.5.1 | Export catalogue PDF |
| **Matomo** | — | Analytics & Tracking |
| **GitHub Actions** | — | CI/CD (Configuration prête) |
| **Netlify** | — | Hébergement haute disponibilité |

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
kiram-pharma/
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
├── js/                 # Orchestrateurs et services
│   ├── main.js/admin.js
│   ├── adminEditor.js
│   ├── pdfExport.js
│   ├── animations.js/toast.js
│   ├── analytics.js/seo.js
│   └── darkMode.js/mobileMenu.js
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
| **Domaine personnalisé** | Configurer `labo-kiram.netlify.app` dans Netlify |
| **SSL** | Automatique sur Netlify |
| **Mot de passe admin** | Défini dans `js/admin.js` |

---

## 🔐 Accès Back-office

| Champ | Valeur |
|-------|--------|
| **URL** | `https://labo-kiram.netlify.app/admin` |
| **Mot de passe** | `KiramAdmin2026` |

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

Ce projet est la propriété exclusive de **KIRAM PHARMA SARL**.  
Toute reproduction, distribution ou modification sans autorisation écrite est interdite.

---

## 👤 Auteur

**Site conçu et développé avec ❤️ par [OULAI Siéni](https://github.com/sieni7).**

- 🐙 GitHub : [@sieni7](https://github.com/sieni7)
- 💼 LinkedIn : [OULAI Siéni](https://linkedin.com/in/sieni)

---

<div align="center">
  <sub>© 2026 KIRAM PHARMA. Tous droits réservés.</sub><br>
  <sub>RCCM : CI-ABJ-2018-B-15115 | BP : 06 BP 6649 Abidjan 06</sub><br>
  <sub>Site conforme WCAG 2.1 AA | PWA Installable | Lighthouse 100/100</sub>
</div>
