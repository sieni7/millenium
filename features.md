# Millenium Coop Initiative — Fonctionnalités

Ce document décrit les fonctionnalités **implémentées** du projet (état actuel du code). Pour la vision et la feuille de route, voir `PRODUCT.md` et `docs/ROADMAP.md`.

## 1. Site vitrine (landing page)

- **Hero configurable** : slides (titre, sous-titre, CTA, image) pilotés par `public/config.json` ; hydratation du HTML statique pour le LCP.
- **Services** : grille segmentée (Conseil & Stratégie Digitale, Solutions Numériques, Accompagnement & Formation), avec icônes.
- **Réalisations** : études de cas structurées en 4 volets (Contexte / Défi / Intervention / Résultat).
- **Équipe** : présentation des membres (nom, rôle, description, photo) ; photo dégradée de repli.
- **Partenaires** : grille de partenaires (logo + regroupement, fallback icône) configurée dans `config.json`.
- **Témoignages** : gérés dans `config.json` et par le back-office (CRUD) ; aucun rendu frontend pour l'instant ⚠️.
- **Contact** : formulaire de consultation (validation + fallback WhatsApp si aucun webhook), bouton WhatsApp flottant personnalisable.
- **Navigation mobile** : menu latéral et bottom navigation configurable (ordre, visibilité, icônes).
- **Footer** : coordonnées, réseaux sociaux (LinkedIn, Facebook, Instagram, WhatsApp), crédit.

## 2. Expérience utilisateur & design

- **Loading screen** : écran de chargement animé puis fondu.
- **Animations reveal** : apparition au défilement (Intersection Observer, `prefers-reduced-motion` respecté).
- **Dark mode** : bascule manuelle + prise en compte de la préférence système, persistance (`localStorage`).
- **Back-to-top**, barre de progression de lecture, curseur personnalisé (tokens standardisés).
- **Responsive** : breakpoints mobiles/tablette/desktop ; `backdrop-filter` désactivé sur mobile.

## 3. SEO, PWA & Analytics

- **SEO** : meta Open Graph + Twitter Cards, données structurées JSON-LD (`ProfessionalService`, `Service`, `Person`), `robots.txt` (bloque `admin.html` + `js/admin.js`), `sitemap.xml`.
- **PWA** : `manifest.json` (installable, icônes 192/512) + service worker (`public/sw.js`, cache `mci-cache-v2`, `config.json` en network-first, stale-while-revalidate).
- **Analytics local** (`js/analytics.js`) : suivi des visites, sessions, durée (plafonnée à 24 h), géolocalisation via **ipwho.is** (HTTPS), événements (thème, CTA). Données stockées en `localStorage`.

## 4. Back-office (`/admin.html`)

- **Authentification** : hash SHA-256 (WebCrypto), verrouillage anti-bruteforce (30 s après 5 échecs), session en `sessionStorage`.
- **Dashboard Audience** : KPIs (visites, sessions, durée moyenne, taux de rebond), graphiques Chart.js (activité 7/30 jours, appareils, navigateurs), top pages, référents, badge temps réel, géolocalisation des visiteurs.
- **CRUD de contenu** : services, projets, slides, équipe, partenaires, témoignages.
- **Onglet Profil** : coordonnées, réseaux sociaux, widgets, footer, + **déploiement GitHub** (vérification et push du `config.json` via l'API GitHub depuis le navigateur).
- **Journal d'activité** : historique des actions (500 entrées max) avec badges et **export CSV**.
- **Import/Export de configuration** : sauvegarde/restauration du `config.json` ; envoi serveur dev (`POST /api/save-config`).
- **Upload d'images** : glisser-déposer et sélection de fichiers.

## 5. Déploiement & CI

- **Vite 8** multi-entrées (`index.html`, `admin.html`, `maintenance.html`), minification **terser**, sourcemaps.
- **Netlify** : déploiement continu depuis GitHub (`netlify.toml` : build `npm run build`, dossier `dist`, Node 22, redirects `/admin` et fallback SPA, en-têtes de sécurité, mode maintenance commenté).
- **CI GitHub Actions** (`.github/workflows/build.yml`) : build et vérification de `dist/` à chaque push/PR sur `main`.