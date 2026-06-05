import { Request, Response, NextFunction } from "express";
import { authService } from "@services/authService";
import { UnauthorizedError, ForbiddenError } from "@utils/AppError";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token de autenticação não fornecido");
    }

    const token = authHeader.split(" ")[1]; 

    if (!token) {
      throw new UnauthorizedError("Token de autenticação inválido");
    }

    const payload = authService.verifyToken(token);

   
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (err) {
    next(err);
  }
}


export function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(new UnauthorizedError("Usuário não autenticado"));
  }

  if (req.user.role !== "ADMIN") {
    return next(new ForbiddenError("Acesso restrito a administradores"));
  }

  next();
}

export function ngoMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(new UnauthorizedError("Usuário não autenticado"));
  }

  if (req.user.role !== "NGO" && req.user.role !== "ADMIN") {
    return next(new ForbiddenError("Acesso restrito a ONGs"));
  }

  next();
}
