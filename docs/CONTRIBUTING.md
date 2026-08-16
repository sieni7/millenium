# Contribution — Millenium Coop Initiative

Merci de contribuer ! Ce projet est volontairement simple : **Vanilla JS, HTML/CSS natifs, pas de framework**.

## Setup local

```bash
git clone https://github.com/sieni7/millenium.git
cd millenium
npm install
npm run dev        # http://localhost:3000 (ouverture auto)
```

Prérequis : Node.js ≥ 20 (recommandé : 22, cf. `netlify.toml`).

## Conventions de code

- **ES Modules** : chaque composant est un module dans `components/`, chaque utilitaire un module dans `js/`, exporté par défaut et réuni dans `js/main.js`.
- **Configuration centralisée** : ne pas coder en dur les textes, coordonnées, couleurs ou slides — tout ajout doit être piloté par `public/config.json`.
- **CSS** : design tokens via variables (`css/…`), cohérence avec la palette existante (vert `#1e7f6e`, émeraude, or).
- **Pas de framework** (cf. ADR-001). Ne pas introduire React/Vue/Angular.
- **Commentaires** : courts, en français, uniquement si nécessaires.
- **Accessibilité** : conserver les améliorations A11y existantes (carrousel flèches clavier, ARIA, labels).

## Tests & vérifications

```bash
npm run build      # doit produire dist/ sans erreur
```

- Vérifier qu'il n'y a pas d'erreur console en dev.
- Vérifier le rendu en mobile (bottom-nav) et le dark mode.
- Les changements de `config.json` doivent être reflétés après rechargement.

## Processus de contribution

1. Créer une branche depuis `main` : `git checkout -b feat/ma-fonctionnalite`.
2. Commiter des changements **atomiques** avec un message clair (style : `feat(admin): …`, `fix(analytics): …`, `docs: …`).
3. Pousser et ouvrir une **pull request** vers `main`.
4. La CI (`.github/workflows/build.yml`) exécute le build ; le déploiement Netlify se déclenche automatiquement après merge.

## Règles de gouvernance

- Toute décision technique ou produit structurante doit être consignée dans `DECISION_LOG.md` (format ADR, validation par le GOVERNOR).
- Ne pas committer de secrets (tokens, identifiants). Le back-office utilise une authentification par hash SHA-256 codé, et les tokens GitHub sont conservés en `sessionStorage` uniquement.
- Rapports d'audit : les audits **conclus** (`reports/*.md`) sont suivis dans le dépôt comme historique ; ne pas y committer de secrets ni de tokens.