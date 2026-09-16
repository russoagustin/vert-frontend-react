import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawTarget = env.API_BASE_URL || env.VITE_API_PROXY_TARGET || env.VITE_API_BASE_URL;
  const proxyTarget =
    rawTarget && (rawTarget.startsWith('http://') || rawTarget.startsWith('https://'))
      ? rawTarget
      : 'http://localhost:8080';

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'API_'],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
