import axiosClient from './axiosClient';

const quizApi = {
  getCommonQuestions: () => axiosClient.get('/quiz/questions/common'),
  getQuestionsByGroup: (group) => axiosClient.get(`/quiz/questions/${group}`),
  getAllQuestions: () => axiosClient.get('/quiz/questions'),
  
  // Admin endpoints
  adminCreate: (data) => axiosClient.post('/admin/quiz/questions', data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/quiz/questions/${id}`, data),
  adminDelete: (id) => axiosClient.delete(`/admin/quiz/questions/${id}`),
};

export default quizApi;
