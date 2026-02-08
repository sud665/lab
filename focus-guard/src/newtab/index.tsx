import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Dashboard } from './Dashboard';
import '../styles/global.css';

const darkGoldTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FFD700' },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
});

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider theme={darkGoldTheme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    </React.StrictMode>
  );
}
