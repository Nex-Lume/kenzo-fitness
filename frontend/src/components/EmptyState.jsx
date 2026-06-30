import { FolderOpen } from 'lucide-react';

const EmptyState = ({ message = 'No data found', icon: Icon = FolderOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <Icon className="w-16 h-16 mb-4 text-gray-500 opacity-50" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default EmptyState;
