import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { corsOptions }      from "@config/cors";
import { requestLogger }    from "@middlewares/requestLogger";
import { notFoundHandler }  from "@middlewares/notFound";
import { errorHandler }     from "@middlewares/errorHandler";
import { apiRoutes }        from "@routes/index";
import { env }              from "@config/env";

export function createApp(): Express {
  const app = express();

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
  app.use(cors(corsOptions));

  
  app.use(
    "/uploads",
    express.static(path.resolve(env.UPLOAD_DIR))
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  app.use(env.API_PREFIX, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
