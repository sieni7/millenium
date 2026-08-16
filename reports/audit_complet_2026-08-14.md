# RAPPORT D'AUDIT — SITE MCI (Millénium Consulting Innovation)

> **⚠️ Snapshot au 14/08/2026 — document historique conservé tel quel.** Depuis cet audit : rebranding « Millenium Coop Initiative » (coopératives agricoles), suppression de `public/sections/partenaires.html` (résidu de marque actif), email renseigné dans `config.json`, optimisations CSS/JS en cours de traitement. Certaines récos P0/P1 sont donc **déjà traitées** — croiser avec l'état actuel avant application.

**Audité le :** 14/08/2026 · **URL :** https://milleniumci.netlify.app · **Stack :** Vite 8 + Vanilla JS + CSS natif + Netlify · **Mode :** lecture seule (aucun fichier modifié)

---

## PHASE 1 — INVENTAIRE DU PROJET

| Élément | Statut | Observations |
|---|---|---|
| **Architecture** | ✅ Saine | Vite multi-pages (`index.html`, `admin.html`, `maintenance.html`). Architecture modulaire propre : `components/` (10 composants), `js/` (17 modules), séparation claire UI / logique / services. Mise en œuvre SPA-like via `config.json` hydratée par `main.js`. |
| **CSS** | ⚠️ Volumineux | 9 fichiers (49 Ko build) + gros `<style>` inline (index.html:25-226). **Duplications CSS réelles** : `.skeleton` défini 2× (`animations.css:16` et `:69`), `.back-to-top` 2× (`animations.css:31` + `refinements.css:23`), `.progress-bar-container` 2× (index + refinements). Échelle de z-index anarchique (999→99999). |
| **Composants** | ✅ Correct | 10 composants ES modules, rendus par `render()`/`init()`. Chaîne de données propre `config.json` → `main.js` → composants. i18n minimal (fr/en) présent. |
| **Assets** | ⚠️ À enrichir | Logos réels OK (logo_header/footer). **4 images de contenu = placeholders générés** (hero 99 Ko JPG 1920×1080, case-study 46 Ko, 2 portraits équipe 22 Ko). Aucune photo réelle. |
| **Configuration** | ✅ Correcte | `vite.config.js` (multi-entrées, minify terser, sourcemap) ; `netlify.toml` (build + headers sécurité + redirects) ; `sw.js` PWA fonctionnel (stale-while-revalidate, config network-first). |

---

## PHASE 2 — AUDIT UX / UI

| Critère | Score (/10) | Commentaire |
|---|---|---|
| **Identité** | **8** | Palette MCI respectée (Émeraude `#174C32`, Or `#C9902E`, Ivoire `#FDFCFA`, Vert-noir `#10261B`). Design tokens structurés dans `:root`. Logos cohérents header/footer/favicon. ⚠️ `--secondary` clair pointe sur gold-600 `#C9902E` (pas le gold-500 nominal `#D7A447`) ; palette divergente en dur (`#1e7f6e`, `#0b3b3c`) dans refinements/layout-fix/admin. |
| **Navigation** | **7** | Header fixe, menu mobile burger + bottom-nav, ancres fluides, back-to-top, widget WhatsApp, sticky-cta. ⚠️ **Section partenaires visible mais vide** (titre + tagline affichés sans contenu). Le nav "Accueil" pointe sur `#about`. |
| **Typographie** | **8** | Inter (headings) + Montserrat (body), hiérarchie h1→h2→h3 correcte, `clamp()` responsive. ⚠️ Section Contact en **h3 sans h2** (saut), footer en **h4 sans h3**. |
| **Responsive** | **7** | Breakpoints 1024/768/600/576, 7 blocs à 768px. Backdrop-filter désactivé sur mobile (sprint P4 ✅). ⚠️ Aucun breakpoint >1024 ; `position:fixed` multiples sur mobile. |
| **Cohérence visuelle** | **6** | Style cohérent sur la page publique. ⚠️ **Admin a sa propre palette divergente** ; bouton WhatsApp icône blanche sur `#25D366` (contraste 1.98:1) ; animations de `box-shadow` en boucle (pulse-wa) surcharge le compositing. |

