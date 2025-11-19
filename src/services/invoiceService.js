import { api } from '../api/axiosInstance';

export const invoiceService = {
  getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return api.get(`/invoices${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => api.post('/invoices', data),
  getStats: () => api.get('/dashboard'),
  getById: (id) => api.get(`/invoices/${id}`),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  getTotalProfits: () => api.get('/invoices/profits/total'),
};