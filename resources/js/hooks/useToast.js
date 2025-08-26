// resources/js/hooks/useToast.js
import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type = 'info', message, duration = 5000, autoClose = true }) => {
      const id = ++toastId;
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, type, message, duration, autoClose },
      ]);
      
      if (autoClose) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, options = {}) => addToast({ type: 'success', message, ...options }),
    [addToast]
  );

  const showError = useCallback(
    (message, options = {}) => addToast({ type: 'error', message, ...options }),
    [addToast]
  );

  const showWarning = useCallback(
    (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    [addToast]
  );

  const showInfo = useCallback(
    (message, options = {}) => addToast({ type: 'info', message, ...options }),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;