import { userRepository } from "@repositories/userRepository";
import { NotFoundError } from "@utils/AppError";



interface AdopterProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: "ADOPTER";
  stats: {
    interests: number;   
    adoptions: number;   
  };
}

interface NgoProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: "NGO";
  stats: {
    availableAnimals: number;
    adoptedAnimals: number;
  };
}

export type UserProfile = AdopterProfile | NgoProfile;



export const userService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    if (user.role === "ADOPTER") {
      const [interests, adoptions] = await Promise.all([
        userRepository.countFavorites(userId),
        userRepository.countAdoptions(userId),
      ]);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: "ADOPTER",
        stats: { interests, adoptions },
      };
    }

    
    const [availableAnimals, adoptedAnimals] = await Promise.all([
      userRepository.countAvailableAnimals(userId),
      userRepository.countAdoptedAnimals(userId),
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: "NGO",
      stats: { availableAnimals, adoptedAnimals },
    };
  },
};
