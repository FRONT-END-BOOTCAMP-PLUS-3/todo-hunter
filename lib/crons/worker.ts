import { PrismaClient } from "@prisma/client";
import SetupCron from "./index.js";

const prisma = new PrismaClient(); // 임시 인스턴스
let isInitialized = false;

console.log("[크론 워커] 시작됨");
console.log("[크론 워커] 환경:", process.env.NODE_ENV);

try {
  if (isInitialized) {
    console.log("[크론 워커] 이미 초기화되어 있습니다.");
  } else {
    console.log("[크론 워커] 크론잡 초기화 시작...");
    SetupCron(prisma);
    isInitialized = true;
    console.log("[크론 워커] 크론잡 초기화 완료");
  }
} catch (error) {
  console.error("[크론 워커] 크론잡 초기화 실패:", error);
  process.exit(1);
}
