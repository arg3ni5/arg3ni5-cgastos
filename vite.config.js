import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    env: {
      VITE_APP_SUPABASE_URL: 'https://test.supabase.co',
      VITE_APP_SUPABASE_ANON_KEY: 'test-anon-key',
      VITE_APP_ENV: 'test',
      VITE_SESSION_TIMEOUT: '3600000',
    },
  },
})
