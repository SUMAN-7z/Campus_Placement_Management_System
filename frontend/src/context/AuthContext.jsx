import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const isApproved = localStorage.getItem('isApproved') === 'true';
    const isProfileCompleted = localStorage.getItem('isProfileCompleted') === 'true';
    const companyId = localStorage.getItem('companyId');

    if (userId && email && role) {
      setUser({
        userId: parseInt(userId),
        email,
        role,
        name,
        isApproved,
        isProfileCompleted,
        companyId: companyId ? parseInt(companyId) : null
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/api/auth/login', { email, password });
      const data = response.data;

      // Save tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userId', data.userId.toString());
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name || '');
      localStorage.setItem('isApproved', data.isApproved.toString());
      localStorage.setItem('isProfileCompleted', data.isProfileCompleted.toString());
      if (data.companyId) {
        localStorage.setItem('companyId', data.companyId.toString());
      } else {
        localStorage.removeItem('companyId');
      }

      const loggedUser = {
        userId: data.userId,
        email: data.email,
        role: data.role,
        name: data.name,
        isApproved: data.isApproved,
        isProfileCompleted: data.isProfileCompleted,
        companyId: data.companyId
      };
      
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check credentials.';
    }
  };

  const register = async (registerPayload) => {
    try {
      const response = await API.post('/api/auth/register', registerPayload);
      const data = response.data;

      // Save tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userId', data.userId.toString());
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name || '');
      localStorage.setItem('isApproved', data.isApproved.toString());
      localStorage.setItem('isProfileCompleted', data.isProfileCompleted.toString());
      if (data.companyId) {
        localStorage.setItem('companyId', data.companyId.toString());
      } else {
        localStorage.removeItem('companyId');
      }

      const loggedUser = {
        userId: data.userId,
        email: data.email,
        role: data.role,
        name: data.name,
        isApproved: data.isApproved,
        isProfileCompleted: data.isProfileCompleted,
        companyId: data.companyId
      };
      
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed.';
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await API.post('/api/auth/logout', { refreshToken });
      } catch (err) {
        console.error('Logout error on backend:', err);
      }
    }
    // Clear state
    localStorage.clear();
    setUser(null);
  };

  const updateProfileStatus = (isCompleted, isAppr) => {
    if (user) {
      const updated = { ...user, isProfileCompleted: isCompleted, isApproved: isAppr };
      setUser(updated);
      localStorage.setItem('isProfileCompleted', isCompleted.toString());
      localStorage.setItem('isApproved', isAppr.toString());
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfileStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
