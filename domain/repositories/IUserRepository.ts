import { User } from "@prisma/client";

export interface IUserRepository {
  findById: (id: number) => Promise<User | null>;
  findByLoginId: (email: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findLoginIdByEmail: (email: string) => Promise<string | null>;
  verifyPassword: (user: User, password: string) => Promise<boolean>;
  create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  update: (user: User) => Promise<User>;
  //   delete: (id: string) => Promise<void>;
}
