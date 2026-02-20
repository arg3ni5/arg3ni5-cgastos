/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SUPABASE_URL: string
  readonly VITE_APP_SUPABASE_ANON_KEY: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  readonly VITE_SESSION_TIMEOUT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
