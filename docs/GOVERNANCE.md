# Gouvernance — Millenium Coop Initiative

Ce document décrit la gouvernance technique, des données et des contenus du programme MCI (site institutionnel + plateforme vitrines coopératives). Il distingue les **faits observés** des **éléments à confirmer**.

## 1. Gouvernance de projet

### Rôles

| Rôle | Périmètre | Référence |
|---|---|---|
| GOVERNOR | Validation des décisions structurantes | `DECISION_LOG.md` ⚠️ rôle organisationnel réel à confirmer |
| PRODUCTOR | Vision produit et priorisation | `DECISION_LOG.md` |
| ARCHITECT | Décisions techniques | `DECISION_LOG.md` |
| Consultant Digital | Développement, formation, déploiement | `config.json` (Oulaï Sieni) |
| Chargé de mobilisation | Collecte terrain, logistique, support | `config.json` (Guisso Franck) |

### Journal des décisions (ADR)

Toute décision structurante est enregistrée au format ADR dans `DECISION_LOG.md` (statuts : proposée / acceptée / rejetée / dépréciée).

Décisions acceptées : **ADR-001** vanilla JS sans framework · **ADR-002** configuration centralisée `config.json` · **ADR-003** pas de base de données en V1 · **ADR-004** conservation du carrousel (améliorations A11y) · **ADR-005** formulaire sans backend · **ADR-006** scope V1 strict.

En attente : ADR-007 (choix webhook), ADR-008 (mode sombre), ADR-009 (hébergement Netlify vs Vercel).

## 2. Gouvernance des données

### Sources de vérité

| Donnée | Source de vérité | Localisation |
|---|---|---|
| Contenu institutionnel | `config.json` | `millenium/public/config.json` |
| Contenu vitrines | `coops.json` + `coopN.json` | `cooperatives-affery/content-src/` |
| Décisions | `DECISION_LOG.md` | racine institutionnelle |
| Analytics | `localStorage` (navigateur) | non centralisée — ⚠️ |

### Principes

- **Données propriété du territoire** : contenus dans des fichiers ouverts, versionnés par Git.
- **Éditions sans code** : back-office institutionnel (`admin.html`) et CMS Decap (vitrines).
- **Traçabilité** : journal d'activité institutionnel (500 entrées, export CSV).
- **Règle d'or vitrines** : ne jamais modifier les sites générés à la main (`coop1/`…`coop4/`).

## 3. Gouvernance des contenus vitrines

### Workflow de publication

```
collecter (terrain / CMS) → modifier (content-src/ ou CMS) → générer (generate.ps1)
→ valider (validate.ps1, 28/28 PASS) → prévisualiser (serve.ps1) → publier (Netlify)
```

### Porte qualité

`validate.ps1` vérifie structure, données et rendu avant publication. La publication est bloquée tant que la validation ne passe pas.

## 4. Sécurité & accès

- Back-office institutionnel : authentification SHA-256 côté client (⚠️ limite — voir `docs/ARCHITECTURE.md`).
- Édition CMS vitrines : Netlify Identity + Git Gateway ⚠️ à mettre en œuvre au déploiement réel.
- Aucun secret dans les dépôts ; tokens en `sessionStorage` uniquement.
- `robots.txt` bloque `admin.html` et `js/admin.js`.

## 5. Gouvernance technique (recommandations)

1. **Configurer les remotes** Git des deux dépôts (⚠️ `cooperatives-affery` sans `origin`).
2. **Publier les 4 vitrines** et documenter les URLs Netlify réelles.
3. **Formaliser une authentification serveur** pour les écritures du back-office institutionnel.
4. **Politique d'accès CMS** : rôles, invitations, revue des publications.
5. **Rendre l'audit périodique** et archiver les rapports (`reports/`).

## 6. Transparence

Le programme s'engage à documenter ouvertement : code source (dépôts publics), décisions (ADR), schémas de données (`config.schema.json`), cadre d'impact (`docs/IMPACT.md`) et feuille de route (`docs/ROADMAP.md`).