import { STATUS } from "@/constants";

export interface CreateQuestDTO {
    characterId: number; // 어떤 캐릭터의 퀘스트인지
    name: string;        // 할일 제목
    tagged: keyof typeof STATUS;    // 스탯 태그 (예: STR)
    isWeekly: boolean;   // 반복 여부
    expiredAt?: Date;    // 만료일
  }