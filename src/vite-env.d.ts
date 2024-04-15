/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STREAMSERVER: string
}

interface ImportEnv {
    readonly env: ImportMetaEnv
}