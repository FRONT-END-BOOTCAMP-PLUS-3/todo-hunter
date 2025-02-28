import { STATUS } from "@/constants";
//할일 조회, 응답 DTO
export interface ResponseQuestDTO {
    id?: number;           // 퀘스트 ID
    characterId: number;  // 퀘스트를 소유한 캐릭터
    name: string;         // 퀘스트 제목
    tagged: keyof typeof STATUS;  // 태그
    isWeekly: boolean;
    expiredAt?: Date;
    createdAt: Date;
    completedDates?: Date[];
  }