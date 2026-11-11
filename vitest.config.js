import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/**/*.spec.js'],
        exclude: ['test/server/db-integration/**', '**/node_modules/**'],
        setupFiles: ['test/helpers/vitest-setup.js'],
        globals: true,
        pool: 'threads',
        isolate: false,
        testTimeout: 10000,
        css: false
    }
});
