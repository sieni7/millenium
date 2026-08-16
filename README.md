# Millenium Coop Initiative (MCI)

> **Des sites web pour les coopératives agricoles en Côte d'Ivoire.**

[![Status](https://img.shields.io/badge/status-actif-1e7f6e)]()
[![Build](https://img.shields.io/badge/build-passant-1e7f6e)]()
[![License MIT](https://img.shields.io/badge/licence-MIT-1e7f6e)]()
[![Version](https://img.shields.io/badge/version-1.0.0-1e7f6e)]()
<!-- ⚠️ Badges à compléter : remplacer chaque lien () par la cible réelle (shields.io, statut Netlify, etc.) -->

## 1. Présentation

Millenium Coop Initiative accompagne les coopératives agricoles de Côte d'Ivoire dans leur transition numérique, avec une conviction forte : **connecter nos producteurs au web pour créer un levier d'émancipation économique, de sécurité alimentaire et d'inclusion sociale.**

> « Millenium Coop Initiative s'inscrit dans la dynamique des Objectifs de Développement Durable (ODD) de l'ONU. En connectant nos producteurs au web, nous créons un levier d'émancipation économique, de sécurité alimentaire et d'inclusion sociale directement à Afféry et Adzopé. »

**Site en ligne :** [https://milleniumci.netlify.app](https://milleniumci.netlify.app)

**Équipe**
- **Guisso Franck** — Chargé de mobilisation locale (Afféry) : mobilisation, collecte des contenus, logistique et support local.
- **Oulaï Sieni** — Consultant Digital & Formateur Technique (Abidjan) : conception des solutions, développement, formation et déploiement.

## 2. Aperçu

<!-- ⚠️ Captures d'écran à ajouter : placeholder temporaire. -->
```
[ Capture de la page d'accueil — à compléter ]
[ Capture du back-office (admin.html) — à compléter ]
```

## 3. Fonctionnalités

### 3.1 Site vitrine (landing page)
- **Hero animé** : slides configurables (titre, sous-titre, CTA, image) via `config.json`.
- **Services** : grille segmentée (Conseil & Stratégie Digitale, Solutions Numériques, Accompagnement & Formation).
- **Réalisations** : études de cas structurées (Contexte / Défi / Intervention / Résultat).
- **Équipe et partenaires** : présentation des membres et certifications.
- **Contact** : formulaire de consultation (validation + fallback WhatsApp) et bouton WhatsApp flottant.
- **Navigation mobile** : bottom navigation et menu latéral.
- **Expérience** : écran de chargement, animations *reveal*, dark mode (toggle + préférence système), bouton retour en haut, barre de progression.
- **PWA** : manifest + service worker (cache hors-ligne `mci-cache-v2`, `config.json` en network-first).
- **SEO** : balises Open Graph et Twitter, données structurées JSON-LD (Organization / Service / Person), `robots.txt`, `sitemap.xml`.

### 3.2 Back-office (`/admin.html`)
- **Authentification** : hash SHA-256 (WebCrypto), verrouillage temporaire après échecs répétés. ⚠️ Identifiants par défaut : à confirmer.
- **Dashboard Audience** : KPIs (visites, sessions, durée moyenne, taux de rebond), graphiques Chart.js (activité 7/30 jours, appareils, navigateurs), top pages, référents, badge *live* et géolocalisation des visiteurs (ipwho.is).
- **Gestion de contenu** : CRUD services, projets, slides, équipe, partenaires, témoignages.
- **Configuration globale** : coordonnées, réseaux sociaux, widgets (WhatsApp, retour en haut, barre de progression).
- **Journal d'activité** : historique (500 entrées max) + export CSV.
- **Sauvegarde / import / export** de la configuration (JSON), envoi serveur (`POST /api/save-config`) et **déploiement GitHub** (poussée du `config.json` via l'API GitHub depuis le navigateur).

### 3.3 Analytics (localStorage)
- Suivi des visites, sessions et événements (dark mode, thème, CTA).
- Géolocalisation via **ipwho.is** (HTTPS) et plafonnement de la durée de session à 24 h.

## 4. Architecture

Application **statique, sans backend** : tout le contenu modifiable est centralisé dans `public/config.json` et consommé au chargement par le JavaScript (`main.js` orchestre 10 composants).

```
Navigateur ──> index.html ──> js/main.js ──> components/* (landing)
                         └─> admin.html ──> js/admin.js (back-office)
                                 └─> localStorage / config.json / API GitHub
Déploiement : Netlify (statique) + GitHub Actions (CI)
```

Décisions d'architecture (journal ADR) :
- Vanilla JS sans framework (ADR-001).
- Configuration centralisée `config.json` (ADR-002).
- Pas de base de données en V1 — les données de l'admin sont conservées en local (ADR-003).
- Formulaire sans backend via webhook / fallback WhatsApp (ADR-005).

## 5. Stack technique

| Rôle | Technologie |
|---|---|
| Build | Vite 8 (dev, build, preview) |
| Langage | Vanilla JavaScript (ES Modules) |
| Styles | CSS natif + variables (design tokens) |
| Graphiques | Chart.js ^4.5.1 (back-office) |
| PWA | manifest.json + service worker |
| Hébergement | Netlify (déploiement continu depuis GitHub) |
| CI | GitHub Actions (`.github/workflows/build.yml`) |

## 6. Installation

Prérequis : Node.js (vite est configuré pour Node 22 sur Netlify ; la CI utilise Node 20.x).

```bash
npm install
npm run dev       # Serveur de développement
npm run build     # Génère le build de production dans dist/
npm run preview   # Prévisualise le build
```

## 7. Configuration

- **Contenu du site** : modifier `public/config.json` (entreprise, hero, services, projets, équipe, partenaires, témoignages, widgets, i18n) puis recharger la page.
- **Back-office** : se rendre sur `/admin.html`, s'authentifier, puis utiliser les onglets de gestion. La configuration modifiée est réinjectée dans `config.json` (ou poussée vers GitHub dans l'onglet Profil).
- **Déploiement** : `netlify.toml` définit le build (`npm run build`), le dossier publié (`dist`), les redirections (`/admin` → `admin.html`, `/*` → `index.html`) et les en-têtes de sécurité.

## 8. Structure du projet

```
millenium/
├── components/        # Composants UI modulaires (JS) : hero, services, projects,
│                      # team, partners, contactForm, footer, bottomNav, loadingScreen
├── css/               # Styles (variables, base, layout, responsive, dark mode, admin)
├── js/                # Modules : main, admin, adminAnalytics, analytics, seo,
│                      # darkMode, githubSync, activityLog, etc.
├── public/            # Assets statiques : config.json, manifest.json, sw.js,
│                      # robots.txt, sitemap.xml, images
├── docs/              # Documentation (architecture, déploiement, contribution, route)
├── .github/workflows/ # CI : build & vérification
├── index.html         # Page principale
├── admin.html         # Back-office
└── maintenance.html   # Page de maintenance (noindex)
```

## 9. Déploiement

- **Netlify** : déploiement automatique à chaque `push` sur `main` (configuration dans `netlify.toml`, Node 22). Bonus : mode maintenance activable (redirection vers `maintenance.html`).
- **CI** : `.github/workflows/build.yml` vérifie le build (node 20.x / `npm install` / `npm run build` / présence de `dist/`).
- **Back-office** : après modification du contenu, l'onglet Profil permet de pousser `config.json` vers GitHub, déclenchant ainsi un redéploiement.

Détails dans [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 10. Contribution

Toute contribution est bienvenue. Consultez [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) pour le setup, les conventions (ES Modules, configuration centralisée, pas de framework) et le processus de revue.

## 11. Feuille de route

- ✅ **V1 (livrée)** : site vitrine configurable, back-office avec dashboard et CRUD, analytics locaux, PWA et SEO.
- 🚧 **P1 — Consolidation** : authentification serveur et sauvegarde persistante du `config.json` hors navigateur, webhook de contact opérationnel, version anglaise complète. <br> *Ne pas considérer comme engagé : https://github.com/sieni7/millenium ⚠️ À confirmer.*
- 🧭 **P2 — Évolution** : catalogue produits / services coopératifs, témoignages et partenaires actifs, statistiques publiques d'impact.

Détails et priorisation dans [docs/ROADMAP.md](docs/ROADMAP.md).

## 12. Licence

Distribué sous licence **MIT** (voir `package.json`). <br>
*Document complet de licence (LICENSE.md) à ajouter — ⚠️ À compléter.*

---

*Contact : email `contact@milleniumci.net` · WhatsApp +225 05 74 97 10 22 · [milleniumci.netlify.app](https://milleniumci.netlify.app)*