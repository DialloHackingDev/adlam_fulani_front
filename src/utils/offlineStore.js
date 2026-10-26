// Livres et données conservés sur l'appareil pour la lecture hors connexion
const BOOKS_CACHE = 'offline-books-v1';
// Caches remplis par le service worker avec des données liées au compte
const ACCOUNT_CACHES = ['api-content', 'api-account', BOOKS_CACHE];

const hasCacheApi = () => typeof caches !== 'undefined';
const bookKey = (id) => `/__offline-books__/${id}`;

export const saveBook = async (id, buffer) => {
  if (!hasCacheApi()) return;
  try {
    const cache = await caches.open(BOOKS_CACHE);
    await cache.put(bookKey(id), new Response(buffer, { headers: { 'Content-Type': 'application/pdf' } }));
  } catch {
    // Espace insuffisant ou cache indisponible : la lecture en ligne reste possible
  }
};

export const loadBook = async (id) => {
  if (!hasCacheApi()) return null;
  try {
    const cache = await caches.open(BOOKS_CACHE);
    const response = await cache.match(bookKey(id));
    return response ? response.arrayBuffer() : null;
  } catch {
    return null;
  }
};

// À la déconnexion : rien de ce compte ne doit rester lisible sur un appareil partagé
export const clearAccountData = async () => {
  if (!hasCacheApi()) return;
  await Promise.all(ACCOUNT_CACHES.map(name => caches.delete(name).catch(() => false)));
};
