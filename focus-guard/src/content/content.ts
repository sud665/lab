import React from 'react';
import ReactDOM from 'react-dom/client';
import { TopBar } from './TopBar';
import './top-bar.css';
import '../styles/global.css';

// Create a container for the top bar
const container = document.createElement('div');
container.id = 'focus-guard-top-bar';
document.body.prepend(container);

// Add padding to body to prevent content overlap
document.body.style.paddingTop = '48px';

// Render the top bar
const root = ReactDOM.createRoot(container);
root.render(React.createElement(TopBar));

// Listen for paste events
document.addEventListener('paste', async (event) => {
  const target = event.target as HTMLElement;

  // Only detect paste in input fields
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  ) {
    const pastedText = event.clipboardData?.getData('text');

    if (pastedText && pastedText.length > 3 && pastedText.length < 100) {
      // Send message to background to suggest task
      chrome.runtime.sendMessage({
        type: 'SUGGEST_TASK',
        payload: { text: pastedText },
      });
    }
  }
});

// Listen for distraction warnings from background service worker
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SHOW_DISTRACTION_WARNING') {
    const { siteName } = message.payload;
    window.dispatchEvent(
      new CustomEvent('focus-guard-distraction', { detail: { siteName } })
    );
  }
});

console.log('Focus Guard: Content script loaded');
