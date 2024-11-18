import React, { useContext } from 'react';

interface PeerProviderProps {
  children: React.ReactNode;
}

interface PeerContextType {
  dummy?: string | null;
}

const PeerContext = React.createContext<PeerContextType | null>(null);
const dummy = ''
export const PeerProvider = ({children} : PeerProviderProps) => {
  return (
    <PeerContext.Provider value={{dummy}}>
      {children}
    </PeerContext.Provider>
  )
}

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("useHost must be used within a HostProvider");
  }
  return context;
};