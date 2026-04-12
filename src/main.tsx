import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './SocketContext.tsx'
import { GameProvider } from './GameContext.tsx'

createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
      <SocketProvider>
         <GameProvider>
            <App />
         </GameProvider>
      </SocketProvider>
   </BrowserRouter>
)
