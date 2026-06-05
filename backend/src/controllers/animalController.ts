import { Request, Response, NextFunction } from "express";
import { animalService } from "@services/animalService";
import { sendSuccess, sendCreated, sendNoContent } from "@utils/apiResponse";
import { UnauthorizedError } from "@utils/AppError";
import {
  createAnimalSchema,
  updateAnimalSchema,
  listAnimalsSchema,
} from "@validations/animalValidation";


export const animalController = {

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = listAnimalsSchema.parse({ query: req.query });
      const animals = await animalService.getAnimals(query.search, query.species);

      sendSuccess(res, animals, "Animais listados com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const animal = await animalService.getAnimalById(req.params.id);

      sendSuccess(res, animal, "Animal encontrado");
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { body } = createAnimalSchema.parse({ body: req.body });
      const animal = await animalService.createAnimal(body, req.user.id);

      sendCreated(res, animal, "Animal cadastrado com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { body } = updateAnimalSchema.parse({ body: req.body });
      const animal = await animalService.updateAnimal(req.params.id, body, req.user.id);

      sendSuccess(res, animal, "Animal atualizado com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      await animalService.deleteAnimal(req.params.id, req.user.id);

      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  },
};
