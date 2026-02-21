# Résolution du problème via.placeholder.com

## Problème
L'erreur `GET https://via.placeholder.com/400x600 net::ERR_NAME_NOT_RESOLVED` apparaît dans la console.

## Cause
Le navigateur a mis en cache l'ancienne version du code qui utilisait `via.placeholder.com`.

## Solution

### 1. Vider le cache du navigateur
**Chrome/Edge:**
- Windows/Linux: `Ctrl + Shift + Delete`
- Mac: `Cmd + Shift + Delete`
- Cocher "Images et fichiers en cache"
- Cliquer sur "Effacer les données"

**Firefox:**
- Windows/Linux: `Ctrl + Shift + Delete`
- Mac: `Cmd + Shift + Delete`
- Cocher "Cache"
- Cliquer sur "Effacer maintenant"

### 2. Forcer le rechargement
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 3. Redémarrer le serveur de développement
```bash
cd FRONTEND/adlam
npm run dev
```

### 4. Vérification
Le code a été corrigé dans `EbookCard.jsx`:
- ✅ `getImageUrl()` retourne `null` au lieu d'une URL placeholder
- ✅ Affichage d'un fallback avec icône 📚 quand pas d'image
- ✅ Gestion d'erreur `onError` pour cacher les images cassées

## Code corrigé
```javascript
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;  // ✅ Retourne null au lieu de placeholder
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5000${imagePath}`;
};
```

Une fois le cache vidé, l'erreur disparaîtra complètement.
