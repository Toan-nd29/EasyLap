import axiosClient from './axiosClient';

const recommendationApi = {
  getRecommendation: (data) => axiosClient.post('/recommend', data),
};

export default recommendationApi;
