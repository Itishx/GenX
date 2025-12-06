import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
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