import { SuccessDay } from "@prisma/client"; 

export interface ISuccessDayRepository {
    findById(id: number): Promise<SuccessDay | null>;
    findByQuestId(questId: number): Promise<SuccessDay[]>;
    findCurrentQuests(currentQuestIds: number[], currentDay: Date): Promise<SuccessDay[] | null>;
    create(questId: number): Promise<SuccessDay>;
    update(id: number, data: Partial<SuccessDay>): Promise<SuccessDay | null>;
    findCompletedQuests: (questIds: number[], date: Date) => Promise<SuccessDay[]>; 
    // delete(id: number): Promise<void>;
  }
  