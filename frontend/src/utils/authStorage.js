export const setToken = (token) => {
  localStorage.setItem('access_token', token);
};

export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const removeToken = () => {
  localStorage.removeItem('access_token');
};

export const clearAuthStorage = () => {
  localStorage.removeItem('access_token');
  // clear other auth related items if necessary
};
