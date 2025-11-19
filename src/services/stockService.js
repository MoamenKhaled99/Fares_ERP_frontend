import { api } from '../api/axiosInstance';

export const stockService = {
  // GET /api/stock
  getAllMovements: () => api.get('/stock'),
  
  // GET /api/stock/type/:productType (for future filtering)
  getMovementsByType: (type) => api.get(`/stock/type/${type}`),
  
  // GET /api/stock/product/:productId (for future drilling down)
  getMovementsByProduct: (id) => api.get(`/stock/product/${id}`),
};