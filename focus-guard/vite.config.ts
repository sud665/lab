import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest: manifest as any }),
  ],
  build: {
    rollupOptions: {
      input: {
        newtab: 'src/newtab/index.html',
        popup: 'src/popup/index.html',
      },
    },
  },
});
