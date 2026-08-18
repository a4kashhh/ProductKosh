import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  server: {
    host: true,
    port: 3000,
    hmr: {
      overlay: false
    },
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/node_modules/**', '**/*.log']
    }
  }
});