---

## PHASE 3 — AUDIT PERFORMANCE (TECHNIQUE)

| Élément | Impact | Priorité |
|---|---|---|
| **CSS** | **Élevé** | 14 déclarations `backdrop-filter` (dont **header desktop fixe + blur(10px)** index.html:145 — compositing continu au scroll). **`pulse-wa` anime `box-shadow` en boucle infinie sur widget fixed** (index.html:212-222) — repaint permanent. `.reveal` = `transition: all 800ms` (la plus lourde). Transition box-shadow sur `.mci-card`/`.product-card`. 5 animations infinies. |
| **JS** | **Élevé** | 🔴 **Fuite de listeners confirmée** : `dragDrop.js` ré-attache 5 listeners anonymes à chaque re-render admin (admin.js:206/256/281). 🔴 **Scroll non throttlé** : `refinements.js:47-52` lit `scrollTop`+écrit `style.width` à chaque événement (layout-thrash). 🔴 MutationObserver permanent sur `document.body` (cursor.js:84-98, jamais disconnecté, double parcours matches+querySelectorAll). Redondances : 3 gestionnaires back-to-top, 2 barres de progression. `removeEventListener` jamais utilisé (code mort cursor.js:detach). |
| **Images** | **Moyen** | Logo header `fetchpriority="high"` ✅ + `preload` hero ✅. ⚠️ **4/4 images de contenu = placeholders JPG** (hero 99 Ko). Pas de WebP/AVIF. Hero en `background-image` CSS (pas de width/height). Footer logo 220×220 `loading="lazy"` ✅. |
| **Bundle** | **Faible/Moyen** | Build 34.5 Ko JS + 25.6 Ko CSS (gzip ~15 Ko) — **léger, bien optimisé**. Google Fonts allégées (400-800) + non-bloquant ✅. Font Awesome CDN `media="print" onload` ✅. `console.log` de prod restants : seo.js:36/98, analytics.js:108/171, refinements.js:116, webhook.js:2 (**expose l'URL du webhook**). |

**Mesure (Lighthouse 14/08/2026)** : Performance mobile **62** (vs 38 avant sprint P4), TBT 0 ms, CLS 0.036. Opportunités : main-thread work (Style & Layout ~3 s), render-blocking restant, unused CSS 18 Ko.

---

## PHASE 4 — AUDIT ACCESSIBILITÉ (WCAG 2.2)

| Critère | Statut | Observation |
|---|---|---|
| **Structure** | ✅ | 1 seul `<h1>` (index.html:265), `main`/`section`/`footer` présents. ⚠️ Contact en h3 sans h2, footer en h4 sans h3 (sauts hiérarchiques mineurs). |
| **Images (alt)** | ⚠️ Partiel | Logo header alt pertinent ✅. ⚠️ **Alt trompeurs** : `team.js:19` et `projects.js:59` décrivent des photos placeholder (dégradés affichés). **Hero en background-image CSS : invisible pour lecteurs d'écran** (image principale !). Aucune image décorative `alt=""` (pas d'img décoratives, OK). |
| **Focus visible** | ⚠️ Partiel | `:focus-visible` global présent (refinements.css:154-157) + logo ✅. ⚠️ **Anneau de focus en `var(--secondary)` = or `#C9902E` sur ivoire = contraste 2.73:1 (insuffisant)**. Formulaires: `outline:none`+ring box-shadow (acceptable). |
| **Contraste** | ⚠️ **Échecs AA** | Mesures : or `#C9902E` sur ivoire **2.73:1** ❌ (texte normal 4.5:1, large 3:1 requis) ; or clair `#D7A447` sur ivoire **2.20:1** ❌ ; vert clair `#2A8A61` sur sombre **4.29:1** ❌ (juste sous 4.5) ; **icône WhatsApp blanche sur `#25D366` = 1.98:1** ❌❌ ; texte muted `#899991` sur sombre **5.50:1** ✅ ; blanc sur vert `#174C32` **9.92:1** ✅. |
| **Animations réduites** | ✅ | `prefers-reduced-motion` global (refinements.css:160-167) + ciblé (mci-components.css:351-364). ⚠️ `pulse-wa` dépend de la règle `!important` globale (pas de fallback dédié). |

