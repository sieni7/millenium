# DECISION_LOG.md – KIRAM PHARMA

## Format d’enregistrement

Chaque décision suit ce format :
ADR-XXX : Titre de la décision
Date : YYYY-MM-DD

Statut : proposée / acceptée / rejetée / dépréciée

Contexte : ...

Décision : ...

Conséquences : ...

Auteur : GOVERNOR / PRODUCTOR / ARCHITECT / Utilisateur

text

---

## Décisions enregistrées

### ADR-001 : Stack vanilla JS sans framework

- **Date** : 2026-01-15
- **Statut** : acceptée
- **Contexte** : Besoin d’un site léger, évolutif, sans surcharge technique pour V1.
- **Décision** : Utiliser HTML/CSS/JS vanilla. Pas de React, Vue, Angular.
- **Conséquences** : 
  - ✅ Plus rapide, plus léger
  - ✅ Pas de formation nécessaire
  - ⚠️ Composants à coder manuellement (mais réutilisables)
- **Auteur** : ARCHITECT (validé GOVERNOR)

---

### ADR-002 : Configuration centralisée (config.json)

- **Date** : 2026-01-15
- **Statut** : acceptée
- **Contexte** : Éviter de coder en dur les textes, couleurs, coordonnées.
- **Décision** : Toutes les données modifiables (slides, contacts, couleurs, textes) sont dans config.json.
- **Conséquences** :
  - ✅ Modifications sans toucher au code
  - ✅ Plus facile pour back-office futur
  - ⚠️ Nécessite de recharger la page pour voir les changements (acceptable en V1)
- **Auteur** : ARCHITECT

---

### ADR-003 : Pas de base de données en V1

- **Date** : 2026-01-15
- **Statut** : acceptée
- **Contexte** : Complexité inutile pour un site vitrine.
- **Décision** : Utiliser des fichiers JSON. La base de données (Supabase) sera ajoutée en V2 si besoin.
- **Conséquences** :
  - ✅ Simplicité, déploiement statique
  - ✅ Pas de coût serveur
  - ⚠️ Limité pour les recherches avancées (non nécessaire en V1)
- **Auteur** : PRODUCTOR (validé GOVERNOR)

---

### ADR-004 : Conservation du carrousel (avec améliorations A11y)

- **Date** : 2026-01-15
- **Statut** : acceptée
- **Contexte** : Le carrousel existe déjà. Le supprimer serait une régression.
- **Décision** : Conserver le carrousel 3 éléments, mais l’améliorer : flèches clavier, ARIA, dots cliquables.
- **Conséquences** :
  - ✅ Cohérence avec la landing existante
  - ✅ Amélioration accessibilité
  - ⚠️ Nécessite du JS supplémentaire (mais déjà présent)
- **Auteur** : GOVERNOR

---

### ADR-005 : Formulaire sans backend (webhook)

- **Date** : 2026-01-15
- **Statut** : acceptée
- **Contexte** : Éviter de construire une API backend pour la V1.
- **Décision** : Utiliser un webhook Discord ou EmailJS pour recevoir les messages du formulaire.
- **Conséquences** :
  - ✅ Simple, gratuit, fiable
  - ✅ Pas de gestion de base de données
  - ⚠️ Nécessite de configurer un webhook (une fois)
- **Auteur** : ARCHITECT

---

### ADR-006 : Scope V1 strict (pas de catalogue produits)

- **Date** : 2026-01-15
- **Statut** : acceptée
- **Contexte** : Éviter le feature creep. Le catalogue produits nécessite une réflexion UX supplémentaire.
- **Décision** : Le catalogue produits (grille + fiches) est reporté au Sprint 2.
- **Conséquences** :
  - ✅ Sprint 1 plus rapide
  - ✅ Focus sur les fondations
  - ⚠️ Les visiteurs ne verront pas de produits immédiatement
- **Auteur** : PRODUCTOR

---

## Décisions en attente

| ID | Sujet | Proposé par | Statut |
|----|-------|-------------|--------|
| ADR-007 | Choix du webhook (Discord vs EmailJS) | ARCHITECT | À valider |
| ADR-008 | Faut-il un mode sombre ? | (aucun) | À discuter |
| ADR-009 | Hébergement : Netlify vs Vercel | OPS | À trancher |

---

## Règles de gouvernance

1. Toute décision technique ou produit doit être enregistrée dans ce fichier.
2. Une décision est **acceptée** après validation par GOVERNOR.
3. Une décision peut être **dépréciée** si une meilleure alternative apparaît.
4. Les ADR sont référencés dans knowledge_graph.json.

---

## Validation

| Rôle | Nom | Dernière validation |
|------|-----|---------------------|
| GOVERNOR | Core7 Agent | 2026-01-15 |
| PRODUCTOR | Core7 Agent | 2026-01-15 |
| ARCHITECT | Core7 Agent | 2026-01-15 |