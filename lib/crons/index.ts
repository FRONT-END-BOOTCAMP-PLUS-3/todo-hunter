import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { type CronJob } from "./cron-type.js";
import EndingOpenCron from "./ending-open-cron.js";
import EndingCloseCron from "./ending-close-cron.js";
import StatusResetCron from "./status-reset-cron.js";

// 모든 크론잡 목록
const cronJobs: CronJob[] = [
  EndingOpenCron,
  EndingCloseCron,
  StatusResetCron,
];

// 크론잡 설정 함수
const SetupCron = (prisma: PrismaClient) => {
  cronJobs.forEach((job) => {
    cron.schedule(job.schedule, () => job.task(prisma));
    console.log(`크론잡 등록 완료: ${job.name}`);
  });
};

export default SetupCron;
