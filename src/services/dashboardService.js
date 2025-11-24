import { api } from '../api/axiosInstance';

export const dashboardService = {
  getStats: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.day) params.append('day', filters.day);
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    const queryString = params.toString();
    return api.get(`/dashboard${queryString ? `?${queryString}` : ''}`);
  },
  getSalesByType: () => api.get('/dashboard/sales-by-type'),
  getProfitsByPeriod: (fromDate, toDate) => {
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
    }).toString();
    return api.get(`/dashboard/profits?${params}`);
  },
};

export const safetyFactorRateService = {
  getAll: () => api.get('/safety-factor-rates'),
  getById: (id) => api.get(`/safety-factor-rates/${id}`),
  create: (data) => api.post('/safety-factor-rates', data),
  update: (id, data) => api.put(`/safety-factor-rates/${id}`, data),
  delete: (id) => api.delete(`/safety-factor-rates/${id}`),
};
