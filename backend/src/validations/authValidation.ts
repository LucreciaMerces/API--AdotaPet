import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Nome é obrigatório" })
      .min(2, "Nome deve ter ao menos 2 caracteres")
      .max(100, "Nome muito longo")
      .trim(),

    email: z
      .string({ required_error: "E-mail é obrigatório" })
      .email("E-mail inválido")
      .toLowerCase()
      .trim(),

    password: z
      .string({ required_error: "Senha é obrigatória" })
      .min(6, "Senha deve ter ao menos 6 caracteres")
      .max(72, "Senha muito longa"), 

    role: z
      .enum(["ADOPTER", "NGO"], {
        errorMap: () => ({ message: 'role deve ser "ADOPTER" ou "NGO"' }),
      })
      .default("ADOPTER"),

    phone: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    bio: z.string().max(500).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "E-mail é obrigatório" })
      .email("E-mail inválido")
      .toLowerCase()
      .trim(),

    password: z.string({ required_error: "Senha é obrigatória" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
