import { ICharacterRepository } from "@/domain/repositories";
import { Character, PrismaClient } from "@prisma/client";

export class PriCharacterRepository implements ICharacterRepository {

  constructor(private readonly prisma: PrismaClient) {} // 의존성 주입 방식

  async findById(id: number):Promise<Character | null> {
    return await this.prisma.character.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUserId(userId: number): Promise<Character | null> {
    return await this.prisma.character.findFirst({
      where: {
        userId,
      },
    })
  };

  async addEndingCount(id: number): Promise<number> {
    const updatedCharacter = await this.prisma.character.update({
      where: { id },
      data: {
        endingCount: {
          increment: 1,
        },
      },
    });
    return updatedCharacter.endingCount;
  }

  async create(userId: number, endingState: number): Promise<Character> {
    return await this.prisma.character.create({
      data: {
        userId,
        endingCount: 0,
        endingState,
      },
    });
  }

  // 일요일에 endingState가 1인 사용자들의 endingState를 2로 업데이트 - node-cron 사용
  async updateForSunday(): Promise<void> {
    await this.prisma.character.updateMany({
      where: {
        endingState: 1,
      },
      data: {
        endingState: 2,
      },
    });
  }

  // 월요일에 모든 사용자의 endingState를 1로 업데이트 - node-cron 사용
  async updateForMonday(): Promise<void> {
    await this.prisma.character.updateMany({
      data: {
        endingState: 1,
      },
    });
  }
  
}