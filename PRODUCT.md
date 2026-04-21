# PRODUCT.md – KIRAM PHARMA

## Vision produit

**Site vitrine évolutif** pour KIRAM PHARMA, SARL basée à Abidjan (Cocody Angré Djibi), spécialisée en représentation, promotion médicale et commercialisation pharmaceutique.

Le site doit :
- Refléter le professionnalisme et la crédibilité d’un acteur clé de la santé en Côte d’Ivoire
- Permettre une évolution progressive : landing → catalogue produits → espace prescripteur
- Être administrable sans compétences techniques (back-office simple)

---

## Scope V1 (MVP) – Sprint 1

| Feature | Priorité | Complexité | Statut |
|---------|----------|------------|--------|
| Hero carrousel 3 éléments | P0 | Moyenne | ✅ existant |
| Navigation responsive | P0 | Faible | ✅ existant |
| Section identité société | P0 | Faible | ✅ existant |
| Refactorisation en composants | P1 | Moyenne | À faire |
| Fichier config.json central | P1 | Faible | À faire |
| Section partenaires | P2 | Faible | À faire |
| Formulaire de contact fonctionnel | P1 | Moyenne | À faire |
| Accessibilité WCAG 2.1 AA | P1 | Moyenne | À faire |
| Tests QA | P1 | Faible | À faire |

**P0** = indispensable au lancement
**P1** = indispensable pour V1
**P2** = agréable mais peut être post-V1

---

## Scope V2 (Sprint 2-3)

| Feature | Priorité estimée |
|---------|------------------|
| Catalogue produits (JSON → grille) | P1 |
| Fiche produit détaillée | P1 |
| Back-office simple (admin panel) | P1 |
| Espace téléchargement (brochures) | P2 |
| Filtrage produits par laboratoire | P2 |

---

## Scope V3 (Sprint 4+)

| Feature | Priorité estimée |
|---------|------------------|
| Espace prescripteur sécurisé | P2 |
| Chatbot métier "Kira" | P3 |
| Analytics et tracking | P2 |
| Export catalogue PDF | P3 |

---

## Règles de priorisation (anti-feature creep)

1. **Santé-règle** : rien qui compromet la lisibilité ou la confiance
2. **Mobile-first** : toute feature doit fonctionner sur mobile
3. **Performance** : pas de librairie lourde sans justification
4. **Évolutivité** : préférer JSON/static avant base de données

---

## User Personas

### Persona 1 – Prospect laboratoire
> *Dr. Koné, Directeur commercial d’un labo européen*
> Cherche un partenaire de confiance pour distribuer en Côte d’Ivoire. Veut voir crédibilité, références, équipe.

### Persona 2 – Professionnel de santé
> *Pharmacien à Abidjan*
> Cherche un produit spécifique ou un contact pour commander. Veut catalogue et coordonnées claires.

### Persona 3 – Visiteur médical (futur)
> *Collaborateur KIRAM PHARMA*
> Veut accéder aux fiches produits et documents pour ses visites.

---

## KPIs de succès V1

| KPI | Cible |
|-----|-------|
| Temps de chargement | < 2s (3G) |
| Score Lighthouse | > 85/100 |
| Formulaire contact | > 95% taux d’envoi réussi |
| Navigation intuitive | Test 5 utilisateurs sans erreur |

---

## Décisions produit validées (GOVERNOR)

- [x] Pas de login en V1
- [x] Pas de base de données (JSON suffit)
- [x] Design sobre, tons turquoise/émeraude
- [x] Carrousel conservé mais rendu accessible