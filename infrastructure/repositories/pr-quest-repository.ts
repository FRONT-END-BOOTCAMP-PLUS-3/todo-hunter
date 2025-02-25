import { PrismaClient, Quest } from "@prisma/client";
import { QuestRepository } from "@/domain/repositories/quest-repository";

export class QuestRepositoryImpl implements QuestRepository {
    private prisma: PrismaClient;
  
    constructor() {
      this.prisma = new PrismaClient();
    }

  async findById(id: number): Promise<Quest | null>{
    return await this.prisma.quest.findUnique({ where: { id } });
  }

  async findAll() {
    return await this.prisma.quest.findMany();
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
}