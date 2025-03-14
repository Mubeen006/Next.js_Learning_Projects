import React from 'react';

/**
 * LoadingSpinner Component
 * 
 * A simple loading spinner with a backdrop to indicate that an operation is in progress.
 * Used during image upload to Cloudinary and form submission.
 */
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-xl flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-pink-500 border-r-purple-500 border-b-blue-500 border-l-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-white font-medium">Uploading your image...</p>
        <p className="text-white/70 text-sm mt-1">This may take a moment</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 