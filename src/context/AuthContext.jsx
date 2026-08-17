import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch current authenticated user on mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (e) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/api/auth/login`, credentials, { withCredentials: true });
    if (res.data.success) {
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
    return res.data;
  };

  const register = async (userData) => {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/api/auth/register`, userData, { withCredentials: true });
    if (res.data.success) {
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
    return res.data;
  };

  const logout = async () => {
    setLoading(true);
    await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
