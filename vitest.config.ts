import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: [
        "src/app/api/pautalia/**/*.ts",
        "src/app/api/webhooks/**/*.ts",
        "src/components/**/*.ts",
        "src/content/**/*.ts",
        "src/data/**/*.ts",
        "src/lib/**/*.ts",
        "src/middleware.ts",
      ],
      exclude: [
        "src/lib/access-control.ts",
        "src/lib/admin-analytics.ts",
        "src/lib/admin-auth.ts",
        "src/lib/admin-crm.ts",
        "src/lib/admin-data.ts",
        "src/lib/admin-demo-data.ts",
        "src/lib/admin-inventory-seed*.ts",
        "src/lib/admin-page.ts",
        "src/lib/admin-api.ts",
        "src/lib/analytics-client.ts",
        "src/lib/legal-pages.ts",
        "src/lib/leads.ts",
        "src/lib/public-api.ts",
        "src/lib/pautalia-data.ts",
        "src/lib/json-ld.ts",
        "src/lib/logger.ts",
        "src/lib/prisma.ts",
        "src/types/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
