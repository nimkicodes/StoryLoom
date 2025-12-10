import React from 'react';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Snackbar = () => {
  const { snackbar, closeSnackbar } = useSnackbar();

  if (!snackbar.isOpen) return null;

  const getIcon = () => {
    switch (snackbar.type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={24} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={24} />;
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
      <button onClick={closeSnackbar} className="text-gray-500 hover:text-gray-700">
        <X size={20} />
      </button>
    </div>
  );
};

export default Snackbar;
