# Millénium Consulting Innovation (MCI)

**Site institutionnel** du cabinet de conseil en transformation digitale.

## Présentation

Millénium Consulting Innovation (MCI) est un cabinet ivoirien de conseil et d'ingénierie numérique, fondé sur une conviction forte : **la technologie n'a de sens que si elle est accessible, utile et durable pour les acteurs locaux.**

Nous accompagnons les coopératives agricoles, les PME et les institutions dans leur transformation digitale, en alliant expertise technique et ancrage terrain.

## Mission

> « Innover localement pour un impact durable. »

## Équipe

- **Guisso Franck** — Chef du Projet Terrain (Afféry)
- **Oulaï Sieni** — Consultant Digital & Formateur Technique (Abidjan)

## Stack technique

- **Framework** : Vite
- **Langage** : Vanilla JavaScript (ES Modules)
- **CSS** : Natif avec variables CSS (design tokens)
- **Hébergement** : Netlify (déploiement continu depuis GitHub)
- **PWA** : Supporté (manifest.json + service worker)
- **SEO** : Métadonnées dynamiques, JSON-LD, sitemap.xml

## Structure du projet

```
millenium/
├── components/       # Composants UI modulaires (JS)
├── css/              # Styles (variables, base, layout, responsive)
├── js/               # Scripts utilitaires (SEO, dark mode, animations, etc.)
├── public/           # Assets statiques (images, config.json, manifest, robots.txt)
├── index.html        # Page principale
├── admin.html        # Back-office (désactivé en production)
├── package.json
├── vite.config.js
└── netlify.toml
```

## Développement

```bash
npm install
npm run dev        # Lance le serveur de développement
npm run build      # Génère le build de production
npm run preview    # Prévisualise le build
```

## Déploiement

Le site est automatiquement déployé sur Netlify à chaque `push` sur la branche `main`.

URL : [https://milleniumci.netlify.app](https://milleniumci.netlify.app)

## Contact

- WhatsApp : +225 05 74 97 10 22
- Téléphone : +225 01 04 46 25 12