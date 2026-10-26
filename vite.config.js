import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Ces fonctions sont recopiées telles quelles dans le service worker généré :
// elles doivent rester autonomes (aucune référence à une variable de ce fichier).

// Contenu public consultable hors connexion (jamais les fichiers PDF, servis à part)
const isPublicContent = ({ url, request }) =>
  request.method === 'GET' &&
  /^\/api\/v1\/(articles|ebooks|documents|comments\/article|shop)(\/|$)/.test(url.pathname) &&
  !/\/(stream|download)$/.test(url.pathname)

// Données liées au compte, utiles hors connexion (profil, bibliothèque)
const isAccountData = ({ url, request }) =>
  request.method === 'GET' && /^\/api\/v1\/(auth\/me|checkout\/purchased-ebooks)$/.test(url.pathname)

// Clé de cache distincte par utilisateur : un appareil partagé n'expose pas
// les données d'un compte à un autre
const perUserCacheKey = {
  cacheKeyWillBeUsed: async ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) return request.url
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(auth))
    const hash = Array.from(new Uint8Array(digest).slice(0, 8), b => b.toString(16).padStart(2, '0')).join('')
    const url = new URL(request.url)
    url.searchParams.set('__user', hash)
    return url.href
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Yelaare - Plateforme Adlam',
        short_name: 'Yelaare',
        description: 'Plateforme de lecture et d\'apprentissage en écriture Adlam',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        categories: ['education', 'books', 'news'],
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // L'application entière (dont le moteur PDF) est enregistrée pour fonctionner sans réseau
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/uploads\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: isPublicContent,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-content',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
              plugins: [perUserCacheKey]
            }
          },
          {
            urlPattern: isAccountData,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-account',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
              plugins: [perUserCacheKey]
            }
          },
          {
            urlPattern: ({ url, request }) =>
              request.destination === 'image' &&
              (url.pathname.startsWith('/uploads/') || url.hostname === 'res.cloudinary.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: ({ url }) => url.hostname === 'fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' }
          },
          {
            urlPattern: ({ url }) => url.hostname === 'fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
})
