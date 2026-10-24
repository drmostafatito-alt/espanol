import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// الواجهة تُبنى إلى dist وتُخدَّم من Worker Static Assets في الإنتاج.
// في التطوير: /api يُمرَّر إلى wrangler dev على 8787 عبر متغير WORKER_ORIGIN.
const WORKER = process.env.WORKER_ORIGIN || 'http://127.0.0.1:8787';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false, target: 'es2022' },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    proxy: { '/api': { target: WORKER, changeOrigin: false } },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    testTimeout: 30000,
    // better-sqlite3 وحدة أصلية (native) — تشغيلها داخل worker threads يسبب SIGSEGV
    pool: 'forks',
  },
});
