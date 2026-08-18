# Millenium Coop Initiative (MCI)

**Programme de transformation numérique au service des coopératives agricoles de Côte d'Ivoire (zone Afféry / Adzopé).**

> Ce document est le **README institutionnel** du dépôt `millenium`. Il s'adresse aux coopératives, partenaires techniques et financiers, bailleurs, décideurs et développeurs. Pour la documentation technique détaillée : [`README_DEV.md`](README_DEV.md) et [`docs/`](docs/).

## Deux périmètres

Le programme **Millenium Coop Initiative** s'articule autour de deux périmètres complémentaires, à ne pas confondre :

| Périmètre | Dépôt | Rôle |
|---|---|---|
| **Initiative / programme pilote** | `millenium` (ce dépôt) | Prouver la démarche aux bailleurs, établir les KPI, générer une méthode de réplicabilité. Porte le site institutionnel + le back-office (vitrine, données, pilotage). |
| **Projet** | `cooperatives-affery` | Le projet concret : preuve d'existence formelle, sous la forme d'un projet de **4 sites vitrines pour 4 coopératives agricoles de la zone Afféry / Adzopé**. ⚠️ Mention générique — détails du projet à confirmer depuis son propre dépôt. |

- Ce dépôt (`millenium`) = **le bras institutionnel & de pilotage** de l'initiative.
- Le dépôt du **projet** (vitrines coopératives) reste la référence de son propre périmètre (données, filières, contenus).
- Document de référence sur les périmètres : [`docs/SCOPE.md`](docs/SCOPE.md).
- Méthode de réplication du programme : [`docs/METHODE_REPLICABILITE.md`](docs/METHODE_REPLICABILITE.md).

