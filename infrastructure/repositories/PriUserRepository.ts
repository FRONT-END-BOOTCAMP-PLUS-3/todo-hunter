import { PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "@/domain/repositories";
import bcrypt from "bcrypt";

export class PriUserRepository implements IUserRepository {
  // refactor : 핫 리로딩으로 인한 prismaClient 의 중복생성을 방지하기 위해 의존성 주입 방식으로 변경
  
  // private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient(); // 자체 인스턴스 생성 방식
  // }

  constructor(private readonly prisma: PrismaClient) {} // 의존성 주입 방식
  
  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  
  async findByLoginId(loginId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        loginId,
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

  async findLoginIdByEmail(email: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    return user ? user.loginId : null;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await tx.user.create({
        data: {
          loginId: data.loginId,
          email: data.email,
          password: hashedPassword,
          nickname: data.nickname,
        },
      });

      return newUser;
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
