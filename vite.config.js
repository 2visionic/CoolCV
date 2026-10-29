import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite konfigurace pro React 18 Frontend + React Backoffice
 * - Při vývoji přes Vite proxy směruje volání `/api.php` na PHP / Node backend
 * - Při `npm run build` vygeneruje statický produkční bundle do `dist/` pro nahrání na PHP freehosting
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api.php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
