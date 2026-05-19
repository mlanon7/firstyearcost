import { defineConfig } from 'vitest/config';
import path from 'node:path';
import fs from 'node:fs';

// Vitest config tuned for this project.
//
// 1. Aliases mirror tsconfig paths so test files can `import x from '@/lib/...'`.
// 2. The CSV loader plugin teaches Vite to treat `import x from '...foo.csv'`
//    as a default-export string — matching the Next.js webpack `asset/source`
//    loader configured in next.config.mjs. Without this, the data modules
//    that import CSVs would fail in the test runner.

const csvAsStringPlugin = {
  name: 'csv-as-string',
  enforce: 'pre' as const,
  load(id: string) {
    if (id.endsWith('.csv')) {
      const clean = id.split('?')[0];
      const content = fs.readFileSync(clean, 'utf8');
      return `export default ${JSON.stringify(content)};`;
    }
    return null;
  },
};

export default defineConfig({
  plugins: [csvAsStringPlugin],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    environment: 'node',
    globals: false,
    include: ['lib/**/*.test.ts', 'components/**/*.test.ts'],
  },
});
