import React, { createContext, useState, useEffect, useContext } from 'react';
import authApi from '../api/authApi';
import { getToken, setToken as setStorageToken, clearAuthStorage } from '../utils/authStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const currentToken = getToken();
      if (!currentToken) {
        setLoading(false);
        return;
      }
      
      const res = await authApi.getMe();
      if (res.success) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching user', error);
      clearAuthStorage();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success) {
      const accessToken = res.session.access_token;
      setStorageToken(accessToken);
      setToken(accessToken);
      setUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const register = async (email, password, fullName) => {
    return await authApi.register({ email, password, fullName });
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      clearAuthStorage();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
