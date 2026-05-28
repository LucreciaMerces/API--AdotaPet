import "dotenv/config";
import { z } from "zod";

// Schema de validação das variáveis de ambiente.
// Garante que a aplicação não suba com variáveis faltando ou com tipos errados.
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3333),
  API_PREFIX: z.string().default("/api/v1"),
  DATABASE_URL: z.string().url("DATABASE_URL deve ser uma URL válida"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter ao menos 16 caracteres"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
});

// Tenta validar. Se falhar, lista todos os erros e encerra o processo —
// melhor falhar em boot do que em runtime com mensagem cryptica.
const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error("❌  Variáveis de ambiente inválidas:\n");
  _parsed.error.errors.forEach((e) => {
    console.error(`  • ${e.path.join(".")}: ${e.message}`);
  });
  process.exit(1);
}

export const env = _parsed.data;
