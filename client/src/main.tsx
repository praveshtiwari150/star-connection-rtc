import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SocketProvider from './context/SocketProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { HostProvider } from './context/HostProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SocketProvider>
      <HostProvider>
        <App />
      </HostProvider>
    </SocketProvider>
  </BrowserRouter>
);
