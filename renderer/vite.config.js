import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' es imprescindible: Electron carga el index.html con loadFile
// (protocolo file://), y con rutas absolutas ("/assets/...") los recursos
// no se encontrarian.
export default defineConfig({
  base: './',
  plugins: [react()],
});
