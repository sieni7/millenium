import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    minify: 'terser', // On garde Terser car c'est ce qui était utilisé
    sourcemap: true
  }
});
