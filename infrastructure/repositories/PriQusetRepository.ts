import { PrismaClient, Quest } from "@prisma/client";
import { IQuestRepository } from "@/domain/repositories/IQuestRepository";

export class PriQuestRepository implements IQuestRepository {
  
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<Quest | null>{
    return await this.prisma.quest.findUnique({ where: { id } });
  }

  // 태그값으로 퀘스트 조회
  async findByTag(tag: string) {
    return await this.prisma.quest.findMany({
      where: { tagged: tag, },
      orderBy: {
        tagged: "asc", // 가나다순 정렬
      },
    });
  }

    // 현재일 기준 character의 일간 퀘스트 조회
    async findCurrentQuests(characterId: number, currentDay: Date):Promise<Quest[] | null> {
      return await this.prisma.quest.findMany({
        where: {
          characterId: characterId,
          isWeekly: false, // 일간 퀘스트만 조회
          createdAt: { lte: currentDay },
          updatedAt: { lte: currentDay },
        }
      })
    }

// 주간 퀘스트 여부 조회
  async findWeeklyQuests(characterId: number) {
    return await this.prisma.quest.findMany({
      where: { 
        characterId: characterId,
        isWeekly: true },
    });
  }

// 종료일 기준 퀘스트 조회
  async findBeforeEndDate(characterId: number, expiredAt: Date) {
    return await this.prisma.quest.findMany({
      where: {
        characterId: characterId,
        expiredAt: expiredAt,
      },
    });
  }

  // 생성일 기준 퀘스트 조회
  async findByCreatedAt(characterId: number) {
    return await this.prisma.quest.findMany({
      where: {
        characterId,
      },
      orderBy: {
        createdAt: "desc", // 최신순 정렬
      },
    });
  }
  
  async create(questData: Omit<Quest, "id">): Promise<Quest> {
    return await this.prisma.quest.create({
      data: questData,
    });
  }

  async update(id: number, quest: Partial<Quest>) {
    return await this.prisma.quest.update({
      where: { id },
      data: quest,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.quest.delete({ where: { id } });
  }
}