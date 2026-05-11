import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/shared/models',

  test: {
    name: '@org/models',
    watch: false,
    globals: true,
    environment: 'node',

    include: ['src/**/*.{test,spec}.{js,ts}'],

    reporters: ['default'],

    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
  },
});
