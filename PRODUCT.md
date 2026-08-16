# PRODUCT.md — Millenium Coop Initiative

## Vision produit

Millenium Coop Initiative accompagne les **coopératives agricoles** de Côte d'Ivoire (au départ : zone Afféry / Adzopé) dans leur **transition numérique**.

> « En connectant nos producteurs au web, nous créons un levier d'émancipation économique, de sécurité alimentaire et d'inclusion sociale. » (aligné avec les ODD de l'ONU)

Le site doit :
- Refléter la crédibilité de terrain et le sérieux de la démarche (équipe résidente à Afféry, méthode éprouvée).
- Permettre un accompagnement fluide : découverte → étude de cas / réalisations → prise de contact.
- Être **administrable simplement** par Oulaï (ou un référent) via le back-office, sans toucher au code.

## Personas

### Persona 1 — Coopérative agricole
> *Président de coopérative (Afféry/Adzopé)*
> Souhaite une présence en ligne et une formation de ses membres, avec un support local de proximité.

### Persona 2 — Partenaire / Institution
> *Programme de développement, OP, institution de financement, partenaire technique*
> Cherche des signaux de crédibilité : projets en ligne, équipe locale, chiffres d'impact.

### Persona 3 — Décideur / rédacteur
> *Oulaï Sieni (consultant digital) ou référent local*
> Doit mettre à jour les contenus et lancer des déploiements sans compétence technique avancée.

## Offre (scope livré)

1. **Création de sites web** pour coopératives (vitrines institutionnelles).
2. **Conseil & stratégie digitale** : diagnostic numérique, feuille de route, gouvernance des données, communication digitale.
3. **Formation & accompagnement** : formation des référents locaux, transfert de compétences, support 3 mois.

## Équipe

| Nom | Rôle | Zone |
|---|---|---|
| Guisso Franck | Chargé de mobilisation locale | Afféry |
| Oulaï Sieni | Consultant Digital & Formateur Technique | Abidjan |

## Étude de cas de référence

**Transformation digitale de 4 coopératives agricoles** (Zone Afféry / Adzopé — mission 3 jours) : 4 sites en ligne, 1 référent local formé, 3 mois de support inclus.

## KPIs de succès

| KPI | Cible |
|---|---|
| Temps de chargement | < 1,5 s (Lighthouse mobile ≥ 70) |
| Crédibilité | 100 % photos réelles, témoignages/partenaires réels publiés |
| Conversion contact | Formulaire + WhatsApp : taux de réponse < 24 h |
| Impact mesurable | N coopératives en ligne / référents formés / survie à 6 mois |

## Prochaines évolutions majeures

- Backend : persistance serveur de `config.json` (endpoint Netlify Functions), authentification serveur.
- Témoignages : rendu frontend des témoignages (CRUD admin déjà en place ⚠️).
- Multi-langue complète (fr/en structure i18n existante).

Voir `docs/ROADMAP.md` pour le détail priorisé.