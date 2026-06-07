import { UserRole } from "@prisma/client";
import { messageRepository } from "@repositories/messageRepository";
import { ForbiddenError, NotFoundError } from "@utils/AppError";
import type { SendMessageInput } from "@validations/messageValidation";


async function assertParticipant(
  adoptionId: string,
  userId: string
): Promise<void> {
  const adoption = await messageRepository.findAdoptionById(adoptionId);

  if (!adoption) throw new NotFoundError("Adoção");

  const isAdopter = adoption.adopterId === userId;
  const isNgo     = adoption.animal.ngoId === userId;

  if (!isAdopter && !isNgo) {
    throw new ForbiddenError("Você não participa desta conversa");
  }
}

export const messageService = {

  async sendMessage(userId: string, input: SendMessageInput) {
    await assertParticipant(input.adoptionId, userId);
    return messageRepository.create(userId, input.adoptionId, input.content);
  },

  async getMessages(adoptionId: string, userId: string) {
    await assertParticipant(adoptionId, userId);
    return messageRepository.findByAdoption(adoptionId);
  },

  async getConversationsForAdopter(userId: string, role: UserRole) {
    if (role !== UserRole.ADOPTER) {
      throw new ForbiddenError("Acesso restrito a adotantes");
    }

    const adoptions = await messageRepository.findConversationsForAdopter(userId);

    return adoptions.map((a) => ({
      adoptionId:  a.id,
      status:      a.status,
      animal:      { id: a.animal.id, name: a.animal.name },
      ngo:         { id: a.animal.ngo.id, name: a.animal.ngo.name },
      lastMessage: a.messages[0]?.content ?? null,
    }));
  },

  async getConversationsForNgo(userId: string, role: UserRole) {
    if (role !== UserRole.NGO && role !== UserRole.ADMIN) {
      throw new ForbiddenError("Acesso restrito a ONGs");
    }

    const adoptions = await messageRepository.findConversationsForNgo(userId);

    return adoptions.map((a) => ({
      adoptionId:  a.id,
      status:      a.status,
      adopter:     { id: a.adopter.id, name: a.adopter.name },
      animal:      { id: a.animal.id, name: a.animal.name },
      lastMessage: a.messages[0]?.content ?? null,
    }));
  },
};
