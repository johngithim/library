/// <reference types="vite/client" />

// Make Vite client-side env vars available to the TypeScript/IDE.
interface ImportMetaEnv {
  readonly VITE_PROJECT_URL: string;
  readonly VITE_PUBLIC_KEY: string;

  readonly SUPABASE_PROJECT_URL: string;
  readonly SUPABASE_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
