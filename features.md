# Millenium Côte d'Ivoire - Documentation des Fonctionnalités

Ce document répertorie les fonctionnalités détaillées implémentées dans le cadre du projet Millenium Côte d'Ivoire.

## 1. Design & Expérience Utilisateur (UX)
- **Esthétique Premium** : Design moderne utilisant une palette de couleurs sophistiquée (Slate, Orange Millenium, Or).
- **Splash Screen** : Écran de chargement animé avec le logo Millenium pour une première impression soignée.
- **Responsive Design** : Interface entièrement optimisée pour mobiles, tablettes et ordinateurs.
- **Animations "Reveal"** : Apparition fluide des éléments au défilement (Intersection Observer).
- **Navigation Fluide** : Menu sticky avec effet de réduction au scroll et menu mobile latéral.

## 2. Contenu Stratégique
- **Hero Section Dynamique** : Présentation forte avec statistiques d'expertise et chips de réassurance.
- **Parcours Méthodologique** : Section "Méthode" détaillant les 5 étapes clés du projet (Qualification, Audit, Structuration, Pilotage, Finalisation).
- **Showcase de Services** : Grille de services segmentée par types de besoins (Audit, Cadrage, Construction, Accompagnement).
- **Scénarios de Projet** : Section portfolio présentant des cas d'usage concrets (Villa premium, Diaspora, Budget structuré).
- **Zones d'Implantation** : Liste et carte visuelle des zones privilégiées (Abidjan, Bassam, Bingerville, etc.).

## 3. Capture de Leads & Conversion
- **Formulaire de Consultation** : 
    - Formulaire complet (Nom, Tel, Pays, Zone, Projet, Budget, Délai).
    - Intégration **FormSubmit** (Gratuit, illimité, sans backend).
    - Support multi-destinataires (Email principal + Copie).
    - Protection anti-spam Honeypot.
- **Intégration WhatsApp** :
    - Bouton flottant persistant.
    - Messages pré-remplis personnalisés selon le bouton cliqué (Consultation vs Échange générique).

## 4. Analyse & Performance
- **Google Analytics 4 (GA4)** :
    - Suivi du temps passé sur le site (paliers 30s, 60s, 120s).
    - Mesure de la profondeur de défilement (25%, 50%, 75%, 90%).
    - Tracking des clics CTA (WhatsApp, Submit).
    - Suivi du remplissage des champs du formulaire.
- **SEO & Social** :
    - Meta tags optimisés (Open Graph, Twitter Cards).
    - Données structurées JSON-LD (Schema.org) pour le référencement local.
    - Hiérarchie HTML5 sémantique.

## 5. Administration & Maintenance
- **Dashboard Minimaliste** : Page `dashboard.html` pour gérer l'état du site.
- **Mode Maintenance** : Système de bascule locale (via localStorage) permettant de rediriger le trafic vers une page d'attente pendant les mises à jour.
- **Configuration Netlify** : Fichier `netlify.toml` optimisé pour la sécurité (Headers) et la performance (Cache).

## 6. Stack Technique
- **Frontend** : HTML5, Vanilla CSS3 (Custom properties), JavaScript ES6+.
- **Fonts** : Google Fonts (Inter).
- **Hébergement** : Optimisé pour Netlify (Static hosting).
