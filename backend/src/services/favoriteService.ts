import { favoriteRepository } from "@repositories/favoriteRepository";
import { animalRepository }   from "@repositories/animalRepository";
import { ForbiddenError, NotFoundError, ConflictError } from "@utils/AppError";
import { UserRole } from "@prisma/client";



function assertAdopter(role: UserRole): void {
  if (role !== UserRole.ADOPTER) {
    throw new ForbiddenError("Apenas adotantes podem gerenciar favoritos");
  }
}

export const favoriteService = {

  async addFavorite(userId: string, role: UserRole, animalId: string) {
    assertAdopter(role);

    const animal = await animalRepository.findById(animalId);
    if (!animal) throw new NotFoundError("Animal");

    const existing = await favoriteRepository.findByUserAndAnimal(userId, animalId);
    if (existing) throw new ConflictError("Animal já está nos favoritos");

    return favoriteRepository.create(userId, animalId);
  },

  async removeFavorite(userId: string, role: UserRole, animalId: string) {
    assertAdopter(role);

    const existing = await favoriteRepository.findByUserAndAnimal(userId, animalId);
    if (!existing) throw new NotFoundError("Favorito");

    await favoriteRepository.delete(userId, animalId);
  },

  listFavorites(userId: string, role: UserRole) {
    assertAdopter(role);
    return favoriteRepository.findAllByUser(userId);
  },
};
