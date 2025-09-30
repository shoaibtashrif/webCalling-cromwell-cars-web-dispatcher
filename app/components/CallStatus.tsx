import React, { ReactNode, useState } from 'react';

interface CallStatusProps {
  status: string;
  children?: ReactNode;
}

const CallStatus: React.FC<CallStatusProps> = ({ status, children }) => {
  const getStatusColor = (status: string) => {
    if (status.includes('success') || status.includes('✅')) return 'text-green-400';
    if (status.includes('error') || status.includes('❌')) return 'text-red-400';
    if (status.includes('Loading') || status.includes('Starting')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('success') || status.includes('✅')) return '✅';
    if (status.includes('error') || status.includes('❌')) return '❌';
    if (status.includes('Loading') || status.includes('Starting')) return '⏳';
    return '🔄';
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 animate-pulse"></div>
          System Status
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Connection:</span>
            <span className={`font-semibold flex items-center ${getStatusColor(status)}`}>
              <span className="mr-2">{getStatusIcon(status)}</span>
              Active
            </span>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-sm text-gray-300 mb-1">Current Status:</p>
            <p className={`font-medium ${getStatusColor(status)}`}>
              {status}
            </p>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
            </div>
            <span className="text-xs text-gray-400">NetTech AI Online</span>
          </div>
        </div>
      </div>

      {/* Optional Children */}
      {children}
    </div>
  );
};

export default CallStatus;