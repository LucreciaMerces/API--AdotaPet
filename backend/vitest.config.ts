import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    
    environment: "node",

    
    env: {
      NODE_ENV: "test",
    },
    setupFiles: ["./src/tests/setup.ts"],

   
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "prisma/",
        "src/tests/",
        "src/server.ts",
      ],
    },

   
    testTimeout: 10000,

    
    include: ["src/tests/**/*.test.ts", "src/**/*.spec.ts"],

    
    alias: {
      "@controllers": path.resolve(__dirname, "src/controllers"),
      "@services": path.resolve(__dirname, "src/services"),
      "@repositories": path.resolve(__dirname, "src/repositories"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@middlewares": path.resolve(__dirname, "src/middlewares"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@validations": path.resolve(__dirname, "src/validations"),
      "@config": path.resolve(__dirname, "src/config"),
    },
  },
});