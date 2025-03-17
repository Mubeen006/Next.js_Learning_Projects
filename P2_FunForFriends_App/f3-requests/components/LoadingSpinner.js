'use client';

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 rounded-full opacity-30 blur-xl animate-pulse-slow"></div>
        
        {/* Spinner container */}
        <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-full shadow-xl border border-white/20">
          {/* Spinner animation */}
          <div className="w-16 h-16 border-4 border-t-pink-500 border-r-purple-500 border-b-yellow-500 border-l-blue-500 rounded-full animate-spin"></div>
          
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 rounded-full blur-sm"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="absolute mt-32 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full shadow-md border border-white/20">
        <p className="text-white font-medium text-shadow-md">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 