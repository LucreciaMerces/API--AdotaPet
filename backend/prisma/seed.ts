import { PrismaClient, UserRole, AnimalSpecies, AnimalGender, AnimalSize, AnimalStatus } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();


function fakeHash(password: string): string {
  return "$seed$" + createHash("sha256").update(password).digest("hex");
}

async function main(): Promise<void> {
  console.log(" Seed iniciado...\n");


  await prisma.favorite.deleteMany();
  await prisma.adoption.deleteMany();
  await prisma.image.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.user.deleteMany();
  console.log("Banco limpo");


  const admin = await prisma.user.create({
    data: {
      email: "admin@adotapet.com",
      name: "Administrador",
      password: fakeHash("Admin@123"),
      role: UserRole.ADMIN,
      city: "São Paulo",
      state: "SP",
    },
  });

  const ongAmigos = await prisma.user.create({
    data: {
      email: "amigos@adotapet.com",
      name: "ONG Amigos dos Animais",
      password: fakeHash("Ong@123"),
      role: UserRole.NGO,
      phone: "(11) 91234-5678",
      bio: "Resgatamos e reabilitamos animais abandonados desde 2010.",
      city: "São Paulo",
      state: "SP",
    },
  });

  const ongPatinhas = await prisma.user.create({
    data: {
      email: "patinhas@adotapet.com",
      name: "ONG Patinhas Felizes",
      password: fakeHash("Ong@123"),
      role: UserRole.NGO,
      phone: "(21) 98765-4321",
      bio: "Trabalhamos para encontrar lares amorosos para cães e gatos.",
      city: "Rio de Janeiro",
      state: "RJ",
    },
  });

  const joao = await prisma.user.create({
    data: {
      email: "joao@email.com",
      name: "João Silva",
      password: fakeHash("Joao@123"),
      role: UserRole.ADOPTER,
      phone: "(11) 99999-1111",
      city: "São Paulo",
      state: "SP",
    },
  });

  const maria = await prisma.user.create({
    data: {
      email: "maria@email.com",
      name: "Maria Oliveira",
      password: fakeHash("Maria@123"),
      role: UserRole.ADOPTER,
      phone: "(21) 99999-2222",
      city: "Rio de Janeiro",
      state: "RJ",
    },
  });

  console.log(`Usuários criados: admin, 2 ONGs, 2 adotantes`);


  const mel = await prisma.animal.create({
    data: {
      name: "Mel",
      species: AnimalSpecies.DOG,
      breed: "Labrador mix",
      age: 24, // 2 anos
      gender: AnimalGender.FEMALE,
      size: AnimalSize.MEDIUM,
      description: "Mel é doce, brincalhona e adora crianças. Vacinada e vermifugada.",
      status: AnimalStatus.AVAILABLE,
      isVaccinated: true,
      isNeutered: true,
      ngoId: ongAmigos.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600",
            key: "mel-primary.jpg",
            isPrimary: true,
          },
        ],
      },
    },
  });

  const thor = await prisma.animal.create({
    data: {
      name: "Thor",
      species: AnimalSpecies.DOG,
      breed: "Pastor Alemão mix",
      age: 36, // 3 anos
      gender: AnimalGender.MALE,
      size: AnimalSize.LARGE,
      description: "Thor é leal e protetor. Precisa de espaço para correr e muito carinho.",
      status: AnimalStatus.AVAILABLE,
      isVaccinated: true,
      isNeutered: false,
      ngoId: ongAmigos.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600",
            key: "thor-primary.jpg",
            isPrimary: true,
          },
        ],
      },
    },
  });

  const luna = await prisma.animal.create({
    data: {
      name: "Luna",
      species: AnimalSpecies.CAT,
      breed: "Siamês mix",
      age: 18, // 1.5 anos
      gender: AnimalGender.FEMALE,
      size: AnimalSize.SMALL,
      description: "Luna é curiosa e independente. Ótima para apartamento.",
      status: AnimalStatus.AVAILABLE,
      isVaccinated: true,
      isNeutered: true,
      ngoId: ongAmigos.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600",
            key: "luna-primary.jpg",
            isPrimary: true,
          },
        ],
      },
    },
  });

  const bob = await prisma.animal.create({
    data: {
      name: "Bob",
      species: AnimalSpecies.DOG,
      breed: "SRD",
      age: 8,
      gender: AnimalGender.MALE,
      size: AnimalSize.SMALL,
      description: "Bob é um filhotinho resgatado da rua. Muito sociável e saudável.",
      status: AnimalStatus.AVAILABLE,
      isVaccinated: true,
      isNeutered: false,
      ngoId: ongPatinhas.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
            key: "bob-primary.jpg",
            isPrimary: true,
          },
        ],
      },
    },
  });

  const mia = await prisma.animal.create({
    data: {
      name: "Mia",
      species: AnimalSpecies.CAT,
      breed: "Persa mix",
      age: 48, // 4 anos
      gender: AnimalGender.FEMALE,
      size: AnimalSize.SMALL,
      description: "Mia é carinhosa e tranquila. Ideal para quem busca companhia.",
      status: AnimalStatus.PENDING, // já tem solicitação
      isVaccinated: true,
      isNeutered: true,
      ngoId: ongPatinhas.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600",
            key: "mia-primary.jpg",
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log(`🐾  Animais criados: Mel, Thor, Luna, Bob, Mia`);


  await prisma.favorite.createMany({
    data: [
      { userId: joao.id, animalId: mel.id },
      { userId: joao.id, animalId: thor.id },
      { userId: maria.id, animalId: luna.id },
      { userId: maria.id, animalId: mia.id },
    ],
  });

  console.log(` Favoritos criados`);


  
  await prisma.adoption.create({
    data: {
      adopterId: joao.id,
      animalId: mel.id,
      message: "Olá! Tenho quintal grande e muito amor para dar. Posso visitar?",
    },
  });

  await prisma.adoption.create({
    data: {
      adopterId: maria.id,
      animalId: mia.id,
      message: "Amo gatos persas! Moro em apartamento e trabalho em casa.",
    },
  });

  console.log(`Solicitações de adoção criadas`);


  console.log("\nSeed concluído com sucesso!\n");
  console.log("Resumo:");
  console.log(`   Usuários  : 5 (1 admin, 2 ONGs, 2 adotantes)`);
  console.log(`   Animais   : 5 (3 cães, 2 gatos)`);
  console.log(`   Favoritos : 4`);
  console.log(`   Adoções   : 2 (ambas PENDING)\n`);
  console.log("Credenciais de acesso:");
  console.log(`   Admin    : admin@adotapet.com   / Admin@123`);
  console.log(`   ONG 1    : amigos@adotapet.com  / Ong@123`);
  console.log(`   ONG 2    : patinhas@adotapet.com / Ong@123`);
  console.log(`   Adotante : joao@email.com       / Joao@123`);
  console.log(`   Adotante : maria@email.com      / Maria@123`);

  console.log("\n ATENÇÃO: as senhas usam hash simplificado para seed.");
  console.log("No Sprint 3 o authService usará bcryptjs:reset após.");

  void admin;
}

main()
  .catch((e) => {
    console.error(" Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