---

## PHASE 5 — AUDIT SEO TECHNIQUE

| Élément | Statut | Observation |
|---|---|---|
| **Title** | ⚠️ OK | 74 caractères (50-60 recommandé, un peu long mais pertinent). |
| **Description** | ✅ | 117 caractères, pertinente, mots-clés (conseil, coopératives, PME, Côte d'Ivoire). |
| **Canonical** | ✅ | `https://milleniumci.netlify.app/` présent (index.html:21). |
| **Robots.txt** | ✅ | Autorise `/`, bloque `admin.html` + `js/admin.js`, référence le sitemap. |
| **Sitemap** | ✅ | Présent, contient l'URL racine, lastmod 11/08/2026. |
| **Structure sémantique** | ✅ | 1 seul h1, hiérarchie logique, `<html lang="fr">`, Open Graph (og:title/description) présents. |

**Manques SEO** : pas d'`og:image` / Twitter Card ; pas de JSON-LD `Organization`/`LocalBusiness` visible (seo.js l'injecte — à vérifier au runtime) ; pas de `<link rel="alternate" hreflang>` pour l'anglais malgré l'i18n. `maintenance.html` correctement `noindex` ✅. Admin `noindex` implicitement via robots.txt ✅.

---

## PHASE 6 — AUDIT MÉTIER & CRÉDIBILITÉ

| Élément | Présent | Manquant | Action recommandée |
|---|---|---|---|
| **Photos réelles** | Logos réels uniquement | **0 photo réelle** (4/4 placeholders générés : hero, case-study, 2 portraits équipe) | Remplacer par vraies photos : consultants, coopératives, zone d'intervention (Afféry/Adzopé), chantier terrain. |
| **Étude de cas** | ✅ 1 étude chiffrée (4 coopératives, 3 jours, 3 mois, 1 référent) | Preuves visuelles (photos/captures des 4 sites) | Ajouter captures d'écran des sites livrés, nommer les coopératives, liens vers les sites. |
| **Témoignages** | — | **`testimonials: []` vide** | Recueillir 2-3 témoignages réels avec nom, fonction, organisation (ex. président de coopérative). |
| **Partenaires** | — | **`partners: []` vide MAIS section visible avec ancienne tagline** | Remplir des partenaires réels (institutions, programmes) OU supprimer la section. ⚠️ Voir Phase 7. |
| **Équipe réelle** | 2 membres nommés avec rôle + description | **Photos placeholder** | Vraies photos + biographie enrichie (expertise, zone d'intervention, années d'expérience). |
| **Coordonnées** | Téléphone ✅, WhatsApp ✅, adresse ✅ | **Email vide (`""`)** → footer affiche "Non communiqué" ; pas de réseaux sociaux (LinkedIn/Facebook) | Ajouter un email professionnel, LinkedIn du cabinet/consultants. |

**Autres points de confiance** : mission/slogan clairs ✅, mention "Site conçu par OULAI Siéni" ✅, phrase de réassurance contact "traitée directement par [nom]" ✅.

---

## PHASE 7 — DÉTECTION DES RÉSIDUS (ANCIENNE MARQUE)

