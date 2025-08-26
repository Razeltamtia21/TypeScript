// resources/js/components/ToastNotification.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

const ToastNotification = ({ type = 'info', message, onClose, autoClose = true, duration = 5000 }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                        <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
        }
    };

    const getAlertClass = () => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50 text-green-800';
            case 'error':
                return 'border-red-200 bg-red-50 text-red-800';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 text-yellow-800';
            default:
                return 'border-blue-200 bg-blue-50 text-blue-800';
        }
    };

    React.useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="mb-2"
        >
            <Alert className={`${getAlertClass()} relative pr-12 shadow-lg`}>
                <div className="flex items-start">
                    {getIcon()}
                    <div className="ml-3 flex-1">
                        <AlertDescription className="text-sm font-medium">{message}</AlertDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                {autoClose && (
                    <div className="absolute bottom-0 left-0 h-1 bg-gray-200">
                        <motion.div
                            className="h-full bg-gray-400"
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                        />
                    </div>
                )}
            </Alert>
        </motion.div>
    );
};

export default ToastNotification;
