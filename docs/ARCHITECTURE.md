# Architecture — Millenium Coop Initiative

## Vue d'ensemble

Application **100 % statique et sans backend** : chaque page est construite au chargement par le JavaScript à partir d'une configuration centralisée (`public/config.json`).

```
┌─────────────────────────── Navigateur ───────────────────────────┐
│                                                                  │
│  index.html  ──►  js/main.js  ──►  components/*  (landing page)   │
│      │                            └─► modules (seo, darkMode,     │
│      │                                 animations, analytics, …)  │
│      │                                                           │
│  admin.html ──►  js/admin.js      (back-office authentifié)       │
│                     └─► localStorage · config.json · API GitHub   │
│                                                                  │
└───────────────────────────────────────────────────────────────────┘
              │ déploiement statique
              ▼
      Netlify (dist/) ── build via Vite ── CI GitHub Actions
```

## Flux de données

1. **Lecture** : `js/main.js` charge `config.json`, puis instancie 10 composants (`components/`) qui peuplent les sections de `index.html` (hero, services, réalisations, équipe, partenaires, contact, footer, bottom-nav, loading screen).
2. **Écriture (back-office)** : `admin.html` + `js/admin.js` permettent d'éditer le contenu. Les modifications sont :
   - enregistrées dans `localStorage` (persistance navigateur),
   - réinjectées dans `config.json` localement via `js/githubSync.js` (push direct l'API GitHub `contents` depuis le navigateur, avec `sha` et encodage base64).
3. **Statistiques** : `js/analytics.js` et `js/adminAnalytics.js` stockent les visites/sessions dans `localStorage` et affichent les KPIs dans le dashboard.

## Composants

| Composant | Rôle |
|---|---|
| `hero.js` | Slides du hero (max 3), hydratation statique HTML, LCP |
| `services.js`, `projects.js`, `team.js`, `partners.js` | Sections dynamiques |
| `contactForm.js` | Formulaire (validation, fallback WhatsApp) |
| `footer.js` / `bottomNav.js` / `loadingScreen.js` | Pied de page, navigation mobile, écran de chargement |

Modules utilitaires (`js/`) : `seo.js` (OG + JSON-LD), `darkMode.js`, `animations.js`, `mobileMenu.js`, `ux-refinements.js`, `cursor.js`, `analytics.js`, `admin.js` (~56 ko), `adminAnalytics.js` (graphiques Chart.js), `githubSync.js`, `activityLog.js`, `imageUpload.js`/`dragDrop.js`.

## Styles

9 feuilles dans `css/` : variables/design tokens, base, layout, responsive, dark mode, animations, composants (`mci-components`), layout-fix, refinements, partenaires, et la feuille `admin` (dashboard au vert émeraude `#1e7f6e`).

## Sécurité (back-office)

- **Authentification** : comparaison SHA-256 (WebCrypto `crypto.subtle`) des identifiants saisis avec des hash codés dans `js/admin.js`.
- **Anti-bruteforce** : verrouillage de 30 secondes après 5 échecs consécutifs ; tentatives et verrou persistés dans `sessionStorage`.
- ⚠️ **Limite connue** : la vérification s'effectue côté client (site statique), elle repousse les accès non autorisés mais n'est pas une authentification serveur. Un vrai backend d'authentification est prévu (voir `docs/ROADMAP.md`).

## Stockage & limites

| Stockage | Usage |
|---|---|
| `localStorage` | Journal d'activité (500 entrées max : `millenium_activity_log`), préférence thème, données analytics |
| `sessionStorage` | Session auth admin (`admin_auth`, `admin_lock_until`, `admin_fail_count`), token GitHub |
| `public/config.json` | Source de vérité du contenu (déployé avec le site) |

- **Endpoint `/api/save-config`** : implémenté côté **serveur de développement Vite uniquement** (`vite.config.js`, middleware `save-config-plugin`) — il n'existe pas en production statique. ⚠️ En production, la sauvegarde du `config.json` passe par le **push GitHub** depuis l'admin. Un endpoint serveur Netlify Functions est prévu (voir ROADMAP).
- Pas de base de données relationnelle en V1 (décision ADR-003).

## Décisions d'architecture

Les choix structurants sont consignés dans le journal ADR (`DECISION_LOG.md`) :

| ID | Décision | Statut |
|---|---|---|
| ADR-001 | Vanilla JS sans framework | acceptée |
| ADR-002 | Configuration centralisée `config.json` | acceptée |
| ADR-003 | Pas de base de données en V1 | acceptée |
| ADR-004 | Conservation du carrousel (améliorations A11y) | acceptée |
| ADR-005 | Formulaire sans backend (webhook / fallback WhatsApp) | acceptée |
| ADR-006 | Scope V1 strict (pas de catalogue produits) | acceptée |

## PWA & SEO

- `public/manifest.json` : PWA installable (icônes 192/512, `standalone`).
- `public/sw.js` : cache `mci-cache-v2` en stale-while-revalidate ; `config.json` en network-first ; contenu cross-origin non mis en cache.
- `js/seo.js` : meta Open Graph/Twitter + JSON-LD (`ProfessionalService`, `Service`, `Person`).