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

  async create(userId: number): Promise<Character> {
    return await this.prisma.character.create({
      data: {
        userId,
        endingCount: 0,
        isCheckEnding: false,
      }
    })
  }

  async isCheckEnding(id: number): Promise<boolean | null> {
    const character = await this.findById(id);
    if (!character) {
      return false
    }
    return character.isCheckEnding;
  }
  
}