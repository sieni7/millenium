# Guide de Déploiement - KIRAM PHARMA

Ce document détaille les étapes nécessaires pour déployer le site vitrine de **KIRAM PHARMA** en production.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :
- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- Un compte sur [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/) ou un accès à votre dépôt GitHub.

## 🛠️ Étapes de Préparation

### 1. Vérification des fichiers critiques
Assurez-vous que les fichiers essentiels sont présents à la racine du projet :
- `index.html` (Page d'accueil)
- `admin.html` (Tableau de bord)
- `config.json` (Configuration globale)
- `js/main.js` (Logique principale)
- `css/style.css` (Styles principaux)

### 2. Minification (Optionnel mais recommandé)
Pour optimiser les performances, vous pouvez minifier les fichiers CSS et JS :
```bash
# Via npm
npm run build

# OU via le script de déploiement (Linux/Mac)
chmod +x deploy.sh
./deploy.sh
```

### 3. Test Local
Vérifiez que le site fonctionne correctement localement avant de pousser les modifications :
```bash
npm start
```
Accédez ensuite à `http://localhost:3000`.

## 🌐 Options de Déploiement

### Option 1 : Déploiement via GitHub (Recommandé)
1. Poussez votre code sur votre dépôt GitHub :
   ```bash
   git add .
   git commit -m "feat: prêt pour le déploiement"
   git push origin main
   ```
2. Connectez votre dépôt à Netlify ou Vercel pour un déploiement automatique à chaque "push".

### Option 2 : Netlify
Le projet inclut un fichier `netlify.toml` pré-configuré avec les en-têtes de sécurité et les redirections.
- **Commande CLI :**
  ```bash
  npx netlify-cli deploy --prod --dir=.
  ```
- **Configuration manuelle :** Pointez le "Publish directory" vers la racine `.` (ou `dist` si vous utilisez un dossier de build).

### Option 3 : Vercel
Le projet inclut un fichier `vercel.json` pour configurer les routes statiques et la sécurité.
- **Commande CLI :**
  ```bash
  npx vercel --prod
  ```

## ⚙️ Configuration Post-Déploiement

### Fichier `config.json`
Après le déploiement, vous devrez peut-être mettre à jour le fichier `config.json` pour pointer vers les bons points de terminaison (endpoints) de production :
- `apiUrl` : URL de votre backend ou service de messagerie.
- `environment` : Remplacez `"development"` par `"production"`.

### En-têtes de Sécurité
Les configurations `netlify.toml` et `vercel.json` activent par défaut :
- `X-Frame-Options: DENY` (Empêche l'affichage dans des frames)
- `X-Content-Type-Options: nosniff` (Force le type MIME)
- `X-XSS-Protection: 1; mode=block` (Protection XSS)

## 🔍 Dépannage
- **Page Blanche :** Vérifiez la console du navigateur (F12) pour des erreurs de chargement de scripts.
- **Erreurs 404 :** Assurez-vous que les chemins dans `index.html` sont relatifs ou corrects.
- **Accès Admin :** La page `admin.html` est protégée contre le cache par défaut pour garantir que vous voyez toujours les dernières données.

---
*Dernière mise à jour : 7 Avril 2026*
