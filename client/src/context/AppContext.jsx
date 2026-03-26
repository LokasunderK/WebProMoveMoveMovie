import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to restore from localStorage on first load
    const saved = localStorage.getItem('mmm_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [toastData, setToastData] = useState(null);
  const navigate = useNavigate();

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('mmm_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('mmm_user');
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