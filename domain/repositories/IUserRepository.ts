import { User } from "@prisma/client";

export interface IUserRepository {
  findById: (id: number) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  verifyPassword: (user: User, password: string) => Promise<boolean>;
  create: (user: User) => Promise<User>;
  update: (user: User) => Promise<User>;
  //   delete: (id: string) => Promise<void>;
}
