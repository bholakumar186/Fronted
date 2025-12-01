import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import theme from './theme.js';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './auth/authprovider.jsx'; 
import axios from 'axios';

// Set global axios baseURL from Vite env variable. When you build for production
// create a `.env.production` with `VITE_API_URL=https://api.example.com`.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