| Fichier | Ligne | Occurrence | Action recommandée |
|---|---|---|---|
| `public/sections/partenaires.html` | 6 | « garantir la **sécurité de vos investissements** » | Réécrire ou supprimer (hérité du patrimonial) |
| `public/sections/partenaires.html` | 12 | **Cabinet Notarial** | Supprimer |
| `public/sections/partenaires.html` | 16 | **Partenaire Bancaire** | Supprimer |
| `public/sections/partenaires.html` | 19 | **Cabinet d'Architecture** (+ icône `fa-hard-hat`) | Supprimer |
| `public/sections/partenaires.html` | 24 | **Expert Foncier** | Supprimer |
| `js/refinements.js` | 2 | En-tête commentaire « Millenium Côte d'Ivoire » (ancien nom) | Corriger le nom de marque |
| `css/refinements.css` / `css/layout-fix.css` | 2 | Idem en-tête | Corriger |

**Résidu actif critique** : `public/sections/partenaires.html` est **visible sur le site public** (fetch main.js:122) avec les 4 "partenaires" de l'ancienne activité (notarial, bancaire, architecture, foncier) + tagline « sécurité de vos investissements ». Même si `partners:[]` masque la grille au runtime, le **titre et la tagline restent affichés** (main.js:125 injecte le HTML, partners.js:12 ne masque que `#partners-grid-container`). Aucun autre terme (immobilier, diaspora, construction, patrimonial) dans les fichiers actifs.

---

## LIVRABLE FINAL — RAPPORT D'AUDIT

### 1. Forces du projet

- **Architecture propre et moderne** : Vite + modules ES + composants séparés, séparation UI/données via `config.json`. Facile à maintenir.
- **Design system MCI cohérent et bien pensé** : tokens CSS structurés, palette Émeraude/Or/Ivoire distincte, hiérarchie typographique correcte.
- **Performance en forte amélioration** : Lighthouse mobile **62** (vs 38), TBT 0 ms, CLS excellent (0.036), bundle gzip ~15 Ko (léger), fonts allégées et non-bloquantes, backdrop-filter désactivé sur mobile.
- **SEO de base solide** : title/description/canonical/lang, robots.txt, sitemap.xml, manifest PWA, SW fonctionnel.
- **Étude de cas crédible et chiffrée** (4 coopératives, 3 jours, 3 mois) avec ancrage géographique réel (Afféry/Adzopé).
- **Équipe nommée avec ancrage terrain** (résident à Afféry) — crédibilité locale réelle.
- **Accessibilité en bon point de départ** : 1 seul h1, `prefers-reduced-motion` global, `:focus-visible` défini, alt sur logos.

### 2. Faiblesses du projet

