import morgan from "morgan";
import { env } from "@config/env";

// Em desenvolvimento usa o formato colorido "dev" (método, status, tempo).
// Em produção usa "combined" (Apache format) que inclui IP, user-agent, etc.
// Útil para auditoria e monitoramento em servidores como Railway/Render.
export const requestLogger =
  env.NODE_ENV === "production"
    ? morgan("combined")
    : morgan("dev");
