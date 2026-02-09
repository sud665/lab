// Chrome API mock 먼저 주입 (다른 import보다 앞에 와야 함)
import './chrome-mock';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from '../newtab/Dashboard';
import { Popup } from '../popup/Popup';
import { Settings } from '../newtab/Settings';
import '../styles/global.css';

type Tab = 'dashboard' | 'popup' | 'settings';

function DevApp() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard (새 탭)' },
    { id: 'popup', label: 'Popup (확장 아이콘)' },
    { id: 'settings', label: 'Settings (설정)' },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-surface-deep">
      {/* Dev Mode Tab Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-1 px-4 py-2"
        style={{ background: 'rgba(10,10,12,0.95)', borderBottom: '1px solid rgba(232,185,49,0.15)', backdropFilter: 'blur(12px)' }}>
        <span className="text-[11px] text-gold-400 font-semibold tracking-widest uppercase mr-4" style={{ fontFamily: "'Sora', sans-serif" }}>
          DEV
        </span>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 cursor-pointer"
            style={{
              background: activeTab === tab.id ? 'rgba(232,185,49,0.12)' : 'transparent',
              color: activeTab === tab.id ? '#e8b931' : '#8e8e99',
              border: activeTab === tab.id ? '1px solid rgba(232,185,49,0.2)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-text-muted" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          localhost:4000
        </span>
      </div>

      {/* Content */}
      <div className="pt-12 w-full">
        {activeTab === 'dashboard' && <Dashboard onNavigate={(p) => setActiveTab(p as Tab)} />}
        {activeTab === 'popup' && (
          <div className="flex items-start justify-center py-12">
            <div style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)', borderRadius: '12px', overflow: 'hidden' }}>
              <Popup />
            </div>
          </div>
        )}
        {activeTab === 'settings' && <Settings onNavigate={(p) => setActiveTab(p as Tab)} />}
      </div>
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
