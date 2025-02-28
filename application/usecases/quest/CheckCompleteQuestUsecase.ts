import { PriSuccessDayRepository } from "@/infrastructure/repositories/PriSuccessdayRepository";
import { PrismaClient } from "@prisma/client";

export class CheckCompleteQuestUsecase {
  private readonly priSuccessDayRepository: PriSuccessDayRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.priSuccessDayRepository = new PriSuccessDayRepository(prisma);
  }

  // questId와 succeed 객체로 반환
  async isQuestCompleted(questId: number): Promise<{ questId: number, succeed: boolean }> {
    const successDay = await this.priSuccessDayRepository.findByQuestId(questId);
    const succeed = successDay.length > 0; // 성공 여부 결정
    return { questId, succeed };
  }

  // // quest_id가 success_day 테이블에 존재하는지 확인하는 메소드 (단일값) (Plan B)
  // async isQuestCompleted(questId: number): Promise<boolean> {
  //   const successDay = await this.priSuccessDayRepository.findByQuestId(questId);
  //   // successDay 배열이 비어 있지 않으면 존재하는 것이므로 true 반환
  //   return successDay.length > 0;
  // }
}

// 사용 예시
// const completedQuestUsecase = new CompletedQuestUsecase(prisma);
// const result = await completedQuestUsecase.isQuestCompleted(questId);
// console.log(result); // 예: { questId: 1, succeed: true } 또는 { questId: 1, succeed: false }

// 사용 예시(Plan B)
// const completedDailyQuestUsecase = new CompletedDailyQuestUsecase(prisma);
// const isCompleted = await completedDailyQuestUsecase.isQuestCompleted(questId);
// console.log(isCompleted); // true 또는 false
