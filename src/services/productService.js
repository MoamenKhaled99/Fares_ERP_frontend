import { api } from "../api/axiosInstance";

export const productService = {
  getAll: (type) => api.get(`/${type}`),
  create: (type, data) => api.post(`/${type}`, data),
  delete: (type, id) => api.delete(`/${type}/${id}`),
  addStock: (type, id, data) => api.post(`/${type}/${id}/add-stock`, data),
  update: (type, id, data) => api.put(`/${type}/${id}`, data),
};
