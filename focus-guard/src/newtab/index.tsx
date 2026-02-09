import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './Dashboard';
import { Settings } from './Settings';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import '../styles/global.css';

type Page = 'dashboard' | 'settings';

function App() {
  const [page, setPage] = useState<Page>('dashboard');

  return page === 'dashboard'
    ? <Dashboard onNavigate={(p) => setPage(p as Page)} />
    : <Settings onNavigate={(p) => setPage(p as Page)} />;
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
