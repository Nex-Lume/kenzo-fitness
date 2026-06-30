import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center gap-3">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
