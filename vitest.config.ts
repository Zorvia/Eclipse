// Project: Mycelium
// Owned by Zorvia
// All credits to the Zorvia Community
// Licensed under ZPL v2.0 — see LICENSE.md

import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
