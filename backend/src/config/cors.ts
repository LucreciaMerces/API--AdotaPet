import cors from "cors";
import { env } from "@config/env";

// Lê as origens permitidas da variável de ambiente.
// Suporta múltiplas origens separadas por vírgula:
//   CORS_ORIGINS=http://localhost:5173,https://adotapet.com.br
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origem não permitida → ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // Cacheia o pre-flight por 24h
};
