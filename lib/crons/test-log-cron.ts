import { PrismaClient } from "@prisma/client";
import { type CronJob } from "./cron-type.js";

// 테스트용 로그 출력 크론잡
const TestLogCron: CronJob = {
  name: "테스트 로그 출력",
  schedule: "*/10 * * * * *", // 10초마다 실행
  task: async (prisma: PrismaClient) => {
    try {
      const now = new Date();
      console.log(
        `[${TestLogCron.name}] 크론잡 정상 동작 중 - ${now.toLocaleString()}`
      );
    } catch (error) {
      console.error(`[${TestLogCron.name}] 실패:`, error);
    }
  },
};

export default TestLogCron;
