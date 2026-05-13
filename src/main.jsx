import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from '@posthog/react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN}
      options={{ api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST }}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
)
