import { PrismaClient, SuccessDay } from "@prisma/client";
import { ISuccessDayRepository } from "@/domain/repositories";

export class PriSuccessDayRepository implements ISuccessDayRepository {

  constructor(private readonly prisma: PrismaClient) {}

    async findById(id: number): Promise<SuccessDay | null> {
        return this.prisma.successDay.findUnique({
          where: { id },
        });
      }

    async findByQuestId(questId: number): Promise<SuccessDay[]>  {
        return  this.prisma.successDay.findMany({
          where: { questId },
          orderBy: { createdAt: "desc" },
        });
      }

    async findCurrentQuests(currentQuestIds: number[], currentDay: Date): Promise<SuccessDay[] | null> {
        return this.prisma.successDay.findMany({
          where: {
            id: { in: currentQuestIds },
            createdAt: { lte: currentDay },
          },
        });
      }

  async create(questId: number): Promise<SuccessDay> {
    return this.prisma.successDay.create({
      data: {
        questId,
      },
    });
  }

  async update(id: number, data: Partial<SuccessDay>): Promise<SuccessDay | null> {
    try {
      return await this.prisma.successDay.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Failed to update SuccessDay:", error);
      return null;
    }
  }
}