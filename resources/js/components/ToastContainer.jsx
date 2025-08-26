// resources/js/components/ToastContainer.jsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ToastNotification from './ToastNotification';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            autoClose={toast.autoClose !== false}
            duration={toast.duration || 5000}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;