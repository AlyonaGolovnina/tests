import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Repo name on GitHub → https://alyonagolovnina.github.io/tests/
export default defineConfig({
  plugins: [react()],
  base: '/tests/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
  },
});
