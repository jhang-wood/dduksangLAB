'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => (
  <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
);

export const PageLoading = ({ message = '로딩 중...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

export const SkeletonLoader = ({ lines = 3 }) => (
  <div className="animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i}
        className="bg-gray-200 rounded h-4 mb-3 w-full"
      />
    ))}
  </div>
);
