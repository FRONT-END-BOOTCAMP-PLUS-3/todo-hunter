import { PrismaClient, Status } from "@prisma/client";
import { StatusRepository } from "@/domain/repositories";

export class PrismaStatusRepository implements StatusRepository {
  // refactor : 핫 리로딩으로 인한 prismaClient 의 중복생성을 방지하기 위해 의존성 주입 방식으로 변경
  
  // private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient(); // 자체 인스턴스 생성 방식
  // }

  constructor(private readonly prisma: PrismaClient) {} // 의존성 주입

  async create(characterId: number): Promise<Status> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.status.create({
        data: {
          characterId: characterId,
          str: 0,
          int: 0,
          emo: 0,
          fin: 0,
          liv: 0,
        },
      });
    });
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
