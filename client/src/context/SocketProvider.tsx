import {ReactNode, createContext, useContext } from "react";

type SocketContextType = WebSocket | null;

const SocketContext = createContext<SocketContextType>(null);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const ws: WebSocket | null = new WebSocket("ws://localhost:8080");

  return (
    <SocketContext.Provider value={ws}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);



export default SocketProvider;
