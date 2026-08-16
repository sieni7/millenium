# Feuille de route — Millenium Coop Initiative

> Repère rapide : `✅ = livré et validé` · `🚧 = en cours / planifié` · `🧭 = vision` · `⚠️ = à confirmer` (non engagé).

## ✅ V1 — Livrée

- Site vitrine configurable (`config.json`) : hero, services, réalisations, équipe, partenaires, contact, footer.
- Back-office `admin.html` :
  - Authentification SHA-256 + verrouillage anti-bruteforce.
  - Dashboard Audience (KPIs, graphiques Chart.js 7/30 jours, appareils, navigateurs, géolocalisation ipwho.is).
  - CRUD services, projets, slides, équipe, partenaires, témoignages.
  - Journal d'activité (500 entrées) + export CSV.
  - Import / export de `config.json`, envoi dev (`/api/save-config`) et poussée GitHub.
- PWA (manifest + service worker), SEO (OG, JSON-LD), dark mode, animations.
- CI GitHub Actions + déploiement Netlify automatique.

## 🚧 P1 — Consolidation (prioritaire)

| Sujet | Description | Statut |
|---|---|---|
| Sauvegarde serveur en production | Remplacer le middleware Vite `/api/save-config` (dev-only) par une fonction Netlify Functions / API externe pour persister `config.json` côté serveur. | ⚠️ À confirmer |
| Authentification serveur | L'authentification actuelle est cliente (hash WebCrypto). Évoluer vers une authentification serveur (token + rôle) pour les écritures. | ⚠️ À confirmer |
| Webhook de contact opérationnel | Le formulaire dispose d'un fallback WhatsApp ; finaliser la réception des messages (webhook email / Discord, cf. ADR-005). | ⚠️ À confirmer |
| Version anglaise complète | La structure i18n (`i18n.en`) existe (menus) ; étendre aux contenus (services, projets, équipe). | ⚠️ À confirmer |
| Témoignages & partenaires actifs | Actuellement vides dans `config.json` (mais l'admin permet de les créer). | ⚠️ À confirmer |

## 🧭 P2 — Évolution (vision)

- Catalogue produits / services coopératives (grille + fiches), annoncé à l'ADR-006 comme reporté à V2.
- Statistiques publiques d'impact (pages de résultats des projets).
- Multi-langue complète et contenus localisés (français / anglais).

## Principes de priorisation

- Privilégier les améliorations **sans backend obligatoire** (l'hébergement est statique).
- Toute nouveauté structurante → nouvelle ADR dans `DECISION_LOG.md` avant implémentation.
- Toujours vérifier que le site reste **léger** et déployable sur Netlify.