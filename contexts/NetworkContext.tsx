import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Network from 'expo-network';

interface NetworkContextType {
  isConnected: boolean;
  networkType: string | null;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [networkType, setNetworkType] = useState<string | null>(null);

  useEffect(() => {
    checkNetworkStatus();
    
    const interval = setInterval(checkNetworkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected || false);
      setNetworkType(networkState.type || null);
    } catch (error) {
      console.error('Failed to check network status:', error);
      setIsConnected(false);
    }
  };

  return (
    <NetworkContext.Provider value={{ isConnected, networkType }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}