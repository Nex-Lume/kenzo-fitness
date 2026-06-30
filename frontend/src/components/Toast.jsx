import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
          isSuccess
            ? 'bg-green-500/10 border-green-500/50 text-green-400'
            : 'bg-red-500/10 border-red-500/50 text-red-400'
        } backdrop-blur-md`}
      >
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <p className="font-medium pr-4">{message}</p>
        <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
