import React, { createContext, useContext, useState, useCallback } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'info', // 'info', 'success', 'error'
  });

  const showSnackbar = useCallback((message, type = 'info') => {
    setSnackbar({ isOpen: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, isOpen: false }));
    }, 3000); // Auto close after 3 seconds
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ snackbar, showSnackbar, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};
