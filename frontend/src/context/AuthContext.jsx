import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on startup if token exists
  const loadUser = async () => {
    const token = localStorage.getItem('kenzofitness_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        setMember(response.data.member);
      } else {
        // Clear invalid token
        localStorage.removeItem('kenzofitness_token');
      }
    } catch (err) {
      console.error('Failed to load user profile:', err.response?.data?.message || err.message);
      localStorage.removeItem('kenzofitness_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('kenzofitness_token', response.data.token);
        setUser(response.data.user);
        setMember(response.data.member);
        return response.data;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Register Member (Admission Request) handler
  const registerMember = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        // Log in the member automatically
        localStorage.setItem('kenzofitness_token', response.data.token);
        setUser(response.data.user);
        setMember(response.data.member);
        return response.data;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('kenzofitness_token');
    setUser(null);
    setMember(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        loading,
        error,
        login,
        registerMember,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
