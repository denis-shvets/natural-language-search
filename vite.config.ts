import { defineConfig, loadEnv } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import demo from './configs/vite/plugins/demo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [demo(env)],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'NaturalLanguageSearch',
        fileName: 'natural-language-search',
      },
      emptyOutDir: false,
      rollupOptions: {
        output: {
          exports: 'named',
        },
      },
    },
  };
});
