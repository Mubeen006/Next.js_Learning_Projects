'use client';

import { useState } from 'react';

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6">
            We're sorry, but there was an error loading this page. Please try refreshing the page or come back later.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onError={(error) => {
        console.error('Caught an error:', error);
        setHasError(true);
      }}
    >
      {children}
    </div>
  );
} 