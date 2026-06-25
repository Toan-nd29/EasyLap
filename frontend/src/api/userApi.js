import axiosClient from './axiosClient';

const userApi = {
  updateProfile: (data) => axiosClient.put('/users/me', data),
  getHistory: () => axiosClient.get('/users/me/history'),
  getFavorites: () => axiosClient.get('/users/me/favorites'),
  addFavorite: (laptopId) => axiosClient.post('/users/me/favorites', { laptop_id: laptopId }),
  removeFavorite: (laptopId) => axiosClient.delete(`/users/me/favorites/${laptopId}`),
};

export default userApi;
