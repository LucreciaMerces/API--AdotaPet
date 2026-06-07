import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    adoptionId: z
      .string({ required_error: "adoptionId é obrigatório" })
      .min(1, "adoptionId não pode ser vazio"),

    content: z
      .string({ required_error: "Mensagem é obrigatória" })
      .min(1, "Mensagem não pode ser vazia")
      .max(2000, "Mensagem muito longa")
      .trim(),
  }),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>["body"];
