import api from './api';

// Update API base URL to match backend
api.defaults.baseURL = 'http://localhost:5000/api/v1';

// Admin Dashboard API
export const adminDashboardAPI = {
  getStats: () => api.get('/admin/stats'),
};

// Admin Articles API
export const adminArticlesAPI = {
  create: (formData) => api.post('/admin/articles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.patch(`/admin/articles/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/admin/articles/${id}`),
};

// Admin E-books API
export const adminEbooksAPI = {
  create: (formData) => api.post('/admin/ebooks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.patch(`/admin/ebooks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/admin/ebooks/${id}`),
};