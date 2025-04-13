import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { getConnectionStatus } from '../lib/supabase';

function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(getConnectionStatus());
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center p-3 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
    }`}>
      {isOnline ? (
        <>
          <Wifi size={18} className="mr-2" />
          <span>Connection restored</span>
        </>
      ) : (
        <>
          <WifiOff size={18} className="mr-2" />
          <span>You are offline</span>
        </>
      )}
    </div>
  );
}

export default ConnectionStatus;