import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

type OfflineContextValue = {
  isOffline: boolean;
  markNetworkFailed: () => void;
};

const OfflineContext = createContext<OfflineContextValue>({
  isOffline: false,
  markNetworkFailed: () => {},
});

export function OfflineProvider({ children }: { children: ReactNode }) {
  const isOnline = useOnlineStatus();
  const [networkFailed, setNetworkFailed] = useState(false);

  useEffect(() => {
    if (isOnline) setNetworkFailed(false);
  }, [isOnline]);

  const isOffline = !isOnline || networkFailed;

  return (
    <OfflineContext.Provider value={{ isOffline, markNetworkFailed: () => setNetworkFailed(true) }}>
      {children}
    </OfflineContext.Provider>
  );
}

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};
