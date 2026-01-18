import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Articles API
export const articlesAPI = {
  getAll: () => api.get('/articles'),
  getRecent: () => api.get('/articles/recent'),
  getFeatured: () => api.get('/articles/featured'),
  getPopular: () => api.get('/articles/popular'),
  getByCategory: (category) => api.get(`/articles/category/${category}`),
  getBySlug: (slug) => api.get(`/articles/slug/${slug}`),
};

// E-books API
export const ebooksAPI = {
  getAll: () => api.get('/ebooks'),
  getRecent: () => api.get('/ebooks/recent'),
  getFeatured: () => api.get('/ebooks/featured'),
  getBestsellers: () => api.get('/ebooks/bestsellers'),
  getByCategory: (category) => api.get(`/ebooks/category/${category}`),
  getBySlug: (slug) => api.get(`/ebooks/slug/${slug}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  getCount: () => api.get('/cart/count'),
  addToCart: (ebookId, quantity = 1) => api.post('/cart/add', { ebookId, quantity }),
  updateItem: (ebookId, quantity) => api.patch(`/cart/${ebookId}`, { quantity }),
  removeItem: (ebookId) => api.delete(`/cart/${ebookId}`),
  clearCart: () => api.delete('/cart/clear'),
};

export default api;