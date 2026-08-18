# Scope — Initiative vs Projet

> Document de référence des deux périmètres du programme **Millenium Coop Initiative**. Ce document fixe les rôles, les frontières de responsabilité et les règles de non-confusion entre les deux dépôts.

## 1. Les deux périmètres

| Périmètre | Dépôt | Rôle |
|---|---|---|
| **Initiative / programme pilote** | `millenium` (ce dépôt) | Prouver la démarche aux bailleurs, établir les KPI, générer une **méthode de réplicabilité**. Porte le site institutionnel + le back-office : vitrine de l'initiative, données, pilotage. |
| **Projet** | `cooperatives-affery` | Le projet concret : **preuve d'existence formelle**. Un projet de 4 sites vitrines pour 4 coopératives agricoles de la zone Afféry / Adzopé. ⚠️ Détails du projet (filières, contenus, données) : se référer à son propre dépôt. |

## 2. Frontières de responsabilité

### Ce dépôt (`millenium`) est responsable de
- Le site institutionnel de l'initiative et son back-office.
- La configuration centralisée (`public/config.json`) du site institutionnel.
- Le cadre d'impact et les indicateurs (KPI) du programme pilote.
- La méthode de réplicabilité (`docs/METHODE_REPLICABILITE.md`).
- La gouvernance du programme pilote.

### Le projet (`cooperatives-affery`) est responsable de
- La preuve d'existence formelle du projet (4 sites vitrines pour 4 coopératives).
- Ses contenus propres, ses données et son histoire.

### Règles de non-confusion
1. **Pas d'hallucination** : toute information sur le projet ne provient pas de ce dépôt. Reste dans le périmètre de `millenium` ; tout détail du projet est ⚠️ À confirmer depuis `cooperatives-affery`.
2. **Sources distinctes** : les données du site institutionnel (`millenium`) et celles des vitrines (`cooperatives-affery`) ne se mélangent pas dans `config.json`.
3. **Réplicabilité ≠ copie** : répliquer la *méthode* (voir ci-dessous), pas dupliquer les contenus du site institutionnel.

## 3. Flux entre initiative et projet

- L'initiative fournit le **cadre** (méthode, KPI, vitrine institutionnelle, valorisation bailleur).
- Le projet fournit la **preuve** (sites vivants, coopératives en ligne, données terrain).
- Les KPI d'adoption mesurés par l'initiative s'appuient sur les réalisations du projet (⚠️ selon disponibilité des données).

## 4. Références croisées

- Méthode de réplicabilité : `docs/METHODE_REPLICABILITE.md`
- Cadre d'impact / KPI : `docs/IMPACT.md`
- Gouvernance : `docs/GOVERNANCE.md`
- Rapport institutionnel : `README.md` (section « Deux périmètres »)