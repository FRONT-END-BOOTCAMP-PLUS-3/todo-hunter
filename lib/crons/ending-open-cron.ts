import { PrismaClient } from "@prisma/client";
import { type CronJob } from "./cron-type.js";

// 엔딩 open 크론잡 (pending 유저 X)
const EndingOpenCron: CronJob = {
  name: "캐릭터 엔딩 open 업데이트",
  schedule: "0 0 * * 0", // 매주 일요일 자정
  task: async (prisma: PrismaClient) => {
    try {
      const result = await prisma.character.updateMany({
        where: {
          endingState: 1,
        },
        data: {
          endingState: 2,
        },
      });
      console.log(
        `[${EndingOpenCron.name}] ${result.count}개의 character endingState가 업데이트되었습니다.`
      );
    } catch (error) {
      console.log(`[${EndingOpenCron.name}] 실패:`, error);
    }
  },
};

export default EndingOpenCron;
