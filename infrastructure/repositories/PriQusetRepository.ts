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

// 주간 퀘스트 여부 조회
  async findWeeklyQuests(characterId: number) {
    return await this.prisma.quest.findMany({
      where: { 
        characterId: characterId,
        isWeekly: true },
    });
  }

// 종료일 기준 퀘스트 조회
  async findBeforeEndDate(characterId: number, endDate: Date) {
    return await this.prisma.quest.findMany({
      where: {
        characterId: characterId,
        endDate: { lte: endDate }, // lte) less than or equal: 종료일이 endDate보다 작거나 같은 퀘스트 조회
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
  
  async create(quest: Quest) {
    return await this.prisma.quest.create({ data: quest });
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