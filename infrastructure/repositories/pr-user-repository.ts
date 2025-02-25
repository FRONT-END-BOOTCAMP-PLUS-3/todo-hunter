import { PrismaClient, User } from "@prisma/client";
import { UserRepository } from "@/domain/repositories";
import bcrypt from "bcrypt";

export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async create(user: User): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      return tx.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          nickname: user.nickname,
        },
      });
    });
  }

  async update(user: User): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      
      return tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: user.email,
          nickname: user.nickname,
          updatedAt: new Date(),
        },
      });
    });
  }
}
