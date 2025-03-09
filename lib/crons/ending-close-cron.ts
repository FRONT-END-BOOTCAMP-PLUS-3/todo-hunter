import { PrismaClient } from "@prisma/client";
import { type CronJob } from "./cron-type.js";

// 엔딩 close 크론잡 (all 유저)
const EndingCloseCron: CronJob = {
  name: "캐릭터 엔딩 close 업데이트",
  schedule: "0 0 * * 1", // 매주 월요일 자정
  task: async (prisma: PrismaClient) => {
    try {
      const result = await prisma.character.updateMany({
        where: {}, // 모든 character 대상
        data: {
          endingState: 1,
        },
      });
      console.log(
        `[${EndingCloseCron.name}] ${result.count}개의 character endingState가 업데이트되었습니다.`
      );
    } catch (error) {
      console.log(`[${EndingCloseCron.name}] 실패:`, error);
    }
  },
};

export default EndingCloseCron;
