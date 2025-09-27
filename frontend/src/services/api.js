import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-app.vercel.app/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API de autenticación
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// API de menús
export const menuAPI = {
  // Rutas públicas
  getMenuByRestaurantId: (restaurantId) => api.get(`/menus/restaurant/${restaurantId}`),
  getMenuById: (id) => api.get(`/menus/${id}`),
  getMenuCategories: (id) => api.get(`/menus/${id}/categories`),
  
  // Rutas administrativas
  createMenu: (menuData) => api.post('/menus', menuData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMenu: (id, menuData) => api.put(`/menus/${id}`, menuData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMenu: (id) => api.delete(`/menus/${id}`),
  
  // Items del menú
  addMenuItem: (menuId, itemData) => api.post(`/menus/${menuId}/items`, itemData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMenuItem: (menuId, itemId, itemData) => api.put(`/menus/${menuId}/items/${itemId}`, itemData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMenuItem: (menuId, itemId) => api.delete(`/menus/${menuId}/items/${itemId}`),
};

// API de WhatsApp
export const whatsappAPI = {
  getConfig: () => api.get('/whatsapp/config'),
  updateConfig: (config) => api.put('/whatsapp/config', config),
  uploadToStatus: (imageData) => api.post('/whatsapp/upload-status', imageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  sendMenuLink: (data) => api.post('/whatsapp/send-menu-link', data),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado';
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api;