import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  loader: {
    '.png': 'file',
    '.css': 'copy'
  },
  clean: true
});
