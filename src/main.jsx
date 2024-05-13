import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@material-tailwind/react'
import { BrowserRouter } from 'react-router-dom';
import { MaterialTailwindControllerProvider } from './context/index.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <MaterialTailwindControllerProvider>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </MaterialTailwindControllerProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
