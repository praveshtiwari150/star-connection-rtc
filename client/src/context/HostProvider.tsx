import React, {useContext, useEffect, useState} from "react";

interface HostProviderProps {
    children:React.ReactNode
}

interface HostContextType {
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  hostws: WebSocket | null;
  hostPC: RTCPeerConnection | null;
  setHostPC: React.Dispatch<React.SetStateAction<RTCPeerConnection | null>>;
}

const HostContext = React.createContext<HostContextType | null>(null);

export const HostProvider = ({ children }: HostProviderProps) => {
  const [email, setEmail] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hostws, setHostWs] = useState<WebSocket | null>(null);
  const [hostPC, setHostPC] = useState<RTCPeerConnection | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Websocket connection opened");
    };
    setHostWs(ws);

    return () => {
      ws.close();
    };
  }, []);
  


    return (
      <HostContext.Provider value={{
          email,
          setEmail,
            sessionId,
            setSessionId,
            hostws,
            hostPC,
            setHostPC
        }}>
        {children}
      </HostContext.Provider>
    );
}

export const useHost = () => {
  const context = useContext(HostContext);
  if (!context) {
    throw new Error("useHost must be used within a HostProvider");
  }
  return context;
};
