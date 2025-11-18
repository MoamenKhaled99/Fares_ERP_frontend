import { api } from '../api/axiosInstance';

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
  getSalesByType: () => api.get('/dashboard/sales-by-type'),
};
