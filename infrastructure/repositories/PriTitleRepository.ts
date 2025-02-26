import { PrismaClient, Title } from "@prisma/client";
import { ITitleRepository } from "@/domain/repositories";

export class PriTitleRepository implements ITitleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<Title | null> {
    return this.prisma.title.findUnique({
      where: { id },
    });
  }

  async findManyByIds(ids: number[]): Promise<Title[]> {
    return this.prisma.title.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findAll(): Promise<Title[]> {
    return this.prisma.title.findMany();
  }

  async findByReqStat(reqStat: string): Promise<Title[]> {
    return this.prisma.title.findMany({
      where: {
        reqStat,
      },
    });
  }

  async findByReqStatAndValue(
    reqStat: string,
    reqValue: number
  ): Promise<Title[]> {
    return this.prisma.title.findMany({
      where: {
        reqStat,
        reqValue,
      },
    });
  }
}
