# Gouvernance — Millenium Coop Initiative

Ce document décrit la gouvernance technique, des données et des contenus du dépôt `millenium` (site institutionnel + back-office). Il distingue les **faits observés** des éléments **⚠️ à confirmer**.

## 1. Gouvernance de projet

### Deux niveaux de gouvernance

| Niveau | Objet | Dépôt | Responsabilité |
|---|---|---|---|
| **Initiative / programme pilote** | Cadre, KPI, méthode de réplicabilité, vitrine institutionnelle | `millenium` (ce dépôt) | Preuve aux bailleurs, établissement des KPI, méthode de réplication |
| **Projet** | Réalisation concrète (4 sites vitrines pour 4 coopératives) | `cooperatives-affery` | Preuve d'existence formelle, contenus et données du projet (⚠️ se référer à son propre dépôt) |

La gouvernance de ce dépôt porte sur le **niveau initiative**. Le périmètre détaillé des deux niveaux : `docs/SCOPE.md`.

### Rôles (source : `public/config.json`)

| Rôle | Périmètre | Référence |
|---|---|---|
| Consultant Digital & Formateur Technique | Développement, formation, déploiement | `config.json` (Oulaï Sieni) |
| Chargé de mobilisation locale | Collecte terrain, logistique, support | `config.json` (Guisso Franck) |
| GOVERNOR / PRODUCTOR / ARCHITECT | Validation des décisions structurantes | `DECISION_LOG.md` ⚠️ rôle effectif à confirmer |

### Journal des décisions (ADR)

Toute décision structurante est enregistrée au format ADR dans `DECISION_LOG.md` (statuts : proposée / acceptée / rejetée / dépréciée).

Décisions acceptées : **ADR-001** vanilla JS sans framework · **ADR-002** configuration centralisée `config.json` · **ADR-003** pas de base de données en V1 · **ADR-004** conservation du carrousel (améliorations A11y) · **ADR-005** formulaire sans backend · **ADR-006** scope V1 strict.

En attente : ADR-007 (choix webhook), ADR-008 (mode sombre), ADR-009 (hébergement Netlify vs Vercel).

## 2. Gouvernance des données

### Sources de vérité

| Donnée | Source de vérité | Localisation |
|---|---|---|
| Contenu institutionnel | `config.json` | `public/config.json` |
| Schéma de référence | `config.schema.json` | racine du dépôt |
| Décisions | `DECISION_LOG.md` | racine du dépôt |
| Audience | `localStorage` (navigateur) | non centralisée — ⚠️ |

### Principes

- **Configuration centralisée** : toute modification de contenu passe par `config.json` ou le back-office, pas par le code.
- **Traçabilité** : journal d'activité du back-office (500 entrées, export CSV) + historique Git.
- **Éditions sans code** : back-office (`admin.html`).

## 3. Workflow de publication

```
modifier (back-office admin.html ou config.json)
→ valider (build npm run build / CI GitHub Actions)
→ pousser et déployer (Netlify, push sur main)
```

- La **CI** (`.github/workflows/build.yml`) vérifie le build avant publication.
- La **persistance serveur** (`/api/save-config`) n'existe qu'en dev (middleware Vite) ; en production, la sauvegarde passe par le **push GitHub** depuis l'admin.

## 4. Sécurité & accès

- **Back-office** : authentification SHA-256 (WebCrypto) côté client — ⚠️ **limite** documentée dans `docs/ARCHITECTURE.md` (une authentification serveur est recommandée).
- **Verrouillage anti-bruteforce** : 30 s après 5 échecs, persisté en `sessionStorage`.
- **robots.txt** : bloque `admin.html` et `js/admin.js`.
- **Aucun secret dans le dépôt** ; tokens GitHub en `sessionStorage` uniquement.

## 5. Recommandations de gouvernance

1. **Formaliser les rôles effectifs** (revue des publications, validation des décisions).
2. **Faire évoluer l'authentification** vers une vérification serveur pour les écritures.
3. **Centraliser les analytics** (aujourd'hui en `localStorage`) pour une mesure d'impact fiable.
4. **Rendre l'audit périodique** et archiver les rapports (`reports/`).
5. **Enrichir les contenus** (témoignages, partenaires) pour une vitrine crédible.

## 6. Transparence

Le programme s'engage à documenter ouvertement : code source (dépôt public), décisions (ADR), schémas de données (`config.schema.json`), cadre d'impact (`docs/IMPACT.md`), méthode de réplicabilité (`docs/METHODE_REPLICABILITE.md`), périmètres (`docs/SCOPE.md`) et feuille de route (`docs/ROADMAP.md`).