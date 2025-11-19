import { api } from '../api/axiosInstance';

export const stockService = {
  getAllMovements: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return api.get(`/stock${queryString ? `?${queryString}` : ''}`);
  },
  
  
  getMovementsByType: (type) => api.get(`/stock/type/${type}`),
  getMovementsByProduct: (id) => api.get(`/stock/product/${id}`),
};  