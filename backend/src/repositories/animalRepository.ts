import { prisma } from "@config/prisma";
import { AnimalSpecies, AnimalStatus, Prisma } from "@prisma/client";
import type { CreateAnimalInput, UpdateAnimalInput } from "@validations/animalValidation";

const animalWithNgo = {
  id:           true,
  name:         true,
  species:      true,
  breed:        true,
  age:          true,
  gender:       true,
  size:         true,
  description:  true,
  status:       true,
  isVaccinated: true,
  isNeutered:   true,
  ngoId:        true,
  createdAt:    true,
  updatedAt:    true,
  ngo: {
    select: {
      id:    true,
      name:  true,
      email: true,
      city:  true,
      state: true,
    },
  },
} as const;

export interface FindAllOptions {
  search?:  string;
  species?: AnimalSpecies;
}

export const animalRepository = {

  findAll(options: FindAllOptions = {}) {
    const { search, species } = options;

    const where: Prisma.AnimalWhereInput = {
      status: AnimalStatus.AVAILABLE, // feed exibe apenas disponíveis
    };

    if (species) {
      where.species = species;
    }

    if (search) {
      where.OR = [
        { name:  { contains: search, mode: "insensitive" } },
        { breed: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.animal.findMany({
      where,
      select: animalWithNgo,
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.animal.findUnique({
      where: { id },
      select: animalWithNgo,
    });
  },

  create(data: CreateAnimalInput & { ngoId: string }) {
    return prisma.animal.create({
      data: {
        name:         data.name,
        species:      data.species,
        breed:        data.breed,
        age:          data.age,
        gender:       data.gender,
        size:         data.size       ?? "MEDIUM",
        description:  data.description,
        isVaccinated: data.isVaccinated ?? false,
        isNeutered:   data.isNeutered   ?? false,
        status:       AnimalStatus.AVAILABLE,
        ngoId:        data.ngoId,
      },
      select: animalWithNgo,
    });
  },

  update(id: string, data: UpdateAnimalInput) {
    return prisma.animal.update({
      where: { id },
      data,
      select: animalWithNgo,
    });
  },

  delete(id: string) {
    return prisma.animal.delete({
      where: { id },
    });
  },
};
