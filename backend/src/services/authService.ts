import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { authRepository } from "@repositories/authRepository";
import { ConflictError, UnauthorizedError } from "@utils/AppError";
import { env } from "@config/env";
import type { RegisterInput, LoginInput } from "@validations/authValidation";



export interface JwtPayload {
  sub: string;     
  email: string;
  name: string;
  role: UserRole;
  iat?: number;    
  exp?: number;    
}


const BCRYPT_SALT_ROUNDS = 12;

function generateToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("E-mail já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: (input.role ?? "ADOPTER") as UserRole,
      phone: input.phone,
      bio: input.bio,
      city: input.city,
      state: input.state,
    });

    const token = generateToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { token, user };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("E-mail ou senha incorretos");
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError("E-mail ou senha incorretos");
    }

    const { password: _pw, ...publicUser } = user;
    void _pw; 

    const token = generateToken({
      sub: publicUser.id,
      email: publicUser.email,
      name: publicUser.name,
      role: publicUser.role,
    });

    return { token, user: publicUser };
  },

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token expirado. Faça login novamente");
      }
      throw new UnauthorizedError("Token inválido");
    }
  },
};
