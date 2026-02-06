import React from 'react';
import ReactDOM from 'react-dom/client';
import { TopBar } from './TopBar';
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

console.log('Focus Guard: Content script loaded');
