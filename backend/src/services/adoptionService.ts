import { UserRole } from "@prisma/client";
import { adoptionRepository } from "@repositories/adoptionRepository";
import { animalRepository }   from "@repositories/animalRepository";
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
  AppError,
} from "@utils/AppError";


export const adoptionService = {

  async createAdoption(adopterId: string, role: UserRole, animalId: string, message?: string) {
    if (role !== UserRole.ADOPTER) {
      throw new ForbiddenError("Apenas adotantes podem solicitar adoção");
    }

    const animal = await animalRepository.findById(animalId);
    if (!animal) throw new NotFoundError("Animal");

    if (animal.status !== "AVAILABLE") {
      throw new AppError("Este animal não está disponível para adoção", 409);
    }

    const duplicate = await adoptionRepository.findPendingByAdopterAndAnimal(adopterId, animalId);
    if (duplicate) throw new ConflictError("Você já possui uma solicitação pendente para este animal");

    return adoptionRepository.create(adopterId, animalId, message);
  },

  async approveAdoption(adoptionId: string, requesterId: string, role: UserRole) {
    if (role !== UserRole.NGO && role !== UserRole.ADMIN) {
      throw new ForbiddenError("Apenas ONGs podem aprovar adoções");
    }

    const adoption = await adoptionRepository.findById(adoptionId);
    if (!adoption) throw new NotFoundError("Solicitação de adoção");

    if (adoption.animal.ngoId !== requesterId) {
      throw new ForbiddenError("Você não tem permissão para aprovar esta solicitação");
    }

    if (adoption.status !== "PENDING") {
      throw new AppError("Apenas solicitações pendentes podem ser aprovadas", 409);
    }

    const [approved] = await adoptionRepository.approve(adoptionId, adoption.animal.id);
    return approved;
  },

  async rejectAdoption(adoptionId: string, requesterId: string, role: UserRole) {
    if (role !== UserRole.NGO && role !== UserRole.ADMIN) {
      throw new ForbiddenError("Apenas ONGs podem rejeitar adoções");
    }

    const adoption = await adoptionRepository.findById(adoptionId);
    if (!adoption) throw new NotFoundError("Solicitação de adoção");

    if (adoption.animal.ngoId !== requesterId) {
      throw new ForbiddenError("Você não tem permissão para rejeitar esta solicitação");
    }

    if (adoption.status !== "PENDING") {
      throw new AppError("Apenas solicitações pendentes podem ser rejeitadas", 409);
    }

    return adoptionRepository.reject(adoptionId);
  },

  async cancelAdoption(adoptionId: string, adopterId: string, role: UserRole) {
    if (role !== UserRole.ADOPTER) {
      throw new ForbiddenError("Apenas adotantes podem cancelar solicitações");
    }

    const adoption = await adoptionRepository.findById(adoptionId);
    if (!adoption) throw new NotFoundError("Solicitação de adoção");

    if (adoption.adopter.id !== adopterId) {
      throw new ForbiddenError("Você não tem permissão para cancelar esta solicitação");
    }

    if (adoption.status === "APPROVED") {
      throw new AppError("Não é possível cancelar uma adoção já aprovada", 409);
    }
    if (adoption.status !== "PENDING") {
      throw new AppError("Apenas solicitações pendentes podem ser canceladas", 409);
    }

    return adoptionRepository.cancel(adoptionId);
  },

  listForNgo(ngoId: string, role: UserRole) {
    if (role !== UserRole.NGO && role !== UserRole.ADMIN) {
      throw new ForbiddenError("Acesso restrito a ONGs");
    }
    return adoptionRepository.findAllByNgo(ngoId);
  },

  listForAdopter(adopterId: string, role: UserRole) {
    if (role !== UserRole.ADOPTER) {
      throw new ForbiddenError("Acesso restrito a adotantes");
    }
    return adoptionRepository.findAllByAdopter(adopterId);
  },
};
