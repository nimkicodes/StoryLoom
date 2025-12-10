import React from 'react';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const Snackbar = () => {
  const { snackbar, closeSnackbar } = useSnackbar();

  if (!snackbar.isOpen) return null;

  const getIcon = () => {
    switch (snackbar.type) {
      case 'success':
        return <FaCheckCircle className="text-xl" />;
      case 'error':
        return <FaExclamationCircle className="text-xl" />;
      default:
        return <FaInfoCircle className="text-xl" />;
    }
  };

  const getColor = () => {
    switch (snackbar.type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg text-white z-[2000] transition-all duration-300 ${getColor()}`}>
      {getIcon()}
      <span className="font-medium">{snackbar.message}</span>
      <button onClick={closeSnackbar} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
        <FaTimes />
      </button>
    </div>
  );
};

export default Snackbar;
