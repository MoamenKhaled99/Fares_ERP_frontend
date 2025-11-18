import { api } from '../api/axiosInstance';

export const invoiceService = {
  getAll: () => api.get('/invoices'),
  create: (data) => api.post('/invoices', data),
  getStats: () => api.get('/dashboard'),
};