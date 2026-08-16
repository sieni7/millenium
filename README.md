# Millenium Coop Initiative (MCI)

**Programme de transformation numérique des coopératives agricoles — sous-préfecture d'Afféry, Côte d'Ivoire.**

> **Millenium Coop Initiative** est un projet de développement local qui donne à chaque coopérative agricole de la sous-préfecture d'Afféry (département d'Adzopé, région de La Mé) une **présence numérique digne, autonome et durable**, et accompagne les producteurs vers l'agriculture durable, la transparence et l'inclusion économique et sociale.

| Référence | Valeur |
|---|---|
| Site institutionnel | [https://milleniumci.netlify.app](https://milleniumci.netlify.app) |
| Dépôt institutionnel | [https://github.com/sieni7/millenium](https://github.com/sieni7/millenium) |
| Dépôt plateforme vitrines | `cooperatives-affery` (local — ⚠️ remote `origin` à confirmer) |
| Coordonnées | `contact@milleniumci.net` · WhatsApp +225 05 74 97 10 22 |
| Licence | MIT (`package.json`) — ⚠️ document `LICENSE` formel à confirmer |

---

## 1. Présentation

Le programme **Millenium Coop Initiative (MCI)** repose sur deux briques complémentaires :

1. **Un site institutionnel** présentant la mission, l'équipe, les services et les réalisations du programme.
2. **Une plateforme de vitrines numériques** mettant à disposition de chaque coopérative agricole un site vitrine professionnel, 100 % statique, reproductible et administrable sans compétence technique.

**Équipe terrain**

| Nom | Rôle | Zone |
|---|---|---|
| Guisso Franck | Chargé de mobilisation locale | Afféry |
| Oulaï Sieni | Consultant Digital & Formateur Technique | Abidjan |

**Étude de cas de référence** *(source : `public/config.json`)* : « Transformation digitale de 4 coopératives agricoles » — 4 sites réalisés en mission intensive de 3 jours, 1 référent local formé, 3 mois de support inclus.

---

## 2. Le problème

Les coopératives agricoles d'Afféry, bien que jouant un rôle économique et social central dans les filières cacao, hévéa, café et vivrier, font face à des contraintes structurelles :

- **Absence de présence en ligne** : aucune vitrine crédible auprès des acheteurs, partenaires et institutions — un frein direct à la visibilité et à la commercialisation.
- **Fragmentation de l'information** : données (producteurs, volumes, engagements, certifications) éparses, non structurées, difficilement exploitables.
- **Faible gouvernance documentaire** : pas de source de vérité unique, pas de procédure de publication, pas de traçabilité des contenus.
- **Coûts de production de sites prohibitifs** : le développement « à la main » d'un site par coopérative est inabordable à l'échelle du territoire.
- **Dépendance technique** : sans outils adaptés, la mise à jour d'un site exige un développeur, excluant les coopératives et les animateurs locaux.
- **Connexion limitée** : l'outillage doit pouvoir fonctionner hors ligne (en brousse), contrainte souvent négligée par les solutions du marché.

> ℹ️ *Les difficultés ci-dessus correspondent aux constats documentés dans le projet ; les données chiffrées sur les coopératives restent des données de démonstration tant que la collecte terrain n'est pas finalisée — ⚠️ À confirmer.*

---

## 3. La solution

**Une architecture « un template, plusieurs sites », légère et sans dépendance :**

1. **Un template visuel unique** (`_template/`) et **une source de vérité par coopérative** (`content-src/coopN.json`) : multiplier les sites **sans coût marginal**.
2. **Un workflow de génération reproductible** (`scripts/generate.ps1`) : `ajouter une coopérative = une commande`.
3. **Une porte qualité automatisée** (`scripts/validate.ps1`) qui valide chaque site avant publication.
4. **Un CMS léger (Decap CMS)** permettant aux coopératives et animateurs de mettre à jour le contenu **sans coder**.
5. **Un fonctionnement hors ligne** : l'outillage est en PowerShell pur, sans dépendance externe.
6. **Un site institutionnel central** (`milleniumci.netlify.app`) pour la gouvernance, les services et la crédibilité du programme.

**Principes directeurs** : configuration centralisée (`config.json`), code vanilla sans framework (ADR-001), pas de base de données en V1 (ADR-003), données propriété du territoire dans des fichiers ouverts.

---

## 4. Public cible

| Public | Besoin couvert |
|---|---|
| **Coopératives agricoles d'Afféry** | Site vitrine présentant histoire, produits, activités, producteurs, galerie, actualités — sans compétence technique |
| **Animateurs terrain / consultants** | Cycle « collecter → générer → valider → publier », en ligne et hors ligne |
| **Partenaires institutionnels** (ANADER, CNRA, Conseil du Café-Cacao, bailleurs) | Vitrine crédible et données structurées par organisation paysanne |
| **Acheteurs et consommateurs** | Présentation fiable des filières cacao, hévéa, café et vivrier |
| **Décideurs publics et évaluateurs** | Modèle d'impact, indicateurs, gouvernance et capacité de réplication documentés |

---

## 5. Objectifs stratégiques

1. Donner à **chaque coopérative agricole d'Afféry** une présence en ligne digne de son rôle économique et social.
2. Rendre la production de sites **reproductible, sûre et peu coûteuse** (un template, quatre sites).
3. Confier la mise à jour des contenus aux **coopératives elles-mêmes** via un CMS léger, sans intermédiaire technique.
4. **Ancrer le projet dans la durée** : données ouvertes, propriété du territoire, versionnage Git, sauvegardes hors ligne (`backup.ps1`).
5. Produire des **indicateurs d'impact mesurables** (coopératives en ligne, producteurs concernés, formations diffusées, conformité).
6. Garantir la **réplicabilité** du modèle à d'autres localités et filières.

---

## 6. Contribution aux Objectifs de Développement Durable (ODD)

Le programme contribue **potentiellement** aux ODD suivants *(contribution structurée par le projet ; mesure d'impact à formaliser — ⚠️ À confirmer)* :

| ODD | Contribution potentielle |
|---|---|
| **ODD 1 — Pas de pauvreté** | Meilleure visibilité commerciale et valorisation de la production des coopératives, source de revenus |
| **ODD 2 — Faim « zéro »** | Valorisation des filières agricoles (vivrier inclus) et des bonnes pratiques culturales |
| **ODD 4 — Éducation de qualité** | Formation des référents locaux, transfert de compétences numériques |
| **ODD 8 — Travail décent** | Professionnalisation des organisations paysannes et des animateurs locaux |
| **ODD 9 — Industrie, innovation** | Transformation numérique, outillage open-source, déploiement statique sobre |
| **ODD 12 — Consommation responsable** | Accompagnement vers les certifications (Rainforest Alliance, bio) et la traçabilité |
| **ODD 13 — Action climatique** | Diffusion des bonnes pratiques agricoles et de la conformité environnementale |
| **ODD 16 — Paix, justice** | Transparence de la gouvernance coopérative et des informations publiées |
| **ODD 17 — Partenariats** | Collaboration avec les services de vulgarisation et les partenaires techniques et financiers |

---

## 7. Fonctionnalités

### 7.1 Site institutionnel (`milleniumci.netlify.app`)

- **Hero configurable** (slides), **services** (conseil & stratégie, solutions numériques, formation), **réalisations** (études de cas), **équipe**, **partenaires**, **témoignages** (⚠️ gérés en config sans rendu frontend pour l'instant), **contact** (formulaire + WhatsApp).
- **Expérience** : dark mode, animations (respect de `prefers-reduced-motion`), bottom-nav mobile, loading screen, back-to-top.
- **SEO** : Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`.
- **PWA** : manifest + service worker (cache `mci-cache-v2`, config network-first).

### 7.2 Back-office (`/admin.html`)

- **Authentification** SHA-256 (WebCrypto) + verrouillage anti-bruteforce (30 s après 5 échecs).
- **Dashboard Audience** : KPIs, graphiques Chart.js (activité 7/30 jours, appareils, navigateurs), top pages, référents, badge temps réel, **géolocalisation** (ipwho.is, HTTPS).
- **Gestion de contenu (CRUD)** : services, projets, slides, équipe, partenaires, témoignages.
- **Journal d'activité** (500 entrées) + **export CSV**.
- **Import / export / sauvegarde** de `config.json`, **push GitHub** depuis le navigateur.

### 7.3 Plateforme vitrines coopératives (`cooperatives-affery`)

Chaque site vitrine (vérifié dans `content-src/coop1.json`) comprend :

| Section | Description |
|---|---|
| Héro | Badge, titre, sous-titre, CTA, image |
| Chiffres clés | Statistiques à icônes (membres, hectares, tonnes, villages) |
| À propos | Présentation (texte + 2 images) |
| Produits | Catalogue avec prix, unité, image |
| Activités | Grille d'activités (formation, pépinière, récolte, séchage, vente, climat) |
| Producteurs | Portraits (nom, rôle, village, photo) |
| Engagements | Valeurs (agriculture durable, commerce équitable, formation, traçabilité) |
| Galerie | Album de photos titrées |
| Actualités | Articles datés |
| Partenaires | Logos (ANADER, CNRA, Conseil du Café-Cacao, Rainforest Alliance…) |
| Contact | Téléphone, e-mail, adresse, horaires, carte OpenStreetMap |

Fonctionnalités techniques : rendu JS vanilla depuis `content.json`, **fallback de secours (mode démo)**, placeholder d'images automatique, pages détaillées (7 par site), **CMS Decap**, page de sauvegarde Git/ZIP.

**Outillage** (`scripts/`) : `generate.ps1`, `inject-fallback.ps1`, `validate.ps1` (porte qualité, 28/28 PASS), `serve.ps1`, `new-coop.ps1`, `backup.ps1` (commit/push/bundle hors ligne).

---

## 8. Gouvernance

La gouvernance est documentée dans [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md).

### Principes

- **Rôle de gouvernance** : validation des décisions structurantes par le GOVERNOR ; enregistrement des décisions techniques dans `DECISION_LOG.md` (format ADR) — *rôle organisationnel réel à confirmer*.
- **Décisions d'architecture** (ADR-001 à ADR-006) : vanilla JS, configuration centralisée, pas de base de données en V1, formulaire sans backend, scope V1 strict.

### Gouvernance des données

- **Source de vérité unique** : `content-src/` (coopératives) et `public/config.json` (institutionnel).
- **Propriété des données** : les contenus restent **la propriété du territoire** dans des fichiers ouverts et versionnés (Git).
- **Éditions** : via le back-office institutionnel ou le CMS Decap des vitrines ; journal d'activité (institutionnel) pour la traçabilité.

### Gouvernance des contenus vitrines

- **Règle d'or** : ne jamais modifier les sites générés (`coop1/`…`coop4/`) à la main — toute évolution passe par `_template/` (visuel) et `content-src/` (données), puis `generate.ps1`.
- **Porte qualité** : `validate.ps1` avant toute publication.

---

## 9. Architecture technique

### Site institutionnel

```
Navigateur ──► index.html ──► js/main.js ──► components/*  (landing)
                          └─► admin.html ──► js/admin.js  (back-office)
                                  └─► localStorage · config.json · API GitHub
Déploiement : Netlify (statique) · CI : GitHub Actions
```

- Application **statique sans backend** ; tout le contenu modifiable centralisé dans `public/config.json`.
- `POST /api/save-config` : middleware **dev-only** (Vite) — ⚠️ pas disponible en production statique ; la persistance passe par le push GitHub (voir `docs/ARCHITECTURE.md`).

### Plateforme vitrines coopératives

```
content-src/ (source de vérité) ──► scripts/generate.ps1 ──► coop1/..coop4/
_template/ (template neutre)           (génère + valide)      (sites statiques autonomes)
                                            │
                                      scripts/validate.ps1 (porte qualité)
                                            │
                               scripts/serve.ps1 (local) / Netlify (public)
```

- 100 % statique, **aucun framework, aucune dépendance npm, aucun build**.
- Édition via **Decap CMS** branché sur Git (git-gateway) — ⚠️ à confirmer au déploiement réel.

---

## 10. Stack technologique

| Brique | Technologie |
|---|---|
| Institutionnel | Vite 8 · Vanilla JS (ES Modules) · CSS natif (tokens) · Chart.js ^4.5.1 |
| Vitrines coopératives | Vanilla JS/CSS · JSON · **aucune dépendance npm** |
| CMS | Decap CMS (`admin/`) |
| Scripts vitrines | PowerShell 7+ (6 scripts, aucun prérequis) · Node.js optionnel (`validate.ps1`) |
| Hébergement | Netlify (statique) |
| CI | GitHub Actions (`.github/workflows/build.yml`, Node 20/22) |
| PWA/SEO | manifest · service worker · Open Graph · JSON-LD |

---

## 11. Installation

### Prérequis

- **Git** (versionnage des deux dépôts).
- **PowerShell 7+** (obligatoire pour l'outillage vitrines).
- **Node.js ≥ 20** (institutionnel — Vite ; recommandé 22, cf. `netlify.toml`).

### Site institutionnel

```bash
git clone https://github.com/sieni7/millenium.git
cd millenium
npm install
npm run dev        # http://localhost:3000
npm run build      # génère dist/
```

### Plateforme vitrines coopératives *(local : `cooperatives-affery`)*

```powershell
# Vérifier la régénération possible (simulation)
.\scripts\generate.ps1 -WhatIf

# Générer les 4 sites (ou un seul : -Coop coop1)
.\scripts\generate.ps1 -Force

# Porte qualité — doit afficher « Validation : PASS »
.\scripts\validate.ps1

# Prévisualiser dans le navigateur (défaut : coop1)
.\scripts\serve.ps1 -Coop coop1
```

> ⚠️ Le dépôt `cooperatives-affery` n'a **pas de remote `origin` configuré** ; l'adresse exacte du dépôt distant est à confirmer.

---

## 12. Configuration

### Institutionnel — `public/config.json`

Entreprise (nom, slogan, mission, coordonnées, réseaux sociaux, widgets), hero, services, projets, équipe, témoignages, partenaires, i18n. Le schéma de référence est documenté dans `config.schema.json` (régénéré sur la configuration réelle).

### Vitrines — `content-src/`

- `coops.json` : registre (id, dossier, nom, filière, couleur d'identité).
- `coopN.json` : contenu complet (hero, stats, about, products, activities, producers, commitments, gallery, news, partners, contact, footer).

### Variables d'environnement

**Aucune** dans le projet vitrines (aucun secret). Pour l'institutionnel, aucune variable requise côté build. La sécurisation de l'édition CMS passe par Netlify Identity (⚠️ à mettre en œuvre au déploiement).

---

## 13. Déploiement

### Institutionnel — Netlify (automatique)

- Déploiement à chaque `push` sur `main` (config : `netlify.toml`, Node 22, dossier `dist`, redirect `/admin` → `admin.html`, fallback `/*` → `index.html`, headers sécurité).
- Mode maintenance : redirection vers `maintenance.html` (prévue dans `netlify.toml`, actuellement commentée).
- Détails : [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

### Vitrines coopératives — 1 site Netlify par coopérative

1. Pousser le dépôt sur GitHub.
2. Netlify : *Add new site → Import from Git* → choisir le dépôt.
3. **Base directory** : `coop1` (puis `coop2`, `coop3`, `coop4`).
4. **Build command** vide, **Publish directory** vide (racine du dossier).
5. Activer **Identity + Git Gateway** pour le CMS (`https://<site>.netlify.app/admin/`).

> ⚠️ À confirmer : URLs Netlify réelles, compte institutionnel, politique d'accès du CMS. Aucun déploiement public des 4 vitrines n'est actuellement vérifié.

---

## 14. Structure du projet

### `millenium/` (institutionnel)

```
components/        # 10 composants UI (hero, services, projects, team, partners,
                   #   contactForm, footer, bottomNav, loadingScreen…)
css/               # 9 feuilles (tokens, layout, responsive, dark mode, admin…)
js/                # main, admin, adminAnalytics, analytics, seo, darkMode,
                   #   githubSync, activityLog, imageUpload, dragDrop…
public/            # config.json, manifest, sw.js, robots.txt, sitemap, images
docs/              # ARCHITECTURE, DEPLOYMENT, CONTRIBUTING, ROADMAP, IMPACT,
                   #   GOVERNANCE
reports/           # audits (historique)
index.html         # page principale
admin.html         # back-office
maintenance.html   # page de maintenance (noindex)
netlify.toml · vite.config.js · package.json
```

### `cooperatives-affery/` (vitrines)

```
_template/        # template neutre (HTML/CSS/JS + Decap CMS + backup)
content-src/      # SOURCE DE VÉRITÉ : coops.json + coop1..4.json
coop1/ … coop4/   # SITES GÉNÉRÉS (ne jamais éditer à la main)
scripts/          # generate · inject-fallback · validate · serve · new-coop · backup
docs/             # ARCHITECTURE, DEPLOYMENT, CONTRIBUTING, ROADMAP
```

---

## 15. Sécurité

- **Back-office institutionnel** : authentification SHA-256 (WebCrypto `crypto.subtle`), verrouillage temporaire anti-bruteforce (30 s / 5 échecs), session en `sessionStorage`. ⚠️ **Limite** : la vérification est côté client (site statique) — une authentification serveur est prévue (voir ROADMAP).
- **Robots** : `robots.txt` bloque `admin.html` et `js/admin.js` ; `maintenance.html` en `noindex`.
- **Headères sécurité** Netlify définis dans `netlify.toml`.
- **CMS vitrines** : sécurisation de l'édition via Netlify Identity / Git Gateway (⚠️ à mettre en œuvre au déploiement).
- **Aucun secret** dans les deux projets ; les tokens GitHub du back-office sont conservés en `sessionStorage` uniquement.

---

## 16. Évolutivité

- **Ajout d'une coopérative** : `new-coop.ps1` (ajoute au registre sans toucher aux sites existants) puis `generate.ps1 -Force`.
- **Nouvelles filières / localités** : le modèle « template + source de contenu » se transpose tel quel ; le README vitrines documente la procédure d'industrialisation.
- **Institutionnel** : sections configurées par `config.json` (services, projets, équipe, témoignages, partenaires) — extension sans code.
- **Architecture sans backend** : coût d'hébergement quasi nul, déploiement statique résilient.

---

## 17. Réplicabilité

La réplicabilité est un objectif central du programme :

- **Un template, N sites** : multiplier les sites à coût marginal nul.
- **Une commande par coopérative** : `generate.ps1 -Force` régénère l'ensemble de manière déterministe.
- **Porte qualité automatisée** : `validate.ps1` (28/28 PASS) garantit que chaque site est publiable.
- **Zéro dépendance** : fonctionne hors ligne (PowerShell pur), déployable sur n'importe quel hébergeur statique.
- **Documentation ouverte** : guides, ADR et schémas publics dans les deux dépôts.

> La documentation de réplication détaillée figure dans le README du dépôt `cooperatives-affery` (sections Architecture, Déploiement, Contribution).

---

## 18. Indicateurs d'impact

Le cadre d'indicateurs est détaillé dans [`docs/IMPACT.md`](docs/IMPACT.md). Premiers indicateurs identifiés *(mesure à formaliser — ⚠️ À confirmer)* :

| Dimension | Indicateur |
|---|---|
| Couverture | Nombre de coopératives accompagnées / en ligne |
| Portée | Nombre de producteurs membres concernés |
| Contenu | Nombre de documents/sections publiés, photos de terrain |
| Capacités | Nombre de formations diffusées, référents locaux formés |
| Participation | Taux d'adoption, taux de participation des coopératives |
| Conformité | Taux de conformité aux référentiels (certifications, EUDR) |
| Traçabilité | Nombre de contributions/mises à jour enregistrées |

**Chiffres de référence (données de démonstration)** — COOPCA : 1 200+ producteurs, 3 500 ha, 850 t/an, 24 villages (source : `content-src/coop1.json`). ⚠️ Données réelles de collecte terrain à confirmer.

---

## 19. Partenariats potentiels

**Partenaires cités dans les contenus vitrines** (source : `content-src/coopN.json`) : ANADER, CNRA, Conseil du Café-Cacao, Rainforest Alliance. *Statut effectif des partenariats : ⚠️ À confirmer.*

**Types de partenariats recherchés** : services de vulgarisation agricole, partenaires techniques et financiers, institutions de financement, programmes de coopération, acheteurs engagés dans la durabilité, organisations de certification.

---

## 20. Feuille de route

| Étape | Statut |
|---|---|
| V1 institutionnel : site + back-office + dashboard + analytics | ✅ Livré |
| V1 vitrines : template + workflow + 4 sites (données de démonstration) | ✅ Livré (`v1.2-workflow`, 28/28 PASS) |
| Collecte des données réelles sur le terrain | 🔄 À confirmer |
| Hébergement public des 4 vitrines (Netlify + CMS) | 🔄 À confirmer |
| Backend institutionnel : persistance serveur de `config.json`, authentification serveur | 🧭 Planifié |
| Témoignages : rendu frontend, partenaires actifs | 🧭 Planifié |
| Multi-langue complète (fr/en) | 🧭 Planifié |

Détails : [`docs/ROADMAP.md`](docs/ROADMAP.md) · README du dépôt vitrines.

---

## 21. Contribution

Toute contribution est bienvenue. Consultez [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) (institutionnel) et le guide du dépôt `cooperatives-affery`.

**Règles essentielles** :
- Toujours régénérer puis valider avant de pousser (vitrines).
- Ne jamais modifier les sites générés à la main.
- Enregistrer toute décision structurante dans `DECISION_LOG.md` (format ADR).
- Ne committer ni secrets ni tokens.
- Préserver UTF-8 sans BOM (vitrines).

---

## Conformité et certification

La plateforme contribue **potentiellement** aux référentiels suivants *(analyse documentaire préliminaire — ⚠️ aucune conformité n'est démontrée à ce stade)* :

| Référentiel | Contribution potentielle |
|---|---|
| **Rainforest Alliance** | Diffusion des engagements et démarches de certification des coopératives (COOPCA affiche « Certification Rainforest Alliance 2026 » dans ses actualités) |
| **UTZ** | Contribution potentielle à la traçabilité et aux bonnes pratiques (programme intégré à Rainforest Alliance) |
| **CocoaTrace** | Contribution potentielle à la structuration des données de traçabilité cacao |
| **Fairtrade / Max Havelaar** | Contribution potentielle à la mise en valeur du commerce équitable et des engagements coopératifs |
| **EUDR** | Contribution potentielle à la documentation des données de géolocalisation et de traçabilité (la plateforme structure les données ; la conformité EUDR n'est pas implémentée) |

> ⚠️ **Conformité non démontrée.** Aucun référentiel n'est certifié par ce projet. Les mentions de certification dans les contenus vitrines relèvent des coopératives et restent à vérifier.

---

## Distinction faits / hypothèses / recommandations

- **Faits observés** : fonctionnalités vérifiées dans le code, contenus `config.json` et `content-src/`, résultats de validation, statut des dépôts.
- **Hypothèses** : contribution aux ODD et aux référentiels internationaux (contribution *potentielle*, non mesurée).
- **Recommandations** : formaliser le cadre d'impact, sécuriser l'édition CMS, configurer les remotes, publier les 4 vitrines (voir `docs/ROADMAP.md`).

---

*Millenium Coop Initiative — Des sites web pour les coopératives agricoles en Côte d'Ivoire. Document institutionnel destiné aux coopératives, partenaires techniques et financiers, bailleurs et décideurs.*