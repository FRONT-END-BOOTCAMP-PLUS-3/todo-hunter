import { PrismaClient, Quest } from "@prisma/client";
import { IQuestRepository } from "@/domain/repositories/IQuestRepository";

export class PriQuestRepository implements IQuestRepository {
  
  constructor(private readonly prisma: PrismaClient) {}

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