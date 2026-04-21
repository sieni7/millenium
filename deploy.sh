
#!/bin/bash

# KIRAM PHARMA - Script de déploiement automatique
# Compatible Netlify / Vercel / GitHub Pages

echo "🚀 KIRAM PHARMA - Déploiement en cours..."
echo "=========================================="

# Vérifier les fichiers critiques
echo "📁 Vérification des fichiers..."
required_files=("index.html" "admin.html" "config.json" "css/style.css" "js/main.js")

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Fichier manquant: $file"
    exit 1
  fi
done
echo "✅ Tous les fichiers sont présents"

# Optimisation des images (si ImageMagick installé)
if command -v convert &> /dev/null; then
  echo "🖼️ Optimisation des images..."
  find . -name "*.jpg" -o -name "*.png" -exec convert {} -strip -quality 85 {} \;
fi

# Minification CSS (optionnelle)
if command -v npx &> /dev/null; then
  echo "🎨 Minification CSS..."
  npx uglifycss css/style.css > css/style.min.css 2>/dev/null
  npx uglifycss css/admin.css > css/admin.min.css 2>/dev/null
  npx uglifycss css/refinements.css > css/refinements.min.css 2>/dev/null
fi

# Minification JS (optionnelle)
if command -v npx &> /dev/null; then
  echo "⚡ Minification JavaScript..."
  npx terser js/main.js -o js/main.min.js 2>/dev/null
  npx terser js/admin.js -o js/admin.min.js 2>/dev/null
fi

echo ""
echo "📊 Statistiques du projet:"
echo "   - Pages: 2 (index.html, admin.html)"
echo "   - Composants: $(ls components/*.js 2>/dev/null | wc -l)"
echo "   - CSS: $(ls css/*.css 2>/dev/null | wc -l)"
echo "   - JS: $(ls js/*.js 2>/dev/null | wc -l)"

echo ""
echo "🌐 Options de déploiement:"
echo "   1. Netlify: netlify deploy --prod --dir=."
echo "   2. Vercel: vercel --prod"
echo "   3. GitHub Pages: git push origin main"

echo ""
echo "✅ Déploiement prêt !"
