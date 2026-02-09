import React from 'react';
import ReactDOM from 'react-dom/client';
import { Popup } from './Popup';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import '../styles/global.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <Popup />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
