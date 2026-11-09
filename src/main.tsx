import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastProvider } from './components/Toast'
import { BrandProvider } from './components/Brand'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrandProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrandProvider>
  </StrictMode>,
)
