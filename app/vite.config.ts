import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo name on GitHub → https://alyonagolovnina.github.io/tests/
export default defineConfig({
  plugins: [react()],
  base: '/tests/',
});
