import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { join } from 'path';

// Function to get API server port
function getApiPort() {
  try {
    const portFile = join(process.cwd(), '../.api-port');
    const port = readFileSync(portFile, 'utf-8').trim();
    return parseInt(port) || 3001;
  } catch {
    // Fallback to default if file doesn't exist
    return 3001;
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '127.0.0.1', // Use IP instead of localhost
    open: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${getApiPort()}`, // Use 127.0.0.1 instead of localhost
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // Retry with updated port if connection fails
          proxy.on('error', (err, req, res) => {
            console.warn(`Proxy error: ${err.message}`);
            console.log(`Trying to reconnect to API server...`);
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['jspdf', 'html2canvas']
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['html2pdf.js']
  },
  preview: {
    port: 3000,
  },
});