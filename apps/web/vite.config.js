import { defineConfig } from 'vite';
export default defineConfig({base:'./',server:{host:'127.0.0.1',fs:{allow:['../..']}},build:{chunkSizeWarningLimit:3500,rollupOptions:{input:{main:'index.html',office:'office.html',personal:'personal.html'}}}});
