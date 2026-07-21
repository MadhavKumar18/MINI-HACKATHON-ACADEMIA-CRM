import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import api, { isMockMode, setMockMode } from '../services/api';
import { AUTH_TOKEN_KEY } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const response = await api.getMe();
      setUser(response.data);
      setDemoMode(isMockMode());
      return response.data;
    } catch (error) {
      console.error('Error fetching user', error);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      await fetchCurrentUser();
      setLoading(false);
    };
    bootstrapAuth();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
    setDemoMode(isMockMode());
    const currentUser = await fetchCurrentUser();
    return currentUser;
  };

  const register = async (name, email, password) => {
    await api.register({ name, email, password });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setMockMode(false);
    setDemoMode(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      loading,
      demoMode,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, demoMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
