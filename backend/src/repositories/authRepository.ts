import { prisma } from "@config/prisma";
import { UserRole } from "@prisma/client";


export interface CreateUserData {
  name: string;
  email: string;
  password: string; 
  role: UserRole;
  phone?: string;
  city?: string;
  state?: string;
}

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  city: true,
  state: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
} as const;

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        ...publicUserSelect,
        password: true, 
      },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  },

  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },
};
