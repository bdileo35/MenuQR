import React from 'react';

const Loading = ({ 
  size = 'medium', 
  text = 'Cargando...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div 
        className={`loader border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin ${sizeClasses[size]}`}
      ></div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

export default Loading;