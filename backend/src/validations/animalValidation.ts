import { z } from "zod";
import {
  AnimalSpecies,
  AnimalGender,
  AnimalSize,
  AnimalStatus,
} from "@prisma/client";

export const createAnimalSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(100)
      .trim(),

    species: z.nativeEnum(AnimalSpecies),

    breed: z
      .string()
      .max(100)
      .trim()
      .optional(),

    age: z.coerce
      .number()
      .int()
      .min(0, "Idade não pode ser negativa")
      .optional(),

    gender: z.nativeEnum(AnimalGender),

    size: z
      .nativeEnum(AnimalSize)
      .default(AnimalSize.MEDIUM),

    description: z
      .string()
      .max(1000)
      .trim()
      .optional(),

    isVaccinated: z.boolean().default(false),

    isNeutered: z.boolean().default(false),
  }),
});

export const updateAnimalSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1)
      .max(100)
      .trim()
      .optional(),

    species: z
      .nativeEnum(AnimalSpecies)
      .optional(),

    breed: z
      .string()
      .max(100)
      .trim()
      .optional(),

    age: z.coerce
      .number()
      .int()
      .min(0)
      .optional(),

    gender: z
      .nativeEnum(AnimalGender)
      .optional(),

    size: z
      .nativeEnum(AnimalSize)
      .optional(),

    description: z
      .string()
      .max(1000)
      .trim()
      .optional(),

    isVaccinated: z
      .boolean()
      .optional(),

    isNeutered: z
      .boolean()
      .optional(),

    status: z
      .nativeEnum(AnimalStatus)
      .optional(),
  }),
});

export const listAnimalsSchema = z.object({
  query: z.object({
    search: z
      .string()
      .trim()
      .optional(),

    species: z
      .nativeEnum(AnimalSpecies)
      .optional(),
  }),
});

export type CreateAnimalInput =
  z.infer<typeof createAnimalSchema>["body"];

export type UpdateAnimalInput =
  z.infer<typeof updateAnimalSchema>["body"];

export type ListAnimalsInput =
  z.infer<typeof listAnimalsSchema>["query"];