# Cadre d'impact — Millenium Coop Initiative

> Ce document définit le cadre d'évaluation d'impact du dépôt `millenium` (site institutionnel + back-office). Les indicateurs sont proposés à partir des capacités réelles de l'application ; **aucune mesure n'a encore été collectée sur le terrain** — chaque référence est marquée ⚠️ À confirmer.

## 1. Théorie du changement (résumé)

**Inputs** : site statique configurable, back-office d'administration, dashboard d'audience, outillage de déploiement (GitHub), formation des référents.

**Activités** : publication d'une présence en ligne crédible, mise à jour des contenus (coopératives, coordonnées, réalisations), suivi d'audience, accompagnement des coopératives.

**Outputs** : site institutionnel en ligne, contenus publiés et à jour, statistiques disponibles, référents formés.

**Outcomes** : visibilité accrue des coopératives, gouvernance documentaire améliorée, capacités numériques locales renforcées.

**Impact** : émancipation économique des producteurs, sécurité alimentaire, inclusion sociale (aligné ODD).

## 2. Indicateurs proposés

### 2.1 Portée & audience

| Indicateur | Définition | Mesure possible |
|---|---|---|
| Visites | Nombre de visites enregistrées | Dashboard admin (`js/adminAnalytics.js`) |
| Sessions | Nombre de sessions | Dashboard admin |
| Durée moyenne | Durée moyenne de session | Dashboard admin |
| Taux de rebond | Part des visites courtes (< 15 s) | Dashboard admin |
| Géolocalisation | Pays / villes des visiteurs | ipwho.is (HTTPS) |

### 2.2 Contenus & gestion des connaissances

| Indicateur | Définition |
|---|---|
| Sections publiées | Nombre de services, projets, membres, partenaires, témoignages dans `config.json` |
| Études de cas | Nombre de réalisations publiées |
| Photos réelles | Nombre d'images réelles remplaçant les placeholders |
| Mises à jour | Historique des modifications (journal d'activité, 500 entrées, export CSV) |

> ⚠️ Actuellement : 3 services, 1 projet, 2 membres d'équipe, 0 partenaire, 0 témoignage dans `public/config.json` — contenus à enrichir par le programme.

### 2.3 Renforcement des capacités

| Indicateur | Définition |
|---|---|
| Référents formés | Nombre de référents capables d'utiliser le back-office |
| Formations diffusées | Nombre de sessions de formation |
| Taux d'adoption | % de coopératives utilisant activement leur présence en ligne |

### 2.4 Conformité & durabilité

| Indicateur | Définition |
|---|---|
| Taux de conformité | % de contenus alignés sur les référentiels affichés (Rainforest Alliance, bio, EUDR…) |
| Traçabilité | Données structurées (coopératives, coordonnées, réalisations) disponibles |

## 3. Données de référence disponibles

- **Configuration réelle** : `public/config.json` (entreprise, hero, services, projets, équipe, témoignages, partenaires, widgets).
- **Audience** : `localStorage` (analytics) — ⚠️ non centralisée, navigateur par navigateur.
- **Décisions** : `DECISION_LOG.md` (ADR-001 à ADR-006).

## 4. Recommandations

1. **Collecter des données de référence** avec les coopératives accompagnées.
2. **Mesurer périodiquement** (T0, T6, T12) les indicateurs ci-dessus.
3. **Publier un rapport d'impact** annuel sur le site institutionnel.
4. **Enrichir les contenus** : témoignages et partenaires réels (sections actuellement vides dans `config.json`).