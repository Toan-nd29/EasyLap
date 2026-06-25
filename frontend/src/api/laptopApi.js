import axiosClient from './axiosClient';

const laptopApi = {
  getAll: (params) => axiosClient.get('/laptops', { params }),
  getFilterOptions: () => axiosClient.get('/laptops/filters/options'),
  getById: (id) => axiosClient.get(`/laptops/${id}`),
  
  // Admin endpoints
  adminCreate: (data) => axiosClient.post('/admin/laptops', data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/laptops/${id}`, data),
  adminDelete: (id) => axiosClient.delete(`/admin/laptops/${id}`),
};

export default laptopApi;
