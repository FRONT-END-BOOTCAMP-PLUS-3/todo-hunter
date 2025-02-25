import { PrismaClient, Status } from "@prisma/client";
import { StatusRepository } from "@/domain/repositories";

export class PrismaStatusRepository implements StatusRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: number): Promise<Status | null> {
    return await this.prisma.status.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByCharacterId(characterId: number): Promise<Status | null> {
    return await this.prisma.status.findUnique({
      where: {
        characterId: characterId,
      },
    });
  }

  async update(status: Status): Promise<Status> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.status.update({
        where: {
          id: status.id,
          characterId: status.characterId,
        },
        data: {
          str: status.str,
          int: status.int,
          emo: status.emo,
          fin: status.fin,
          liv: status.liv,
        },
      });
    });
  }
}
