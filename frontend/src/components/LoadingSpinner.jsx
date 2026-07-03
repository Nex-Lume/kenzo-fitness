const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-700 border-t-[#c1ff00] rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
