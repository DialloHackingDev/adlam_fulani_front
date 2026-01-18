# 𞤀𞤣𞤤𞤢𞤥 - Plateforme d'Information Fulani

Une plateforme web moderne dédiée à la langue Fulani (Pular) utilisant le script Adlam, avec un design épuré noir et blanc inspiré des sites d'actualités professionnels.

## 🎯 Fonctionnalités

### Frontend (React + Vite)
- **Interface RTL complète** en script Adlam
- **Design monochrome** (noir, blanc, nuances de gris)
- **Navigation responsive** avec header sticky
- **Hero Banner** avec slider automatique des articles mis en avant
- **Système de catégories** pour articles et e-books
- **Recherche et filtres** avancés pour la bibliothèque
- **Panier d'achat** avec gestion d'état globale
- **Animations fluides** et transitions professionnelles

### Pages Principales
1. **Accueil** - Hero banner + articles récents par catégorie
2. **Articles** - Liste complète avec filtres par catégorie
3. **Bibliothèque** - E-books avec recherche, filtres et tri
4. **Panier** - Gestion des achats avec résumé de commande

### Composants Clés
- `Header` - Navigation principale avec recherche et panier
- `HeroBanner` - Slider des articles mis en avant
- `ArticleCard` - Carte d'article avec métadonnées
- `EbookCard` - Carte de livre avec prix et ajout au panier

## 🛠 Technologies Utilisées

### Frontend
- **React 19** avec Vite
- **React Router DOM** pour le routing
- **Tailwind CSS 4** pour le styling
- **React Icons** pour les icônes
- **Axios** pour les appels API

### Backend (API Routes)
- Articles : `/api/articles/*`
- E-books : `/api/ebooks/*`
- Panier : `/api/cart/*`
- Boutique : `/api/shop/*`

## 🎨 Design System

### Palette de Couleurs (Monochrome)
- **Fond principal** : `#FFFFFF` (blanc pur)
- **Texte principal** : `#000000` (noir pur)
- **Texte secondaire** : `#444444` / `#555555` (gris foncé)
- **Accents/Liens** : `#000000` avec hover `#E0E0E0`
- **Bordures** : `#DDDDDD` (gris très clair)

### Typographie
- **Police principale** : Noto Sans Adlam (fallback: system-ui)
- **Titres** : Noto Serif Adlam pour contraste "newspaper"
- **Tailles** :
  - H1 : 32-40px desktop / 24-28px mobile
  - H2 : 22-26px
  - Corps : 16-17px (line-height 1.6-1.7)
  - Métadonnées : 13-14px

### Animations
- Transitions douces (0.2-0.3s)
- Hover effects : scale 1.02, underline, background léger
- Pas de parallax lourd - focus sur la performance

## 📱 Responsive Design
- **Mobile-first** approach
- **Breakpoints** : sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation mobile** avec hamburger menu
- **Grids adaptatifs** : 1 col mobile → 2-3 cols desktop

## 🔧 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
cd FRONTEND/adlam
npm install
```

### Démarrage en développement
```bash
npm run dev
```

### Build de production
```bash
npm run build
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.jsx      # Navigation principale
│   ├── HeroBanner.jsx  # Slider hero
│   ├── ArticleCard.jsx # Carte d'article
│   └── EbookCard.jsx   # Carte de livre
├── pages/              # Pages principales
│   ├── Home.jsx        # Page d'accueil
│   ├── Articles.jsx    # Liste des articles
│   ├── Library.jsx     # Bibliothèque e-books
│   └── Cart.jsx        # Panier d'achat
├── context/            # Gestion d'état globale
│   └── CartContext.jsx # Contexte du panier
├── services/           # Services API
│   └── api.js          # Configuration Axios
├── App.jsx             # Composant racine
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux + Tailwind
```

## 🌐 API Integration

### Articles
- `GET /api/articles` - Tous les articles
- `GET /api/articles/recent` - Articles récents
- `GET /api/articles/featured` - Articles mis en avant
- `GET /api/articles/category/:category` - Par catégorie

### E-books
- `GET /api/ebooks` - Tous les e-books
- `GET /api/ebooks/recent` - E-books récents
- `GET /api/ebooks/bestsellers` - Meilleures ventes

### Panier
- `GET /api/cart` - Contenu du panier
- `POST /api/cart/add` - Ajouter un article
- `DELETE /api/cart/:ebookId` - Supprimer un article

## 🎯 Fonctionnalités Avancées

### Gestion du Panier
- **Context API** pour l'état global
- **Persistance** des données
- **Compteur** en temps réel dans le header
- **Calculs automatiques** des totaux

### Recherche et Filtres
- **Recherche full-text** dans titres/auteurs
- **Filtres par catégorie** dynamiques
- **Tri** par date, prix, popularité
- **Fourchette de prix** avec slider

### Performance
- **Lazy loading** des images
- **Skeleton screens** pendant le chargement
- **Optimisation** des re-renders avec React
- **Bundle splitting** avec Vite

## 🔮 Évolutions Futures

1. **Authentification** utilisateur
2. **Système de commentaires** sur les articles
3. **Paiement** intégré (Stripe/PayPal)
4. **Mode sombre** optionnel
5. **PWA** avec cache offline
6. **Notifications** push
7. **Partage social** avancé

## 📄 Licence

Ce projet est sous licence MIT.

---

**Développé avec ❤️ pour la communauté Fulani**