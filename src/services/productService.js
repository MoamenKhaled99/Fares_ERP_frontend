import { api } from "../api/axiosInstance";

export const productService = {
  getAll: (type, search = '') => {
    const params = search ? { search } : {};
    return api.get(`/${type}`, { params });
  },
  create: (type, data) => api.post(`/${type}`, data),
  delete: (type, id) => api.delete(`/${type}/${id}`),
  addStock: (type, id, data) => api.post(`/${type}/${id}/add-stock`, data),
  update: (type, id, data) => api.put(`/${type}/${id}`, data),
  
  // Safety factor rates
  getSafetyFactorRates: () => api.get('/safety-factor-rates'),
};
