import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ThemeToggleProvider from "./theme/ThemeToggleProvider.jsx";

import App from './App.jsx'

import "./App.css";
import './i18n/i18n.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeToggleProvider>
      <App />
    </ThemeToggleProvider>
  </StrictMode>,
)
