import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastProvider } from './components/Toast'
import { BrandProvider } from './components/Brand'
import { ThemeProvider } from './components/Theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrandProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrandProvider>
    </ThemeProvider>
  </StrictMode>,
)
