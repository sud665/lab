import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// "/" 접속 시 dev.html로 연결하는 플러그인
function devRedirect(): Plugin {
  return {
    name: 'dev-redirect',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/') {
          req.url = '/dev.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [devRedirect(), react(), tailwindcss()],
  server: {
    port: 4000,
    strictPort: true,
    open: '/dev.html',
  },
});
