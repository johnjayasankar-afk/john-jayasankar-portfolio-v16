/// <reference types="vite/client" />

declare module "*.svg?raw" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
