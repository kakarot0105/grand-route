import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import App from './App.jsx'
import './styles/global.css'
import './styles/animations.css'
import { themes } from './styles/themes.js'
import { AuthProvider } from './context/AuthContext.js'
import { QuestProvider } from './context/QuestContext.js'
import { ToastProvider } from './context/ToastContext.js'

const root = createRoot(document.getElementById('root'))
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <ThemeProvider theme={themes.light}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <QuestProvider>
            <ToastProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ToastProvider>
          </QuestProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {})
  })
}
