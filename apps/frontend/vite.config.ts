import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import ViteYaml from '@modyfi/vite-plugin-yaml';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteYaml()],
  server: {
    port: 7070,
  },
  define: {
    'process.env': process.env,
  },
});
