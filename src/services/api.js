import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  signup: (userData) => api.post('/users/register', userData)
};

// Plan API
export const planAPI = {
  getPlans: () => api.get('/recharge-plans'),
  addPlan: (planData) => api.post('/recharge-plans', planData),
  updatePlan: (id, planData) => api.put(`/recharge-plans/${id}`, planData),
  deletePlan: (id) => api.delete(`/recharge-plans/${id}`)
};

// User API
export const userAPI = {
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Transaction API
export const transactionAPI = {
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  getUserTransactions: () => api.get('/transactions')
};

export default api;
