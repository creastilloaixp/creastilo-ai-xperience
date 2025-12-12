import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      iconColor: 'text-green-400'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: Info,
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      iconColor: 'text-cyan-400'
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[toast.type];

  return (
    <div
      className={`${bgColor} ${borderColor} border backdrop-blur-sm rounded-xl p-4 shadow-2xl flex items-start gap-3 min-w-[320px] animate-in slide-in-from-right-full duration-300 pointer-events-auto`}
    >
      <Icon className={`${iconColor} shrink-0 mt-0.5`} size={20} />
      <p className={`flex-1 text-sm ${textColor} leading-relaxed`}>{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-white transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};
