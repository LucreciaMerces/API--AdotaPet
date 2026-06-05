import { AnimalSpecies } from "@prisma/client";
import { animalRepository } from "@repositories/animalRepository";
import { NotFoundError, ForbiddenError } from "@utils/AppError";
import type { CreateAnimalInput, UpdateAnimalInput } from "@validations/animalValidation";



export const animalService = {

  getAnimals(search?: string, species?: string) {
    return animalRepository.findAll({
      search,
      species: species as AnimalSpecies | undefined,
    });
  },

  async getAnimalById(id: string) {
    const animal = await animalRepository.findById(id);

    if (!animal) {
      throw new NotFoundError("Animal");
    }

    return animal;
  },

  createAnimal(data: CreateAnimalInput, ngoId: string) {
    return animalRepository.create({ ...data, ngoId });
  },

  async updateAnimal(id: string, data: UpdateAnimalInput, requesterId: string) {
    const animal = await animalRepository.findById(id);

    if (!animal) {
      throw new NotFoundError("Animal");
    }

    if (animal.ngoId !== requesterId) {
      throw new ForbiddenError("Você não tem permissão para editar este animal");
    }

    return animalRepository.update(id, data);
  },

  async deleteAnimal(id: string, requesterId: string) {
    const animal = await animalRepository.findById(id);

    if (!animal) {
      throw new NotFoundError("Animal");
    }

    if (animal.ngoId !== requesterId) {
      throw new ForbiddenError("Você não tem permissão para excluir este animal");
    }

    await animalRepository.delete(id);
  },
};
