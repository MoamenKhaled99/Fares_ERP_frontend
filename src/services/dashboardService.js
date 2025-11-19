import { api } from '../api/axiosInstance';

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
  getSalesByType: () => api.get('/dashboard/sales-by-type'),
  getProfitsByPeriod: (fromDate, toDate) => {
    // Note: Backend controller already handles Arabic query params but using English is safer
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
    }).toString();
    return api.get(`/dashboard/profits?${params}`);
  },
};
