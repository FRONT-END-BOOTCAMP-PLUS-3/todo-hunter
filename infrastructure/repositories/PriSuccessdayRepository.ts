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
        console.log("findCurrentQuests 실행됨! currentQuestIds:", currentQuestIds, "currentDay:", currentDay);
    
        const successDays = await this.prisma.successDay.findMany({
            where: {
                questId: { in: currentQuestIds }, // questId가 현재 퀘스트 목록에 있는 것만 조회
                createdAt: { lte: currentDay }, // 완료된 날짜가 현재 날짜 이전인지 확인
            },
        });
    
        console.log("완료된 퀘스트 조회 결과:", successDays);
        return successDays;
    }
    

      async create(questId: number): Promise<SuccessDay> {
        console.log(`SuccessDay 저장 요청 - questId: ${questId}`);
    
        const successDay = await this.prisma.successDay.create({
            data: {
                questId,
            },
        });
    
        console.log("SuccessDay 저장 성공:", successDay);
        return successDay;
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