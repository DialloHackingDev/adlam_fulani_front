import axios from 'axios';

// Configuration de base - Utilise les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// Fonction utilitaire pour obtenir l'URL complète des images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  // Encoder l'URL pour gérer les caractères spéciaux (comme les caractères Adlam)
  const encodedPath = imagePath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `${BASE_URL}${encodedPath}`;
};

// Instance axios avec configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service API centralisé
export const apiService = {
  // ==================== AUTH ====================
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    getProfile: () => apiClient.get('/auth/me'),
  },

  // ==================== ARTICLES ====================
  articles: {
    // Public
    getAll: (params = {}) => apiClient.get('/articles', { params }),
    getRecent: (limit = 6) => apiClient.get(`/articles/recent?limit=${limit}`),
    getFeatured: (limit = 3) => apiClient.get(`/articles/featured?limit=${limit}`),
    getPopular: (limit = 6) => apiClient.get(`/articles/popular?limit=${limit}`),
    getBySlug: (slug) => apiClient.get(`/articles/slug/${slug}`),
    getById: (id) => apiClient.get(`/articles/${id}`),
    getByCategory: (category, params = {}) => apiClient.get(`/articles/category/${category}`, { params }),
    search: (query, params = {}) => apiClient.get(`/articles/search?q=${query}`, { params }),
    
    // User actions
    toggleLike: (id) => apiClient.patch(`/articles/${id}/like`),
    
    // Admin
    create: (formData) => apiClient.post('/admin/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => apiClient.put(`/admin/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => apiClient.delete(`/admin/articles/${id}`),
    toggleFeatured: (id) => apiClient.patch(`/articles/${id}/featured`),
    togglePublished: (id) => apiClient.patch(`/articles/${id}/published`),
    getStats: () => apiClient.get('/articles/stats'),
  },

  // ==================== EBOOKS ====================
  ebooks: {
    // Public
    getAll: (params = {}) => apiClient.get('/ebooks', { params }),
    getRecent: (limit = 6) => apiClient.get(`/ebooks/recent?limit=${limit}`),
    getFeatured: (limit = 3) => apiClient.get(`/ebooks/featured?limit=${limit}`),
    getBestsellers: (limit = 6) => apiClient.get(`/ebooks/bestsellers?limit=${limit}`),
    getBySlug: (slug) => apiClient.get(`/ebooks/slug/${slug}`),
    getById: (id) => apiClient.get(`/ebooks/${id}`),
    getByCategory: (category, params = {}) => apiClient.get(`/ebooks/category/${category}`, { params }),
    
    // User actions
    download: (id) => apiClient.get(`/ebooks/${id}/download`),
    stream: (id) => `${API_BASE_URL}/ebooks/${id}/stream`,
    
    // Admin
    create: (formData) => apiClient.post('/admin/ebooks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => apiClient.put(`/admin/ebooks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => apiClient.delete(`/admin/ebooks/${id}`),
    toggleFeatured: (id) => apiClient.patch(`/ebooks/${id}/featured`),
    getStats: () => apiClient.get('/ebooks/admin/stats'),
  },

  // ==================== DOCUMENTS ====================
  documents: {
    // Public
    getAll: (params = {}) => apiClient.get('/documents', { params }),
    getRecent: (limit = 6) => apiClient.get(`/documents/recent?limit=${limit}`),
    getFeatured: (limit = 3) => apiClient.get(`/documents/featured?limit=${limit}`),
    getByCategory: (category, params = {}) => apiClient.get(`/documents/category/${category}`, { params }),
    getByType: (type, params = {}) => apiClient.get(`/documents/type/${type}`, { params }),
    getBySlug: (slug) => apiClient.get(`/documents/${slug}`),
    download: (id) => apiClient.get(`/documents/${id}/download`),
    
    // Admin
    create: (formData) => apiClient.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => apiClient.put(`/documents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => apiClient.delete(`/documents/${id}`),
    toggleFeatured: (id) => apiClient.patch(`/documents/${id}/featured`),
    getStats: () => apiClient.get('/documents/admin/stats'),
  },

  // ==================== CART ====================
  cart: {
    get: () => apiClient.get('/cart'),
    getCount: () => apiClient.get('/cart/count'),
    add: (itemData) => apiClient.post('/cart/add', itemData),
    syncPrices: () => apiClient.patch('/cart/sync'),
    update: (itemId, quantity) => apiClient.patch(`/cart/${itemId}`, { quantity }),
    clear: () => apiClient.delete('/cart/clear'),
    remove: (itemId) => apiClient.delete(`/cart/${itemId}`),
  },

  // ==================== CHECKOUT ====================
  checkout: {
    createSession: (orderData) => apiClient.post('/checkout/create-session', orderData),
    confirmPayment: (paymentData) => apiClient.post('/checkout/confirm-payment', paymentData),
    getOrders: () => apiClient.get('/checkout/orders'),
    getOrder: (orderId) => apiClient.get(`/checkout/orders/${orderId}`),
    downloadEbook: (orderId, ebookId) => apiClient.get(`/checkout/orders/${orderId}/download/${ebookId}`),
    getPurchasedEbooks: () => apiClient.get('/checkout/purchased-ebooks'),
    addFreeEbook: (ebookId) => apiClient.post('/checkout/add-free-ebook', { ebookId }),
  },

  // ==================== ADMIN ====================
  admin: {
    // Dashboard
    getStats: () => apiClient.get('/admin/stats'),
    
    // Users
    getUsers: (params = {}) => apiClient.get('/admin/users', { params }),
    updateUser: (id, userData) => apiClient.put(`/admin/users/${id}`, userData),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
    
    // Analytics
    getAnalytics: (period = '30d') => apiClient.get(`/admin/analytics?period=${period}`),
  },

  // ==================== COMMENTS ====================
  comments: {
    getByArticle: (articleId) => apiClient.get(`/comments/article/${articleId}`),
    getReplies: (commentId) => apiClient.get(`/comments/${commentId}/replies`),
    create: (commentData) => apiClient.post('/comments', commentData),
    update: (id, commentData) => apiClient.patch(`/comments/${id}`, commentData),
    delete: (id) => apiClient.delete(`/comments/${id}`),
    like: (id) => apiClient.patch(`/comments/${id}/like`),
    report: (id, reportData) => apiClient.post(`/comments/${id}/report`, reportData),
    getModerationQueue: () => apiClient.get('/comments/moderation'),
    moderate: (id, moderationData) => apiClient.patch(`/comments/${id}/moderate`, moderationData),
  },

  // ==================== LIKES ====================
  likes: {
    toggleArticle: (articleId) => apiClient.patch(`/articles/${articleId}/like`),
    getArticleLikes: (articleId) => apiClient.get(`/article-likes/${articleId}`),
  },

  // ==================== SHOP ====================
  shop: {
    getInfo: () => apiClient.get('/shop'),
    update: (shopData) => apiClient.put('/shop', shopData),
  },

  // ==================== CONTACT ====================
  contact: {
    send: (contactData) => apiClient.post('/contact', contactData),
    getMessages: () => apiClient.get('/admin/contact/messages'),
    getMessage: (id) => apiClient.get(`/admin/contact/messages/${id}`),
    markAsRead: (id) => apiClient.patch(`/admin/contact/messages/${id}/read`),
    delete: (id) => apiClient.delete(`/admin/contact/messages/${id}`),
  },

  // ==================== UTILS ====================
  utils: {
    getImageUrl,
  },
};

export default apiService;