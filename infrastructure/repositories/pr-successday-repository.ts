import { SuccessDay } from "@prisma/client";
import { SuccessDayRepository } from "@/domain/repositories";
import { prisma } from "@/lib/prisma";

export class PriSuccessDayRepository implements SuccessDayRepository {

  constructor(private readonly prisma: PrismaClient) {}

    async findById(id: number): Promise<SuccessDay | null> {
        return prisma.successDay.findUnique({
          where: { id },
        });
      }

    async findByQuestId(questId: number): Promise<SuccessDay[]>  {
        return prisma.successDay.findMany({
          where: { questId },
          orderBy: { createdAt: "desc" },
        });
      }

  async create(questId: number): Promise<SuccessDay> {
    return prisma.successDay.create({
      data: {
        questId,
      },
    });
  }

  async update(id: number, data: Partial<SuccessDay>): Promise<SuccessDay | null> {
    try {
      return await prisma.successDay.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Failed to update SuccessDay:", error);
      return null;
    }
  }
}