| Référence | Valeur |
|---|---|
| Site en ligne | [https://milleniumci.netlify.app](https://milleniumci.netlify.app) |
| Dépôt | [https://github.com/sieni7/millenium](https://github.com/sieni7/millenium) |
| Coordonnées | `contact@milleniumci.net` · WhatsApp +225 05 74 97 10 22 |
| Adresse | Afféry / Adzopé, Côte d'Ivoire |
| Licence | MIT (`package.json`) — ⚠️ document `LICENSE` formel à confirmer |

---

## 1. Présentation

Millenium Coop Initiative accompagne les **coopératives agricoles** de Côte d'Ivoire dans leur transition numérique, avec une conviction forte : connecter les producteurs au web comme levier d'**émancipation économique, de sécurité alimentaire et d'inclusion sociale**.

Le dépôt `millenium` porte deux briques :

1. **Un site institutionnel** (`index.html`) présentant la mission, les services, les réalisations, l'équipe et les coordonnées du programme — entièrement configurable.
2. **Un back-office** (`admin.html`) permettant de gérer les contenus, les statistiques d'audience et le déploiement sans compétence technique avancée.

**Équipe** *(source : `public/config.json`)*

| Nom | Rôle | Zone |
|---|---|---|
| Guisso Franck | Chargé de mobilisation locale | Afféry |
| Oulaï Sieni | Consultant Digital & Formateur Technique | Abidjan |

**Mission** *(source : `public/config.json`)*

> « Millenium Coop Initiative s'inscrit dans la dynamique des Objectifs de Développement Durable (ODD) de l'ONU. En connectant nos producteurs au web, nous créons un levier d'émancipation économique, de sécurité alimentaire et d'inclusion sociale directement à Afféry et Adzopé. »

---

## 2. Le problème

Constat documenté à l'origine du programme *(positionnement du projet, à compléter par la collecte terrain)* :

- **Absence de présence en ligne** des coopératives agricoles : visibilité limitée auprès des partenaires, institutions et acheteurs.
- **Fragmentation de l'information** : données de production, coordonnées et contenus épars, non structurés.
- **Gouvernance documentaire faible** : pas de source de vérité unique ni de procédure de publication.
- **Coûts et dépendance technique** : la mise à jour d'un site suppose un développeur ; sans outil d'administration, les coopératives en sont exclues.

> ⚠️ À confirmer : les constats chiffrés et l'ampleur du problème seront précisés par la collecte de données sur le terrain.

---

## 3. La solution

Une approche **statique, configurée et administrable** :

1. **Configuration centralisée** (`public/config.json`) : tout le contenu modifiable (entreprise, hero, services, projets, équipe, coordonnées, widgets) vit dans un seul fichier, sans toucher au code.
2. **Site 100 % statique** : léger, rapide, hébergeable gratuitement et résilient (Netlify).
3. **Back-office autonome** (`admin.html`) : authentification, gestion de contenu (CRUD), dashboard d'audience, journal d'activité, import/export et **déploiement depuis le navigateur** (push GitHub).
4. **Statistiques d'audience locales** : visites, sessions, géolocalisation, événements — sans backend.
5. **PWA & SEO** : installable, hors-ligne, visible sur les moteurs de recherche.

**Principes directeurs** *(documentés dans `DECISION_LOG.md`)* : vanilla JS sans framework (ADR-001), configuration centralisée (ADR-002), pas de base de données en V1 (ADR-003), formulaire sans backend (ADR-005).

---

## 4. Public cible

| Public | Besoin couvert |
|---|---|
| **Coopératives agricoles** | Présence en ligne digne, visibilité auprès des partenaires et acheteurs |
| **Animateurs / consultants** | Mise à jour des contenus via le back-office, sans coder |
| **Partenaires institutionnels** | Vitrine crédible, données structurées, coordonnées accessibles |
| **Décideurs publics & bailleurs** | Modèle d'impact, gouvernance et réplicabilité documentés |
| **Évaluateurs externes** | Cadre d'indicateurs, historique des décisions (ADR), transparence |

---

## 5. Objectifs stratégiques

1. Donner aux coopératives agricoles une **présence numérique digne et durable**.
2. Rendre la gestion de contenu **accessible sans compétence technique**.
3. Produire des **indicateurs d'impact mesurables** (visites, contenus, adoption).
4. Garantir la **durabilité et la réplicabilité** (architecture statique, configurable, ouverte).
5. Renforcer les **capacités locales** (formation des référents, transfert de compétences).

---

## 6. Contribution aux Objectifs de Développement Durable (ODD)

Contributions **potentielles**, à confirmer par la mesure d'impact — ⚠️ À confirmer :

| ODD | Contribution potentielle |
|---|---|
| **ODD 1 — Pas de pauvreté** | Meilleure visibilité et valorisation de la production coopérative |
| **ODD 2 — Faim « zéro »** | Valorisation des filières agricoles locales |
| **ODD 4 — Éducation de qualité** | Formation des référents locaux et transfert de compétences numériques |
| **ODD 8 — Travail décent** | Professionnalisation des organisations paysannes |
| **ODD 9 — Industrie, innovation** | Transformation numérique sobre et open-source |
| **ODD 12 — Consommation responsable** | Diffusion des bonnes pratiques et de la traçabilité |
| **ODD 13 — Action climatique** | Vulgarisation des pratiques agricoles durables |
| **ODD 16 — Paix, justice** | Transparence de la gouvernance coopérative |
| **ODD 17 — Partenariats** | Collaboration avec les services de vulgarisation et partenaires techniques |

---

## 7. Fonctionnalités

### 7.1 Site institutionnel

- **Hero configurable** (slides : titre, sous-titre, CTA, image).
- **Services** : grille segmentée (Conseil & Stratégie Digitale, Solutions Numériques, Accompagnement & Formation) — sources `config.json`.
- **Réalisations** : études de cas structurées (Contexte / Défi / Intervention / Résultat).
- **Équipe** et **partenaires** : sections dynamiques.
- **Contact** : formulaire de consultation (validation + fallback WhatsApp) et widget WhatsApp flottant.
- **Navigation mobile** : bottom navigation configurable + menu latéral.
- **Expérience** : loading screen, animations *reveal* (respectant `prefers-reduced-motion`), dark mode, back-to-top, barre de progression.
- **SEO** : Open Graph, Twitter Cards, JSON-LD (`ProfessionalService`, `Service`, `Person`), `robots.txt`, `sitemap.xml`.
- **PWA** : `manifest.json` + service worker (cache `mci-cache-v2`, `config.json` en network-first).

### 7.2 Back-office (`/admin.html`)

- **Authentification** : hash SHA-256 (WebCrypto), verrouillage anti-bruteforce (30 s après 5 échecs).
- **Dashboard Audience** : KPIs (visites, sessions, durée moyenne, taux de rebond), graphiques Chart.js (activité 7/30 jours, appareils, navigateurs), top pages, référents, badge temps réel, **géolocalisation** (ipwho.is, HTTPS).
- **Gestion de contenu (CRUD)** : services, projets, slides, équipe, partenaires, témoignages, coordonnées, réseaux sociaux, widgets.
- **Journal d'activité** (500 entrées) + **export CSV**.
- **Import / export / sauvegarde** de la configuration ; **déploiement GitHub** depuis le navigateur (`js/githubSync.js`).
- **Upload d'images** : glisser-déposer.

### 7.3 Analytics (local)

- Suivi des visites, sessions et événements (thème, CTA) via `js/analytics.js`.
- Géolocalisation via **ipwho.is** (HTTPS) ; durée de session plafonnée à 24 h.

---

## 8. Gouvernance

Documentée dans [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md).

- **Décisions d'architecture** : enregistrées au format ADR dans `DECISION_LOG.md` (ADR-001 à ADR-006 acceptées).
- **Source de vérité** : `public/config.json` (contenu) et `DECISION_LOG.md` (décisions).
- **Traçabilité** : journal d'activité du back-office + historique Git.
- **Sécurité** : authentification SHA-256 (côté client — ⚠️ limite documentée), `robots.txt` bloque `admin.html`.

> ⚠️ La gouvernance organisationnelle (rôles effectifs, revue des publications) est à formaliser — voir `docs/GOVERNANCE.md`.

---

## 9. Architecture technique

```
Navigateur ──► index.html ──► js/main.js ──► components/*  (landing page)
                          └─► admin.html ──► js/admin.js  (back-office)
                                  └─► localStorage · config.json · API GitHub
Déploiement : Netlify (statique) · CI : GitHub Actions
```

- Application **statique sans backend** ; contenu centralisé dans `public/config.json`, consommé par 10 composants (`components/`).
- Endpoint `POST /api/save-config` : middleware **dev-only** (Vite) — ⚠️ non disponible en production statique ; la persistance passe par le push GitHub.

Détails : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 10. Stack technologique

| Brique | Technologie |
|---|---|
| Build | Vite 8 (dev / build / preview) |
| Langage | Vanilla JavaScript (ES Modules) |
| Styles | CSS natif + tokens (`:root`) |
| Graphiques | Chart.js ^4.5.1 |
| PWA | manifest.json + service worker |
| Hébergement | Netlify (déploiement continu) |
| CI | GitHub Actions (`.github/workflows/build.yml`) |
| Minification | Terser + sourcemaps |

---

## 11. Installation

Prérequis : Node.js ≥ 20 (recommandé 22, cf. `netlify.toml`).

```bash
git clone https://github.com/sieni7/millenium.git
cd millenium
npm install
npm run dev        # http://localhost:3000
npm run build      # génère dist/
npm run preview    # prévisualise le build
```

---

## 12. Configuration

- **Contenu du site** : `public/config.json` (entreprise, hero, services, projets, équipe, témoignages, partenaires, widgets, i18n).
- **Schéma de référence** : `config.schema.json` (régénéré sur la configuration réelle).
- **Back-office** : `/admin.html` pour gérer les contenus et déployer.
- **Build / déploiement** : `netlify.toml` (build `npm run build`, dossier `dist`, Node 22, redirects `/admin` → `admin.html` et fallback `/*`, headers sécurité, mode maintenance commenté).

---

## 13. Déploiement

- **Netlify** : déploiement automatique à chaque `push` sur `main`.
- **Mode maintenance** : redirection vers `maintenance.html` prévue dans `netlify.toml` (actuellement commentée).
- **CI** : `.github/workflows/build.yml` (Node 20.x, `npm install`, `npm run build`, vérification `dist/`).
- **Back-office** : onglet Profil → pousser `config.json` vers GitHub pour redéployer.

Détails : [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## 14. Structure du projet

```
millenium/
├── components/        # 10 composants UI (hero, services, projects, team, partners,
│                      #   contactForm, footer, bottomNav, loadingScreen…)
├── css/               # 9 feuilles (tokens, base, layout, responsive, dark mode, admin…)
├── js/                # main, admin, adminAnalytics, analytics, seo, darkMode,
│                      #   githubSync, activityLog, imageUpload, dragDrop…
├── public/            # config.json, manifest.json, sw.js, robots.txt, sitemap.xml, images
├── docs/              # SCOPE, ARCHITECTURE, DEPLOYMENT, CONTRIBUTING, ROADMAP,
│                      #   IMPACT, METHODE_REPLICABILITE, GOVERNANCE
├── reports/           # audits (historique)
├── index.html         # page principale
├── admin.html         # back-office
├── maintenance.html   # page de maintenance (noindex)
├── netlify.toml · vite.config.js · package.json · config.schema.json
```

---

## 15. Sécurité

- **Back-office** : authentification SHA-256 (WebCrypto), verrouillage anti-bruteforce (30 s / 5 échecs), session en `sessionStorage`. ⚠️ **Limite** : vérification côté client (site statique) — une authentification serveur est à l'étude.
- **robots.txt** : bloque `admin.html` et `js/admin.js`.
- **Headers sécurité** Netlify dans `netlify.toml`.
- **Aucun secret dans le dépôt** ; tokens GitHub du back-office en `sessionStorage` uniquement.

---

## 16. Évolutivité

- **Contenu** : extension sans code via `config.json` (services, projets, équipe, témoignages, partenaires).
- **Fonctionnalités** : composants modulaires (`components/`) et modules utilitaires (`js/`) ajoutables sans refonte.
- **Hébergement** : statique → coût quasi nul, montée en charge naturelle.

---

## 17. Réplicabilité

La réplicabilité est une finalité centrale du programme pilote : générer une **méthode de réplication** réutilisable pour étendre la présence en ligne à d'autres coopératives et localités. Méthode détaillée : [`docs/METHODE_REPLICABILITE.md`](docs/METHODE_REPLICABILITE.md).

- **Configurable par design** : un même code sert n'importe quelle organisation (renommage, coordonnées, contenus dans `config.json`).
- **Zéro backend** : déployable sur tout hébergeur statique, sans base de données ni serveur applicatif.
- **Outillage documenté** : guides, ADR, schémas et procédures dans le dépôt.
- **CI intégrée** : build et contrôle automatiques à chaque push — garantit qu'une copie du template reste déployable sans correction.

---

## 18. Indicateurs d'impact

Cadre détaillé dans [`docs/IMPACT.md`](docs/IMPACT.md). Indicateurs proposés *(mesure à formaliser — ⚠️ À confirmer)* :

| Dimension | Indicateur |
|---|---|
| Portée | Nombre de coopératives accompagnées et en ligne |
| Audience | Visites, sessions, durée moyenne (dashboard admin) |
| Contenu | Sections publiées, études de cas, photos réelles |
| Capacités | Référents formés, formations diffusées |
| Adoption | Taux d'adoption et de participation des coopératives |
| Conformité | Alignement des contenus sur les référentiels affichés |

---

## 19. Partenariats potentiels

- Services de vulgarisation agricole, partenaires techniques et financiers.
- Institutions de financement, programmes de coopération, acheteurs engagés dans la durabilité.
- ⚠️ Aucun partenariat n'est listé actuellement dans `config.json` (`partners: []`) — à peupler par le programme.

---

## 20. Feuille de route

Documentée dans [`docs/ROADMAP.md`](docs/ROADMAP.md). Résumé :

| Étape | Statut |
|---|---|
| Cadre d'impact, KPI pilote et méthode de réplicabilité | ✅ Livré (docs/IMPACT.md, docs/METHODE_REPLICABILITE.md) |
| Vérification par le projet vitrines (preuve d'existence formelle) | ⚠️ Relève de `cooperatives-affery` |
| Site institutionnel + back-office + dashboard + analytics | ✅ Livré |
| PWA, SEO, dark mode, accessibilité | ✅ Livré |
| Backend : persistance serveur de `config.json`, authentification serveur | 🧭 Planifié |
| Témoignages : rendu frontend | 🧭 Planifié |
| Multi-langue complète (fr/en) | 🧭 Planifié |

---

## 21. Contribution

Toute contribution est bienvenue — voir [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

**Règles essentielles** :
- Config centralisée : pas de textes en dur.
- ES Modules, vanilla JS, pas de framework.
- Enregistrer les décisions structurantes dans `DECISION_LOG.md` (ADR).
- Ne committer ni secrets ni tokens.
- Build valide avant tout push.

---

## Conformité et certification

Analyse **documentaire préliminaire** — ⚠️ aucune conformité n'est démontrée à ce stade. Contributions **potentielles** de la plateforme :

| Référentiel | Contribution potentielle |
|---|---|
| **Rainforest Alliance / UTZ** | Diffusion des engagements et démarches de certification dans les contenus |
| **CocoaTrace** | Structuration des données de traçabilité cacao |
| **Fairtrade / Max Havelaar** | Mise en valeur du commerce équitable dans les contenus |
| **EUDR** | Documentation des données de géolocalisation et de traçabilité (non implémentée) |

> ⚠️ **Conformité non démontrée.** Aucun référentiel n'est certifié par ce projet.

---

## Distinction faits / hypothèses / recommandations

- **Faits observés** : fonctionnalités vérifiées dans le code de ce dépôt, contenus de `public/config.json`, résultats de build/validation.
- **Hypothèses** : contributions aux ODD et aux référentiels internationaux (potentielles, non mesurées).
- **Recommandations** : formaliser le cadre d'impact (`docs/IMPACT.md`), sécuriser l'édition, publier les témoignages et partenaires réels.

---

*Millenium Coop Initiative — Des sites web pour les coopératives agricoles en Côte d'Ivoire. Document institutionnel basé exclusivement sur le contenu du dépôt `millenium`.*