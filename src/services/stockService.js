import { api } from '../api/axiosInstance';

export const stockService = {
  // GET /api/stock
  getAllMovements: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return api.get(`/stock${queryString ? `?${queryString}` : ''}`);
  },
  
  // GET /api/stock/type/:productType
  getMovementsByType: (type) => api.get(`/stock/type/${type}`),
  
  // GET /api/stock/product/:productId
  getMovementsByProduct: (id) => api.get(`/stock/product/${id}`),
};  