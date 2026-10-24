import { defineConfig } from 'vitest/config';

// The database specs share one database and each spec file shuts down its own connection pool,
// so files run one at a time and in isolation.
export default defineConfig({
    test: {
        include: ['test/server/db-integration/**/*.spec.js'],
        setupFiles: ['test/helpers/vitest-db-setup.js'],
        globals: true,
        fileParallelism: false,
        isolate: true,
        testTimeout: 20000
    }
});