- **Section partenaires visible mais vide** (titre + tagline sans contenu) et **témoignages absents** (`[]`).
- **Email vide** dans config.json → "Non communiqué" dans le footer ; aucun réseau social (LinkedIn).
- **Palette en dur divergente** (`#1e7f6e`, `#0b3b3c`) et admin avec sa propre palette vs design system.
- **Duplications CSS** (`.skeleton`, `.back-to-top`, `.progress-bar-container`) et z-index anarchique (999→99999).
- **3 gestionnaires back-to-top + 2 barres de progression** (une non throttlée) — redondance JS.
- **`console.log` de prod** (dont l'URL du webhook).
- **Sauts hiérarchiques a11y mineurs** (contact en h3 sans h2, footer en h4 sans h3) ; hero en background-image invisible aux lecteurs d'écran.
- Pas d'`og:image`/Twitter Card/hreflang malgré l'i18n anglais.

### 3. Problèmes critiques

1. **Résidu de l'ancienne marque actif sur le site public** : la section partenaires affiche « Cabinet Notarial / Partenaire Bancaire / Cabinet d'Architecture / Expert Foncier / sécurité de vos investissements » (héritage patrimonial/immobilier). **Rupture de marque visible en production.**
2. **Zéro preuve sociale visuelle** : aucune photo réelle (équipe, projets, zone), 4/4 placeholders. Pour un cabinet de conseil, c'est le facteur de conversion n°1.
3. **Zéro témoignage client** : un cabinet de conseil sans preuve sociale ne génère pas la confiance nécessaire.
4. **Section partenaires = coquille vide visible** avec tagline fausse (« institutions de renommée » alors qu'aucun partenaire).
5. **Fuite de listeners en admin** (dragDrop) + **scroll non throttlé** (refinements.js) — dégradation de performance sur mobile et risque de crash mémoire en admin après plusieurs manipulations.

### 4. Recommandations priorisées

#### P0 — Corrections immédiates (avant toute nouvelle communication)
1. **Supprimer ou réécrire `public/sections/partenaires.html`** avec de vrais partenaires, ou masquer la section entière si `partners` est vide (inclure titre + tagline dans le masquage).
2. **Corriger l'email vide** dans `config.json` (ou masquer proprement la ligne "Non communiqué").
3. **Retirer les `console.log` de production**, en particulier celui exposant l'URL du webhook (webhook.js:2).
4. **Remplacer l'icône WhatsApp blanche** par un vert plus foncé ou ajuster le fond pour le contraste (1.98:1 actuellement).

#### P1 — Améliorations importantes (sprint suivant, fort impact commercial)
1. **Ajouter des photos réelles** : 2 consultants, coopératives, zone d'intervention, captures des 4 sites livrés. (Priorité absolue pour un cabinet de conseil.)
2. **Recueillir et intégrer 2-3 témoignages réels** avec nom + fonction + organisation.
3. **Compléter les coordonnées** : email professionnel, LinkedIn, et aligner le téléphone maintenance.html (+225 05 06 09 35 61) avec config.json (05 74 97 10 22) — **coordonnées incohérentes entre les deux pages**.
4. **Nommer les coopératives de l'étude de cas** et lier les sites livrés (preuves vérifiables).
5. **Corriger le contraste des éléments or sur ivoire** (utiliser une teinte plus foncée pour le texte secondaire or, ≥4.5:1).

#### P2 — Optimisations futures (améliorations techniques secondaires)
1. **Réparer la fuite de listeners dragDrop** (admin) : `off()` avant chaque `init()`, ou useRef sur un flag d'init.
2. **Throttler le scroll de `refinements.js`** (rAF) — fusionner avec main.js/ux-refinements.js pour n'avoir qu'un seul handler.
3. **Désactiver ou limiter le MutationObserver cursor.js** (déconnecter après init, ou limiter le scope aux conteneurs dynamiques connus).
4. **Nettoyer les duplications CSS** (`.skeleton`, `.back-to-top`, `.progress-bar-container`) et **standardiser le z-index** en tokens.
5. **Unifier les palettes** (retirer `#1e7f6e`/`#0b3b3c` en dur) ; **alléger/arrêter `pulse-wa`** (box-shadow infini) et supprimer `transition: all`.
6. **Accessibilité** : ajouter un h2 en Contact, réparer les sauts h3/h4, alt="" explicite pour le footer, vérifier le runtime JSON-LD, ajouter og:image.
7. **Sécurité** : retirer le `data._cc` hardcodé et le `_captcha: "false"` dans webhook.js (antispam désactivé).

### 5. Décision finale

> **B — Corrections mineures nécessaires (quelques ajustements)**

Le site est techniquement sain, performant (62 mobile), bien architecturé, avec une identité MCI claire et une étude de cas crédible. **Il ne doit pas être mis en avant commercialement en l'état** à cause du **résidu de marque visible** (section partenaires de l'ancienne activité patrimoniale) et de **l'absence totale de preuve sociale visuelle** (0 photo réelle, 0 témoignage). Ces deux points sont des correctifs de contenu rapides à fort impact, sans refonte technique. Après les P0 (1-2 jours) et la première tranche de P1 (photos + témoignages), le site sera crédible et prêt pour une communication large.
