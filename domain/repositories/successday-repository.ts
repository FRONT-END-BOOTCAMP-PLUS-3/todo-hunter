import { SuccessDay } from "@prisma/client"; 

export interface SuccessDayRepository {
    findById(id: number): Promise<SuccessDay | null>;
    findByQuestId(questId: number): Promise<SuccessDay[]>;
    create(questId: number): Promise<SuccessDay>;
    // delete(id: number): Promise<void>;
  }
  