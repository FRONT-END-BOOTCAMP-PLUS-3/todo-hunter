import { PrismaClient } from "@prisma/client";

export type CronJob = {
  name: string;
  schedule: string;
  task: (prisma: PrismaClient) => Promise<void>;
};
