# Déploiement — Millenium Coop Initiative

## Prérequis

- Un compte **Netlify** relié au dépôt GitHub (`https://github.com/sieni7/millenium`, branche `main`).
- Node.js : **22** recommandé (valeur définie dans `netlify.toml`).
- Repository GitHub avec **au minimum une permission de lecture sur les contents** pour l'admin (voir « Back-office »).

## Build

```bash
npm install
npm run build      # génère le dossier dist/ (sortie Vite)
npm run preview    # vérifie le build en local
```

- Configuré dans `vite.config.js` : trois points d'entrée (`index.html`, `admin.html`, `maintenance.html`), minification **terser**, sourcemaps.
- CI : `.github/workflows/build.yml` (Node 20.x, `npm install`, `npm run build`, vérification de la présence de `dist/`).

## Déploiement Netlify

Le déploiement est **automatique à chaque push sur `main`**, selon `netlify.toml` :

| Réglage | Valeur |
|---|---|
| Commande build | `npm run build` |
| Dossier de publication | `dist` |
| Version Node | `NODE_VERSION = "22"` |
| Redirection | `/admin` → `admin.html` (301) |
| Fallback SPA | `/*` → `index.html` (200) |
| En-têtes de sécurité | définis dans `netlify.toml` |

**Mode maintenance** : une redirection vers `maintenance.html` (bloquée en `noindex`) est prévue dans `netlify.toml` (actuellement commentée) pour suspendre le site pendant les mises à jour.

## PWA & cache

- `public/sw.js` : stratégie **stale-while-revalidate** sur le cache `mci-cache-v2` ; `config.json` chargé en **network-first** (toujours frais).
- Après un changement de cache, incrémenter `CACHE_NAME` et versions.

## Back-office : pousser `config.json` vers GitHub

Depuis `/admin.html` → onglet **Profil** :

1. Saisir un **token d'accès personnel GitHub** (avec droit `repo`).
2. `Vérifier le token` → appelle `GET /users` de l'API GitHub.
3. `Pousser la configuration` → envoie `PUT /repos/sieni7/millenium/contents/public/config.json` (base64 + `sha` courant) via `js/githubSync.js`.
4. Le push redéploie automatiquement le site sur Netlify.

⚠️ **Sauvegarde serveur (`/api/save-config`)** : disponible uniquement en **développement** (middleware Vite), pas en production statique. Pour persister le contenu en production, utiliser la poussée GitHub ci-dessus.

## Vérification post-déploiement

- [ ] `https://milleniumci.netlify.app/` répond et affiche le contenu de `config.json`.
- [ ] `https://milleniumci.netlify.app/admin` redirige vers `admin.html` (301).
- [ ] `robots.txt` expose la directive `Disallow: /admin.html` et le `sitemap.xml`.
- [ ] Le service worker enregistre le cache et sert en hors-ligne.
- [ ] La CI GitHub Actions passe (build + présence de `dist/`).