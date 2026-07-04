import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('three') ||
              id.includes('@react-three') ||
              id.includes('postprocessing') ||
              id.includes('maath')
            ) {
              return 'three';
            }
            if (id.includes('react-simple-maps') || id.includes('d3-') || id.includes('topojson')) {
              return 'maps';
            }
          }
          return undefined;
        },
      },
    },
  },
});
