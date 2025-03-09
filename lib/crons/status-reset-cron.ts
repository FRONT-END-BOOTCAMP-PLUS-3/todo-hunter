import { PrismaClient } from "@prisma/client";
import { type CronJob } from "./cron-type.js";

// 스테이터스 초기화 크론잡 (all 유저)
const StatusResetCron: CronJob = {
  name: "캐릭터 status 초기화",
  schedule: "0 0 * * 1", // 매주 월요일 자정
  task: async (prisma: PrismaClient) => {
    try {
      const result = await prisma.status.updateMany({
        where: {}, // 모든 status 대상
        data: {
          str: 0,
          int: 0,
          emo: 0,
          fin: 0,
          liv: 0,
        },
      });
      console.log(
        `[${StatusResetCron.name}] ${result.count}개의 character status가 초기화되었습니다.`
      );
    } catch (error) {
      console.log(`[${StatusResetCron.name}] 실패:`, error);
    }
  },
};

export default StatusResetCron;
