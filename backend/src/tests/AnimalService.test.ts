import { describe, it, expect, vi, beforeEach } from "vitest";
import { animalService } from "@services/animalService";
import { animalRepository } from "@repositories/animalRepository";

vi.mock("@repositories/animalRepository", () => ({
  animalRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockAnimal = {
  id: "animal-id-1",
  name: "Mel",
  species: "DOG" as const,
  breed: "Golden Retriever",
  age: 2,
  gender: "FEMALE" as const,
  size: "MEDIUM" as const,
  description: "Cachorra dócil e brincalhona",
  status: "AVAILABLE" as const,
  isVaccinated: true,
  isNeutered: false,
  ngoId: "ngo-id-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  ngo: {
    id: "ngo-id-1",
    name: "Amigos dos Bichos",
    email: "ong@email.com",
    city: "São Paulo",
    state: "SP",
  },
  images: [],
};

describe("animalService.getAnimals", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deve retornar a lista de animais existentes", async () => {
    vi.mocked(animalRepository.findAll).mockResolvedValue([mockAnimal]);

    const result = await animalService.getAnimals();

    expect(result).toEqual([mockAnimal]);
    expect(animalRepository.findAll).toHaveBeenCalledWith({
      search: undefined,
      species: undefined,
    });
  });

  it("deve retornar lista vazia quando não houver animais", async () => {
    vi.mocked(animalRepository.findAll).mockResolvedValue([]);

    const result = await animalService.getAnimals();

    expect(result).toEqual([]);
  });
});

describe("animalService.getAnimalById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deve retornar o animal quando existir", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(mockAnimal);

    const result = await animalService.getAnimalById("animal-id-1");

    expect(result).toEqual(mockAnimal);
    expect(animalRepository.findById).toHaveBeenCalledWith("animal-id-1");
  });

  it("deve lançar NotFoundError quando o animal não existir", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(null);

    await expect(
      animalService.getAnimalById("id-inexistente")
    ).rejects.toMatchObject({
      name: "NotFoundError",
      statusCode: 404,
    });
  });
});

describe("animalService.createAnimal", () => {
  beforeEach(() => vi.clearAllMocks());

  const createInput = {
    name: "Mel",
    species: "DOG" as const,
    breed: "Golden Retriever",
    age: 2,
    gender: "FEMALE" as const,
    size: "MEDIUM" as const,
    description: "Cachorra dócil e brincalhona",
    isVaccinated: false,
    isNeutered: false,
  };

  it("deve criar o animal com dados válidos", async () => {
    vi.mocked(animalRepository.create).mockResolvedValue(mockAnimal);

    const result = await animalService.createAnimal(createInput, "ngo-id-1");

    expect(result).toEqual(mockAnimal);
    expect(animalRepository.create).toHaveBeenCalledWith({
      ...createInput,
      ngoId: "ngo-id-1",
    });
  });

  it("deve propagar o erro quando o repository falhar", async () => {
    vi.mocked(animalRepository.create).mockRejectedValue(
      new Error("Falha de conexão com o banco")
    );

    await expect(
      animalService.createAnimal(createInput, "ngo-id-1")
    ).rejects.toThrow("Falha de conexão com o banco");
  });
});

describe("animalService.updateAnimal", () => {
  beforeEach(() => vi.clearAllMocks());

  const updateInput = { name: "Mel Atualizada" };

  it("deve atualizar o animal quando o requester for o dono", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(mockAnimal);
    vi.mocked(animalRepository.update).mockResolvedValue({
      ...mockAnimal,
      ...updateInput,
    });

    const result = await animalService.updateAnimal(
      "animal-id-1",
      updateInput,
      "ngo-id-1"
    );

    expect(result.name).toBe("Mel Atualizada");
    expect(animalRepository.update).toHaveBeenCalledWith(
      "animal-id-1",
      updateInput
    );
  });

  it("deve lançar NotFoundError quando o animal não existir", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(null);

    await expect(
      animalService.updateAnimal("id-inexistente", updateInput, "ngo-id-1")
    ).rejects.toMatchObject({
      name: "NotFoundError",
      statusCode: 404,
    });

    expect(animalRepository.update).not.toHaveBeenCalled();
  });

  it("deve lançar ForbiddenError quando o requester não for o dono do animal", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(mockAnimal);

    await expect(
      animalService.updateAnimal("animal-id-1", updateInput, "outra-ngo-id")
    ).rejects.toMatchObject({
      name: "ForbiddenError",
      statusCode: 403,
    });

    expect(animalRepository.update).not.toHaveBeenCalled();
  });
});

describe("animalService.deleteAnimal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deve excluir o animal quando o requester for o dono", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(mockAnimal);
    vi.mocked(animalRepository.delete).mockResolvedValue(undefined as never);

    const result = await animalService.deleteAnimal("animal-id-1", "ngo-id-1");

    expect(result).toBeUndefined();
    expect(animalRepository.delete).toHaveBeenCalledWith("animal-id-1");
  });

  it("deve lançar NotFoundError quando o animal não existir", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(null);

    await expect(
      animalService.deleteAnimal("id-inexistente", "ngo-id-1")
    ).rejects.toMatchObject({
      name: "NotFoundError",
      statusCode: 404,
    });

    expect(animalRepository.delete).not.toHaveBeenCalled();
  });

  it("deve lançar ForbiddenError quando o requester não for o dono do animal", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(mockAnimal);

    await expect(
      animalService.deleteAnimal("animal-id-1", "outra-ngo-id")
    ).rejects.toMatchObject({
      name: "ForbiddenError",
      statusCode: 403,
    });

    expect(animalRepository.delete).not.toHaveBeenCalled();
  });
});