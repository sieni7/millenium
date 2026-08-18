# Méthode de réplicabilité — Millenium Coop Initiative

> Méthode du programme pilote pour étendre la présence en ligne à d'autres coopératives et localités. Ce document repose **uniquement sur les capacités vérifiables du dépôt `millenium`** (site institutionnel + back-office). Tout élément relevant du projet vitrines reste marqué ⚠️ À confirmer depuis `cooperatives-affery`.

## 1. Pourquoi répliquer

L'initiative doit pouvoir démontrer aux bailleurs :
1. que la démarche **fonctionne** (preuve par le projet) ;
2. qu'elle est **mesurable** (KPI — voir `docs/IMPACT.md`) ;
3. qu'elle est **reproductible** (méthode, coût marginal, délais).

La réplicabilité transforme une expérience ponctuelle en **méthode** réutilisable.

## 2. Ce que `millenium` apporte à la réplication

| Capacité | Preuve dans le dépôt |
|---|---|
| Configuration centralisée | `public/config.json` : entreprise, hero, services, projets, équipe, témoignages, partenaires, widgets — modification sans code |
| Site statique | HTML + CSS + JS vanilla (ES Modules), zéro framework, zéro backend |
| Déploiable partout | Hébergement statique (Netlify) ; `netlify.toml` ; CI GitHub Actions |
| Contrôle qualité | Build + validations automatiques à chaque push (CI) ; `config.schema.json` |
| Back-office de saisie | `admin.html` : CRUD des sections, import/export `config.json`, journal d'activité (500 entrées, export CSV) |
| Analytics local | Dashboard audience (visites, sessions, durée, rebond, géolocalisation ipwho.is) |
| PWA & SEO | Manifest + service worker ; SEO (OG, JSON-LD) |
| Documentation | Guides, ADR, schémas, procédures dans le dépôt |

## 3. Étapes de réplication d'un site vitrine

> ⚠️ Le déroulé concret du projet vitrines (création effective des 4 sites, contenu, données) relève de `cooperatives-affery`. La méthode ci-dessous décrit le **processus type** que le programme entend valider.

1. **Besoins & inventaire** — identifier la coopérative, ses filières et contenus (⚠️ données du projet).
2. **Clonage du template** — copier le socle `millenium` (code, CI, schéma).
3. **Configuration** — renseigner `config.json` (identité, coordonnées, services) via le back-office.
4. **Contenus** — services, réalisations, équipe, partenaires, témoignages réels.
5. **Validation** — build CI vert + contrôle `config.schema.json` avant mise en ligne.
6. **Mise en ligne** — déploiement statique (hébergeur à coût nul).
7. **Mesure** — activer le dashboard analytics ; reporter les KPI (T0).
8. **Suivi** — T6 / T12 : adoption, complétude des contenus, impact (voir `docs/IMPACT.md`).

## 4. Indicateurs de réplicabilité (KPI)

| Indicateur | Définition | Mesure (⚠️ à formaliser) |
|---|---|---|
| Coût marginal d'un site | Coût additionnel d'un nouveau site par rapport au socle existant | Estimer par cycle (matériel, hébergement, temps) |
| Temps de mise en ligne | Du clonage à la première publication | Chronométrer par cycle |
| Complétude des contenus | % des sections de `config.json` renseignées | Audit `config.json` par site |
| Taux d'adoption | % de coopératives utilisant activement leur présence en ligne | Enquête programme (⚠️) |
| Porte qualité | Nombre de sites publiés conformes au schéma | CI + revue manuelle |

## 5. Conditions de réussite

- Le socle reste **configurable et sans backend** (ADR-002, ADR-003).
- Toute nouveauté structurante pour la méthode → **ADV dans `DECISION_LOG.md`** avant implémentation.
- Les contenus du site institutionnel ne sont **pas** dupliqués dans les vitrines (séparation `docs/SCOPE.md`).
- La méthode est améliorée à chaque cycle (rétroaction portée dans ce document).

## 6. Rôle du programme pilote

- Établir les **KPI** de démonstration (section 4 et `docs/IMPACT.md`).
- Capitaliser un **dossier bailleur** factuel (preuve → mesures → méthode).
- Publier la méthode et son application sur le site institutionnel.

## 7. Références

- Scope : `docs/SCOPE.md`
- Impact / KPI : `docs/IMPACT.md`
- Gouvernance : `docs/GOVERNANCE.md`
- Feuille de route : `docs/ROADMAP.md`
- Décisions d'architecture : `DECISION_LOG.md` (ADR-001 à ADR-006)