/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HTTP_API_BASE_ENDPOINT: string;
  readonly VITE_WEBSOCKET_API_BASE_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
