import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [toastData, setToastData] = useState(null);
  const navigate = useNavigate();

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    navigate('/');
  }, [navigate]);

  const toast = useCallback((msg, type = 'success') => {
    setToastData({ msg, type, key: Date.now() });
  }, []);

  return (
    <AppContext.Provider value={{ user, login, logout, toast, toastData, setToastData }}>
      {children}
    </AppContext.Provider>
  );
};