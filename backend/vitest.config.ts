import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Ambiente Node.js (não browser)
    environment: "node",

    // Carrega o .env.test automaticamente antes dos testes
    // Crie um .env.test com DATABASE_URL apontando para um banco de testes
    // separado para não sujar o banco de desenvolvimento
    env: {
      NODE_ENV: "test",
    },
    setupFiles: ["./src/tests/setup.ts"],

    // Cobertura de código com V8 (mais leve que Istanbul)
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "prisma/",
        "src/tests/",
        "src/server.ts", // Entry point não precisa de cobertura unitária
      ],
    },

    // Timeout por teste (ms)
    testTimeout: 10000,

    // Glob para encontrar arquivos de teste
    include: ["src/tests/**/*.test.ts", "src/**/*.spec.ts"],
  },

  // Resolve os path aliases do tsconfig.json no contexto dos testes
  resolve: {
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
