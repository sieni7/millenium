# Millenium Coop Initiative (MCI)

**Site institutionnel** — Des sites web pour les coopératives agricoles.

## Présentation

Millenium Coop Initiative accompagne les coopératives agricoles de Côte d'Ivoire dans leur transition numérique, avec une conviction forte : **connecter nos producteurs au web pour créer un levier d'émancipation économique, de sécurité alimentaire et d'inclusion sociale.**

## Mission

> « Millenium Coop Initiative s'inscrit dans la dynamique des Objectifs de Développement Durable (ODD) de l'ONU. En connectant nos producteurs au web, nous créons un levier d'émancipation économique, de sécurité alimentaire et d'inclusion sociale directement à Afféry et Adzopé. »

## Équipe

- **Guisso Franck** — Chargé de mobilisation locale (Afféry)
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